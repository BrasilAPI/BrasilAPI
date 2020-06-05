import { NowRequest, NowResponse } from '@vercel/node';

function Status(request: NowRequest, response: NowResponse) {
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

export default Status;
