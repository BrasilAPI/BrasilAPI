import { ApolloServer } from 'apollo-server-micro';

import handle from 'handler';

import { schema } from '../../../../graphql/schema';

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: ({ req, res }) => {
    return { req, res };
  },
  cors: true
});

const handler = apolloServer.createHandler({ path: '/api/graphql/v1' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
