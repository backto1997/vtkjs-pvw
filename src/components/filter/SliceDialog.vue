<template>
  <v-dialog
    :scrim="false"
    :persistent="true"
    :no-click-animation="true"
    :retain-focus="false"
    width="auto"
    content-class="slice-dialog"
  >
    <v-card width="500">
      <v-toolbar density="compact" class="d-flex justify-space-between align-center bg-transparent">
        <v-spacer></v-spacer>
        <v-btn variant="text" density="compact" icon @click="$emit('close')">
          <v-icon icon="mdi-close" size="16"></v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-l pt-0 pb-m">
        <v-form class="d-flex flex-column gap-l" @submit.prevent="submit">
          <div class="d-flex flex-column gap-s">
            <div>Origin</div>
            <div class="d-flex flex-column gap-s">
              <div class="d-flex gap-l">
                <v-text-field
                  v-model.number="origin[0]"
                  label="X"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
                <v-slider v-model="origin[0]" :min="bounding[0]" :max="bounding[1]"></v-slider>
              </div>

              <div class="d-flex gap-l">
                <v-text-field
                  v-model.number="origin[1]"
                  label="Y"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
                <v-slider v-model="origin[1]" :min="bounding[2]" :max="bounding[3]"></v-slider>
              </div>

              <div class="d-flex gap-l">
                <v-text-field
                  v-model.number="origin[2]"
                  label="Z"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
                <v-slider v-model="origin[2]" :min="bounding[4]" :max="bounding[5]"></v-slider>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column gap-s">
            <div>Normal</div>
            <div class="d-flex gap-s">
              <v-text-field
                v-model.number="normal[0]"
                label="X"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model.number="normal[1]"
                label="Y"
                variant="outlined"
                density="compact"
              ></v-text-field>
              <v-text-field
                v-model.number="normal[2]"
                label="Z"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </div>
          </div>

          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary">OK</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

import { useWSLinkStore, useModelStore } from '@/store'
import { storeToRefs } from 'pinia'

/* -- store -- */
const wslinkStore = useWSLinkStore()
const modelStore = useModelStore()

/* -- props / emits -- */
defineEmits<{
  (e: 'close'): void
}>()

/* -- data -- */
const { bounding } = storeToRefs(modelStore)

const origin = ref<number[]>([0, 0, 0])
const normal = ref<number[]>([0, 0, 1])

/* -- watcher -- */
watch(bounding, () => {
  if (bounding.value.length === 0) return
  origin.value[0] = (bounding.value[0] + bounding.value[1]) / 2
  origin.value[1] = (bounding.value[2] + bounding.value[3]) / 2
  origin.value[2] = (bounding.value[4] + bounding.value[5]) / 2
})

/* -- method -- */
const { slice } = wslinkStore

const submit = () => {
  slice('Plane', origin.value, normal.value)
  // emits('close')
}
</script>

<style lang="scss">
.slice-dialog {
  position: absolute;
  top: 2.5rem;
  right: -1rem;
}
</style>
