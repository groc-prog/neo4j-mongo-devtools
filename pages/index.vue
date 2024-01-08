<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center text-center">
    <div class="mb-20">
      <h1 class="text-title text-4xl sm:text-5xl font-bold">
        {{ $t('gettingStarted.title') }}
      </h1>
      <p class="text-description sm:text-lg mt-6">
        {{ $t('gettingStarted.description.beginning') }}
        <span class="highlighted">
          {{ $t('gettingStarted.description.highlightedFeatures') }}
        </span>
        {{ $t('gettingStarted.description.middle') }}
        <span class="highlighted">
          {{ $t('gettingStarted.description.highlightedDx') }}
        </span>
      </p>
    </div>

    <div class="max-w-md">
      <h2 class="text-title text-xl font-semibold">{{ $t('gettingStarted.new.title') }}</h2>
      <p class="text-description mt-1 mb-8">{{ $t('gettingStarted.new.description') }}</p>
      <UButton
        size="lg"
        icon="i-carbon-cloud-satellite"
        to="/instances/new"
        :label="t('gettingStarted.new.cta')"
      />
    </div>
  </div>
</template>
