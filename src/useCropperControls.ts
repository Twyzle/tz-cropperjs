import { Ref } from 'vue'
import { CropperCanvas, CropperImage, CropperSelection } from 'cropperjs'
import { ToCanvasOptions, type TransformTuple } from './types'
export function useCropperControls({
  cropperImageEl,
  cropperCanvasEl,
  cropperSelectionEl,
  originalTransform
}: {
  cropperImageEl: Ref<CropperImage | null>
  cropperCanvasEl: Ref<CropperCanvas | null>
  cropperSelectionEl: Ref<CropperSelection | null>
  originalTransform: Ref<TransformTuple | undefined>
}) {
  function zoom(ratio: number) {
    cropperImageEl.value?.$zoom(+ratio.toFixed(2))
  }

  function rotate(degree = 15, angleUnit: 'deg' | 'rad' | 'grad' | 'turn' = 'deg') {
    cropperImageEl.value?.$rotate(`${degree}${angleUnit}`)
  }

  function flip(direction: 'horizontal' | 'vertical') {
    if (!cropperImageEl.value) return
    const x = direction === 'horizontal' ? -1 : 1
    const y = direction === 'vertical' ? -1 : 1
    cropperImageEl.value.$scale(x, y)
  }

  function move(direction: 'left' | 'right' | 'up' | 'down') {
    if (!cropperImageEl.value) return

    const distance = 10
    const dx = direction === 'left' ?
      -distance
      : direction === 'right'
        ? distance
        : 0
    const dy = direction === 'up'
      ? -distance
      : direction === 'down'
        ? distance
        : 0

    cropperImageEl.value.$move(dx, dy)
  }

  function reset() {
    if (!cropperImageEl.value || !cropperSelectionEl.value) return
    cropperImageEl.value.$setTransform(...(originalTransform.value ?? [0]))
    cropperSelectionEl.value.$reset()
  }

  function getTransform(): TransformTuple {
    return !!cropperImageEl.value?.$getTransform()
      ? cropperImageEl.value?.$getTransform() as TransformTuple
      : [0]
  }

  async function getCroppedCanvas(options: ToCanvasOptions): Promise<HTMLCanvasElement | null> {
    if (!cropperSelectionEl.value) {
      return null
    }
    return await cropperSelectionEl.value.$toCanvas(options)
  }

  return {
    getCroppedCanvas,
    getTransform,
    flip,
    move,
    reset,
    rotate,
    zoom,
  }
}
