// Utilities
import { defineStore } from 'pinia'

import { markRaw } from 'vue'

import { LayerNode } from '@/models/LayerNode'

export const useLayerStore = defineStore('layer', () => {
  /* -- state -- */
  // const tree = shallowRef(new Tree<LayerNode>())
  const nodes = markRaw<LayerNode[]>([])

  const addNode = (node: LayerNode) => {
    nodes.push(node)
  }

  return { nodes, addNode }
})
