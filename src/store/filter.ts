// Utilities
import { defineStore } from 'pinia'

import { useWSLinkStore } from './wslink'

export const useFilterStore = defineStore('filter', () => {
  /* -- store -- */
  const wslinkStore = useWSLinkStore()

  /* -- state -- */

  /* -- action -- */
  const slice = () => {
    wslinkStore.slice()
  }

  return { slice }
})
