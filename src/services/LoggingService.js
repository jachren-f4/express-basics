const loggingConfig = require('../config/logging');

class LoggingService {
    constructor() {
        this.config = loggingConfig;
        this.setupLogDirectories();
    }

    setupLogDirectories() {
        const fs = require('fs');
        const path = require('path');
        
        // Ensure log directories exist
        const logDirs = new Set();
        Object.values(this.config.files).forEach(file => {
            if (file.enabled && file.path) {
                logDirs.add(path.dirname(file.path));
            }
        });

        logDirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // Core logging methods
    error(message, meta = {}) {
        this.log('error', message, meta);
    }

    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    debug(message, meta = {}) {
        this.log('debug', message, meta);
    }

    // Security-specific logging
    security(event, details = {}) {
        if (!this.config.security.enabled) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: 'security',
            event,
            details,
            severity: this.getSecuritySeverity(event)
        };

        this.writeToFile('security', logEntry);
        
        // Also log to main system for high severity events
        if (logEntry.severity === 'high') {
            this.error(`Security Event: ${event}`, details);
        }
    }

    // Performance logging
    performance(operation, duration, meta = {}) {
        if (!this.config.performance.enabled) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: 'performance',
            operation,
            duration,
            meta,
            slow: duration > this.config.performance.slowRequestThreshold
        };

        if (logEntry.slow) {
            this.warn(`Slow operation detected: ${operation} took ${duration}ms`, meta);
        }

        this.log('info', `Performance: ${operation} completed in ${duration}ms`, meta);
    }

    // Request/Response logging
    request(req, res, duration) {
        if (!this.config.requests.enabled) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: this.sanitizeUrl(req.originalUrl),
            statusCode: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user?.id || null
        };

        // Add request body if enabled and safe
        if (this.config.requests.logBody && req.body) {
            logEntry.body = this.sanitizeRequestBody(req.body);
        }

        // Add headers if enabled
        if (this.config.requests.logHeaders) {
            logEntry.headers = this.sanitizeHeaders(req.headers);
        }

        // Determine log level based on status code
        const level = res.statusCode >= 500 ? 'error' : 
                     res.statusCode >= 400 ? 'warn' : 'info';

        this.log(level, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, logEntry);
    }

    // Authentication event logging
    authEvent(event, user, meta = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            userId: user?.id || null,
            email: user?.email || null,
            ip: meta.ip || null,
            userAgent: meta.userAgent || null,
            success: meta.success || false,
            ...meta
        };

        if (event === 'login_failed' && this.config.security.logFailedAuth) {
            this.security('authentication_failure', logEntry);
        } else if (event === 'login_success') {
            this.info('User authentication successful', logEntry);
        }

        this.info(`Auth Event: ${event}`, logEntry);
    }

    // Rate limit event logging
    rateLimitHit(type, ip, meta = {}) {
        if (!this.config.security.logRateLimitHits) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            ip,
            ...meta
        };

        this.security('rate_limit_exceeded', logEntry);
        this.warn(`Rate limit exceeded: ${type} from ${ip}`, logEntry);
    }

    // Core logging implementation
    log(level, message, meta = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...meta
        };

        // Console logging
        if (this.config.console.enabled) {
            this.logToConsole(level, message, meta);
        }

        // File logging
        this.writeToFile('combined', logEntry);
        
        if (level === 'error') {
            this.writeToFile('error', logEntry);
        }
    }

    // Helper methods
    logToConsole(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '';
        
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr ? '\n' + metaStr : ''}`;
        
        switch (level) {
            case 'error':
                console.error(logMessage);
                break;
            case 'warn':
                console.warn(logMessage);
                break;
            case 'debug':
                console.debug(logMessage);
                break;
            default:
                console.log(logMessage);
        }
    }

    writeToFile(type, logEntry) {
        const fileConfig = this.config.files[type];
        if (!fileConfig || !fileConfig.enabled) return;

        const fs = require('fs');
        const logLine = JSON.stringify(logEntry) + '\n';
        
        try {
            fs.appendFileSync(fileConfig.path, logLine);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    sanitizeUrl(url) {
        const sensitiveParams = this.config.requests.excludeQuery;
        let sanitized = url;
        
        sensitiveParams.forEach(param => {
            const regex = new RegExp(`([?&])${param}=([^&]*)`, 'gi');
            sanitized = sanitized.replace(regex, `$1${param}=[REDACTED]`);
        });
        
        return sanitized;
    }

    sanitizeRequestBody(body) {
        const sensitiveFields = this.config.requests.excludeQuery;
        const sanitized = { ...body };
        
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        const bodyStr = JSON.stringify(sanitized);
        return bodyStr.length > this.config.requests.maxBodyLength 
            ? bodyStr.substring(0, this.config.requests.maxBodyLength) + '...[TRUNCATED]'
            : sanitized;
    }

    sanitizeHeaders(headers) {
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        const sanitized = { ...headers };
        
        sensitiveHeaders.forEach(header => {
            if (sanitized[header]) {
                sanitized[header] = '[REDACTED]';
            }
        });
        
        return sanitized;
    }

    getSecuritySeverity(event) {
        const highSeverityEvents = [
            'authentication_failure',
            'rate_limit_exceeded',
            'suspicious_activity',
            'privilege_escalation'
        ];
        
        return highSeverityEvents.includes(event) ? 'high' : 'medium';
    }
}

// Export singleton instance
module.exports = new LoggingService();