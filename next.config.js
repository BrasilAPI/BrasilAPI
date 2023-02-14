module.exports = {
  webpack5: false,
  webpack(config) {
    if (config.resolve.fallback) {
      /* eslint-disable no-param-reassign */
      config.resolve.fallback.fs = false;
      /* eslint-enable no-param-reassign */
    }

    /*
    This rule fix error during building
    with yaml/browser used by fast-xml-parser
    */
    config.module.rules.push({
      test: /node_modules\/yaml\/browser\//,
      type: 'javascript/auto',
    });
    return config;
  },
};
