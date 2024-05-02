<template>
  <v-card class="pipeline-card pa-xs mt-xs ml-xs" width="250">
    <v-card-text class="pa-0">
      <div class="px-xs pb-xxs text-h6 text-primary">Pipeline</div>
      <tree-node
        v-for="d in pipeline"
        :key="d.name"
        :node="d"
        :spacing="0"
        :active="true"
      ></tree-node>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useModelStore } from '@/store'

import TreeNode from '@/components/tree/TreeNode.vue'

/* -- store -- */
const modelStore = useModelStore()

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
.v-card {
  position: absolute;
  z-index: 99;
  /* background-color: rgba(255, 255, 255, 0.7); */
}
</style>
