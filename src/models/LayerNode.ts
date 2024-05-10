import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

import mapboxgl from 'mapbox-gl'

import { Node } from '@/models/Node'
import { MglBjsEngine } from '@/models/MglBjsEngine'

export class LayerNode extends Node<LayerNode> {
  name: string

  private _engine: MglBjsEngine

  url: string

  lngLat: [number, number]
  boundingBox?: mapboxgl.LngLatBounds

  size: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }

  show: boolean

  constructor(name: string, url: string, engine: MglBjsEngine) {
    super()

    this.name = name
    this.url = url
    this._engine = engine
    this.lngLat = [120.47823749628697, 23.92051949732512]

    this.show = true
  }

  loadGlb() {
    // const meshParent = new BABYLON.Mesh('__meshgroup__', this._engine.scene)
    let meshRoot: BABYLON.AbstractMesh
    let boundingBox!: BABYLON.BoundingBox

    BABYLON.SceneLoader.ImportMeshAsync(null, this.url, '', this._engine.scene).then(
      ({ meshes, transformNodes }) => {
        let min!: BABYLON.Vector3, max!: BABYLON.Vector3
        meshes.forEach((mesh, idx) => {
          // __root__ size is 0, should not be added to the mesh parent group
          if (mesh.id === '__root__') {
            meshRoot = mesh
            meshRoot.name = `__root__${this.name}__`
            return
          }

          if (mesh.material) {
            const mat = mesh.material as BABYLON.PBRMaterial
            mat.metallic = 0.1 // for better visualization
          }

          // abstract mesh does not have convertToFlatShadedMesh() in its typescript definition?
          // @ts-expect-error
          mesh.convertToFlatShadedMesh()

          const meshMin = mesh.getBoundingInfo().boundingBox.minimumWorld
          const meshMax = mesh.getBoundingInfo().boundingBox.maximumWorld

          min = BABYLON.Vector3.Minimize(min ?? meshMin, meshMin)
          max = BABYLON.Vector3.Maximize(max ?? meshMax, meshMax)

          mesh.setParent(meshRoot)
          mesh.name = mesh.id = `${this.name}__${idx}`
        })
        transformNodes.forEach((tnode) => tnode.dispose())

        this.size.x = max.x - min.x
        this.size.y = max.y - min.y
        this.size.z = max.z - min.z

        meshRoot.setBoundingInfo(new BABYLON.BoundingInfo(min, max))
        boundingBox = meshRoot.getBoundingInfo().boundingBox

        let centerOffset = boundingBox.centerWorld
        centerOffset = centerOffset.multiply(new BABYLON.Vector3(-1, -1, 0))

        meshRoot.position = centerOffset

        this.render()
      }
    )
  }

  setVisibility(visible: boolean) {
    this._engine.scene?.getMeshByName(`__root__${this.name}__`)?.setEnabled(visible)
    this.show = visible
    this.render()
  }

  render() {
    this._engine.render()
  }

  fitBounds() {
    if (!this._engine?.map) return

    if (!this.boundingBox) this._computeBoundingBox()

    if (this.boundingBox) {
      this._engine.map.fitBounds(this.boundingBox, {
        pitch: 0,
        padding: { top: 160, bottom: 160, right: 100, left: 100 },
      })
    }
  }

  _computeBoundingBox() {
    if (!this._engine) return

    const mc = this._engine.worldOriginMercator // center_xyz (unit: m in mercator)
    if (!mc) return

    const size = this.size // size by mesh boundingbox (unit: m)
    const scaleFactor = this._engine.worldScale // 單位轉換: m -> m in mercator

    this.boundingBox = new mapboxgl.LngLatBounds() // mapbox boundingbox (unit: m in mercator)

    const { x: sizeX, y: sizeY } = size

    const sw = new mapboxgl.MercatorCoordinate(
      mc.x - (sizeX * scaleFactor) / 2,
      mc.y - (sizeY * scaleFactor) / 2,
      0
    ).toLngLat()

    const ne = new mapboxgl.MercatorCoordinate(
      mc.x + (sizeX * scaleFactor) / 2,
      mc.y + (sizeY * scaleFactor) / 2,
      0
    ).toLngLat()

    this.boundingBox.extend(sw)
    this.boundingBox.extend(ne)
  }
}
