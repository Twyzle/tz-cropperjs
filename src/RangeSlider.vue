<template>
  <div
    class="range-slider"
    @mousedown="startDrag"
    @touchstart.passive="startDrag"
  >
    <!-- Static Value Display -->
    <div class="value-label">
      {{ displayValue }}
    </div>

    <!-- Scrollable Track Centered Behind Label -->
    <div
      ref="trackContainerRef"
      class="track-container"
    >
      <div
        ref="trackRef"
        class="track"
        :style="{ transform: `translateX(${translateX}px)` }"
      >
        <div
          v-for="i in totalSteps + 1"
          :key="i"
          class="dot"
          :style="{ left: `${i * stepSpacing}px` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  unitLabel?: string
  requireDragToUpdate?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const min = computed(() => props.min ?? 0)
const max = computed(() => props.max ?? 100)
const step = computed(() => props.step ?? 1)
const range = computed(() => max.value - min.value)
const totalSteps = computed(() => Math.round(range.value / step.value))
const stepSpacing = 16 // spacing between dots

const internalValue = ref(props.modelValue)
const dragging = ref(false)
const dragStartX = ref(0)
const dragStartValue = ref(0)
const trackContainerRef = ref<HTMLElement | null>(null)

const displayValue = computed(() => `${internalValue.value}${props.unitLabel ?? ''}`)

watch(() => props.modelValue, (val) => {
  if (!dragging.value) {
    internalValue.value = val
  }
})

function startDrag(e: MouseEvent | TouchEvent) {
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX

  dragging.value = true
  dragStartX.value = clientX
  dragStartValue.value = internalValue.value

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onMouseMove)
  window.addEventListener('touchend', stopDrag)
}

function onMouseMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const deltaX = clientX - dragStartX.value
  const deltaSteps = Math.round(deltaX / stepSpacing)
  let newValue = dragStartValue.value + deltaSteps * step.value

  newValue = Math.max(min.value, Math.min(max.value, newValue))
  if (newValue !== internalValue.value) {
    internalValue.value = newValue
    emit('update:modelValue', newValue)
  }
}

function stopDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onMouseMove)
  window.removeEventListener('touchend', stopDrag)
}

const translateX = computed(() => {
  const stepsFromMin = (internalValue.value - min.value) / step.value
  const centerOffset = (trackContainerRef.value?.clientWidth ?? 0) / 2
  return -stepsFromMin * stepSpacing + centerOffset
})

onMounted(() => {
  internalValue.value = props.modelValue
})
</script>

<style scoped>
.range-slider {
  position: relative;
  width: 100%;
  user-select: none;
  max-width: 100%;
}

.value-label {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  white-space: nowrap;
}

.track-container {
  max-width: 50%;
  margin: 0 auto;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.track {
  position: absolute;
  height: 6px;
  top: 50%;
  transform: translateY(-50%);
  will-change: transform;
  transition: transform 0.1s linear;
}

.dot {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  background-color: currentColor;
  border-radius: 50%;
  transform: translateY(-50%);
}
</style>
