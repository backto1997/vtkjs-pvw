// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import vtkWSLinkClient from '@kitware/vtk.js/IO/Core/WSLinkClient'
import SmartConnect from 'wslink/src/SmartConnect'

import protocols from '@/services/wslink/protocols'

import { useViewStore } from './view'

// Bind vtkWSLinkClient to our SmartConnect
vtkWSLinkClient.setSmartConnectClass(SmartConnect)

export const useWSLinkStore = defineStore('wslink', () => {
  /* -- store -- */
  const viewStore = useViewStore()

  /* -- state -- */
  const client = ref<Nullable<vtkWSLinkClient>>(null)
  // const config = ref(null)
  const busy = ref(false)

  /* -- action -- */
  /**
   * 1. Create vtkWSLinkClient
   * 2. Connect to ws server session
   * 3. If connected, create vtkRemoteView
   * 4. Call protocol method: Service.getViewId()
   * 5. Set viewId when receive the response
   * @param port
   */
  const connect = (port: string) => {
    // Initiate network connection
    const config: Record<string, string> = { application: 'test' }

    // Custom setup for development
    config.sessionURL = `ws://${import.meta.env.VITE_BACKEND_ENDPOINT}:${port}/ws`

    if (client.value && client.value.isConnected()) {
      client.value.disconnect(-1)
    }
    let clientToConnect = client.value
    if (!clientToConnect) {
      clientToConnect = vtkWSLinkClient.newInstance({ protocols })
    }

    // Connect to busy store
    clientToConnect.onBusyChange((count: any) => {
      busy.value = count
    }, 1)
    clientToConnect.beginBusy()

    // Error
    clientToConnect.onConnectionError((httpReq) => {
      const message = (httpReq && httpReq.response && httpReq.response.error) || `Connection error`
      console.error(message)
      console.log(httpReq)
    })

    // Close
    clientToConnect.onConnectionClose((httpReq) => {
      const message = (httpReq && httpReq.response && httpReq.response.error) || `Connection close`
      console.error(message)
      console.log(httpReq)
    })

    // Connect
    clientToConnect
      .connect(config)
      .then((validClient) => {
        client.value = validClient

        viewStore.connect()

        clientToConnect.endBusy()

        // Now that the client is ready let's setup the server for us
        getViewId()
        resetCamera()
      })
      .catch(console.error)
  }

  /* -- protocol -- */
  // View ID
  const getViewId = () => {
    client.value
      ?.getRemote()
      .Service.getViewId()
      .then(({ viewId }: { viewId: string }) => {
        viewStore.setViewId(viewId)
      })
      .catch(console.error)
  }

  // Camera
  const resetCamera = () => {
    client.value?.getRemote().Service.resetCamera(viewStore.viewId).catch(console.error)
  }

  // Slice
  const slice = () => {
    client.value?.getRemote().Filter.slice().catch(console.error)
  }

  return { client, busy, connect, resetCamera, slice }
})
