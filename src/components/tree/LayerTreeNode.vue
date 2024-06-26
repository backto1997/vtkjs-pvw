<template>
  <div :style="nodeIndent">
    <!-- self -->
    <div :key="node.name" class="node px-s py-xxs d-flex gap-s align-center" :class="{ active }">
      <v-icon
        :icon="`mdi-eye-${show ? '' : 'off-'}outline`"
        size="16"
        @click.stop="setShow(!show)"
      ></v-icon>

      <div class="node--name">{{ node.name }}</div>

      <v-icon icon="mdi-crosshairs-gps" size="16" @click.stop="node.fitBounds()"></v-icon>

      <v-icon
        v-if="hasChildren"
        :icon="`mdi-${showChildren ? 'minus' : 'plus'}`"
        size="16"
        @click.stop="showChildren = !showChildren"
      ></v-icon>
    </div>

    <!-- children node -->
    <div v-if="hasChildren" class="node-children" :aria-expanded="showChildren">
      <div class="overflow-hidden">
        <layer-tree-node
          v-for="c in node.children"
          :key="c.name"
          :node="c"
          :spacing="16"
          :active="showChildren && active"
        ></layer-tree-node>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import LayerTreeNode from '@/components/tree/LayerTreeNode.vue'

import { LayerNode } from '@/models/LayerNode'

/* -- props -- */
const props = defineProps<{
  node: LayerNode
  spacing: number
  active: boolean
}>()

/* -- data -- */
const showChildren = ref(true)
const show = ref(props.node.show)

/* -- computed -- */
const hasChildren = computed(() => props.node.children.length !== 0)
const nodeIndent = computed(() => ({ 'margin-left': `${props.spacing}px` }))

/* -- method -- */
const setShow = (_show: boolean) => {
  props.node.setVisibility(_show)
  show.value = _show
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

    transition: background-color 0.1s ease-out;
  }

  &:hover::before {
    background-color: #f1f1f1;
    // background-color: #effaf8;
  }

  &[aria-selected='true'].active::before {
    background-color: #e2e2e2;
    // background-color: #d9f5ef;
  }
}

.node-children {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;

  &[aria-expanded='true'] {
    grid-template-rows: 1fr;
  }
}

.v-icon {
  color: #777;
  transition: color 0.15s ease-in-out;

  &:hover {
    color: #111;
  }
}
</style>
