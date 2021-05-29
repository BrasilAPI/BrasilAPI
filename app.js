import nc from 'next-connect';

import cors from 'cors';
import onError from './middlewares/errorHandler';
import cache from './middlewares/cache';
import logger from './middlewares/logger';
import { cacheExpires } from './middlewares/constants';

const corsDefaultConfiguration = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const onNoMatch = (request, response) => {
  return response.status(404).json({
    message: 'Page not found.',
    type: 'not_found',
    name: 'NotFoundError',
  });
};

export default (options = {}) => {
  const corsOptions = options.cors || {};
  const cacheOptions = options.cache || cacheExpires;

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
    .use(logger)
    .use(cache(configurations.cache));
};
