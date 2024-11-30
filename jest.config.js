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
        'Tests/**/*.test.js',
        'Tests/**/*.spec.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    injectGlobals: true
};