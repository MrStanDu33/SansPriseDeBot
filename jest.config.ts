/**
 * @file Jest tests configuration.
 * @author DANIELS-ROTH Stan <contact@daniels-roth-stan.fr>
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  rootDir: '.',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/tests/setup-tests.ts'],

  moduleNameMapper: pathsToModuleNameMapper(
    {
      '$src/*': ['src/*'],
    },
    {
      prefix: '<rootDir>/',
    },
  ),
};
