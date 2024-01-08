<script setup lang="ts">
import type { UForm } from '#build/components';
import _ from 'lodash';
import { z } from 'zod';

import {
  type Neo4jAuthConfiguration,
  type Neo4jBasicAuth,
  type Neo4jKerberosAuth,
  type Neo4jBearerAuth,
  Neo4jScheme,
  Neo4jAuthType,
} from '~/types/instance';

const props = defineProps<{
  state: Partial<Neo4jAuthConfiguration>;
}>();
const emit = defineEmits<{
  (e: 'update:state', state: Partial<Neo4jAuthConfiguration>): void;
}>();

const { t } = useI18n();
const { schemeOptions, authOptions } = useNeo4jConfig();

const schema = z.object({
  url: z.string().min(1, t('neo4jConfiguration.validation.host')),
  scheme: z.nativeEnum(Neo4jScheme),
  authType: z.nativeEnum(Neo4jAuthType),
  parameters: z.union([
    z.undefined(),
    z.object({
      username: z.string().min(1, t('neo4jConfiguration.validation.username')),
      password: z.string().min(1, t('neo4jConfiguration.validation.password')),
    }),
    z.object({
      base64EncodedTicket: z.string().min(1, t('neo4jConfiguration.validation.base64EncodedTicket')),
    }),
    z.object({
      base64EncodedToken: z.string().min(1, t('neo4jConfiguration.validation.base64EncodedToken')),
    }),
  ]),
});

const form = ref<typeof UForm | null>(null);
const state = reactive<Partial<Neo4jAuthConfiguration>>({
  ...props.state,
});

const getAuthTypeLabel = computed(() => authOptions.value.find((option) => option.value === state.authType)?.label);

watch(
  () => state.authType,
  (newAuthType) => {
    switch (newAuthType) {
      case Neo4jAuthType.NONE:
        state.parameters = undefined;
        break;
      case Neo4jAuthType.BASIC:
        state.parameters = {
          username: '',
          password: '',
        };
        break;
      case Neo4jAuthType.KERBEROS:
        state.parameters = {
          base64EncodedTicket: '',
        };
        break;
      case Neo4jAuthType.BEARER:
        state.parameters = {
          base64EncodedToken: '',
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
      required
      :label="$t('neo4jConfiguration.label.connection')"
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
            base: 'min-w-[7rem]',
          }"
          @update:model-value="emitState()"
        />
      </UFormGroup>

      <UFormGroup
        name="url"
        :ui="{
          wrapper: 'w-full',
        }"
      >
        <template #default="{ error }">
          <UInput
            v-model="state.url"
            type="text"
            size="md"
            :placeholder="$t('neo4jConfiguration.placeholder.host')"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
        /></template>
      </UFormGroup>
    </UFormGroup>

    <UFormGroup
      name="type"
      :label="$t('neo4jConfiguration.label.type')"
      :ui="{
        container: 'flex flex-row items-center gap-x-2 w-full',
      }"
    >
      <USelectMenu
        v-model="state.authType"
        size="md"
        value-attribute="value"
        :options="authOptions"
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

    <!-- Basic authentication -->
    <div
      v-if="state.authType === Neo4jAuthType.BASIC"
      class="space-y-4"
    >
      <UFormGroup
        :label="$t('neo4jConfiguration.label.username')"
        name="parameters.username"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as Neo4jBasicAuth).username"
            type="text"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('neo4jConfiguration.placeholder.username')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>

      <UFormGroup
        :label="$t('neo4jConfiguration.label.password')"
        name="parameters.password"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as Neo4jBasicAuth).password"
            type="password"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('neo4jConfiguration.placeholder.password')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>
    </div>

    <!-- Kerberos authentication -->
    <div
      v-if="state.authType === Neo4jAuthType.KERBEROS"
      class="space-y-4"
    >
      <UFormGroup
        :label="$t('neo4jConfiguration.label.base64EncodedTicket')"
        name="parameters.base64EncodedTicket"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as Neo4jKerberosAuth).base64EncodedTicket"
            type="text"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('neo4jConfiguration.placeholder.base64EncodedTicket')"
            :ui="{
              wrapper: 'w-full',
            }"
            @update:model-value="emitState()"
          />
        </template>
      </UFormGroup>
    </div>

    <!-- Bearer authentication -->
    <div
      v-if="state.authType === Neo4jAuthType.BEARER"
      class="space-y-4"
    >
      <UFormGroup
        :label="$t('neo4jConfiguration.label.base64EncodedToken')"
        name="parameters.base64EncodedToken"
      >
        <template #default="{ error }">
          <UInput
            v-model="(state.parameters as Neo4jBearerAuth).base64EncodedToken"
            type="text"
            size="md"
            :trailing-icon="error ? 'i-carbon-warning-alt-filled' : undefined"
            :placeholder="$t('neo4jConfiguration.placeholder.base64EncodedToken')"
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
