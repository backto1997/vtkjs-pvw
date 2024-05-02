<template>
  <div ref="renderView"></div>
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

/* -- watcher -- */
// wait for valid remote view, then bind to HTML element to display
watch(view, () => {
  bindContainer()
})

/* -- method -- */
// bind remote render view to HTML container
const bindContainer = () => {
  if (view.value && renderView.value) {
    view.value.setContainer(renderView.value)
    // view.value.setInteractiveRatio(0.7) // the scaled image compared to the clients view resolution
    // view.value.setInteractiveQuality(50) // jpeg quality

    window.addEventListener('resize', view.value.resize)
  }
}

/* -- lifecycle -- */
onBeforeUnmount(() => {
  if (view.value) {
    window.removeEventListener('resize', view.value.resize)
    view.value.delete()
  }
})
</script>
