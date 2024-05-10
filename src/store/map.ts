// Utilities
import { defineStore } from 'pinia'

import { markRaw, ref, shallowRef } from 'vue'

import mapboxgl, { Map } from 'mapbox-gl'

import { useLayerStore } from '@/store'

import { MglBjsEngine } from '@/models/MglBjsEngine'
import { LayerNode } from '@/models/LayerNode'

import { sleep } from '@/utils'

mapboxgl.accessToken = import.meta.env.VITE_MGL_TOKEN

export const useMapStore = defineStore('map', () => {
  /* -- store -- */
  const layerStore = useLayerStore()

  /* -- object -- */
  const engine = markRaw(new MglBjsEngine())

  /* -- state -- */
  const map = shallowRef<Map>()

  const existed = ref(false)
  const loading = ref(false)

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

    // wait for wslink to get glb url
    // const res = await wslinkStore.loadGlb()
    // if (!res || !res.url) return

    while (!map.value?.isStyleLoaded()) {
      await sleep(200)
    }

    if (!map.value) return

    if (!map.value.getLayer('BabylonJS')) {
      map.value.addLayer(engine.toMapboxLayer())
    }

    const baseUrl = 'https://dl.dropbox.com/scl/fi'
    // const url = `${baseUrl}/3vkdbzqjdsm20256spo5t/grid.glb?rlkey=hz270k47b613u2ac0qc3avzdl` // simple version
    // const url = `${baseUrl}/2vo2j92sj0obvdh1pxj8s/grid_all.glb?rlkey=zv9cx0j2xw1498tv5vs1fpbss`; // original version
    const url = `${baseUrl}/rtsdigvv9o47vclfjsot3/test.gltf?rlkey=e9a8vh7ol2wnp5dqw0sozbjgb`
    // const url = `${baseUrl}/c9kr21kw7bu4xtgi9kwmp/test2.gltf?rlkey=hreoakis9mdyf128dgwwz8ggo`
    // const url = `${baseUrl}/cwigysx9y0osqkhatzlib/test3.gltf?rlkey=wyytgg0lvlle92egl9c1tzk83`
    let node = new LayerNode('test', url, engine)
    node.loadGlb()
    layerStore.addNode(node)

    node = new LayerNode(
      'grid',
      `${baseUrl}/3vkdbzqjdsm20256spo5t/grid.glb?rlkey=hz270k47b613u2ac0qc3avzdl`,
      engine
    )
    node.loadGlb()
    layerStore.addNode(node)

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
