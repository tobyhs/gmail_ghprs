const path = require('path');

const config = {
  mode: process.env.NODE_ENV || 'development',
  devtool: false,
  entry: {
    options: './src/options.js',
    background: './src/background/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'extension', 'build'),
  },
};

module.exports = config;
