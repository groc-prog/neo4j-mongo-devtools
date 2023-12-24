export function useMongoDBConfig() {
  const { t } = useI18n();

  const mechanismOptions = ref([
    {
      label: t('mongodb.auth.default'),
      value: 'default',
    },
  ]);

  return {
    mechanismOptions,
  };
}
