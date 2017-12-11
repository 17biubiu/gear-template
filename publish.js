var path = require('path');
var cooking = require('cooking');
var config = require('./build/config');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var GearPublishPlugin = require('./gear-publish-plugin');



var isProd = process.env.NODE_ENV === 'production';

var base = process.cwd();



var packageJson = require(path.join(base, './package.json'));


cooking.set({
    entry: {
        [packageJson.name]: path.join(base, './src/components/index.js'),
    },
    dist: './dist/components/',
    moduleName: packageJson.name,
    format: 'umd',
    publicPath: process.env.CI_ENV || '',
    hash: true,
    minimize: true,
    extractCSS: true,
    alias: config.alias,
    extends: ['vue2', ],
    postcss: config.postcss
});


cooking.add('loader.js', {
    test: /\.js$/,
    use: [{
        loader: 'babel-loader'
    }],
});

cooking.add('loader.scss', {
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
});

if (isProd) {
    cooking.add('externals.vue', 'Vue');
    // cooking.add('externals.vue-router', 'VueRouter');
}

cooking.add('plugin.CopyWebpackPlugin', new CopyWebpackPlugin([{
    from: './src/docs',
    to: "../docs"
}]));

const uploadPath = packageJson + path.sep + packageJson.version;
// cooking.add('plugin.GearPublishPlugin', new GearPublishPlugin({
//     submit: '', //url,
//     upload: uploadPath, //upload path
// }));

module.exports = cooking.resolve();