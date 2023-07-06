const path = require('path');

const buildFolder = 'dist';

module.exports = {
//  context: path.resolve(__dirname, 'src'),
  entry: './src/index.ts',
  output: {
    filename: 'headbreaker.js',
    path: path.resolve(__dirname, buildFolder),
    library: 'headbreaker'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
