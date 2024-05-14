/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/test/**'],
  coveragePathIgnorePatterns: [
    'index.ts',
    '.+-protocols.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '.(ts)': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}

module.exports = config
