<script setup lang="ts">
import type { MongoDBAuthConfiguration, MongoDBDefaultAuth } from '~/types/instance';

const props = defineProps<{
  state: Partial<MongoDBAuthConfiguration>;
}>();
const emit = defineEmits<{
  (e: 'update:state', state: Partial<MongoDBAuthConfiguration>): void;
}>();

const { mechanismOptions } = useMongoDBConfig();

const state = reactive<Partial<MongoDBAuthConfiguration>>({
  ...props.state,
});

const getAuthTypeLabel = computed(
  () => mechanismOptions.value.find((option) => option.value === state.mechanism)?.label,
);

watch(
  () => state.mechanism,
  (newAuthType) => {
    switch (newAuthType) {
      case 'default':
        state.parameters = {
          username: '',
          password: '',
        };
        break;
      default:
        break;
    }
  },
  { immediate: true },
);
</script>

<template>
  <UForm
    :state="state"
    class="space-y-4"
  >
    <UFormGroup
      :label="$t('mongodbConfiguration.label.connection')"
      :ui="{
        container: 'flex flex-row items-center gap-x-2 w-full',
      }"
    >
      <UInput
        v-model="state.uri"
        type="text"
        size="md"
        :placeholder="$t('mongodbConfiguration.placeholder.uri')"
        :ui="{
          wrapper: 'w-full',
        }"
        @update:model-value="emit('update:state', state)"
      />
    </UFormGroup>

    <UFormGroup
      :label="$t('mongodbConfiguration.label.mechanism')"
      :ui="{
        container: 'flex flex-row items-center gap-x-2 w-full',
      }"
    >
      <USelectMenu
        v-model="state.mechanism"
        size="md"
        value-attribute="value"
        :options="mechanismOptions"
        :ui="{
          wrapper: 'w-full',
        }"
        @update:model-value="emit('update:state', state)"
      >
        <template #label>
          {{ getAuthTypeLabel }}
        </template>
      </USelectMenu>
    </UFormGroup>

    <!-- Default mechanism -->
    <div
      v-if="state.mechanism === 'default'"
      class="space-y-4"
    >
      <UFormGroup :label="$t('mongodbConfiguration.label.username')">
        <UInput
          v-model="(state.parameters as MongoDBDefaultAuth).username"
          type="text"
          size="md"
          :placeholder="$t('mongodbConfiguration.placeholder.username')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emit('update:state', state)"
        />
      </UFormGroup>

      <UFormGroup :label="$t('mongodbConfiguration.label.password')">
        <UInput
          v-model="(state.parameters as MongoDBDefaultAuth).password"
          type="password"
          size="md"
          :placeholder="$t('mongodbConfiguration.placeholder.password')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emit('update:state', state)"
        />
      </UFormGroup>
    </div>
  </UForm>
</template>
