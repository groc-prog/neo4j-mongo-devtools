<template>
  <UContainer
    :ui="{
      base: 'h-screen overflow-y-auto',
      constrained: 'max-w-none',
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UContainer>

  <UNotifications />
</template>
