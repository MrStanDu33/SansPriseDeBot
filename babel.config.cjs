module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-syntax-import-assertions',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          $src: './src',
        },
      },
    ],
  ],
};
