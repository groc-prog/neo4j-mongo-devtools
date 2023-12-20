/**
 * The type of graph entity to use for the relation.
 */
export enum GraphEntity {
  NODE = 'node',
  RELATIONSHIP = 'relationship',
}

/**
 * The configuration for a relation between MongoDB and Neo4j.
 */
export interface DataRelation {
  mongodb: {
    database: string;
    collection: string;
    field: string;
  };
  neo4j: {
    graphEntity: GraphEntity;
    labels?: string[];
    type?: string;
    property: string;
  };
}

/**
 * A application instance configuration.
 */
export interface InstanceConfiguration {
  /**
   * The unique identifier of the instance. Will be the documents `_id` field in MongoDB
   * if `saveToMongo` is set to `true`.
   */
  id: string;
  /**
   * The name of the instance.
   */
  name: string;
  /**
   * Customization options for the instance. This only affects the UI.
   */
  customization: {
    color: string;
    icon?: string;
  };
  /**
   * The configuration for the Neo4j database connections.
   */
  neo4j: {
    url: string;
    username: string;
    password: string;
  };
  /**
   * The configuration for the MongoDB database connections.
   */
  mongodb: {
    url: string;
    username: string;
    password: string;
  };
  /**
   * The configuration for the relations between MongoDB and Neo4j.
   * These configuration settings allow for automatic fetching of the related
   * MongoDB documents when querying Neo4j.
   */
  relations: DataRelation[];
}
