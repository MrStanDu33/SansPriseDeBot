process.env.TZ = 'Europe/Paris';

export default {
  testEnvironment: 'jest-environment-node',
  moduleNameMapper: {
    // see: https://github.com/kulshekhar/ts-jest/issues/414#issuecomment-517944368
    '^#(.*)$': '<rootDir>/node_modules/$1',
  },
  transform: {},
};
