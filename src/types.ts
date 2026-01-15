import type { CropperCanvas, CropperImage, CropperSelection } from 'cropperjs'

export type CropperSelectionBoundary = 'canvas' | 'image' | 'none'

export interface Dimensions {
  width?: number;
  height?: number;
}

export interface DisableHandles {
  n?: boolean;
  e?: boolean;
  s?: boolean;
  w?: boolean;
  ne?: boolean;
  nw?: boolean;
  se?: boolean;
  sw?: boolean;
  move?: boolean;
}

export interface ToCanvasOptions {
  width?: number;
  height?: number;
  beforeDraw?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}
export interface ExtendedToCanvasOptions extends ToCanvasOptions {
  fillColor?: string;
  imageSmoothingEnabled?: boolean;
}

export interface Props {
  aspectRatio?: number;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  cropDimensions?: Dimensions;
  cropperHandleAction?: 'select' | 'move' | 'scale' | 'n-resize' | 'e-resize' | 's-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'none';
  cropperSelectionBoundary?: CropperSelectionBoundary;
  cropperSelectionPrecise?: boolean;
  disableHandles?: DisableHandles;
  enableActionButtons?: boolean;
  enableCropperShade?: boolean;
  enableFreeformSelection?: boolean;
  enableToolbar?: boolean;
  enableViewer?: boolean;
  viewer?: string | HTMLElement;
  handleAction?: string;
  fillColor?: string;
  initialCoverage?: number;
  rotateMin?: number;
  rotateMax?: number;
  zoomMin?: number;
  zoomMax?: number;
  src: string;
}

export type TransformTuple = [number, number?, number?, number?, number?, number?]

export type { CropperCanvas, CropperImage, CropperSelection }
