module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/',
        '/dist/'
    ],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ],
    injectGlobals: true  // This ensures Jest globals are available
};