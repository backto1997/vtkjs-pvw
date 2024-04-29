// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

// import { useWSLinkStore } from './wslink'

export const useModelStore = defineStore('model', () => {
  /* -- store -- */
  //   const wslinkStore = useWSLinkStore()

  /* -- state -- */
  const bounding = ref<number[]>([])

  /* -- action -- */
  const setBounding = (bbox: number[]) => {
    if (!bbox) return
    bounding.value = bbox
  }

  return { bounding, setBounding }
})
