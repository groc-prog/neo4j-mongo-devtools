import { MongoClient } from 'mongodb';
import { AuthToken, driver, auth } from 'neo4j-driver';
import z from 'zod';

import {
  MongoAuthConfiguration,
  MongoMechanism,
  MongoScheme,
  Neo4jAuthConfiguration,
  Neo4jAuthType,
  Neo4jBasicAuth,
  Neo4jBearerAuth,
  Neo4jKerberosAuth,
  Neo4jScheme,
} from '~/types/instance';

interface EventNodeRequest {
  neo4j: Neo4jAuthConfiguration;
  mongo: MongoAuthConfiguration;
}

const logger = useLogger();
const schema = z.object({
  neo4j: z.object({
    url: z.string(),
    scheme: z.nativeEnum(Neo4jScheme),
    authType: z.nativeEnum(Neo4jAuthType),
    parameters: z.union([
      z.object({
        username: z.string(),
        password: z.string(),
      }),
      z.object({
        base64EncodedToken: z.string(),
      }),
      z.object({
        base64EncodedTicket: z.string(),
      }),
    ]),
  }),
  mongo: z.object({
    uri: z.string(),
    scheme: z.nativeEnum(MongoScheme),
    mechanism: z.nativeEnum(MongoMechanism),
    parameters: z.object({
      username: z.string(),
      password: z.string(),
    }),
  }),
});

/**
 * Checks whether the MongoDB database can be reached with the provided credentials.
 *
 * @param {MongoAuthConfiguration} config - The options passed to the client.
 * @returns {Promise<boolean>} True if the connection was successful or false if not.
 */
async function checkMongoConnection({ uri, scheme, mechanism, parameters }: MongoAuthConfiguration): Promise<boolean> {
  logger.info('Checking MongoDB connection', { uri, scheme, mechanism, parameters });
  let connectionUri: string;

  switch (mechanism) {
    default:
      logger.debug('Using default MongoDB mechanism');
      connectionUri = `${scheme}${parameters.username}:${parameters.password}@${uri}`;
      break;
  }

  const client = new MongoClient(connectionUri);

  try {
    logger.debug('Attempting to connect to MongoDB', { uri: connectionUri });
    await client.connect();
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  } finally {
    logger.debug('Closing MongoDB connection');
    await client.close();
  }
}

/**
 * Checks whether the Neo4j database can be reached with the provided credentials.
 *
 * @param {Neo4jAuthConfiguration} config - The options passed to the client.
 * @returns {Promise<boolean>} True if the connection was successful or false if not.
 */
async function checkNeo4jConnection({ url, scheme, authType, parameters }: Neo4jAuthConfiguration): Promise<boolean> {
  logger.info('Checking Neo4j connection', { url, scheme, authType, parameters });
  const clientUrl = `${scheme}${url}`;
  let clientAuth: AuthToken | undefined;
  let username: string;
  let password: string;

  switch (authType) {
    case 'basic':
      logger.debug('Using basic authentication');
      ({ username, password } = parameters as Neo4jBasicAuth);

      clientAuth = auth.basic(username, password);
      break;
    case 'bearer':
      logger.debug('Using bearer Neo4j authentication');
      clientAuth = auth.bearer((parameters as Neo4jBearerAuth).base64EncodedToken);
      break;
    case 'kerberos':
      logger.debug('Using kerberos authentication');
      clientAuth = auth.kerberos((parameters as Neo4jKerberosAuth).base64EncodedTicket);
      break;
    default:
      logger.debug('Using no authentication');
      break;
  }

  const neo4jDriver = driver(clientUrl, clientAuth);

  try {
    logger.debug('Attempting to connect to Neo4j', { clientUrl, clientAuth });
    await neo4jDriver.getServerInfo();
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  } finally {
    logger.debug('Closing Neo4j connection');
    await neo4jDriver.close();
  }
}

export default defineEventHandler<{ body: EventNodeRequest }>(async (event) => {
  const requestBody = await readBody(event);

  const validatedData = useValidation(schema, requestBody);

  const [mongoConnected, neo4jConnected] = await Promise.all([
    checkMongoConnection(validatedData.mongo),
    checkNeo4jConnection(validatedData.neo4j),
  ]);

  if (!mongoConnected || !neo4jConnected) {
    throw createError({
      status: 400,
      statusMessage: 'Connection failure',
      message: 'One or more connections could not be established.',
      data: {
        mongoConnected,
        neo4jConnected,
      },
    });
  }
});
