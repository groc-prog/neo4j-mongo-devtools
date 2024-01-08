<script setup lang="ts">
import {
  Neo4jScheme,
  type MongoAuthConfiguration,
  type Neo4jAuthConfiguration,
  Neo4jAuthType,
  MongoMechanism,
  MongoScheme,
} from '~/types/instance';

const { t } = useI18n();

const configurationFiles = ref<FileList | null>(null);
const neo4jConfiguration = reactive<Partial<Neo4jAuthConfiguration>>({
  url: 'localhost:7687',
  scheme: Neo4jScheme.NEO4J,
  authType: Neo4jAuthType.NONE,
});
const mongoConfiguration = reactive<Partial<MongoAuthConfiguration>>({
  uri: 'localhost:27017',
  scheme: MongoScheme.DEFAULT,
  mechanism: MongoMechanism.NONE,
});
</script>

<template>
  <div class="flex flex-col items-center text-center w-full max-w-5xl">
    <div class="mb-20">
      <h1 class="text-title text-4xl sm:text-5xl font-bold">
        {{ $t('newInstance.title') }}
      </h1>
      <p class="text-description text-lg mt-6">
        {{ $t('newInstance.description') }}
      </p>
    </div>

    <div class="grid text-left w-full grid-cols-1 gap-y-16 md:gap-x-20 md:grid-cols-2">
      <div>
        <h2 class="text-title text-xl font-semibold">{{ $t('newInstance.neo4j.title') }}</h2>
        <p class="text-description mt-1 mb-8">{{ $t('newInstance.neo4j.description') }}</p>
        <Neo4jConfiguration
          v-model:state="neo4jConfiguration"
          @update:state="
            () => {
              console.log('UPDATE STATE', neo4jConfiguration);
            }
          "
        />
      </div>

      <div>
        <h2 class="text-title text-xl font-semibold">{{ $t('newInstance.mongodb.title') }}</h2>
        <p class="text-description mt-1 mb-8">{{ $t('newInstance.mongodb.description') }}</p>
        <MongoConfiguration
          v-model:state="mongoConfiguration"
          @update:state="
            () => {
              console.log('UPDATE STATE', mongoConfiguration);
            }
          "
        />
      </div>
    </div>

    <UDivider
      class="my-10"
      :label="t('newInstance.divider')"
    />

    <InputFile
      v-model:files="configurationFiles"
      class="h-64"
    />

    <div class="mt-6 w-full text-right">
      <UButton
        size="lg"
        trailing-icon="i-carbon-arrow-right"
        :label="t('newInstance.cta.create')"
      />
    </div>
  </div>
</template>
