<template>
  <div class="pipeline-card" :aria-expanded="show">
    <v-card class="mt-xs ml-xs overflow-hidden" width="250">
      <v-card-text class="pa-xs">
        <div class="px-xs pb-xxs text-h6 text-primary">Pipeline</div>
        <tree-node
          v-for="node in pipeline"
          :key="node.name"
          :node="node"
          :spacing="0"
          :active="true"
        ></tree-node>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useModelStore } from '@/store'

import TreeNode from '@/components/tree/TreeNode.vue'

/* -- store -- */
const modelStore = useModelStore()

/* -- props -- */
defineProps<{
  show: boolean
}>()

/* -- data -- */
const { pipeline } = storeToRefs(modelStore)
// const data = ref([
//   {
//     name: '1',
//     show: true,
//     filters: [
//       {
//         name: '2',
//         show: true,
//         filters: [
//           {
//             name: '3',
//             show: true,
//             filters: [
//               {
//                 name: '4',
//                 show: true,
//                 filters: [],
//               },
//               {
//                 name: '5',
//                 show: true,
//                 filters: [],
//               },
//               {
//                 name: '6',
//                 show: true,
//                 filters: [],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: '7',
//     show: true,
//     filters: [
//       {
//         name: '8',
//         show: true,
//         filters: [
//           {
//             name: '9',
//             show: true,
//             filters: [
//               {
//                 name: '10',
//                 show: true,
//                 filters: [],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ])
</script>

<style scoped>
.pipeline-card {
  position: absolute;
  z-index: 99;
  /* background-color: rgba(255, 255, 255, 0.7); */
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;

  &[aria-expanded='true'] {
    grid-template-rows: 1fr;
  }
}

.pipeline-card--wrapper {
  overflow: hidden;
}
</style>
