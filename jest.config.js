module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/Config/',
        '/docs/'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'Client/**/*.js',
        '!Client/**/*.test.js'
    ],
    testMatch: [
        'tests/**/*.test.js',
        'tests/**/*.spec.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    injectGlobals: true
};