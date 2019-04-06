const fs = require('fs');
const YAML = require('yaml');
const cssNano = require('cssnano');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const VueTemplateCompiler = require('vue-template-compiler');

const resolve = require('./helpers/resolve');
const rules = require('./webpack.rules');
const allStaticDependencies = require('./webpack.staticDeps');

let appEnvironmentConfig = {};
try {
  const appYamlConfigurations = fs.readFileSync('app.yaml', 'utf8');
  appEnvironmentConfig = YAML.parse(appYamlConfigurations);
} catch (error) {
  if (process.env.APPLICATION_CONFIG) {
    appEnvironmentConfig = process.env.APPLICATION_CONFIG;
    return;
  }
  // eslint-disable-next-line no-console
  console.log(error);
  process.exit(1);
}

const isDeveloperMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
// eslint-disable-next-line no-console
console.log(`IS DEVELOPER MODE: ${isDeveloperMode}`);

const viewportOptions = [
  'width=device-width',
  'initial-scale=1',
  'maximum-scale=1.0',
  'user-scalable=no',
  'shrink-to-fit=no',
];
const htmlConfigOptions = {
  filename: 'index.html',
  template: 'app/index.html',
  meta: {
    charset: 'utf-8',
    description: '',
    keywords: '',
    viewport: viewportOptions.reduce((acc, val) => `${acc} ${val}`),
    'theme-color': '#3700ff',
    'content-type': {
      'http-equiv': 'content-type',
      content: 'text/html; charset=utf-8',
    },
    'X-UA-Compatible': {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=Edge',
    },
    cleartype: {
      'http-equiv': 'cleartype',
      content: 'on',
    },
  },
  inject: true,
  hash: true,
  minify: !isDeveloperMode,
};

const alias = {
  vue$: isDeveloperMode ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.min.js',
  '@style': resolve('app/styles'),
  '@images': resolve('app/images'),
  '@app': resolve('app/scripts'),
  '@component': resolve('app/scripts/components'),
  '@lib': resolve('app/scripts/libs'),
  '@mixin': resolve('app/scripts/mixins'),
  '@plugin': resolve('app/scripts/plugins'),
  '@service': resolve('app/scripts/services'),
  '@filter': resolve('app/scripts/filters'),
  '@util': resolve('app/scripts/utils'),
  '@store': resolve('app/scripts/store'),
  '@node_module': resolve('node_modules'),
  '@constant': resolve('app/scripts/constants'),
  '@dashkit': resolve('app/dashkit'),
  querystring: 'querystring-browser',
};

const webpackConfig = {
  mode: !isDeveloperMode ? process.env.NODE_ENV : 'development',
  devtool: isDeveloperMode ? 'eval-source-map' : 'none',
  entry: {
    app: resolve('app/scripts/main.js'),
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: resolve('public'),
  },
  resolve: {
    extensions: ['.vue', '.js', '.json', '.css', '.scss'],
    alias,
  },
  module: {
    rules,
  },
  performance: {
    hints: false,
  },
  stats: {
    colors: true,
  },
  plugins: [
    new HtmlWebpackPlugin(htmlConfigOptions),
    new VueLoaderPlugin({
      compiler: VueTemplateCompiler,
    }),
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin(allStaticDependencies, {
      copyUnmodified: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(
      Object.assign(
        {
          ENVIRONMENT: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
          DEBUG: isDeveloperMode,
        },
        appEnvironmentConfig
      )
    ),
  ],
};

if (isDeveloperMode) {
  webpackConfig.devServer = {
    hot: true,
    contentBase: resolve('public'),
    compress: true,
    port: process.env.PORT || appEnvironmentConfig.PORT || 3000,
    historyApiFallback: true,
    noInfo: true,
    watchOptions: {
      poll: 2000,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
  };

  if (!process.env.NO_BUNDLE) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        openAnalyzer: !isDeveloperMode,
      })
    );
  }
}

if (!isDeveloperMode) {
  const optimizeCSSPlugin = new OptimizeCssAssetsPlugin({
    cssProcessor: cssNano,
    cssProcessorPluginOptions: {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    },
    canPrint: true,
  });

  webpackConfig.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      optimizeCSSPlugin,
    ],
    // Extracting all CSS in a single file
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  };

  webpackConfig.plugins.push(
    ...[
      optimizeCSSPlugin,
      new MiniCssExtractPlugin({
        filename: 'styles/[name].css',
        chunkFilename: '[id].[hash].css',
      }),
    ]
  );
}

module.exports = webpackConfig;
