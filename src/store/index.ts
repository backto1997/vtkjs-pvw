// Utilities
import { createPinia } from 'pinia'

import { useWSLinkStore } from './wslink'
import { useViewStore } from './view'
import { useModelStore } from './model'
import { useMapStore } from './map'
import { useLayerStore } from './layer'

const store = createPinia()

export { useWSLinkStore, useViewStore, useModelStore, useMapStore, useLayerStore }

export default store
