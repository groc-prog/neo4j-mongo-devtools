import { MongoScheme, MongoMechanism } from '~/types/instance';

export function useMongoConfig() {
  const { t } = useI18n();

  const schemeOptions = ref<MongoScheme[]>([MongoScheme.DEFAULT, MongoScheme.ATLAS, MongoScheme.UNIX]);
  const mechanismOptions = ref([
    {
      label: t('mongodb.auth.none'),
      value: MongoMechanism.NONE,
    },
    {
      label: t('mongodb.auth.scram'),
      value: MongoMechanism.SCRAM,
    },
  ]);

  return {
    mechanismOptions,
    schemeOptions,
  };
}
