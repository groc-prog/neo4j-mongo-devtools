import { Neo4jAuthType, Neo4jScheme } from '~/types/instance';

export function useNeo4jConfig() {
  const { t } = useI18n();

  const schemeOptions = ref<Neo4jScheme[]>([Neo4jScheme.BOLT, Neo4jScheme.NEO4J]);
  const authOptions = ref([
    {
      label: t('neo4j.auth.none'),
      value: Neo4jAuthType.NONE,
    },
    {
      label: t('neo4j.auth.basic'),
      value: Neo4jAuthType.BASIC,
    },
    {
      label: t('neo4j.auth.kerberos'),
      value: Neo4jAuthType.KERBEROS,
    },
    {
      label: t('neo4j.auth.bearer'),
      value: Neo4jAuthType.BEARER,
    },
  ]);

  return {
    schemeOptions,
    authOptions,
  };
}
