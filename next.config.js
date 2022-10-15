module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      /* eslint-disable no-param-reassign */
      config.resolve.fallback.fs = false;
      /* eslint-enable no-param-reassign */
    }
    return config;
  },
};
