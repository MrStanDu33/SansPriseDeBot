module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:jsdoc/recommended'],
  plugins: ['prettier', 'jsdoc'],
  rules: {
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'jsdoc/tag-lines': 'off',

    // 'jsdoc/check-examples': 1, see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-tag-lines
    'jsdoc/check-indentation': ['error'],
    'jsdoc/check-param-names': [
      'error',
      {
        checkRestProperty: true,
        allowExtraTrailingParamDocs: true,
        useDefaultObjectProperties: true,
      },
    ],
    'jsdoc/check-syntax': ['error', true],
  },
  settings: {
    'import/resolver': {
      alias: [['$src', './src']],
    },
    jsdoc: {
      tagNamePreference: {
        param: 'param',
        returns: 'returns',
      },
    },
  },
  globals: {
    node: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
