const path = require('path');

const config = {
  entry: {
    options: './src/options.js',
  },

  output: {
    path: path.resolve(__dirname, 'extension', 'build'),
    filename: '[name].js',
  },
};

module.exports = config;
