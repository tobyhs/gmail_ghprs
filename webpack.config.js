const path = require('path');

const config = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'none',
  entry: {
    options: './src/options.js',
    background: './src/background/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'extension', 'build'),
    filename: '[name].js',
  },
};

module.exports = config;
