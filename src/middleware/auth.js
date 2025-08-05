const AuthService = require('../services/AuthService');
const ResponseFormatter = require('../utils/responseFormatter');
const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES, AUTH_CONSTANTS } = require('../constants/auth');

class AuthMiddleware {
    constructor() {
        this.authService = new AuthService();
    }

    // Middleware to verify JWT token
    authenticate = async (req, res, next) => {
        try {
            // Get token from header
            const authHeader = req.header(AUTH_CONSTANTS.TOKEN.HEADER_NAME);
            
            if (!authHeader) {
                return ResponseFormatter.error(
                    res, 
                    AUTH_MESSAGES.UNAUTHORIZED, 
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            // Check if token starts with Bearer
            if (!authHeader.startsWith(AUTH_CONSTANTS.TOKEN.PREFIX)) {
                return ResponseFormatter.error(
                    res, 
                    AUTH_MESSAGES.INVALID_TOKEN, 
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            // Extract token
            const token = authHeader.substring(AUTH_CONSTANTS.TOKEN.PREFIX.length);

            if (!token) {
                return ResponseFormatter.error(
                    res, 
                    AUTH_MESSAGES.UNAUTHORIZED, 
                    HTTP_STATUS.UNAUTHORIZED
                );
            }

            // Verify token
            const decoded = this.authService.verifyToken(token);
            
            // Validate decoded token structure
            if (!decoded || !decoded.id) {
                return ResponseFormatter.error(
                    res, 
                    AUTH_MESSAGES.INVALID_TOKEN, 
                    HTTP_STATUS.UNAUTHORIZED
                );
            }
            
            // Add user info to request
            req.user = decoded;
            req.token = token;
            
            next();
        } catch (error) {
            // Log authentication error for debugging (don't expose in production)
            console.error('Authentication error:', error.message);
            
            if (error.status) {
                return ResponseFormatter.error(res, error.message, error.status);
            }
            
            // Handle specific JWT errors
            if (error.name === 'TokenExpiredError') {
                return ResponseFormatter.error(
                    res, 
                    AUTH_MESSAGES.TOKEN_EXPIRED || 'Token has expired', 
                    HTTP_STATUS.UNAUTHORIZED
                );
            }
            
            if (error.name === 'JsonWebTokenError') {
                return ResponseFormatter.error(
                    res, 
                    AUTH_MESSAGES.INVALID_TOKEN, 
                    HTTP_STATUS.UNAUTHORIZED
                );
            }
            
            return ResponseFormatter.error(
                res, 
                AUTH_MESSAGES.INVALID_TOKEN, 
                HTTP_STATUS.UNAUTHORIZED
            );
        }
    };

    // Optional authentication - doesn't fail if no token
    optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.header(AUTH_CONSTANTS.TOKEN.HEADER_NAME);
            
            if (!authHeader || !authHeader.startsWith(AUTH_CONSTANTS.TOKEN.PREFIX)) {
                return next();
            }

            const token = authHeader.substring(AUTH_CONSTANTS.TOKEN.PREFIX.length);
            
            if (!token) {
                return next();
            }

            // Try to verify token, but don't fail if invalid
            try {
                const decoded = this.authService.verifyToken(token);
                req.user = decoded;
                req.token = token;
            } catch (tokenError) {
                // Token invalid, but continue without authentication
            }
            
            next();
        } catch (error) {
            // Continue without authentication on any error
            next();
        }
    };

    // Middleware to check if user owns the resource
    authorizeOwner = (resourceIdParam = 'id') => {
        return (req, res, next) => {
            try {
                const resourceId = req.params[resourceIdParam];
                const userId = req.user?.id;

                if (!userId) {
                    return ResponseFormatter.error(
                        res, 
                        AUTH_MESSAGES.UNAUTHORIZED, 
                        HTTP_STATUS.UNAUTHORIZED
                    );
                }

                // Validate resource ID format
                if (!resourceId || isNaN(parseInt(resourceId))) {
                    return ResponseFormatter.error(
                        res, 
                        'Invalid resource ID', 
                        HTTP_STATUS.BAD_REQUEST
                    );
                }

                // Check if user is trying to access their own resource
                if (parseInt(resourceId) !== parseInt(userId)) {
                    return ResponseFormatter.error(
                        res, 
                        AUTH_MESSAGES.ACCESS_DENIED, 
                        HTTP_STATUS.FORBIDDEN
                    );
                }

                next();
            } catch (error) {
                console.error('Authorization error:', error.message);
                return ResponseFormatter.error(
                    res, 
                    'Authorization failed', 
                    HTTP_STATUS.INTERNAL_SERVER_ERROR
                );
            }
        };
    };

    // Middleware to check if user is admin (placeholder for future implementation)
    requireAdmin = (req, res, next) => {
        if (!req.user) {
            return ResponseFormatter.error(
                res, 
                AUTH_MESSAGES.UNAUTHORIZED, 
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // For now, assume all authenticated users can access admin routes
        // In production, check user role/permissions
        next();
    };
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

module.exports = {
    authenticate: authMiddleware.authenticate,
    optionalAuth: authMiddleware.optionalAuth,
    authorizeOwner: authMiddleware.authorizeOwner,
    requireAdmin: authMiddleware.requireAdmin
};