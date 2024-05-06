// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import vtkRemoteView, { connectImageStream } from '@kitware/vtk.js/Rendering/Misc/RemoteView'

import { useWSLinkStore } from './wslink'

export const useViewStore = defineStore('view', () => {
  /* -- store -- */
  const wslinkStore = useWSLinkStore()

  /* -- state -- */
  const view = ref<Nullable<vtkRemoteView>>(null)
  const viewId = ref('')

  /* -- action -- */
  const connect = () => {
    if (!wslinkStore.client) return

    view.value = vtkRemoteView.newInstance({
      rpcWheelEvent: 'viewport.mouse.zoom.wheel',
    })
    const session = wslinkStore.client.getConnection().getSession()
    view.value.setSession(session)
    connectImageStream(session)

    resetViewId()
    resetCamera()
  }

  const resetView = () => {
    resetViewId()
    view.value?.getViewStream().invalidateCache()
    wslinkStore.resize()
    resetCamera()
  }

  const resetViewId = () => {
    view.value?.setViewId('-1')
  }

  const resetCamera = () => {
    view.value?.resetCamera()
  }

  const render = () => {
    view.value?.render()
  }

  return { view, viewId, connect, resetView, resetViewId, resetCamera, render }
})
