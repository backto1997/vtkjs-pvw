// Utilities
import { defineStore } from 'pinia'

import { markRaw, ref } from 'vue'

import mapboxgl, { Map } from 'mapbox-gl'

import { sleep } from '@/utils'
import { MglBjsEngine } from '@/models/MglBjsEngine'
import { LayerNode } from '@/models/LayerNode'

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

  const load = async () => {
    loading.value = true

    while (!map.value?.isStyleLoaded()) {
      await sleep(200)
    }

    if (!map.value) return

    if (!map.value.getLayer('BabylonJS')) {
      map.value.addLayer(engine.toMapboxLayer())
    }

    const baseUrl = 'https://dl.dropbox.com/scl/fi'
    const url = `${baseUrl}/3vkdbzqjdsm20256spo5t/grid.glb?rlkey=hz270k47b613u2ac0qc3avzdl` // simple version
    // const url = `${baseUrl}/2vo2j92sj0obvdh1pxj8s/grid_all.glb?rlkey=zv9cx0j2xw1498tv5vs1fpbss`; // original version
    const node = new LayerNode(url, engine)
    node.loadGlb()

    engine.scene?.executeWhenReady(() => {
      loading.value = false
      node.fitBounds()
    }, true)
  }

  const clear = () => {
    engine.clearScene()
  }

  return { engine, loading, init, destroy, load, clear }
})
