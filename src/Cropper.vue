<template>
  <div
    ref="cropperContainer"
    class="cropper-container"
    :class="{
      'items-start': enableViewer,
    }"
  >
    <div class="flex-col flex w-full h-full">
      <cropper-canvas
        ref="cropperCanvasEl"
        background
      >
        <cropper-image
          ref="cropperImageEl"
          :src="props.src"
          :crossorigin="props.crossOrigin"
          rotatable
          scalable
          skewable
          translatable
          @ready="onImageReady"
          @transform="onCropperImageTransform"
        />
        <cropper-shade
          v-if="props.enableCropperShade"
          hidden
        />
        <cropper-handle
          :action="props.cropperHandleAction"
          plain
        />
        <cropper-selection
          :id="uniqueId"
          ref="cropperSelectionEl"
          :initial-coverage="props.initialCoverage"
          :aspect-ratio="computedAspectRatio"
          :movable="true"
          :resizable="true"
          :precise="props.cropperSelectionPrecise"
          @change="onCropperSelectionChange"
        >
          <cropper-grid
            role="grid"
            bordered
            covered
          />
          <cropper-crosshair centered />
          <cropper-handle
            v-if="!props.disableHandles?.move"
            action="move"
            theme-color="rgba(255, 255, 255, 0.35)"
          />
          <cropper-handle
            v-if="!props.disableHandles?.n"
            action="n-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.e"
            action="e-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.s"
            action="s-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.w"
            action="w-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.ne"
            action="ne-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.nw"
            action="nw-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.se"
            action="se-resize"
          />
          <cropper-handle
            v-if="!props.disableHandles?.sw"
            action="sw-resize"
          />
        </cropper-selection>
      </cropper-canvas>
      <div
        v-if="enableToolbar"
        class="cropper-tools"
      >
        <div
          :class="{ 'animate-pulse': !imageLoaded }"
          class="w-full flex flex-row justify-between items-center mt-4 flex-wrap"
        >
          <div class="grow-0">
            <div class="cropper-tools-button-group">
              <button
                type="button"
                :disabled="!imageLoaded"
                title="zoom in"
                @click="zoom(0.1)"
              >
                <span class="sr-only">zoom in</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                /></svg>
              </button>
              <button
                type="button"
                class="-ml-px "
                :disabled="!imageLoaded"
                title="zoom out"
                @click="zoom(-0.1)"
              >
                <span class="sr-only">zoom out</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
                /></svg>
              </button>
            </div>
          </div>
          <div class="grow-0">
            <div class="cropper-tools-button-group">
              <button
                type="button"
                :disabled="!imageLoaded"
                title="move left"
                @click="move('left')"
              >
                <span class="sr-only">move left</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                /></svg>
              </button>
              <button
                type="button"
                :disabled="!imageLoaded"
                title="move right"
                @click="move('right')"
              >
                <span class="sr-only">move right</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                /></svg>
              </button>
              <button
                type="button"
                :disabled="!imageLoaded"
                title="move up"
                @click="move('up')"
              >
                <span class="sr-only">move up</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                /></svg>
              </button>
              <button
                type="button"
                :disabled="!imageLoaded"
                title="move down"
                @click="move('down')"
              >
                <span class="sr-only">move down</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                /></svg>
              </button>
            </div>
          </div>
          <div class="grow-0">
            <div class="cropper-tools-button-group">
              <button
                type="button"
                :disabled="!imageLoaded"
                title="rotate"
                @click="rotate()"
              >
                <span class="sr-only">rotate</span>
                <svg
                  data-v-9c34c54e=""
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="icon"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="m16.89 15.5l1.42 1.39c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.5M13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03m6.93-6.9a7.9 7.9 0 0 0-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47m-2.36-5.45L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10z"
                /></svg>
              </button>
              <button
                type="button"
                :disabled="!imageLoaded"
                title="flip horizontal"
                @click="flip('horizontal')"
              >
                <span class="sr-only">flip horizontal</span>
                <svg
                  data-v-9c34c54e=""
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="icon"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M15 21h2v-2h-2m4-10h2V7h-2M3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2m16-2v2h2c0-1.1-.9-2-2-2m-8 20h2V1h-2m8 16h2v-2h-2M15 5h2V3h-2m4 10h2v-2h-2m0 10c1.1 0 2-.9 2-2h-2Z"
                /></svg>
              </button>
              <button
                type="button"
                :disabled="!imageLoaded"
                title="flip vertical"
                @click="flip('vertical')"
              >
                <span class="sr-only">flip vertical</span>
                <svg
                  data-v-9c34c54e=""
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="icon"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M3 15v2h2v-2m10 4v2h2v-2m2-16H5c-1.1 0-2 .9-2 2v4h2V5h14v4h2V5c0-1.1-.9-2-2-2m2 16h-2v2c1.1 0 2-.9 2-2M1 11v2h22v-2M7 19v2h2v-2m10-4v2h2v-2m-10 4v2h2v-2M3 19c0 1.1.9 2 2 2v-2Z"
                /></svg>
              </button>
            </div>
          </div>
          <div class="grow-0">
            <div class="cropper-tools-button-group">
              <button
                :disabled="!imageLoaded"
                type="button"
                title="reset"
                @click="reset()"
              >
                <span class="sr-only">reset</span>
                <svg
                  data-v-9c34c54e=""
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  class="icon"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                ><path
                  fill="currentColor"
                  d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9"
                /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="enableActionButtons"
        class="flex flex-col items-center w-full"
        style="margin-top: 24px;"
      >
        <div class="flex items-center">
          <gemini-slider
            v-show="currentAction === 'rotate'"
            v-model="rotateLevel"
            :min="rotateMin"
            :max="rotateMax"
            :step="1"
            unit-label="°"
            @change="rotate(rotateLevel)"
          />
          <gemini-slider
            v-show="currentAction === 'zoom'"
            v-model="zoomLevel"
            :min="props.zoomMin"
            :max="props.zoomMax"
            :step="0.01"
            :label="(zoomLevel * 100).toFixed(0) + '%'"
          />
        </div>

        <div class="flex items-center mt-4">
          <button
            class="action-button"
            :class="{ 'action-button-active': currentAction === 'rotate' }"
            @click="currentAction = 'rotate'"
          >
            Rotate
          </button>
          <button
            class="action-button"
            :class="{ 'action-button-active': currentAction === 'zoom' }"
            @click="currentAction = 'zoom'"
          >
            Zoom
          </button>
        </div>
      </div>
    </div>
    <cropper-viewer
      v-if="!props.viewer && props.enableViewer"
      ref="cropperViewerWrapperEl"
      :selection="'#' + uniqueId"
      class="flex-col flex w-full ml-4"
      style="background-color: rgba(0, 0, 0, 0.1);"
    />
  </div>
</template>

<script setup lang="ts">
import GeminiSlider from './GeminiSlider.vue'
import { ref, onMounted, onUnmounted, watch, Ref, computed, watchEffect } from 'vue'
import Cropper, { CropperViewer } from 'cropperjs'
import type { Selection } from '@cropper/element-selection'
import type { Props, TransformTuple, ExtendedToCanvasOptions, CropperCanvas, CropperImage, CropperSelection, Dimensions } from './types'
import { useCropperControls  } from './useCropperControls'
// Define component props with types
const props = withDefaults(defineProps<Props>(), {
  aspectRatio: undefined,
  crossOrigin: 'anonymous',
  cropDimensions: () => ({} as Dimensions),
  cropperHandleAction: 'move',
  cropperSelectionBoundary: 'canvas',
  cropperSelectionPrecise: true,
  disableHandles: () => ({}),
  enableActionButtons: true,
  enableCropperShade: true,
  enableFreeformSelection: false,
  enableToolbar: false,
  enableViewer: false,
  viewer: undefined,
  fillColor: undefined,
  handleAction: 'move',
  initialCoverage: 0.5,
  rotateMin: -90,
  rotateMax: 90,
  zoomMin: -1,
  zoomMax: 1,
})

// Define component emits for type-checking
const emit = defineEmits(['loadError', 'ready'])
const rotateLevel = ref(0)
const zoomLevel = ref(0)

const currentAction = ref('rotate')
// Typed refs for the <img> element and the Cropper instance
const cropperContainer: Ref<HTMLDivElement | null> = ref(null)
const cropperViewerWrapperEl: Ref<HTMLDivElement | null> = ref(null)
const cropperViewerEl: Ref<CropperViewer | null> = ref(null)
const cropperImageEl: Ref<CropperImage | null> = ref(null)
const cropperCanvasEl: Ref<CropperCanvas | null> = ref(null)
const cropperSelectionEl: Ref<CropperSelection | null> = ref(null)
const originalTransform: Ref<TransformTuple | undefined> = ref([0])
const uniqueId = ref(generateUniqueId())
const imageLoaded = ref(false)
const {
  getCroppedCanvas,
  zoom,
  rotate,
  flip,
  move,
  reset,
} = useCropperControls({
  cropperImageEl,
  cropperCanvasEl,
  cropperSelectionEl,
  originalTransform,
})

const computedAspectRatio = computed(() => {
  if (props.aspectRatio) {
    return props.aspectRatio
  }
  if (props.cropDimensions && props.cropDimensions.width && props.cropDimensions.height) {
    return props.cropDimensions.width / props.cropDimensions.height
  }
  return 1 // Default aspect ratio
})

function onImageReady(image: HTMLImageElement) {
  emit('ready', { image })
  imageLoaded.value = true
  if (cropperImageEl.value) {
    originalTransform.value = cropperImageEl.value.$getTransform() as TransformTuple
  }
}

// Watch for custom viewer targets only (template handles default viewer)
watchEffect((onCleanup) => {
  // Only handle custom viewer targets, not the default viewer
  if (!props.viewer || !imageLoaded.value || !props.src) {
    return
  }

  let targetElement: HTMLElement | null = null

  // Handle string selector or HTMLElement reference
  if (typeof props.viewer === 'string') {
    targetElement = document.querySelector(props.viewer)
    if (!targetElement) {
      console.warn(`[vue-cropperjs] Viewer selector "${props.viewer}" not found.`)
      return
    }
  } else if (props.viewer instanceof HTMLElement) {
    targetElement = props.viewer
  }

  if (!targetElement) return

  // Create and append the viewer to custom target
  const viewer = new CropperViewer()
  viewer.setAttribute('selection', '#' + uniqueId.value)
  targetElement.appendChild(viewer)
  cropperViewerEl.value = viewer

  // Cleanup: remove viewer when component unmounts or viewer target changes
  onCleanup(() => {
    viewer.remove()
    cropperViewerEl.value = null
  })
})
const steps = computed(() => {
  return Math.round(zoomLevel.value * 100)
})


/**
 * Calculates the final, absolute zoom scale that the image should have
 * based on the number of steps. This is our "source of truth".
 */
const targetZoomScale = computed(() => {
  // This factor determines how much to zoom per step.
  // 1.01 = 1% zoom per step.
  // If you want 10% zoom per step, change this to 1.1.
  const zoomFactorPerStep = 1.1

  // The formula for the final scale is:
  // initialScale * (zoomFactor ^ numberOfSteps)
  return originalTransform.value![0] * Math.pow(zoomFactorPerStep, steps.value)
})

/**
 * This watcher observes our "source of truth" (`targetZoomScale`).
 * When it changes, this code calculates the precise, one-time zoom operation
 * needed to get the image from its current state to the target state.
 *
 * This automatically handles "missed steps" from a fast drag.
 */
watch(targetZoomScale, (newTargetScale) => {
  // Only run after the onMounted hook has completed.
  // if (!isReady.value || !cropperInstance.value) {
  //   return
  // }

  // 1. Get the cropper's ACTUAL current scale.
  const currentScale = cropperImageEl.value?.$getTransform()[0] || 0

  // 2. Calculate the required RELATIVE zoom factor to bridge the gap
  //    between the current scale and the target scale.
  //    Formula: (target / current) - 1
  const relativeZoomFactor = (newTargetScale / currentScale) - 1

  // 3. Apply the single, corrective zoom.
  zoom(relativeZoomFactor)
})

onMounted(() => {
  if (cropperImageEl.value) {
    cropperImageEl.value.$ready((image) => {
      onImageReady(image)
    }).catch((error) => {
      console.error('Error initializing Cropper:')
      console.error(error)
      emit('loadError', { error })
      imageLoaded.value = false
    })
  }
})

// Destroy the cropper instance when the component is unmounted
onUnmounted(() => {
  cropperViewerEl.value = null
})

// Watch for changes in the src prop
watch(() => props.src, (newSrc) => {
  if (cropperImageEl.value && newSrc) {
    cropperImageEl.value.setAttribute('src', newSrc)
  }
})
watch(rotateLevel, (newAngle) => {
  // Cropper.js v2 has a direct method to set the absolute angle.
  // 1. Get the cropper's current transformation matrix.
  const matrix = cropperImageEl.value!.$getTransform()
  const a = matrix[0] // cos(angle) * scale
  const b = matrix[1] // sin(angle) * scale

  // 2. Calculate the current angle in degrees from the matrix components.
  //    Math.atan2(b, a) returns the angle in radians.
  const currentAngleRad = Math.atan2(b, a)
  const currentAngleDeg = currentAngleRad * (180 / Math.PI)

  // 3. Calculate the difference (delta) needed to get from the current to the new angle.
  const deltaAngle = newAngle - currentAngleDeg

  // 4. Apply the relative rotation using the calculated delta.
  //    This ensures the image always rotates to the correct absolute position,
  //    matching the slider's value perfectly.
  rotate(deltaAngle)
})

// Expose typed methods to the parent component
defineExpose({
  async getCroppedCanvas (options?: ExtendedToCanvasOptions): Promise<HTMLCanvasElement | null> {
    if (!options) {
      options = {}
    }
    if (typeof options.width === 'undefined' && props.cropDimensions.width) {
      options.width = props.cropDimensions.width
    }
    if (typeof options.height === 'undefined' && props.cropDimensions.height) {
      options.height = props.cropDimensions.height
    }
    if (typeof options.fillColor === 'undefined' && props.fillColor?.trim()) {
      options.fillColor = props.fillColor
    }

    if (Object.keys(options).length > 0) {
      options.beforeDraw = function (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        context.fillStyle = props.fillColor as string
        context.fillRect(0, 0, options?.width || canvas.width, options?.height || canvas.height)
      }
    }
    return await getCroppedCanvas(options)
  },
  // Expose other methods with their types
  zoom: (ratio: number): void => zoom(ratio),
  rotate: (degree: number): void => rotate(degree),
})
function isWithinBounds(selection: Selection, maxSelection: Selection, tolerance = 1): boolean {
  return (
    selection.x >= (maxSelection.x - tolerance)
    && selection.y >= (maxSelection.y - tolerance)
    && (selection.x + selection.width) <= (maxSelection.x + maxSelection.width + tolerance)
    && (selection.y + selection.height) <= (maxSelection.y + maxSelection.height + tolerance)
  )
}
function onCropperImageTransform(event: Event) {
  const customEvent = event as CustomEvent
  const cropperCanvas = cropperCanvasEl.value as CropperCanvas

  if (!cropperCanvas || props.cropperSelectionBoundary !== 'image') {
    return
  }

  const cropperImage = cropperImageEl.value as CropperImage
  const cropperSelection = cropperSelectionEl.value as CropperSelection
  const cropperCanvasRect = cropperCanvas.getBoundingClientRect()

  // 1. Clone the cropper image.
  const cropperImageClone = cropperImage.cloneNode() as CropperImage

  // 2. Apply the new matrix to the cropper image clone.
  cropperImageClone.style.transform = `matrix(${customEvent.detail.matrix.join(', ')})`

  // 3. Make the cropper image clone invisible.
  cropperImageClone.style.opacity = '0'

  // 4. Append the cropper image clone to the cropper canvas.
  cropperCanvas.appendChild(cropperImageClone)

  // 5. Compute the boundaries of the cropper image clone.
  const cropperImageRect = cropperImageClone.getBoundingClientRect()

  // 6. Remove the cropper image clone.
  cropperCanvas.removeChild(cropperImageClone)

  const selection = cropperSelection as Selection
  const maxSelection: Selection = {
    x: cropperImageRect.left - cropperCanvasRect.left,
    y: cropperImageRect.top - cropperCanvasRect.top,
    width: cropperImageRect.width,
    height: cropperImageRect.height,
  }

  if (!isWithinBounds(selection, maxSelection)) {
    event.preventDefault()
  }
}
function generateUniqueId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2)
}
function onCropperSelectionChange(event: Event) {
  const customEvent = event as CustomEvent
  if (!cropperCanvasEl.value || !cropperSelectionEl.value) {
    return
  }
  const cropperCanvas = cropperCanvasEl.value
  if (!cropperCanvas || props.cropperSelectionBoundary === 'none') {
    return
  }

  const cropperCanvasRect = cropperCanvas.getBoundingClientRect()
  const selection = customEvent.detail as Selection
  let maxSelection: Selection

  switch (props.cropperSelectionBoundary) {
    case 'canvas': {
      maxSelection = {
        x: 0,
        y: 0,
        width: cropperCanvasRect.width,
        height: cropperCanvasRect.height,
      }
      break
    }
    case 'image': {
      const cropperImage = cropperImageEl.value as CropperImage
      const cropperImageRect = cropperImage.getBoundingClientRect()
      maxSelection = {
        x: cropperImageRect.left - cropperCanvasRect.left,
        y: cropperImageRect.top - cropperCanvasRect.top,
        width: cropperImageRect.width,
        height: cropperImageRect.height,
      }
      break
    }
    default:
      return
  }

  // Only prevent if selection would go outside bounds
  if (!isWithinBounds(selection, maxSelection)) {
    event.preventDefault()
  }
}

</script>
<style scoped>
.cropper-tools-button-group button:active,
.cropper-tools-button-group button:active svg  {
  transform: scale(0.95); /* "Pushed down" effect */
}
.cropper-tools-button-group button:active {
  background: rgba(45, 45, 45, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.cropper-container {
  display: flex;
  position: relative;
}
.h-full {
  height: 100%;
}
.w-full {
  width: 100%;
}
.flex {
  display: flex;
}
.flex-basis-full {
  flex-basis: 100%;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.icon {
  display: inline-block;
  vertical-align: middle;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.items-start{
  align-items: flex-start;
}
.justify-center {
  justify-content: center;
}
.grow-0 {
  flex-grow: 0;
}
.ml-4 {
  margin-left: 1rem;
}
.mt-4 {
  margin-top: 16px;
}
button {
  cursor: pointer;
}
button[disabled] {
  cursor: not-allowed;
}
.action-button{
  padding: 8px 24px;
  border: 0;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
}
.action-button:not(:first-of-type) {
  margin-left: 16px;
}
.cropper-tools-button-group button {
  align-items: center;
  display: inline-flex;
  position: relative;
  padding: .375rem;
  background: rgba(45, 45, 45, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: .375rem;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0,0,0,.05);
  transition: background .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.cropper-tools-button-group button:not([disabled]):hover,
.action-button-active {
  color: white;
  background: rgba(45, 45, 45, 0.5);
}
.cropper-tools-button-group button:focus {
  outline: none;
}
.cropper-tools-button-group {
  gap: 4px;
  display: inline-flex;
  isolation: isolate;
}
.cropper-tools-button-group button svg {
  height: 1.25rem;
  width: 1.25rem;
}
.cropper-container :deep(cropper-canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite;
}
.sr-only{
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  clip: rect(0, 0, 0, 0);
  border-width: 0;
  white-space: nowrap;
}

@keyframes pulse {
  50% {
    opacity: .5;
  }
}
</style>
