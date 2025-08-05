const AuthService = require('../services/AuthService');
const ResponseFormatter = require('../utils/responseFormatter');
const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES } = require('../constants/auth');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            ResponseFormatter.created(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.CONFLICT) {
                return ResponseFormatter.conflict(res, error.message);
            }
            if (error.status === HTTP_STATUS.BAD_REQUEST) {
                return ResponseFormatter.badRequest(res, error.message);
            }
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            ResponseFormatter.success(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                return ResponseFormatter.error(res, error.message, HTTP_STATUS.UNAUTHORIZED);
            }
            next(error);
        }
    };

    getProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const profile = await this.authService.getProfile(userId);
            ResponseFormatter.success(res, profile);
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            next(error);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const updatedProfile = await this.authService.updateProfile(userId, req.body);
            ResponseFormatter.success(res, {
                message: 'Profile updated successfully',
                user: updatedProfile
            });
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            if (error.status === HTTP_STATUS.CONFLICT) {
                return ResponseFormatter.conflict(res, error.message);
            }
            next(error);
        }
    };

    changePassword = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            const result = await this.authService.changePassword(userId, currentPassword, newPassword);
            ResponseFormatter.success(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                return ResponseFormatter.error(res, error.message, HTTP_STATUS.UNAUTHORIZED);
            }
            if (error.status === HTTP_STATUS.BAD_REQUEST) {
                return ResponseFormatter.badRequest(res, error.message);
            }
            next(error);
        }
    };

    deleteAccount = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const result = await this.authService.deleteAccount(userId);
            ResponseFormatter.success(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            // For JWT, logout is handled client-side by removing the token
            // In production, you might want to implement token blacklisting
            ResponseFormatter.success(res, {
                message: AUTH_MESSAGES.LOGOUT_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            // Extract user info from current token
            const userId = req.user.id;
            const user = await this.authService.getProfile(userId);
            
            // Generate new token
            const token = this.authService.generateToken(user);
            
            ResponseFormatter.success(res, {
                message: 'Token refreshed successfully',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, 'User not found');
            }
            next(error);
        }
    };
}

module.exports = AuthController;