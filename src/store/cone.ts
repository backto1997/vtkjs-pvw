// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import { useWSLinkStore } from './wslink'

export const useConeStore = defineStore('cone', () => {
  const WSLinkStore = useWSLinkStore()

  const resolution = ref(6)

  const updateConeResolution = (_resolution: number) => {
    resolution.value = _resolution
    WSLinkStore.updateResolution(_resolution)
  }

  return { resolution, updateConeResolution }
})
