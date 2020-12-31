import { handle } from '../../../../handler';
import { get } from '../../../../handler/middlewares';

// eslint-disable-next-line no-unused-vars
function Status(request, response, next) {
  response.status(200);
  response.json({
    status: 'ok',
    date: new Date(),
    environment: process.env.NODE_ENV,
    aws: {
      region: process.env.AWS_REGION || 'local',
      function_version: process.env.AWS_LAMBDA_FUNCTION_VERSION || 'local',
    },
  });
}

export default handle(get(Status));
