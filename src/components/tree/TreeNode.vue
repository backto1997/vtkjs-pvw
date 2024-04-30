<template>
  <div :style="nodeIndent">
    <div class="px-s py-xxs d-flex gap-s align-center">
      <v-icon
        :icon="`mdi-eye-${node.show ? '' : 'off-'}outline`"
        size="16"
        @click="setShow(node.name, !node.show)"
      ></v-icon>

      <div>{{ node.name }}</div>

      <v-icon
        v-if="hasChildren"
        :icon="`mdi-${showChildren ? 'minus' : 'plus'}`"
        size="16"
        @click="showChildren = !showChildren"
      ></v-icon>
    </div>
    <div v-if="showChildren && hasChildren">
      <tree-node
        v-for="d in node.filters"
        :key="d.name"
        :node="d"
        :spacing="spacing + 24"
      ></tree-node>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import { useWSLinkStore } from '@/store'

import TreeNode from '@/components/tree/TreeNode.vue'

import { PipelineItem } from '@/types/model'

/* -- store -- */
const wslinkStore = useWSLinkStore()

/* -- props -- */
const props = withDefaults(
  defineProps<{
    node: PipelineItem
    spacing: number
  }>(),
  {
    spacing: 0,
  }
)

/* -- data -- */
const showChildren = ref(true)

/* -- computed -- */
const hasChildren = computed(() => props.node.filters.length !== 0)
const nodeIndent = computed(() => ({ 'margin-left': `${props.spacing}px` }))

/* -- method -- */
const setShow = (name: string, show: boolean) => {
  if (show) wslinkStore.show(name)
  else wslinkStore.hide(name)
}
</script>
