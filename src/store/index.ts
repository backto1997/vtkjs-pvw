// Utilities
import { createPinia } from 'pinia'

import { useWSLinkStore } from './wslink'
import { useConeStore } from './cone'

const store = createPinia()

export { useWSLinkStore, useConeStore }

export default store
