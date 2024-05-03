<template>
  <v-container class="pa-0 fill-height align-start" fluid>
    <tool-bar :map-active="map" @toggle-map="toggleMap" @toggle-pipeline="pipeline = !pipeline" />
    <node-pipeline :show="pipeline" />

    <div class="w-100 fill-height" style="position: relative">
      <!-- paraview -->
      <remote-rendering-view class="container" :class="{ active: !map }" />

      <!-- map -->
      <mgl-map class="container" :class="{ active: map }" />
    </div>
  </v-container>

  <v-overlay :model-value="mapStore.loading" class="align-center justify-center">
    <v-progress-circular color="white" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useWSLinkStore, useMapStore } from '@/store'

import { useRoute } from 'vue-router'

import ToolBar from '@/components/ToolBar.vue'
import NodePipeline from '@/components/NodePipeline.vue'
import RemoteRenderingView from '@/components/RemoteRenderingView.vue'
import MglMap from '@/components/MglMap.vue'

/* -- route -- */
const route = useRoute()

/* -- store -- */
const wslinkStore = useWSLinkStore()
const mapStore = useMapStore()

/* -- data -- */
const map = ref(false)
const pipeline = ref(true)

/* -- method -- */
const { connect } = wslinkStore

const toggleMap = () => {
  map.value = !map.value
  if (map.value) mapStore.init()
}

/* -- lifecycle -- */
onMounted(() => {
  connect(route.params.port as string)
})
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.active {
    z-index: 5;
  }
}
</style>
