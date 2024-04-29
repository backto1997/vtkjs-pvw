<template>
  <v-app-bar elevation="0" density="comfortable" class="bg-grey-darken-4" app>
    <v-app-bar-title>Trame</v-app-bar-title>

    <template #append>
      <v-btn variant="text" color="white" icon="mdi-hand-wave-outline" @click="test"></v-btn>

      <v-btn variant="text" color="white" icon @click.stop="dialog = true">
        <v-icon icon="$slice"></v-icon>
        <v-tooltip activator="parent" location="bottom">Slice</v-tooltip>
      </v-btn>

      <v-btn variant="text" color="white" icon @click="resetCamera">
        <v-icon icon="mdi-fit-to-screen"></v-icon>
        <v-tooltip activator="parent" location="bottom">Reset Camera</v-tooltip>
      </v-btn>
    </template>

    <v-progress-linear
      :active="!!busy"
      :indeterminate="!!busy"
      :absolute="true"
      style="bottom: 0"
    />
  </v-app-bar>

  <slice-dialog v-model="dialog" @close="dialog = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useWSLinkStore } from '@/store'

import SliceDialog from '@/components/filter/SliceDialog.vue'

/* -- store -- */
const wslinkStore = useWSLinkStore()

/* -- data -- */
const { busy } = storeToRefs(wslinkStore)

const dialog = ref(false)

/* -- method -- */
const { resetCamera, test } = wslinkStore
</script>
