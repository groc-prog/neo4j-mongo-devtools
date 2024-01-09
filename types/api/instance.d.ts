/**
 * The configuration for a new instance.
 */
export interface InstanceAuthConfiguration {
  neo4j: Neo4jAuthConfiguration;
  mongo: MongoAuthConfiguration;
}

/**
 * The status of the database connections.
 */
export interface ConnectionStatus {
  mongodbConnectionSuccessful: boolean;
  neo4jConnectionSuccessful: boolean;
}
