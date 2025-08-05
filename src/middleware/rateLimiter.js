const rateLimit = require('express-rate-limit');

// Rate limiting configurations for different endpoints
const rateLimitConfigs = {
    // Strict rate limiting for authentication endpoints to prevent brute force attacks
    authentication: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 5 requests per windowMs
        message: {
            error: 'Too many authentication attempts, please try again later.',
            retryAfter: '15 minutes'
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        // Skip rate limiting for successful requests
        skipSuccessfulRequests: true,
        // Custom key generator to include user agent for better security
        keyGenerator: (req) => {
            return req.ip + ':' + (req.get('User-Agent') || 'unknown');
        }
    }),

    // Moderate rate limiting for registration to prevent spam
    registration: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, // Limit each IP to 3 registration attempts per hour
        message: {
            error: 'Too many registration attempts, please try again later.',
            retryAfter: '1 hour'
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            return req.ip + ':' + (req.get('User-Agent') || 'unknown');
        }
    }),

    // General API rate limiting
    general: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: {
            error: 'Too many requests, please try again later.',
            retryAfter: '15 minutes'
        },
        standardHeaders: true,
        legacyHeaders: false
    }),

    // Strict rate limiting for password reset to prevent abuse
    passwordReset: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 2, // Limit each IP to 2 password reset attempts per hour
        message: {
            error: 'Too many password reset attempts, please try again later.',
            retryAfter: '1 hour'
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // Use email from request body for password reset attempts
            const email = req.body?.email || 'unknown';
            return req.ip + ':' + email;
        }
    })
};

// Security middleware to add additional headers
const securityHeaders = (req, res, next) => {
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Add custom security header to indicate rate limiting is active
    res.setHeader('X-Rate-Limit-Policy', 'active');
    
    next();
};

// Export middleware functions
module.exports = {
    authenticationLimiter: [securityHeaders, rateLimitConfigs.authentication],
    registrationLimiter: [securityHeaders, rateLimitConfigs.registration],
    generalLimiter: [securityHeaders, rateLimitConfigs.general],
    passwordResetLimiter: [securityHeaders, rateLimitConfigs.passwordReset],
    securityHeaders
};