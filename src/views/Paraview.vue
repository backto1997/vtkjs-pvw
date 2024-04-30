<template>
  <div class="fill-height overflow-hidden">
    <paraview-tool-bar />
    <pipeline />

    <div class="w-100 fill-height" style="position: relative">
      <remote-rendering-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import { useWSLinkStore } from '@/store'

import { useRoute } from 'vue-router'

import ParaviewToolBar from '@/components/ParaviewToolBar.vue'
import Pipeline from '@/components/Pipeline.vue'
import RemoteRenderingView from '@/components/RemoteRenderingView.vue'

/* -- route -- */
const route = useRoute()

/* -- store -- */
const wslinkStore = useWSLinkStore()

/* -- method -- */
const { connect } = wslinkStore

/* -- lifecycle -- */
onMounted(() => {
  connect(route.params.port as string)
})
</script>
