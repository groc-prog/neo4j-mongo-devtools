<script setup lang="ts">
import type { UForm } from '#build/components';
import _ from 'lodash';
import { z } from 'zod';

import type { MongoDBAuthConfiguration, MongoDBDefaultAuth, MongoDBMechanism } from '~/types/instance';

const props = defineProps<{
  state: Partial<MongoDBAuthConfiguration>;
}>();
const emit = defineEmits<{
  (e: 'update:state', state: Partial<MongoDBAuthConfiguration>): void;
}>();

const { t } = useI18n();
const { mechanismOptions } = useMongoDBConfig();

const schema = z.object({
  uri: z.string().min(1, t('mongodbConfiguration.validation.uri')),
  mechanism: z
    .string()
    .refine((value) => mechanismOptions.value.map(({ value }) => value).includes(value as MongoDBMechanism)),
  parameters: z.object({
    username: z.string().min(1, t('mongodbConfiguration.validation.username')),
    password: z.string().min(1, t('mongodbConfiguration.validation.password')),
  }),
});

const form = ref<typeof UForm | null>(null);
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

const emitState = _.debounce(() => {
  if (form.value === null) return;

  form.value
    .validate()
    .then(() => {
      emit('update:state', state);
    })
    .catch(() => {});
}, 250);

defineExpose({
  form,
});
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-4"
  >
    <UFormGroup
      eager-validation
      name="uri"
      :label="$t('mongodbConfiguration.label.connection')"
    >
      <template #default="{ error }">
        <UInput
          v-model="state.uri"
          type="text"
          size="md"
          :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
          :placeholder="$t('mongodbConfiguration.placeholder.uri')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emitState()"
        />
      </template>
    </UFormGroup>

    <UFormGroup
      name="mechanism"
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
        @update:model-value="emitState()"
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
      <UFormGroup
        eager-validation
        name="parameters.username"
        :label="$t('mongodbConfiguration.label.username')"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as MongoDBDefaultAuth).username"
            type="text"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('mongodbConfiguration.placeholder.username')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>

      <UFormGroup
        eager-validation
        name="parameters.password"
        :label="$t('mongodbConfiguration.label.password')"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as MongoDBDefaultAuth).password"
            type="password"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('mongodbConfiguration.placeholder.password')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>
    </div>
  </UForm>
</template>
