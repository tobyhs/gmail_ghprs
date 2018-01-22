const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const config = {
  entry: {
    options: './src/options.js',
    background: './src/background/main.js',
  },

  output: {
    path: path.resolve(__dirname, 'extension', 'build'),
    filename: '[name].js',
  },
};

if (process.env.RELEASE) {
  config.plugins = [
    new UglifyJsPlugin({ uglifyOptions: { ecma: 6, } }),
  ];
}

module.exports = config;
