export default {
  Query: {
    status: () => {
      return {
        status: 'ok',
        date: new Date(),
        environment: process.env.NODE_ENV,
        aws: {
          region: process.env.AWS_REGION || 'local',
          function_version: process.env.AWS_LAMBDA_FUNCTION_VERSION || 'local',
        },
      };
    },
  },
};
