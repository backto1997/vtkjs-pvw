<template>
  <v-app-bar elevation="0" density="comfortable" class="bg-grey-darken-4" app>
    <template #prepend>
      <v-btn variant="text" color="white" icon @click="$emit('toggle-pipeline')">
        <v-icon icon="mdi-file-tree-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Pipeline</v-tooltip>
      </v-btn>
    </template>

    <v-app-bar-title>Test</v-app-bar-title>

    <template #append>
      <v-btn variant="text" color="white" icon="mdi-hand-wave-outline" @click="test"></v-btn>

      <v-divider vertical class="mx-xs my-auto h-75"></v-divider>

      <v-btn variant="text" color="white" icon @click="$emit('toggle-map')">
        <v-icon :icon="mapActive ? 'mdi-pencil-outline' : 'mdi-map-outline'"></v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ mapActive ? 'Edit' : 'View model in map' }}
        </v-tooltip>
      </v-btn>

      <v-divider vertical class="mx-xs my-auto h-75"></v-divider>

      <v-btn variant="text" color="white" icon @click.prevent="loadCarotid">
        <v-icon icon="mdi-numeric-1-box-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Load carotid</v-tooltip>
      </v-btn>

      <v-btn variant="text" color="white" icon @click.prevent="loadState">
        <v-icon icon="mdi-numeric-2-box-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Load state</v-tooltip>
      </v-btn>

      <v-btn variant="text" color="white" icon @click.prevent="loadFem">
        <v-icon icon="mdi-numeric-3-box-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Load Fem</v-tooltip>
      </v-btn>

      <v-divider vertical class="mx-xs my-auto h-75"></v-divider>

      <v-btn variant="text" color="white" icon @click="selection">
        <v-icon icon="mdi-select-group"></v-icon>
        <v-tooltip activator="parent" location="bottom">Selection</v-tooltip>
      </v-btn>

      <v-divider vertical class="mx-xs my-auto h-75"></v-divider>

      <v-btn variant="text" color="white" icon @click="glyph">
        <v-icon icon="mdi-arrow-bottom-right-bold-box-outline"></v-icon>
        <v-tooltip activator="parent" location="bottom">Glyph</v-tooltip>
      </v-btn>

      <v-btn variant="text" color="white" icon @click.stop="dialog = true">
        <v-icon icon="$slice"></v-icon>
        <v-tooltip activator="parent" location="bottom">Slice</v-tooltip>
      </v-btn>

      <v-divider vertical class="mx-xs my-auto h-75"></v-divider>

      <v-btn variant="text" color="white" icon @click="viewStore.view?.resetCamera()">
        <v-icon icon="mdi-fit-to-screen"></v-icon>
        <v-tooltip activator="parent" location="bottom">Reset Camera</v-tooltip>
      </v-btn>
    </template>
  </v-app-bar>

  <slice-dialog v-model="dialog" @close="dialog = false" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useWSLinkStore, useViewStore } from '@/store'

import SliceDialog from '@/components/filter/SliceDialog.vue'

/* -- store -- */
const wslinkStore = useWSLinkStore()
const viewStore = useViewStore()

/* -- props / emits -- */
defineProps<{
  mapActive: boolean
}>()
defineEmits<{ (e: 'toggle-map'): void; (e: 'toggle-pipeline'): void }>()

/* -- data -- */
const dialog = ref(false)

/* -- method -- */
const { loadCarotid, loadFem, loadState, glyph, test, selection } = wslinkStore
</script>
