// Utilities
import { createPinia } from 'pinia'

import { useWSLinkStore } from './wslink'
import { useViewStore } from './view'
import { useModelStore } from './model'
import { useMapStore } from './map'

const store = createPinia()

export { useWSLinkStore, useViewStore, useModelStore, useMapStore }

export default store
