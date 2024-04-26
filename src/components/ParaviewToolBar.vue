<template>
  <v-app-bar class="px-4" app>
    <span class="title">Trame</span>
    <v-spacer />

    <!-- Reset camera -->
    <v-btn color="primary" icon="$slice" @click="slice"></v-btn>
    <v-btn color="primary" icon="mdi-camera" @click="resetCamera"></v-btn>

    <v-progress-linear
      :active="!!busy"
      :indeterminate="!!busy"
      :absolute="true"
      style="bottom: 0"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useWSLinkStore, useFilterStore } from '@/store'

/* -- store -- */
const wslinkStore = useWSLinkStore()
const filterStore = useFilterStore()

/* -- data -- */
const { busy } = storeToRefs(wslinkStore)

/* -- method -- */
const { resetCamera } = wslinkStore
const { slice } = filterStore
</script>
