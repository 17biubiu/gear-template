var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var saladConfig = require('./salad.config.json');




exports.alias = {
  etc: path.resolve(__dirname, '../etc'),
  src: path.resolve(__dirname, '../src'),
  // packages: path.resolve(__dirname, '../packages'),
  // examples: path.resolve(__dirname, '../examples'),
  // 'element-ui': path.resolve(__dirname, '../')
};

exports.postcss = function(webapck) {
  saladConfig.features.partialImport = {
    addDependencyTo: webapck
  };
  return [
    require('postcss-salad')(saladConfig)
  ];
};
