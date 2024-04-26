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
  }

  const setViewId = (_viewId: string) => {
    if (!view.value) return
    viewId.value = _viewId
    view.value.setViewId(_viewId)
    view.value.render()
  }

  return { view, viewId, connect, setViewId }
})
