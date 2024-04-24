<template>
  <div ref="renderView" class="container"></div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import { useViewStore } from '@/store'

/* -- store -- */
const viewStore = useViewStore()

/* -- data -- */
const { view } = storeToRefs(viewStore)

const renderView = ref<HTMLElement>()

/* -- watchers -- */
// watch for remote view is available
watch(view, () => {
  bindContainer()
})

/* -- methods -- */
// bind remote render view to HTML container
const bindContainer = () => {
  if (view.value && renderView.value) {
    view.value.setContainer(renderView.value)
    window.addEventListener('resize', view.value.resize)
  }
}

/* -- lifecycles -- */
onBeforeUnmount(() => {
  if (view.value) {
    window.removeEventListener('resize', view.value.resize)
    view.value.delete()
  }
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
