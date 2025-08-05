const config = {
    // Log levels: error, warn, info, debug
    level: process.env.LOG_LEVEL || 'info',
    
    // Log formats
    formats: {
        development: {
            colorize: true,
            timestamp: true,
            format: 'combined'
        },
        production: {
            colorize: false,
            timestamp: true,
            format: 'json'
        }
    },
    
    // File logging configuration
    files: {
        error: {
            enabled: process.env.LOG_ERROR_FILE === 'true',
            path: process.env.LOG_ERROR_PATH || 'logs/error.log',
            maxSize: '10m',
            maxFiles: 5
        },
        combined: {
            enabled: process.env.LOG_COMBINED_FILE === 'true',
            path: process.env.LOG_COMBINED_PATH || 'logs/combined.log',
            maxSize: '10m',
            maxFiles: 5
        },
        security: {
            enabled: process.env.LOG_SECURITY_FILE === 'true',
            path: process.env.LOG_SECURITY_PATH || 'logs/security.log',
            maxSize: '5m',
            maxFiles: 10
        }
    },
    
    // Console logging
    console: {
        enabled: process.env.LOG_CONSOLE !== 'false',
        colorize: process.env.NODE_ENV !== 'production'
    },
    
    // Security event logging
    security: {
        enabled: true,
        logFailedAuth: true,
        logRateLimitHits: true,
        logSuspiciousActivity: true,
        logPrivilegedOperations: true
    },
    
    // Performance logging
    performance: {
        enabled: process.env.LOG_PERFORMANCE === 'true',
        slowRequestThreshold: parseInt(process.env.SLOW_REQUEST_THRESHOLD) || 1000, // ms
        logSlowRequests: true
    },
    
    // Request logging configuration
    requests: {
        enabled: true,
        logBody: process.env.LOG_REQUEST_BODY === 'true',
        logHeaders: process.env.LOG_REQUEST_HEADERS === 'true',
        excludePaths: ['/health', '/favicon.ico'],
        excludeQuery: ['password', 'token', 'secret'],
        maxBodyLength: 1000
    }
};

module.exports = config;