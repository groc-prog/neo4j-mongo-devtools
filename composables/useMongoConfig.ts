import { MongoScheme } from '~/types/instance';

export function useMongoConfig() {
  const { t } = useI18n();

  const schemeOptions = ref<MongoScheme[]>([MongoScheme.DEFAULT]);
  const mechanismOptions = ref([
    {
      label: t('mongodb.auth.default'),
      value: 'default',
    },
  ]);

  return {
    mechanismOptions,
    schemeOptions,
  };
}
