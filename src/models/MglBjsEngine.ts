import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

import mapboxgl, { Map, MercatorCoordinate, CustomLayerInterface } from 'mapbox-gl'

BABYLON.SceneLoader.ShowLoadingScreen = false

export class MglBjsEngine {
  // info
  lngLat: [number, number]

  // babylonjs
  public engine?: BABYLON.Engine
  public scene?: BABYLON.Scene
  public light?: BABYLON.HemisphericLight

  // mapbox
  map: Map | null = null
  _worldMatrix?: BABYLON.Matrix
  _mapboxCameraMatrix: number[]
  _projectionMatrix?: BABYLON.Matrix
  worldOriginMercator?: mapboxgl.MercatorCoordinate
  worldScale: number = 0

  constructor() {
    this._mapboxCameraMatrix = []
    this.lngLat = [120.47823749628697, 23.92051949732512]
  }

  createEngine(
    canvasOrContext: BABYLON.Nullable<
      WebGLRenderingContext | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext
    >
  ) {
    this.engine = new BABYLON.Engine(canvasOrContext, true, {
      useHighPrecisionMatrix: true,
      adaptToDeviceRatio: true,
    })
  }

  createScene() {
    if (!this.engine) return

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.autoClear = false
    this.scene.detachControl()
    this.scene.useRightHandedSystem = true
    this.scene.beforeRender = () => {
      this.engine?.wipeCaches(true)
    }
    this.scene.onNewMaterialAddedObservable.add((mat) => {
      mat.backFaceCulling = false
    })
  }

  createCamera() {
    if (!this.scene) return

    this.scene.activeCamera = new BABYLON.Camera('mapboxCamera', BABYLON.Vector3.Zero(), this.scene)
    this.scene.activeCamera.minZ = 0
  }

  createLight() {
    this.light = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 0, 1), this.scene)
    this.light.groundColor = new BABYLON.Color3(0.7, 0.7, 0.7) // for better visualization
    this.light.specular = BABYLON.Color3.Black()
  }

  /**
   * Create mapbox custom layer
   * @returns layer
   */
  toMapboxLayer() {
    const layer: CustomLayerInterface = {
      id: 'BabylonJS',
      type: 'custom',
      renderingMode: '3d',
      onAdd: (map, gl) => {
        this.map = map

        // engine
        this.createEngine(gl)

        // scene
        this.createScene()

        // camera
        this.createCamera()

        // add light
        this.createLight()

        window.dispatchEvent(new Event('resize'))

        // calc world transform matrix
        this._computeWorldMatrix()

        // optimize performance
        // this.scene.freeActiveMeshes();
        // this.scene.performancePriority = BABYLON.ScenePerformancePriority.Aggressive;
        // this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
        // this.scene.blockfreeActiveMeshesAndRenderingGroups = true;
        // this.scene.renderTargetsEnabled = false;
      },
      onRemove: () => {
        // window.removeEventListener('resize', this.onWindowResize)
        if (this.scene) {
          this.scene.cleanCachedTextureBuffer()
          this.scene.clearCachedVertexData()
          this.scene.meshes.length = 0
          this.scene.dispose()
        }
        this.engine?.dispose()

        this._worldMatrix = undefined
        this._mapboxCameraMatrix.length = 0
        this._projectionMatrix = undefined
        this.worldOriginMercator = undefined
        this.worldScale = 0
      },
      render: (gl, matrix) => {
        if (!this.scene?.isReady()) return

        // SceneOptimizer
        // for auto-merging meshes, reducing shadow quality and material properties
        // BABYLON.SceneOptimizer.OptimizeAsync(this.scene);

        // -----
        // [issue] mapbox would keep rendering even there is no any view change
        // so record and compare mapbox camera matrix, if same, then return to avoid unnecessary render
        const isSameMatrix = this._mapboxCameraMatrix.every((item, iItem) => item === matrix[iItem])
        // do not render if no any view change
        if (this._mapboxCameraMatrix.length && isSameMatrix) {
          this.render(false)
          return
        }

        // calculate overall projection matrix
        const _mapboxCameraMatrix = BABYLON.Matrix.FromArray(matrix)
        this._projectionMatrix = this._worldMatrix?.multiply(_mapboxCameraMatrix)

        // record mapbox camera matrix for comparison
        this._mapboxCameraMatrix = matrix
        // -----

        this.render()
      },
    }
    return layer
  }

  render(repaintMap = true, renderScene = true) {
    if (renderScene) {
      // wipeCaches要在scene render之前
      this.engine?.wipeCaches(true)

      // activeCamera要freeze
      this.scene?.activeCamera?.freezeProjectionMatrix(this._projectionMatrix)
      this.scene?.render(false)
    }

    if (repaintMap) {
      this.map?.triggerRepaint()
    }
  }

  clearScene() {
    this.scene?.meshes.forEach((mesh) => mesh.dispose())
    this.render()
  }

  /**
   * ------------------------
   *         private
   * ------------------------
   **/
  // ref: https://docs.maptiler.com/sdk-js/examples/add-3d-model-babylon/
  // ref: https://jsfiddle.net/gtsl2/mrfs9td8/10/
  _computeWorldMatrix() {
    if (!this.map) return

    // const worldRotate = [0, 0, 0];

    // lnglat -> mercator center (x, y, z)
    this.worldOriginMercator = MercatorCoordinate.fromLngLat(this.lngLat, 1)

    // distance of 1 meter in mercatorCenter units (depends on LngLat)
    // ref: https://docs.mapbox.com/mapbox-gl-js/api/geography/#mercatorcoordinate#meterinmercatorcoordinateunits
    this.worldScale = this.worldOriginMercator.meterInMercatorCoordinateUnits()

    // calculate world matrix
    // y-axis(-) means right-handed system
    const scaleMatrix = BABYLON.Matrix.Scaling(this.worldScale, -this.worldScale, this.worldScale)

    this._worldMatrix = BABYLON.Matrix.Identity().setTranslationFromFloats(
      this.worldOriginMercator.x,
      this.worldOriginMercator.y,
      this.worldOriginMercator.z || 0
    )
    this._worldMatrix = scaleMatrix.multiply(this._worldMatrix)
    // this._worldMatrix = BABYLON.Matrix.RotationX(worldRotate[0]).multiply(this._worldMatrix);
    // this._worldMatrix = BABYLON.Matrix.RotationY(worldRotate[1]).multiply(this._worldMatrix);
    // this._worldMatrix = BABYLON.Matrix.RotationZ(worldRotate[2]).multiply(this._worldMatrix);
  }
}
