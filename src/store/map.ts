// Utilities
import { defineStore } from 'pinia'

import { ref } from 'vue'

import mapboxgl, { Map } from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MGL_TOKEN

export const useMapStore = defineStore('map', () => {
  /* -- store -- */
  //   const wslinkStore = useWSLinkStore()

  /* -- state -- */
  const map = ref<Map>()
  const existed = ref(false)
  const loading = ref(false)

  /* -- action -- */
  const init = () => {
    if (existed.value) return

    loading.value = true

    map.value = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 8,
      center: [120.55534622040807, 23.772201819052135],
      pitch: 0,
      antialias: true,
      projection: {
        name: 'mercator',
      },
    })

    map.value.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
      }),
      'bottom-right'
    )
    map.value.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      'bottom-right'
    )

    map.value.on('style.load', () => {
      loading.value = false
      existed.value = true
    })
  }

  const destroy = () => {
    map.value?.remove()
  }

  return { loading, init, destroy }
})
