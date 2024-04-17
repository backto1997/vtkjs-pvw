<template>
  <div ref="renderView" class="container"></div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, markRaw, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import { useWSLinkStore } from '@/store'

import vtkRemoteView from '@kitware/vtk.js/Rendering/Misc/RemoteView'

/* -- store -- */
const WSLinkStore = useWSLinkStore()

/* -- props, emits -- */
const props = withDefaults(
  defineProps<{
    client: Record<any, any> | null
  }>(),
  { client: null }
)

/* -- data -- */
const { viewId } = storeToRefs(WSLinkStore)

const view = markRaw(
  vtkRemoteView.newInstance({
    rpcWheelEvent: 'viewport.mouse.zoom.wheel',
  })
)

const renderView = ref<HTMLElement>()

const connected = ref(false)

/* -- computed -- */
const client = computed(() => props.client)

/* -- watchers -- */
// watch for valid client is available
watch(client, () => {
  connect()
})

// set view ID to vtkRemoteView when receive view ID from server
watch(viewId, (id) => {
  if (connected.value) {
    view.setViewId(id)
    view.render()
  }
})

/* -- methods -- */
// set session when valid client is available
const connect = () => {
  if (props.client) {
    const session = props.client.getConnection().getSession()
    view.setSession(session)
    connected.value = true
    if (viewId.value) {
      view.setViewId(viewId.value)
      view.render()
    }
  }
}

onMounted(() => {
  if (renderView.value) view.setContainer(renderView.value)
  window.addEventListener('resize', view.resize)
  // connect()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', view.resize)
  view.delete()
})
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
