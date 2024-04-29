// Utilities
import { createPinia } from 'pinia'

import { useWSLinkStore } from './wslink'
import { useViewStore } from './view'
import { useModelStore } from './model'

const store = createPinia()

export { useWSLinkStore, useViewStore, useModelStore }

export default store
