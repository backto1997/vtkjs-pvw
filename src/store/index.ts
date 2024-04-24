// Utilities
import { createPinia } from 'pinia'

import { useWSLinkStore } from './wslink'
import { useViewStore } from './view'
import { useConeStore } from './cone'

const store = createPinia()

export { useWSLinkStore, useViewStore, useConeStore }

export default store
