import { MongoClient } from 'mongodb';
import { auth } from 'neo4j-driver';

type Neo4jAuthType = Exclude<keyof typeof auth, 'custom'> | 'none';

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
  neo4j: Neo4jAuthConfiguration;
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

/**
 * The configuration for the Neo4j database connections.
 */
export interface Neo4jAuthConfiguration {
  /**
   * The URL of the Neo4j database.
   */
  url: string;
  /**
   * The URL scheme to use for the connection.
   */
  scheme: 'neo4j://' | 'bolt://';
  /**
   * The authentication method to use for the connection.
   */
  type: Neo4jAuthType;
  /**
   * The authentication parameters to use for the connection.
   */
  parameters: Neo4jBasicAuth | Neo4jKerberosAuth | Neo4jBearerAuth;
}

export interface Neo4jBasicAuth {
  username: string;
  password: string;
}

export interface Neo4jKerberosAuth {
  base64EncodedTicket: string;
}

export interface Neo4jBearerAuth {
  base64EncodedToken: string;
}

/**
 * The configuration for the MongoDB database connections.
 */
export interface MongoDBAuthConfiguration {
  /**
   * The URL of the MongoDB database.
   */
  uri: string;
  /**
   * The authentication mechanism to use.
   */
  mechanism: 'default';
  parameters: MongoDBDefaultAuth;
}

export interface MongoDBDefaultAuth {
  username: string;
  password: string;
}
