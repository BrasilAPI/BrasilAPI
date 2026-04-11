import nc from 'next-connect';

import cors from 'cors';
import onError from './middlewares/errorHandler';
import cache from './middlewares/cache';
import logger from './middlewares/logger';
import firewall from './middlewares/firewall';

const corsDefaultConfiguration = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const cacheDefaultConfiguration = 86400;

const onNoMatch = (request, response) => {
  return response.status(404).json({
    message: 'Page not found.',
    type: 'not_found',
    name: 'NotFoundError',
  });
};

const app = (options = {}) => {
  const corsOptions = options.cors || {};
  const cacheOptions = options.cache || cacheDefaultConfiguration;

  const configurations = {
    cors: {
      ...corsDefaultConfiguration,
      ...corsOptions,
    },
    cache: cacheOptions,
  };

  return nc({
    onError,
    onNoMatch,
  })
    .use(cors(configurations.cors))
    .use(firewall)
    .use(logger)
    .use(cache(configurations.cache));
};

export default app;
