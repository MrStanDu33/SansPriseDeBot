module.exports = {
  root: true,
  env: {
    browser: false,
    es6: true,
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
};
