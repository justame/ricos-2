const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const PATHS = {
  monorepo_root: path.join(__dirname, '..', '..', '..'),
  root: path.join(__dirname, '..'),
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
};

module.exports = env => ({
  entry: [require.resolve('./polyfills'), path.resolve(PATHS.src, 'index.jsx')],
  output: {
    path: PATHS.dist,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'wix-rich-content-common': path.resolve(PATHS.monorepo_root, 'packages', 'common', 'web'),
      'wix-rich-content-editor-common': path.resolve(
        PATHS.monorepo_root,
        'packages',
        'editor-common',
        'web'
      ),
    },
  },
  ignoreWarnings: [/Failed to parse source map/],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        include: [/\/packages\//],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /styles\.global\.scss/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]_[local]',
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.global.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        issuer: /\.(css|sass|js|jsx)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          fallback: 'file-loader',
        },
      },
      {
        test: /\.(woff|eot|ttf|svg|woff2)$/,
        issuer: /\.(s)?css$/,
        use: ['url-loader'],
      },
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../shared'),
          path.resolve(__dirname, '../../storybook/src/shared'),
        ],
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'esnext',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'Rich Content Editor',
      favicon: './public/favicon.ico',
      template: './public/index.html',
      meta: {
        charset: 'utf-8',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no',
      },
      chunksSortMode: 'none',
    }),
    new DotenvWebpackPlugin({
      path: path.resolve(PATHS.monorepo_root, '.env'),
    }),
    new MonacoWebpackPlugin({
      languages: ['json'],
      features: [
        'bracketMatching',
        'caretOperations',
        'clipboard',
        'codeAction',
        'comment',
        'contextmenu',
        'coreCommands',
        'cursorUndo',
        'find',
        'folding',
        'format',
        'gotoError',
        'gotoLine',
        'hover',
        'inPlaceReplace',
        'inspectTokens',
        'linesOperations',
        'links',
        'multicursor',
        'parameterHints',
        'referenceSearch',
        'rename',
        'smartSelect',
        'suggest',
        'transpose',
        'wordHighlighter',
        'wordOperations',
        'wordPartOperations',
      ],
    }),
  ],
});
