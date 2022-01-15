module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  plugins: ['prettier'],
  rules: {},
  settings: {
    'import/resolver': {
      alias: [['$src', './src']],
    },
  },
  globals: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 13,
  },
};
