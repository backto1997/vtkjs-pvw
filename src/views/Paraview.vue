<template>
  <div class="fill-height overflow-hidden">
    <v-app-bar app>
      <span class="ms-4 title">Application</span>
      <v-spacer />

      <!-- [Custom Method] Change resolution of the cone (not actually implement on server side) -->
      <v-slider
        hide-details
        :modelValue="resolution"
        :max="60"
        :min="3"
        :step="1"
        @update:modelValue="updateConeResolution"
      />

      <!-- [Custom Method] Reset camera (not actually implement on server side) -->
      <v-icon icon="mdi-camera" class="mx-4" @click="resetCamera" />

      <v-progress-linear
        :active="!!busy"
        :indeterminate="!!busy"
        :absolute="true"
        style="bottom: 0"
      />
    </v-app-bar>

    <div style="position: relative; width: 100%; height: 100%">
      <remote-rendering-view :client="client" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

import { storeToRefs } from 'pinia'
import { useWSLinkStore, useConeStore } from '@/store'

import { useRoute } from 'vue-router'

import RemoteRenderingView from '@/components/RemoteRenderingView.vue'

const route = useRoute()

const WSLinkStore = useWSLinkStore()
const coneStore = useConeStore()

const { client, busy } = storeToRefs(WSLinkStore)
const { resolution } = storeToRefs(coneStore)

const { updateConeResolution } = coneStore
const { connect, resetCamera } = WSLinkStore

onMounted(() => {
  connect(route.params.port as string)
})
</script>
