<template>
  <v-container class="pa-0 fill-height align-start" fluid>
    <tool-bar @toggle-pipeline="pipeline = !pipeline" />
    <node-pipeline :show="pipeline" />

    <div class="w-100 fill-height" style="position: relative">
      <!-- paraview -->
      <remote-rendering-view class="container" />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useWSLinkStore } from '@/store'

import { useRoute } from 'vue-router'

import ToolBar from '@/components/ToolBar.vue'
import NodePipeline from '@/components/NodePipeline.vue'
import RemoteRenderingView from '@/components/RemoteRenderingView.vue'

/* -- route -- */
const route = useRoute()

/* -- store -- */
const wslinkStore = useWSLinkStore()

/* -- data -- */
const pipeline = ref(true)

/* -- method -- */
const { connect } = wslinkStore

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
    z-index: 1;
  }
}
</style>
