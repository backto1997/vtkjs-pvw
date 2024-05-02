// Utilities
import { defineStore } from 'pinia'

import { computed, reactive, ref } from 'vue'

import { PipelineItem } from '@/types/model'

export const useModelStore = defineStore('model', () => {
  /* -- state -- */
  const bounding = ref<number[]>([])
  const pipeline = ref<PipelineItem[]>([])
  const selected = reactive<Set<string>>(new Set())

  /* -- getter -- */
  const isSelected = computed(() => (name: string) => selected.has(name))

  /* -- action -- */
  const setBounding = (bbox: number[]) => {
    if (!bbox) return
    bounding.value = bbox
  }

  const setPipeline = (_pipeline: PipelineItem[]) => {
    pipeline.value = _pipeline
  }

  const toggleSelect = (name: string) => {
    const existed = selected.has(name)
    if (existed) selected.delete(name)
    else selected.add(name)
  }

  return { bounding, pipeline, isSelected, setBounding, setPipeline, toggleSelect }
})
