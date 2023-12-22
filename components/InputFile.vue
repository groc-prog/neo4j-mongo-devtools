<script setup lang="ts">
const props = defineProps<{
  files: FileList | null;
}>();

const emit = defineEmits<{
  (e: 'update:files', files: FileList | null): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);

function onDrop(e: DragEvent) {
  isDragOver.value = false;
  if (fileInput.value === null) return;

  fileInput.value.files = e.dataTransfer?.files || null;
  emit('update:files', fileInput.value.files);
}

function onFileChange(e: Event) {
  if (fileInput.value === null) return;

  fileInput.value.files = (e.target as HTMLInputElement).files || null;
  emit('update:files', fileInput.value.files);
}

function onDragOver() {
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}

onMounted(() => {
  if (fileInput.value === null) return;

  fileInput.value.files = unref(props.files);
});
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
        <div
          v-if="fileInput?.files == undefined || fileInput.files.length === 0"
          class="flex flex-col items-center gap-y-2 justify-center text-description"
        >
          <UIcon
            name="i-carbon-upload"
            class="w-8 h-8"
          />
          <p>{{ $t('inputFile.dropzoneEmpty') }}</p>
        </div>
        <div
          v-else
          class="flex flex-col items-center gap-y-2 justify-center"
        >
          <div class="flex p-3 rounded-full bg-green-100 dark:bg-green-950">
            <UIcon
              name="i-carbon-checkmark-outline"
              class="w-8 h-8 text-green-500"
            />
          </div>
          <p class="text-description">{{ $t('inputFile.dropzoneFiles', { count: fileInput?.files?.length }) }}</p>
        </div>
      </div>

      <svg
        class="absolute inset-0 h-full w-full stroke-gray-900/5 dark:stroke-white/5"
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
        multiple
        accept="application/json"
        @change="onFileChange"
      />
    </label>
  </div>
</template>
