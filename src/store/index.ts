// Utilities
import { createPinia } from 'pinia'

import { useWSLinkStore } from './wslink'
import { useViewStore } from './view'
import { useFilterStore } from './filter'

const store = createPinia()

export { useWSLinkStore, useViewStore, useFilterStore }

export default store
