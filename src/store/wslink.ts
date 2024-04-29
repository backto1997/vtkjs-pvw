// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import vtkWSLinkClient from '@kitware/vtk.js/IO/Core/WSLinkClient'
import SmartConnect from 'wslink/src/SmartConnect'

import protocols from '@/services/wslink/protocols'

import { useViewStore } from './view'
import { useModelStore } from './model'

// Bind vtkWSLinkClient to our SmartConnect
vtkWSLinkClient.setSmartConnectClass(SmartConnect)

export const useWSLinkStore = defineStore('wslink', () => {
  /* -- store -- */
  const viewStore = useViewStore()
  const modelStore = useModelStore()

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
  const connect = async (port: string) => {
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
      })
      .catch(console.error)
  }

  /* -- protocol -- */
  // View ID
  const getViewId = async () => {
    return client.value
      ?.getRemote()
      .Service.getViewId()
      .then(({ viewId }: { viewId: string }) => {
        viewStore.setViewId(viewId)

        // reset
        resetCamera()
        getBoundingBox()
      })
      .catch(console.error)
  }

  // Camera
  const resetCamera = () => {
    client.value?.getRemote().Service.resetCamera(viewStore.viewId).catch(console.error)
  }

  // Bounding Box
  const getBoundingBox = () => {
    client.value?.getRemote().Model.boundingBox().then(modelStore.setBounding).catch(console.error)
  }

  // Slice
  const slice = (type: string, origin: number[], normal: number[]) => {
    client.value?.getRemote().Filter.slice([type, origin, normal]).catch(console.error)
  }

  // Test
  const test = () => {
    client.value?.getRemote().Service.test().catch(console.error)
  }

  return { client, busy, connect, resetCamera, getBoundingBox, slice, test }
})
