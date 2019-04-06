module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'],
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  globals: {
    __dirname: true,
    browser: true,
    module: true,
    process: true,
    require: true,
    Vue: true,
    VueRouter: true,
    assert: true,
    expect: true,
    sinon: true,
    $: true,
    jQuery: true
  },
  // NOTE: Please ensure you arrange them alphabetically, thanks
  rules: {
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'new-cap': [2, {
      'capIsNewExceptions': ['Metrics']
    }],
    'no-unused-expressions': 0,
    'no-param-reassign': 0,
    'no-whitespace-before-property': 0,
    'max-len': [
      2,
      100,
      2,
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignorePattern: '/(.*)/;',
      },
    ],
    'prefer-template': 0,
    'prefer-promise-reject-errors': 0,
    'prefer-rest-params': 0,
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        semi: true,
        arrowParens: 'always',
        bracketSpacing: true,
        printWidth: 100,
        endOfLine: 'lf'
      }
    ],
    'strict': ['error', 'never'],
  },
};
