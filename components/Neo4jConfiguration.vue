<script setup lang="ts">
import type { Neo4jAuthConfiguration, Neo4jBasicAuth, Neo4jKerberosAuth, Neo4jBearerAuth } from '~/types/instance';

const props = defineProps<{
  state: Partial<Neo4jAuthConfiguration>;
}>();
const emit = defineEmits<{
  (e: 'update:state', state: Partial<Neo4jAuthConfiguration>): void;
}>();

const { schemeOptions, authOptions } = useNeo4jConfig();

const state = reactive<Partial<Neo4jAuthConfiguration>>({
  ...props.state,
});

const getAuthTypeLabel = computed(() => authOptions.value.find((option) => option.value === state.type)?.label);

watch(
  () => state.type,
  (newAuthType) => {
    switch (newAuthType) {
      case 'none':
        state.parameters = undefined;
        break;
      case 'basic':
        state.parameters = {
          username: '',
          password: '',
        };
        break;
      case 'kerberos':
        state.parameters = {
          base64EncodedTicket: '',
        };
        break;
      case 'bearer':
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
</script>

<template>
  <UForm
    :state="state"
    class="space-y-4"
  >
    <UFormGroup
      :label="$t('neo4jConfiguration.label.connection')"
      :ui="{
        container: 'flex flex-row items-center gap-x-2 w-full',
      }"
    >
      <USelectMenu
        v-model="state.scheme"
        size="md"
        :options="schemeOptions"
        :ui="{
          base: 'min-w-[7rem]',
        }"
        @update:model-value="emit('update:state', state)"
      />
      <UInput
        v-model="state.url"
        type="text"
        size="md"
        :placeholder="$t('neo4jConfiguration.placeholder.host')"
        :ui="{
          wrapper: 'w-full',
        }"
        @update:model-value="emit('update:state', state)"
      />
    </UFormGroup>

    <UFormGroup
      :label="$t('neo4jConfiguration.label.type')"
      :ui="{
        container: 'flex flex-row items-center gap-x-2 w-full',
      }"
    >
      <USelectMenu
        v-model="state.type"
        size="md"
        value-attribute="value"
        :options="authOptions"
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

    <!-- Basic authentication -->
    <div
      v-if="state.type === 'basic'"
      class="space-y-4"
    >
      <UFormGroup :label="$t('neo4jConfiguration.label.username')">
        <UInput
          v-model="(state.parameters as Neo4jBasicAuth).username"
          type="text"
          size="md"
          :placeholder="$t('neo4jConfiguration.placeholder.username')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emit('update:state', state)"
        />
      </UFormGroup>

      <UFormGroup :label="$t('neo4jConfiguration.label.password')">
        <UInput
          v-model="(state.parameters as Neo4jBasicAuth).password"
          type="password"
          size="md"
          :placeholder="$t('neo4jConfiguration.placeholder.password')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emit('update:state', state)"
        />
      </UFormGroup>
    </div>

    <!-- Kerberos authentication -->
    <div
      v-if="state.type === 'kerberos'"
      class="space-y-4"
    >
      <UFormGroup :label="$t('neo4jConfiguration.label.base64EncodedTicket')">
        <UInput
          v-model="(state.parameters as Neo4jKerberosAuth).base64EncodedTicket"
          type="text"
          size="md"
          :placeholder="$t('neo4jConfiguration.placeholder.base64EncodedTicket')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emit('update:state', state)"
        />
      </UFormGroup>
    </div>

    <!-- Bearer authentication -->
    <div
      v-if="state.type === 'bearer'"
      class="space-y-4"
    >
      <UFormGroup :label="$t('neo4jConfiguration.label.base64EncodedToken')">
        <UInput
          v-model="(state.parameters as Neo4jBearerAuth).base64EncodedToken"
          type="text"
          size="md"
          :placeholder="$t('neo4jConfiguration.placeholder.base64EncodedToken')"
          :ui="{
            wrapper: 'w-full',
          }"
          @update:model-value="emit('update:state', state)"
        />
      </UFormGroup>
    </div>
  </UForm>
</template>
