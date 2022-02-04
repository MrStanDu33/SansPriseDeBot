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
  },
  settings: {
    'import/resolver': {
      alias: [['$src', './src']],
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
