import { sign } from 'jsonwebtoken';
import { set } from 'lodash';
import { MongoClient, MongoClientOptions } from 'mongodb';
import { driver } from 'neo4j-driver';

import { MongoDBAuthConfiguration, Neo4jAuthConfiguration } from '~/types/instance';

interface EventNodeRequest {
  neo4j: Neo4jAuthConfiguration;
  mongodb: MongoDBAuthConfiguration;
}

export default defineEventHandler<{ body: EventNodeRequest }>(async (event) => {
  const requestBody = await readBody(event);
  return requestBody;
});

async function checkMongoDBConnection(config: MongoDBAuthConfiguration) {
  const mongodbOptions: Partial<MongoClientOptions> = {};

  switch (config.mechanism) {
    default:
      set(mongodbOptions, 'auth.username', config.parameters.username);
      set(mongodbOptions, 'auth.password', config.parameters.password);
      break;
  }

  const client = new MongoClient(config.uri, mongodbOptions);

  try {
    await client.connect();
    return true;
  } catch (error) {
    return false;
  } finally {
    await client.close();
  }
}
