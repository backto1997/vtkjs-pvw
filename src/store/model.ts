// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import { PipelineItem } from '@/types/model'

export const useModelStore = defineStore('model', () => {
  /* -- store -- */
  //   const wslinkStore = useWSLinkStore()

  /* -- state -- */
  const bounding = ref<number[]>([])
  const pipeline = ref<PipelineItem[]>([])

  /* -- action -- */
  const setBounding = (bbox: number[]) => {
    if (!bbox) return
    bounding.value = bbox
  }

  const setPipeline = (_pipeline: PipelineItem[]) => {
    pipeline.value = _pipeline
  }

  return { bounding, pipeline, setBounding, setPipeline }
})
