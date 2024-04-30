<template>
  <v-card class="pipeline-card pa-xs mt-xs ml-xs" width="280">
    <v-card-text class="pa-0">
      <tree-node v-for="d in data" :key="d.name" :node="d"></tree-node>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { storeToRefs } from 'pinia'
import { useModelStore } from '@/store'

import TreeNode from '@/components/tree/TreeNode.vue'

/* -- store -- */
const modelStore = useModelStore()

/* -- data -- */
const { pipeline } = storeToRefs(modelStore)
const data = ref([
  {
    name: '1714447564',
    show: true,
    filters: [
      {
        name: '1714447574',
        show: true,
        filters: [],
      },
    ],
  },
])
</script>

<style scoped>
.v-card {
  position: absolute;
  z-index: 99;
  /* background-color: rgba(255, 255, 255, 0.7); */
}
</style>
