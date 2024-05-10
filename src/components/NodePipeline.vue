<template>
  <div class="pipeline-card" :aria-expanded="show">
    <v-card class="mt-xs ml-xs overflow-hidden" width="250">
      <v-card-text class="pa-xs">
        <div class="px-xs pb-xxs text-h6 text-primary">Pipeline</div>
        <div v-if="mapMode">
          <layer-tree-node
            v-for="node in layerStore.nodes"
            :key="node.name"
            :node="node"
            :spacing="0"
            :active="true"
          ></layer-tree-node>
        </div>

        <div v-else>
          <tree-node
            v-for="node in modelStore.pipeline"
            :key="node.name"
            :node="node"
            :spacing="0"
            :active="true"
          ></tree-node>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useLayerStore, useModelStore } from '@/store'

import TreeNode from '@/components/tree/TreeNode.vue'
import LayerTreeNode from '@/components/tree/LayerTreeNode.vue'

/* -- store -- */
const modelStore = useModelStore()
const layerStore = useLayerStore()

/* -- props -- */
defineProps<{
  show: boolean
  mapMode: boolean
}>()

/* -- data -- */
// const { pipeline } = storeToRefs(modelStore)
// const { pipeline } = storeToRefs(layerStore)
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
