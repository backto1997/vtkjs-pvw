// Utilities
import { defineStore } from 'pinia'

import { markRaw, ref } from 'vue'

import mapboxgl, { Map } from 'mapbox-gl'

import { sleep } from '@/utils'
import { MglBjsEngine } from '@/models/MglBjsEngine'

mapboxgl.accessToken = import.meta.env.VITE_MGL_TOKEN

export const useMapStore = defineStore('map', () => {
  /* -- store -- */
  //   const wslinkStore = useWSLinkStore()

  /* -- state -- */
  const map = ref<Map>()
  const existed = ref(false)
  const loading = ref(false)

  const engine = markRaw(new MglBjsEngine())

  /* -- action -- */
  const init = () => {
    if (existed.value) return

    map.value = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 7,
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
      existed.value = true
    })
  }

  const destroy = () => {
    map.value?.remove()
  }

  // const waitToAddBjsLayer = async () => {
  //   loading.value = true

  //   while (!map.value?.isStyleLoaded()) {
  //     await sleep(200)
  //   }

  //   if (map.value) {
  //     if (map.value.getLayer('BabylonJS'))
  //     map.value.addLayer(engine.toMapboxLayer())

  //     engine.scene?.executeWhenReady(() => {
  //       loading.value = false
  //     }, true)
  //   }
  // }

  const load = async () => {
    loading.value = true

    while (!map.value?.isStyleLoaded()) {
      await sleep(200)
    }

    if (!map.value) return

    if (!map.value.getLayer('BabylonJS')) {
      map.value.addLayer(engine.toMapboxLayer())
    }

    engine.loadGlb()

    engine.scene?.executeWhenReady(() => {
      loading.value = false
    }, true)
  }

  const clear = () => {
    engine.clearScene()
  }

  return { loading, init, destroy, load, clear }
})
