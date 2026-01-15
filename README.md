# Tz-CropperJs

[![npm version](https://img.shields.io/npm/v/@twyzle/tz-cropperjs.svg)](https://www.npmjs.com/package/@twyzle/tz-cropperjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, feature-rich Vue 3 component wrapper for [CropperJS v2](https://github.com/fengyuanchen/cropperjs). Built with TypeScript and designed for flexibility and ease of use.

## Features

- 🎯 **Vue 3 & TypeScript** - Full type safety and modern Vue Composition API
- 🎨 **Highly Customizable** - Control every aspect of the cropper with extensive props
- 🔧 **Flexible Handles** - Enable/disable individual resize handles as needed
- 🖼️ **Built-in Toolbar** - Optional toolbar with zoom, rotate, and move controls
- 📏 **Precise Dimensions** - Set exact output dimensions for cropped images
- 🎭 **Multiple Boundaries** - Constrain selection to canvas, image, or none
- 👁️ **Live Preview** - Optional viewer for real-time crop preview

## Installation

```bash
npm install @twyzle/tz-cropperjs cropperjs
```

## Quick Start

```vue
<template>
  <div>
    <Cropper
      :src="imageSrc"
      :aspect-ratio="16 / 9"
      :crop-dimensions="{ width: 800, height: 450 }"
      @ready="onReady"
      ref="cropperRef"
    />
    <button @click="cropImage">Crop Image</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Cropper } from '@twyzle/tz-cropperjs';
import '@twyzle/tz-cropperjs/dist/twzcropperjs.css';

const cropperRef = ref();
const imageSrc = ref('/path/to/your/image.jpg');

const onReady = ({ image }) => {
  console.log('Cropper is ready', image);
};

const cropImage = async () => {
  if (cropperRef.value) {
    const canvas = await cropperRef.value.getCroppedCanvas();
    const croppedImageDataURL = canvas.toDataURL();
    console.log(croppedImageDataURL);
  }
};
</script>
```

## Props

| Prop                      | Type                               | Default       | Description                                                                                                                                                               |
| ------------------------- | ---------------------------------- |---------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aspectRatio`             | `number`                           | `undefined`   | The aspect ratio of the crop box.                                                                                                                                         |
| `crossOrigin`             | `''` \| `'anonymous'` \| `'use-credentials'` | `'anonymous'` | The `crossOrigin` attribute for the image.                                                                                                                                |
| `cropDimensions`          | `Dimensions`                       | `{}`          | The initial dimensions of the crop box. Also used as default dimensions for `getCroppedCanvas()` if no options are provided.                                              |
| `cropperHandleAction`     | `'select'` \| `'move'` \| `'scale'` \| `'n-resize'` \| `'e-resize'` \| `'s-resize'` \| `'w-resize'` \| `'ne-resize'` \| `'nw-resize'` \| `'se-resize'` \| `'sw-resize'` \| `'none'` | `'move'`      | The action for the main cropper handle outside the selection box. |
| `cropperSelectionBoundary`| `'canvas'` \| `'image'` \| `'none'`   | `'canvas'`    | Defines the boundary for the crop selection. Can be the canvas, the image, or none.                                                                                       |
| `cropperSelectionPrecise` | `boolean`                          | `true`        | When `true`, the crop selection dimensions are rounded to whole numbers for pixel-perfect precision.                                                                       |
| `disableHandles`          | `DisableHandles`                   | `{}`          | Object to selectively disable resize handles. Keys: `n`, `e`, `s`, `w`, `ne`, `nw`, `se`, `sw`, `move`. Example: `{ n: true, e: true }` disables north and east handles. |
| `enableActionButtons`     | `boolean`                          | `true`        | Enables or disables the action buttons (Rotate, Zoom).                                                                                                                    |
| `enableCropperShade`      | `boolean`                          | `true`        | Enables or disables the shade overlay outside the crop selection area.                                                                                                    |
| `enableFreeformSelection` | `boolean`                          | `false`       | Enables or disables freeform selection. If `false`, the aspect ratio is maintained.                                                                                       |
| `enableToolbar`           | `boolean`                          | `false`       | Enables or disables the toolbar with zoom and move controls.                                                                                                              |
| `enableViewer`            | `boolean`                          | `false`       | Enables or disables the viewer that shows a preview of the cropped image.                                                                                                 |
| `fillColor`               | `string`                           | `undefined`   | The color to fill the background of the cropped canvas.                                                                                                                   |
| `handleAction`            | `string`                           | `'move'`      | The action to perform when dragging the handle.                                                                                                                           |
| `initialCoverage`         | `number`                           | `0.5`         | The initial coverage of the crop box on the image (0-1). For example, `0.8` means 80% coverage.                                                                           |
| `rotateMin`               | `number`                           | `-90`         | The minimum rotation angle in degrees.                                                                                                                                    |
| `rotateMax`               | `number`                           | `90`          | The maximum rotation angle in degrees.                                                                                                                                    |
| `src`                     | `string`                           | **Required**  | The source URL of the image to be cropped.                                                                                                                                |
| `viewer`                  | `string` \| `HTMLElement`         | `undefined`   | A CSS selector or an HTML element to be used as the viewer.                                                                                                               |
| `zoomMin`                 | `number`                           | `-1`          | The minimum zoom level.                                                                                                                                                   |
| `zoomMax`                 | `number`                           | `1`           | The maximum zoom level.                                                                                                                                                   |

## Events

| Event   | Payload          | Description                                                  |
| ------- | ---------------- | ------------------------------------------------------------ |
| `ready` | `{ image: HTMLImageElement }` | Emitted when the cropper is ready and the image has loaded |
 | `loadError` | `Error` | Emitted when the image fails to load |
## Exposed Methods

Access these methods via template ref:

```typescript
const cropperRef = ref();

// Get cropped canvas with optional dimensions
const canvas = await cropperRef.value.getCroppedCanvas({ width: 1000, height: 600 });

// Zoom in/out (positive to zoom in, negative to zoom out)
cropperRef.value.zoom(0.1);

// Rotate image (in degrees)
cropperRef.value.rotate(90);
```

### Method Reference

| Method              | Parameters                           | Returns              | Description                                    |
| ------------------- | ------------------------------------ | -------------------- | ---------------------------------------------- |
| `getCroppedCanvas`  | `options?: { width?, height?, fillColor?, imageSmoothingEnabled? }` | `Promise<HTMLCanvasElement \| null>` | Returns the cropped area as a canvas element |
| `zoom`              | `ratio: number`                      | `void`               | Zoom in/out by ratio (0.1 = 10% zoom in)      |
| `rotate`            | `degree: number`                     | `void`               | Rotate the image by specified degrees          |

## Examples

### Basic Usage with Toolbar

```vue
<template>
  <Cropper
    :src="imageSrc"
    :enable-toolbar="true"
    :enable-action-buttons="true"
    :initial-coverage="0.8"
  />
</template>
```

### Disable Specific Handles

```vue
<template>
  <!-- Only allow corner resizing, disable edge handles -->
  <Cropper
    :src="imageSrc"
    :disable-handles="{ n: true, e: true, s: true, w: true }"
  />
</template>
```

### Custom Crop Dimensions

```vue
<template>
  <Cropper
    :src="imageSrc"
    :crop-dimensions="{ width: 1920, height: 1080 }"
    :aspect-ratio="16 / 9"
    fill-color="#000000"
  />
</template>
```

### With Live Preview

```vue
<template>
  <div style="display: flex;">
    <Cropper
      :src="imageSrc"
      :enable-viewer="true"
      style="flex: 1;"
    />
  </div>
</template>
```

### Constrain Selection to Image

```vue
<template>
  <Cropper
    :src="imageSrc"
    cropper-selection-boundary="image"
    :initial-coverage="0.9"
  />
</template>
```

### Getting Cropped Image Data

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Cropper } from '@twyzle/tz-cropperjs';

const cropperRef = ref();

const downloadCroppedImage = async () => {
  const canvas = await cropperRef.value.getCroppedCanvas({
    width: 800,
    height: 600,
    fillColor: '#ffffff'
  });

  // Convert to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cropped-image.png';
    a.click();
    URL.revokeObjectURL(url);
  });
};
</script>

<template>
  <div>
    <Cropper ref="cropperRef" :src="imageSrc" />
    <button @click="downloadCroppedImage">Download</button>
  </div>
</template>
```

## Browser Support

This component supports the same browsers as [CropperJS v2](https://fengyuanchen.github.io/cropperjs/guide.html#browser-support). For the most up-to-date browser compatibility information, please refer to the official CropperJS documentation.

**Minimum Requirements:**
- Modern browsers with ES2015+ support
- Native Web Components support

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/twyzle/tz-cropperjs.git
cd tz-cropperjs

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
tz-cropperjs/
├── src/
│   ├── Cropper.vue       # Main component
│   ├── types.ts          # TypeScript definitions
│   ├── useCropperControls.ts  # Composable for cropper controls
│   └── index.ts          # Package entry point
├── dist/                 # Built files
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

## Acknowledgments

- Built on top of [CropperJS v2](https://github.com/fengyuanchen/cropperjs) by [Chen Fengyuan](https://chenfengyuan.com/)
- Inspired by the Vue.js community
