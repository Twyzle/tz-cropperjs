<template>
  <div
    class="range-slider"
    title="Click and drag to change the value"
    @mousedown="handleMouseDown"
  >
    <div class="range-slider__track-container">
      <div class="range-slider__track" />
      <div
        class="range-slider__fill"
        :style="fillStyle"
      />

      <!-- Standard Dots -->
      <template v-if="!shouldUseZeroCenteredTrack">
        <div
          class="range-slider__dot"
          style="left: 0;"
        />
        <div
          class="range-slider__dot"
          style="left: 100%;"
        />
      </template>

      <!-- Zero-Centered Dots -->
      <template v-if="shouldUseZeroCenteredTrack">
        <div
          class="range-slider__dot"
          style="left: 0;"
        />
        <div
          class="range-slider__dot range-slider__dot--zero"
          :style="{ left: zeroPosition + '%' }"
        />
        <div
          class="range-slider__dot"
          style="left: 100%;"
        />
      </template>

      <div
        class="range-slider__thumb"
        :style="{ left: thumbPosition + '%' }"
      />
    </div>
    <div
      v-if="!label"
      class="range-slider__value"
    >
      {{ modelValue }}{{ unitLabel }}
    </div>
    <div
      v-if="label"
      class="range-slider__value"
    >
      {{ label }}{{ unitLabel ? unitLabel : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

// Define component properties and events
const props = defineProps({
  label: {
    type: String,
    default: '',
    required: false,
  },
  /**
   * The current value of the slider. Used with v-model.
   */
  modelValue: {
    type: Number,
    required: true,
  },
  /**
   * The minimum value of the range.
   */
  min: {
    type: Number,
    default: 0,
  },
  /**
   * The maximum value of the range.
   */
  max: {
    type: Number,
    default: 100,
  },
  /**
   * The amount to increment the value by for each step.
   */
  step: {
    type: Number,
    default: 1,
  },
  /**
   * The label to display next to the value (e.g., '%', '°').
   */
  unitLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change','update:modelValue'])

// --- Safeguard for min/max props ---

const safeMin = computed(() => {
  if (props.min > props.max) {
    return props.max
  }
  return props.min
})

const safeMax = computed(() => {
  if (props.min > props.max) {
    return props.min
  }
  return props.max
})

watch(() => [props.min, props.max], ([newMin, newMax]) => {
  if (newMin > newMax) {
    console.warn(`[GeminiSlider] Warning: The 'min' prop (${newMin}) should not be greater than the 'max' prop (${newMax}). The values have been swapped internally to prevent breaking the component.`)
  }
}, { immediate: true })


// --- Computed Properties ---

/**
 * Calculates the horizontal position of the thumb in percentage.
 */
const thumbPosition = computed(() => {
  const { modelValue } = props
  if (safeMax.value === safeMin.value) return 0 // Avoid division by zero
  return ((modelValue - safeMin.value) / (safeMax.value - safeMin.value)) * 100
})

/**
 * Determines if the special zero-centered track should be used (i.e., when min is negative).
 */
const shouldUseZeroCenteredTrack = computed(() => safeMin.value < 0)

/**
 * Calculates the position of the '0' dot in zero-centered mode.
 */
const zeroPosition = computed(() => {
  if (safeMax.value === safeMin.value || safeMin.value >= 0) return 50 // Default or not applicable
  return ((0 - safeMin.value) / (safeMax.value - safeMin.value)) * 100
})

/**
 * Generates the dynamic style for the track's fill element.
 * This handles both standard and zero-centered modes.
 */
const fillStyle = computed(() => {
  if (shouldUseZeroCenteredTrack.value) {
    // Zero-centered mode
    const currentPos = thumbPosition.value
    const zeroPos = zeroPosition.value

    if (props.modelValue > 0) {
      return {
        left: `${zeroPos}%`,
        width: `${currentPos - zeroPos}%`,
      }
    } else if (props.modelValue < 0) {
      return {
        left: `${currentPos}%`,
        width: `${zeroPos - currentPos}%`,
      }
    } else { // modelValue is 0
      return {
        left: `${zeroPos}%`,
        width: '0%',
      }
    }
  } else {
    // Standard mode (min >= 0)
    return {
      left: '0%',
      width: `${thumbPosition.value}%`,
    }
  }
})


// --- Internal State ---

const startX = ref(0)
const startValue = ref(0)
const isDragging = ref(false)

/**
 * The sensitivity of the drag. A smaller number means faster value changes.
 * This means for every 4 pixels of horizontal mouse movement, the value changes by one 'step'.
 */
const DRAG_SENSITIVITY = 4 // pixels per step

// --- Event Handlers ---

const handleMouseMove = (event: MouseEvent) => {
  // We only start changing the value after the mouse has been confirmed to be dragging.
  if (!isDragging.value) {
    // This threshold prevents value changes on a simple click without dragging.
    if (Math.abs(event.clientX - startX.value) > 3) {
      isDragging.value = true
      document.body.style.cursor = 'ew-resize' // Change cursor for visual feedback
    } else {
      return // Not dragging yet, do nothing.
    }
  }

  // Prevent text selection while dragging
  event.preventDefault()

  // Calculate the horizontal distance moved from the starting point
  const deltaX = event.clientX - startX.value

  // Convert the pixel distance into a value change based on sensitivity and step
  const valueChange = Math.round(deltaX / DRAG_SENSITIVITY) * props.step

  // Calculate the potential new value
  let newValue = startValue.value + valueChange

  // Clamp the new value to stay within the min and max limits
  newValue = Math.max(safeMin.value, Math.min(safeMax.value, newValue))

  // Round the value to the nearest step increment
  // This ensures the value aligns with the steps, e.g., if step is 5, you get 5, 10, 15...
  const steppedValue = +(Math.round(newValue / props.step) * props.step).toFixed(2)
  // Emit the updated value if it has actually changed
  if (steppedValue !== props.modelValue) {
    emit('update:modelValue', steppedValue)
    emit('change', steppedValue)
  }
}

const handleMouseUp = () => {
  // Clean up global event listeners and reset state
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'default' // Reset cursor
  isDragging.value = false
}

const handleMouseDown = (event: MouseEvent) => {
  // Prevent default browser actions (like text selection)
  event.preventDefault()

  // Record the starting mouse position and the slider's value at that moment
  startX.value = event.clientX
  startValue.value = props.modelValue
  isDragging.value = false // Reset dragging state on new click

  // Add listeners to the window to capture mouse movement anywhere on the page
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

// Ensure that we clean up the event listeners if the component is unmounted
// while a drag is in progress to prevent memory leaks.
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.range-slider {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #2c2c2c;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: ew-resize; /* Indicates horizontal dragging is possible */
  user-select: none; /* Prevents text selection during interaction */
  width: 250px;
}

.range-slider__track-container {
  flex-grow: 1;
  position: relative;
  height: 10px; /* Give container height for alignment */
  display: flex;
  align-items: center;
}

.range-slider__track,
.range-slider__fill {
  position: absolute;
  height: 3px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 3px;
}

.range-slider__track {
  width: 100%;
  background-color: #7a7a7a;
  z-index: 0;
}

.range-slider__fill {
  background-color: #007bff;
  width: 0; /* Default width, will be overridden by inline style */
  z-index: 1;
}

.range-slider__thumb {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.range-slider__dot {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #7a7a7a;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.range-slider__dot--zero {
  width: 7px;
  height: 7px;
  background-color: #ffffff; /* Make it prominent */
}


.range-slider__value {
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  min-width: 24px; /* Ensures space for the value */
  text-align: right;
  white-space: nowrap; /* Prevents the label from wrapping */
}
</style>
