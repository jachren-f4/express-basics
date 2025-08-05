const ResponseFormatter = require('../utils/responseFormatter');
const HTTP_STATUS = require('../constants/httpStatus');

class RateLimiter {
    constructor() {
        this.attempts = new Map();
        this.cleanupInterval = setInterval(() => this.cleanup(), 15 * 60 * 1000); // Clean every 15 minutes
    }

    // Generic rate limiter
    createLimiter(maxAttempts, windowMs, message = 'Too many requests') {
        return (req, res, next) => {
            const key = this.getKey(req);
            const now = Date.now();
            
            if (!this.attempts.has(key)) {
                this.attempts.set(key, []);
            }
            
            const userAttempts = this.attempts.get(key);
            
            // Remove old attempts outside the window
            const validAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
            this.attempts.set(key, validAttempts);
            
            if (validAttempts.length >= maxAttempts) {
                return ResponseFormatter.error(
                    res,
                    `${message}. Try again later.`,
                    HTTP_STATUS.TOO_MANY_REQUESTS
                );
            }
            
            // Add current attempt
            validAttempts.push(now);
            next();
        };
    }

    // Auth-specific rate limiters
    loginLimiter = this.createLimiter(5, 15 * 60 * 1000, 'Too many login attempts');
    
    registerLimiter = this.createLimiter(3, 60 * 60 * 1000, 'Too many registration attempts');
    
    passwordResetLimiter = this.createLimiter(3, 60 * 60 * 1000, 'Too many password reset requests');
    
    emailVerificationLimiter = this.createLimiter(5, 15 * 60 * 1000, 'Too many email verification attempts');

    // Get unique key for rate limiting (IP + endpoint)
    getKey(req) {
        const ip = req.ip || req.connection.remoteAddress;
        const endpoint = req.route?.path || req.path;
        return `${ip}:${endpoint}`;
    }

    // Clean up old entries
    cleanup() {
        const now = Date.now();
        const maxAge = 60 * 60 * 1000; // 1 hour
        
        for (const [key, attempts] of this.attempts.entries()) {
            const validAttempts = attempts.filter(timestamp => now - timestamp < maxAge);
            if (validAttempts.length === 0) {
                this.attempts.delete(key);
            } else {
                this.attempts.set(key, validAttempts);
            }
        }
    }

    // Graceful shutdown
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.attempts.clear();
    }
}

// Create singleton instance
const rateLimiter = new RateLimiter();

// Graceful shutdown handling
process.on('SIGINT', () => rateLimiter.destroy());
process.on('SIGTERM', () => rateLimiter.destroy());

module.exports = {
    loginLimiter: rateLimiter.loginLimiter,
    registerLimiter: rateLimiter.registerLimiter,
    passwordResetLimiter: rateLimiter.passwordResetLimiter,
    emailVerificationLimiter: rateLimiter.emailVerificationLimiter
};