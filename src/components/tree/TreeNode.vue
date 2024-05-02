<template>
  <div :style="nodeIndent">
    <div
      :key="node.name"
      class="node px-s py-xxs d-flex gap-s align-center"
      :class="{ active: selected }"
      @click="selected = !selected"
    >
      <v-icon
        :icon="`mdi-eye-${node.show ? '' : 'off-'}outline`"
        size="16"
        @click.stop="setShow(node.name, !node.show)"
      ></v-icon>

      <div class="node--name">{{ node.name }}</div>

      <v-icon
        v-if="hasChildren"
        :icon="`mdi-${showChildren ? 'minus' : 'plus'}`"
        size="16"
        @click.stop="showChildren = !showChildren"
      ></v-icon>
    </div>
    <div v-if="hasChildren" class="node-children" :class="{ expanded: showChildren }">
      <div class="node-children--wrapper">
        <tree-node v-for="d in node.filters" :key="d.name" :node="d" :spacing="16"></tree-node>
      </div>
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
const selected = ref(false)
const showChildren = ref(true)

/* -- computed -- */
const hasChildren = computed(() => props.node.filters.length !== 0)
const nodeIndent = computed(() => ({ 'padding-left': `${props.spacing}px` }))

/* -- method -- */
const setShow = (name: string, show: boolean) => {
  if (show) wslinkStore.show(name)
  else wslinkStore.hide(name)
}
</script>

<style lang="scss" scoped>
.node {
  cursor: pointer;

  &::before {
    position: absolute;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 28px;

    content: '';
  }

  &:hover::before {
    background-color: #effaf8;
  }

  &.active::before {
    background-color: #d9f5ef;
  }
}

.node-children {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;

  &.expanded {
    grid-template-rows: 1fr;
  }
}

.node-children--wrapper {
  overflow: hidden;
}

.v-icon {
  color: #777;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: #111;
  }
}
</style>
