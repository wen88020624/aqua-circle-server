module.exports = {
  default: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['test/**/*.cucumber.steps.ts'],
    paths: ['spec/features/**/*.feature'],
    format: ['progress'],
    publishQuiet: true,
  },
  aquarium: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['test/aquarium/**/*.cucumber.steps.ts'],
    paths: ['spec/features/魚缸管理.feature'],
    format: ['progress'],
    publishQuiet: true,
  },
};
