module.exports = {
  webpack5: true,
  webpack(config) {
    if (config.resolve.fallback) {
      /* eslint-disable no-param-reassign */
      config.resolve.fallback.fs = false;
      /* eslint-enable no-param-reassign */
    }

    return config;
  },
};
