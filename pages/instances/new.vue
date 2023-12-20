<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center text-center max-w-5xl">
    <div class="mb-20">
      <h1 class="text-title text-3xl sm:text-5xl font-bold">
        {{ $t('newInstance.title') }}
      </h1>
      <p class="text-description text-lg mt-6">
        {{ $t('newInstance.description') }}
      </p>
    </div>

    <UDivider
      class="my-10"
      :label="t('newInstance.divider')"
    />

    <p></p>
    <InputFile class="h-64"> Upload file here </InputFile>
  </div>
</template>
