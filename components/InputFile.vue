<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);

function onDrop(e: DragEvent) {
  isDragOver.value = false;
  if (fileInput.value === null) return;

  const files = e.dataTransfer?.items;
  console.log(files);
}

function onDragOver() {
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}
</script>

<template>
  <div class="flex items-center justify-center w-full">
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full h-full relative"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div
        class="flex flex-col items-center justify-center w-full h-full rounded-lg ring-1 ring-gray-200 dark:ring-gray-800 transition-colors"
        :class="{
          'bg-gray-100/60 dark:bg-gray-800/70': isDragOver,
          'bg-white dark:bg-gray-900': !isDragOver,
        }"
      >
        <div class="flex flex-col items-center justify-center">
          <slot />
        </div>
      </div>

      <svg
        class="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-white/10"
        fill="none"
      >
        <defs>
          <pattern
            id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
          width="100%"
          height="100%"
        ></rect>
      </svg>

      <input
        id="dropzone-file"
        ref="fileInput"
        type="file"
        class="hidden"
      />
    </label>
  </div>
</template>
