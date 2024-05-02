<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'

import { useMapStore } from '@/store'

/* -- store -- */
const mapStore = useMapStore()

/* -- life cycle -- */
onBeforeUnmount(() => {
  mapStore.destroy()
})
</script>
