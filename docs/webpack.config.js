// webpack.config.js
const path = require('path');

module.exports = {
  entry: path.resolve('src', 'webpack.entry.js'),
  output: {
    path: path.resolve('build'),
    filename: 'main.js',
    publicPath: '/'
  },
  module: {
    loaders: {
     "test": /\.js?$/,
     "exclude": /node_modules/,
     "loader": "babel"
   }
  }
};