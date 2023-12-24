import type { Neo4jAuthConfiguration } from '~/types/instance';

export function useNeo4jConfig() {
  const { t } = useI18n();

  const schemeOptions = ref<Neo4jAuthConfiguration['scheme'][]>(['neo4j://', 'bolt://']);
  const authOptions = ref([
    {
      label: t('neo4j.auth.none'),
      value: 'none',
    },
    {
      label: t('neo4j.auth.basic'),
      value: 'basic',
    },
    {
      label: t('neo4j.auth.kerberos'),
      value: 'kerberos',
    },
    {
      label: t('neo4j.auth.bearer'),
      value: 'bearer',
    },
  ]);

  return {
    schemeOptions,
    authOptions,
  };
}
