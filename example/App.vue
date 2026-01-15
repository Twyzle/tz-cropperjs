<template>
  <div id="app-container">
    <header class="app-header">
      <h1>Tz-CropperJS</h1>
      <button
        class="theme-toggle"
        title="Toggle Theme"
        @click="toggleTheme"
      >
        <span v-if="isDarkMode">
          <svg
            id="sun"
            height="24px"
            version="1.1"
            viewBox="0 0 512 512"
            width="24px"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g>
              <g>
                <path
                  d="M256,144c-61.75,0-112,50.25-112,112s50.25,112,112,112s112-50.25,112-112S317.75,144,256,144z M256,336    c-44.188,0-80-35.812-80-80c0-44.188,35.812-80,80-80c44.188,0,80,35.812,80,80C336,300.188,300.188,336,256,336z M256,112    c8.833,0,16-7.167,16-16V64c0-8.833-7.167-16-16-16s-16,7.167-16,16v32C240,104.833,247.167,112,256,112z M256,400    c-8.833,0-16,7.167-16,16v32c0,8.833,7.167,16,16,16s16-7.167,16-16v-32C272,407.167,264.833,400,256,400z M380.438,154.167    l22.625-22.625c6.25-6.25,6.25-16.375,0-22.625s-16.375-6.25-22.625,0l-22.625,22.625c-6.25,6.25-6.25,16.375,0,22.625    S374.188,160.417,380.438,154.167z M131.562,357.834l-22.625,22.625c-6.25,6.249-6.25,16.374,0,22.624s16.375,6.25,22.625,0    l22.625-22.624c6.25-6.271,6.25-16.376,0-22.625C147.938,351.583,137.812,351.562,131.562,357.834z M112,256    c0-8.833-7.167-16-16-16H64c-8.833,0-16,7.167-16,16s7.167,16,16,16h32C104.833,272,112,264.833,112,256z M448,240h-32    c-8.833,0-16,7.167-16,16s7.167,16,16,16h32c8.833,0,16-7.167,16-16S456.833,240,448,240z M131.541,154.167    c6.251,6.25,16.376,6.25,22.625,0c6.251-6.25,6.251-16.375,0-22.625l-22.625-22.625c-6.25-6.25-16.374-6.25-22.625,0    c-6.25,6.25-6.25,16.375,0,22.625L131.541,154.167z M380.459,357.812c-6.271-6.25-16.376-6.25-22.625,0    c-6.251,6.25-6.271,16.375,0,22.625l22.625,22.625c6.249,6.25,16.374,6.25,22.624,0s6.25-16.375,0-22.625L380.459,357.812z"
                  fill="#1D1D1B"
                />
              </g>
            </g>
          </svg>
        </span>
        <span v-else>
          <svg
            id="moon"
            height="24px"
            width="24px"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              fill="none"
              height="24"
              width="24"
            />
            <path
              d="M216.7,152.6A91.9,91.9,0,0,1,103.4,39.3h0A92,92,0,1,0,216.7,152.6Z"
              fill="none"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
          </svg>
        </span>
      </button>
    </header>

    <main class="main-content">
      <!-- Left Column: Cropper -->
      <div class="cropper-column">
        <div class="cropper-wrapper">
          <Cropper
            ref="cropperRef"
            :src="imageSrc"
            :enable-viewer="true"
            :enable-toolbar="enableToolbar"
            style="width: 100%; height: 100%;"
            @ready="onCropperReady"
            @load-error="handleLoadError"
          />
        </div>
      </div>

      <!-- Right Column: Controls & Preview -->
      <div class="sidebar-column">
        <!-- Preview Card -->
        <div class="sidebar-card">
          <h3>Cropped result</h3>
          <div class="preview-wrapper">
            <img
              v-if="croppedImage"
              :src="croppedImage"
              crossorigin="anonymous"
              alt="Cropped Image"
              class="preview-image"
            >
            <div
              v-else
              class="preview-placeholder"
            >
              <p>Preview will appear here</p>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="sidebar-card">
          <h3>Actions</h3>
          <div class="actions-grid">
            <button
              class="btn btn-primary"
              @click="getCropResult"
            >
              Get Cropped Image
            </button>
            <button
              class="btn"
              @click="changeImage"
            >
              Random Image
            </button>
            <label class="btn">
              Upload Image
              <input
                type="file"
                class="sr-only"
                accept="image/*"
                @change="onFileChange"
              >
            </label>
            <button
              class="btn"
              @click="toggleToolbar"
            >
              Toggle Toolbar
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import Cropper from '../src/Cropper.vue'

// --- Refs ---
const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)
const imageSrc = ref(`https://picsum.photos/1600/900?random=${Date.now()}`)
const croppedImage = ref<string | null>(null)
const attempts = ref(0)
const isDarkMode = ref(false)
const enableToolbar = ref(true)

// --- Theme Management ---
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

watchEffect(() => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
})

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
}

function toggleToolbar() {
  enableToolbar.value = !enableToolbar.value
}

// --- Methods ---

async function changeImage() {
  attempts.value = 0
  croppedImage.value = null // Clear previous preview
  try {
    const response = await fetch(`https://picsum.photos/1600/900?random=${Date.now()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch image from picsum.photos`)
    }
    const blob = await response.blob()
    imageSrc.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('Failed to load image:', error)
    handleLoadError()
  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imageSrc.value = reader.result as string
      croppedImage.value = null // Clear previous preview
    }
    reader.readAsDataURL(file)
  }
}

async function getCropResult() {
  if (!cropperRef.value) return
  const canvas = await cropperRef.value.getCroppedCanvas()
  if (!canvas) return

  croppedImage.value = canvas.toDataURL() // Update result
}

function handleLoadError() {
  if (attempts.value < 3) {
    const timeout = Math.pow(2, attempts.value) * 1000
    attempts.value++
    setTimeout(() => {
      changeImage()
    }, timeout)
  } else {
    alert('Failed to load a new random image after 3 attempts. Please try uploading an image.')
  }
}

const onCropperReady = () => {
  console.log('Cropper is ready!')
}

</script>

<style>
/* --- Global Styles & Theming --- */
* {
  box-sizing: border-box;
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
body {
  /* Light Mode Variables */
  --primary-color: #3490dc;
  --primary-hover: #2779bd;
  --text-dark: #2d3748;
  --text-light: #718096;
  --bg-main: #f7fafc;
  --bg-card: #ffffff;
  --border-color: #e2e8f0;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  background-color: var(--bg-main);
  color: var(--text-dark);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

body.dark-mode {
  /* Dark Mode Variable Overrides */
  --primary-color: #4299e1;
  --primary-hover: #3182ce;
  --text-dark: #e2e8f0;
  --fill-dark: #e2e8f0;
  --text-light: #a0aec0;
  --fill-light: #a0aec0;
  --bg-main: #1a202c;
  --bg-card: #2d3748;
  --border-color: #4a5568;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

svg#sun path{
  fill: var(--text-dark);
}

svg#moon path{
  stroke: var(--text-dark);
}

#app-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* --- Header & Theme Toggle --- */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  position: relative;
  border-bottom: 1px solid var(--border-color);
}

.app-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.app-header p {
  font-size: 1.125rem;
  color: var(--text-light);
  margin-top: 0.5rem;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 4px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--border-color);
}

.theme-toggle span {
  display: inline-flex;
}

.theme-toggle:hover {
  color: var(--text-dark);
  background-color: rgba(0, 0, 0, 0.05);
}

body.dark-mode .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* --- Main Layout --- */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-content {
    flex-direction: row;
  }
}

.cropper-column {
  flex: 2;
  min-width: 0;
}

.sidebar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* --- Cropper Wrapper --- */
.cropper-wrapper {
  height: 600px;
  width: 100%;
  background: var(--bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  padding: 1.5rem;
}

/* --- Sidebar Cards --- */
.sidebar-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.sidebar-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
  transition: border-color 0.3s ease;
}

/* --- Preview --- */
.preview-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--bg-main);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px dashed var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.preview-placeholder p {
  color: var(--text-light);
  font-size: 0.875rem;
}

/* --- Actions --- */
.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid .btn-primary {
    grid-column: 1 / -1; /* Span full width */
  }
}

@media (min-width: 1024px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}


/* --- Buttons --- */
.btn {
  display: inline-block;
  text-align: center;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
}

.btn:hover {
  border-color: #cbd5e0;
  opacity: 0.9;
}

body.dark-mode .btn:hover {
  border-color: var(--text-light);
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
  opacity: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* --- Modal --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-light);
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: var(--text-dark);
}
</style>
