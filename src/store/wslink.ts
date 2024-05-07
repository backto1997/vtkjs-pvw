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
        initialize()
      })
      .catch(console.error)
  }

  const initialize = () => {
    addObserver()
    getPipeline()
  }

  /* -- protocol -- */
  const addObserver = async () => {
    const res = await client.value?.getRemote().Service.addObserver().catch(console.error)
    if (res && res.viewId) viewStore.setViewId(res.viewId)
  }

  const resize = () => {
    if (!viewStore.view) return
    const size = viewStore.view.getCanvasView().getSize()
    client.value?.getRemote().Service.resize(viewStore.viewId, size).catch(console.error)
  }

  const loadCarotid = async () => {
    await client.value?.getRemote().Service.loadCarotid().catch(console.error)
    getPipeline()
    viewStore.resetView()
  }

  const loadFem = async () => {
    await client.value?.getRemote().Service.loadFem().catch(console.error)
    getPipeline()
    viewStore.resetView()
  }

  const loadState = async () => {
    await client.value?.getRemote().Service.loadState().catch(console.error)
    getPipeline()
    viewStore.resetView()
  }

  /* -- Model -- */
  // Bounding Box
  const getBoundingBox = () => {
    client.value?.getRemote().Model.boundingBox().then(modelStore.setBounding).catch(console.error)
  }

  // Selection
  const selection = () => {
    client.value?.getRemote().Model.selection().catch(console.error)
    viewStore.render()
  }

  const getPipeline = () => {
    client.value?.getRemote().Model.pipeline().then(modelStore.setPipeline).catch(console.error)
  }

  const show = async (name: string) => {
    await client.value?.getRemote().Model.show(name).catch(console.error)
    viewStore.render()
    getPipeline()
  }

  const hide = async (name: string) => {
    await client.value?.getRemote().Model.hide(name).catch(console.error)
    viewStore.render()
    getPipeline()
  }

  /* -- Filter -- */
  // Slice
  const slice = (type: string, origin: number[], normal: number[]) => {
    client.value?.getRemote().Filter.slice([type, origin, normal]).catch(console.error)
    if (modelStore.pipeline[0].show) {
      hide(modelStore.pipeline[0].name)
    } else {
      viewStore.render()
      getPipeline()
    }
  }

  // Glyph
  const glyph = () => {
    client.value?.getRemote().Filter.glyph().catch(console.error)
    viewStore.render()
    getPipeline()
  }

  /* -- Test -- */
  // Test
  const test = () => {
    // client.value?.getRemote().Service.test(viewStore.viewId).catch(console.error)
    client.value?.getRemote().Service.setOriginalSize(viewStore.viewId).catch(console.error)
    client.value?.getRemote().Service.invalidateCache(viewStore.viewId).catch(console.error)
    // client.value?.getRemote().Service.render(viewStore.viewId).catch(console.error)
  }

  return {
    client,
    busy,

    connect,
    addObserver,
    resize,
    loadCarotid,
    loadFem,
    loadState,

    getBoundingBox,
    selection,
    getPipeline,
    show,
    hide,

    slice,
    glyph,

    test,
  }
})
