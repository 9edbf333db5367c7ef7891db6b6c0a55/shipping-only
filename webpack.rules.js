const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = require('./helpers/resolve');

const CSSLoaders = ['vue-style-loader', 'style-loader', 'css-loader', 'sass-loader'];

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  CSSLoaders.splice(0, 2, MiniCssExtractPlugin.loader);
}

module.exports = [
  {
    enforce: 'pre',
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/,
    options: {
      emitError: true,
      emitWarning: true,
      failOnError: true,
    },
    include: [resolve('app'), resolve('test')],
  },
  {
    enforce: 'pre',
    test: /\.js$/,
    loader: 'source-map-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
  },
  {
    test: /\.js$/,
    loader: 'babel-loader',
    include: [resolve('app'), resolve('test')],
    exclude: (file) => /node_modules/.test(file) && !/\.vue|\.js/.test(file),
  },
  {
    test: /\.pug$/,
    loader: ['pug-plain-loader'],
    include: [resolve('app')],
  },
  {
    test: /\.(sc|sa|c)ss$/,
    loader: CSSLoaders,
    include: [resolve('app')],
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'images/[name].[hash:7].[ext]',
    },
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: 'fonts/[name].[ext]',
    },
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: 'file-loader',
    options: {
      name: '[name].[ext]?[hash]',
    },
  },
];
