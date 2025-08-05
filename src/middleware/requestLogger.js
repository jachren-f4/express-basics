const logger = require('../services/LoggingService');
const loggingConfig = require('../config/logging');

// Enhanced request logging middleware
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Skip logging for excluded paths
    if (loggingConfig.requests.excludePaths.includes(req.path)) {
        return next();
    }

    // Capture the original res.end method
    const originalEnd = res.end;
    
    // Override res.end to capture response time
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        
        // Log the request
        logger.request(req, res, duration);
        
        // Call the original end method
        originalEnd.apply(this, args);
    };

    next();
};

// Security event middleware - integrates with existing auth middleware
const securityLogger = {
    // Log authentication attempts
    logAuthAttempt: (req, success, user = null) => {
        const event = success ? 'login_success' : 'login_failed';
        logger.authEvent(event, user, {
            ip: req.ip,
            userAgent: req.get('user-agent'),
            success,
            timestamp: new Date().toISOString()
        });
    },

    // Log rate limit violations
    logRateLimitHit: (req, limitType) => {
        logger.rateLimitHit(limitType, req.ip, {
            userAgent: req.get('user-agent'),
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
    },

    // Log suspicious activity
    logSuspiciousActivity: (req, description, severity = 'medium') => {
        logger.security('suspicious_activity', {
            description,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            path: req.path,
            method: req.method,
            severity,
            timestamp: new Date().toISOString()
        });
    },

    // Log privileged operations (admin actions, sensitive operations)
    logPrivilegedOperation: (req, operation, user, details = {}) => {
        logger.security('privileged_operation', {
            operation,
            userId: user?.id,
            userEmail: user?.email,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            details,
            timestamp: new Date().toISOString()
        });
    }
};

// Performance monitoring middleware
const performanceLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Capture the original res.end method
    const originalEnd = res.end;
    
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        const operation = `${req.method} ${req.route?.path || req.path}`;
        
        // Log performance metrics
        logger.performance(operation, duration, {
            statusCode: res.statusCode,
            path: req.path,
            method: req.method,
            userId: req.user?.id || null
        });
        
        // Call the original end method
        originalEnd.apply(this, args);
    };

    next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
    // Log the error with context
    logger.error(err.message, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || null,
        body: req.body,
        query: req.query,
        params: req.params,
        timestamp: new Date().toISOString()
    });

    // Check if this might be a security-related error
    if (err.status === 401 || err.status === 403) {
        securityLogger.logSuspiciousActivity(req, `Authentication/Authorization error: ${err.message}`, 'high');
    }

    next(err);
};

// Middleware to add logger to request object for use in controllers
const attachLogger = (req, res, next) => {
    req.logger = logger;
    req.securityLogger = securityLogger;
    next();
};

module.exports = {
    requestLogger,
    securityLogger,
    performanceLogger,
    errorLogger,
    attachLogger
};