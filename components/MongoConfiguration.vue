<script setup lang="ts">
import type { UForm } from '#build/components';
import _ from 'lodash';
import { z } from 'zod';

import { type MongoAuthConfiguration, type MongoSCRAMAuth, MongoMechanism, MongoScheme } from '~/types/instance';

const props = defineProps<{
  state: Partial<MongoAuthConfiguration>;
}>();
const emit = defineEmits<{
  (e: 'update:state', state: Partial<MongoAuthConfiguration>): void;
}>();

const { t } = useI18n();
const { mechanismOptions, schemeOptions } = useMongoConfig();

const schema = z.object({
  uri: z.string().min(1, t('mongoConfiguration.validation.uri')),
  scheme: z.nativeEnum(MongoScheme),
  mechanism: z.nativeEnum(MongoMechanism),
  parameters: z.union([
    z.undefined(),
    z.object({
      username: z.string().min(1, t('mongoConfiguration.validation.username')),
      password: z.string().min(1, t('mongoConfiguration.validation.password')),
    }),
  ]),
});

const form = ref<typeof UForm | null>(null);
const state = reactive<Partial<MongoAuthConfiguration>>({
  ...props.state,
});

const getAuthTypeLabel = computed(
  () => mechanismOptions.value.find((option) => option.value === state.mechanism)?.label,
);

watch(
  () => state.mechanism,
  (newAuthType) => {
    switch (newAuthType) {
      case MongoMechanism.SCRAM:
        state.parameters = {
          username: '',
          password: '',
        };
        break;
      default:
        state.parameters = undefined;
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
      required
      :label="$t('mongoConfiguration.label.connection')"
      :ui="{
        container: 'flex flex-row gap-x-2 w-full',
      }"
    >
      <UFormGroup name="scheme">
        <USelectMenu
          v-model="state.scheme"
          size="md"
          :options="schemeOptions"
          :ui="{
            base: 'min-w-[10.5rem]',
          }"
          @update:model-value="emitState()"
        />
      </UFormGroup>

      <UFormGroup
        name="uri"
        :ui="{
          wrapper: 'w-full',
        }"
      >
        <template #default="{ error }">
          <UInput
            v-model="state.uri"
            type="text"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('mongoConfiguration.placeholder.uri')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>
    </UFormGroup>

    <UFormGroup
      name="mechanism"
      :label="$t('mongoConfiguration.label.mechanism')"
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
      v-if="state.mechanism === MongoMechanism.SCRAM"
      class="space-y-4"
    >
      <UFormGroup
        name="parameters.username"
        :label="$t('mongoConfiguration.label.username')"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as MongoSCRAMAuth).username"
            type="text"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('mongoConfiguration.placeholder.username')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>

      <UFormGroup
        name="parameters.password"
        :label="$t('mongoConfiguration.label.password')"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as MongoSCRAMAuth).password"
            type="password"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('mongoConfiguration.placeholder.password')"
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
