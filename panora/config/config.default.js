'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1537252425172_2962';

  config.view = {
    defaultViewEngine: 'nunjucks',
      mapping: {
      '.html': 'nunjucks',
      },
  };
  // add your config here
  config.middleware = [];

  return config;
};
