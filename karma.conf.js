const webpackConfig = require('./webpack.config.js');
// npm i -D puppeteer karma-chrome-launcher
// process.env.CHROME_BIN = require('puppeteer').executablePath();

webpackConfig.devtool = 'inline-source-map';
delete webpackConfig.entry;

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    files: ['app/script/**/*', 'tests/**/*.spec.js'],
    preprocessors: {
      'app/script/**/*': ['webpack', 'sourcemap'],
      '**/*.spec.js': ['webpack', 'sourcemap'],
    },
    plugins: [
      // Launchers
      // 'karma-chrome-launcher',
      // 'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-sinon-chai',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-mocha-reporter',
      'karma-spec-reporter',
      'karma-coverage',
    ],
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    colors: true,
    // options: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    loglevel: config.LOG_DEBUG,
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage', 'spec', 'failed'
    reporters: ['spec', 'progress', 'coverage'],
    port: 9876,
    // options: PhantomJS, ChromeHeadless, Chrome, ChromeWithoutSecurity, Firefox, FirefoxHeadless
    browsers: ['FirefoxHeadless'],
    // https://www.youtube.com/watch?v=FQwZrOAmMAc
    // To turn off chrome's security limitations that do not allow some basics things to run
    // That are required while developing
    customLauncher: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      },
      ChromeWithoutSecurity: {
        base: 'Chrome',
        flags: ['--disable-web-security'],
      },
    },
    // Have phantomjs exit if a ResourceError is encountered
    // (useful if karma exits without killing phantom)
    phantomjsLauncher: {
      exitOnResourceError: true,
    },
    singleRun: true,
    concurrency: Infinity,
    // enable / disable watching file and executing tests whenever any file changes
    // on true, on CI systems break
    autoWatch: false,
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: 'lcov' },
        { type: 'cobertura', subdir: 'cobertura' },
        { type: 'json', subdir: 'json' },
        { type: 'text-summary', subdir: 'text' },
      ],
    },
  });
};
