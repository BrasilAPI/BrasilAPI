import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { schema } from '@/graphql/schema';

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
});

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: ({ req, res }) => ({ req, res }),
});

const handler = apolloServer.createHandler({ path: '/api/graphql/v1' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default cors(handler);
