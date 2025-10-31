export default {
  collectCoverage: true,
  collectCoverageFrom: ['src/utils/*.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 90
    }
  }
}
