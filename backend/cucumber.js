module.exports = {
  default: {
    requireModule: ['ts-node/register/transpile-only'],
    require: ['test/**/*.cucumber.steps.ts'],
    paths: [
      'spec/features/aquarium-core/魚缸管理.feature',
      'spec/features/organism-management/生物管理.feature',
      'spec/features/record-management/換水記錄管理.feature',
      'spec/features/record-management/餵食記錄管理.feature',
      'spec/features/record-management/下藥記錄管理.feature',
      'spec/features/record-management/水質檢測記錄管理.feature',
      'spec/features/resource-management/設備管理.feature',
      'spec/features/resource-management/耗材管理.feature',
    ],
    format: ['summary'],
    publishQuiet: true,
  },
};
