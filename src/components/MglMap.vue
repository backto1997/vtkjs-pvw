<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'

import { useMapStore } from '@/store'

/* -- store -- */
const mapStore = useMapStore()

/* -- props -- */
const props = defineProps<{
  active: boolean
}>()

/* -- watcher -- */
watch(props, () => {
  if (props.active) mapStore.load()
  else mapStore.clear()
})

/* -- life cycle -- */
onMounted(() => {
  mapStore.init()
})
onBeforeUnmount(() => {
  mapStore.destroy()
})
</script>
