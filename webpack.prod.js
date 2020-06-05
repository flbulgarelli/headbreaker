const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ]
});
