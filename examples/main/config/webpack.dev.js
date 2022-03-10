/* eslint-disable */
const path = require('path');
const merge = require('webpack-merge').merge;

const PATHS = {
  monorepo_root: path.join(__dirname, '..', '..', '..'),
};

const devConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      'react-hot-loader': path.resolve(PATHS.monorepo_root, 'node_modules', 'react-hot-loader'),
      'react-dom': path.resolve(PATHS.monorepo_root, 'node_modules', '@hot-loader', 'react-dom'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'esnext',
        },
      },
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    host: 'localhost',
    compress: true,
    allowedHosts: 'all',
    proxy: {
      '/_serverless/*': {
        target: 'https://www.wix.com/',
        secure: false,
        changeOrigin: true,
      },
      '/rich-content/oembed': 'http://stehauho.wixsite.com/',
    },
  },
};

module.exports = env => {
  const common = require('./webpack.common.js')(env);
  return merge(common, devConfig);
};
