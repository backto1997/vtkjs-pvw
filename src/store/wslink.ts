// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import vtkWSLinkClient from '@kitware/vtk.js/IO/Core/WSLinkClient'
import SmartConnect from 'wslink/src/SmartConnect'

import protocols from '@/services/wslink/protocols'

import { connectImageStream } from '@kitware/vtk.js/Rendering/Misc/RemoteView'

// Bind vtkWSLinkClient to our SmartConnect
vtkWSLinkClient.setSmartConnectClass(SmartConnect)

export const useWSLinkStore = defineStore('WSLink', () => {
  const client = ref<vtkWSLinkClient | null>(null)
  const viewId = ref('')
  // const config = ref(null)
  const busy = ref(false)

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
    // @ts-ignore
    clientToConnect.onBusyChange((count) => {
      busy.value = count
    })
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
        connectImageStream(validClient.getConnection().getSession())
        client.value = validClient
        clientToConnect.endBusy()

        // Now that the client is ready let's setup the server for us
        initializeServer()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const initializeServer = () => {
    client.value
      ?.getRemote()
      .Service.getViewId()
      .then(({ viewId: _viewId }: { viewId: string }) => {
        viewId.value = _viewId
      })
      .catch(console.error)
  }

  const resetCamera = () => {
    client.value?.getRemote().Service.resetCamera().catch(console.error)
  }

  const updateResolution = (resolution: number) => {
    client.value?.getRemote().Cone.updateResolution(resolution).catch(console.error)
  }

  return { client, viewId, busy, connect, initializeServer, updateResolution, resetCamera }
})
