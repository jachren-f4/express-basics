const jwt = require('jsonwebtoken');
const AuthUserRepository = require('../repositories/AuthUserRepository');
const AuthUser = require('../models/AuthUser');
const { config } = require('../config');
const HTTP_STATUS = require('../constants/httpStatus');
const { AUTH_MESSAGES } = require('../constants/auth');

class AuthService {
    constructor() {
        this.authUserRepository = new AuthUserRepository();
    }

    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw {
                    status: HTTP_STATUS.UNAUTHORIZED,
                    message: AUTH_MESSAGES.TOKEN_EXPIRED
                };
            } else if (error.name === 'JsonWebTokenError') {
                throw {
                    status: HTTP_STATUS.UNAUTHORIZED,
                    message: AUTH_MESSAGES.INVALID_TOKEN
                };
            }
            throw {
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGES.INVALID_TOKEN
            };
        }
    }

    async register(userData) {
        // Check if user already exists
        const existingUser = await this.authUserRepository.findByEmail(userData.email);
        
        if (existingUser) {
            throw {
                status: HTTP_STATUS.CONFLICT,
                message: AUTH_MESSAGES.USER_EXISTS
            };
        }

        // Validate password
        const tempUser = new AuthUser(userData);
        if (!tempUser.isPasswordValid(userData.password)) {
            throw {
                status: HTTP_STATUS.BAD_REQUEST,
                message: AUTH_MESSAGES.PASSWORD_TOO_SHORT
            };
        }

        // Create user with hashed password
        const authUser = await AuthUser.create(userData);
        
        if (!authUser.isValid()) {
            throw {
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'Invalid user data'
            };
        }

        // Save user
        const savedUser = await this.authUserRepository.create(authUser);
        
        // Generate token
        const token = this.generateToken(savedUser);

        return {
            message: AUTH_MESSAGES.REGISTER_SUCCESS,
            user: savedUser.toAuthJSON(),
            token
        };
    }

    async login(email, password) {
        // Find user by email
        const user = await this.authUserRepository.findByEmail(email);
        
        if (!user) {
            throw {
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGES.INVALID_CREDENTIALS
            };
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            throw {
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGES.INVALID_CREDENTIALS
            };
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            message: AUTH_MESSAGES.LOGIN_SUCCESS,
            user: user.toAuthJSON(),
            token
        };
    }

    async getProfile(userId) {
        const user = await this.authUserRepository.findById(userId);
        
        if (!user) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: 'User not found'
            };
        }

        return user.toJSON();
    }

    async updateProfile(userId, updateData) {
        const existingUser = await this.authUserRepository.findById(userId);
        
        if (!existingUser) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: 'User not found'
            };
        }

        // Check if email is being changed and if it already exists
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.authUserRepository.emailExists(updateData.email, userId);
            if (emailExists) {
                throw {
                    status: HTTP_STATUS.CONFLICT,
                    message: 'Email already exists'
                };
            }
        }

        const updatedUser = await this.authUserRepository.update(userId, {
            name: updateData.name,
            email: updateData.email?.toLowerCase(),
            age: updateData.age
        });

        return updatedUser.toJSON();
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.authUserRepository.findById(userId);
        
        if (!user) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: 'User not found'
            };
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isCurrentPasswordValid) {
            throw {
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'Current password is incorrect'
            };
        }

        // Validate new password
        if (!user.isPasswordValid(newPassword)) {
            throw {
                status: HTTP_STATUS.BAD_REQUEST,
                message: AUTH_MESSAGES.PASSWORD_TOO_SHORT
            };
        }

        // Hash new password
        await user.updatePassword(newPassword);
        
        // Update in repository
        await this.authUserRepository.updatePassword(userId, user.hashedPassword);

        return {
            message: 'Password changed successfully'
        };
    }

    async deleteAccount(userId) {
        const deletedUser = await this.authUserRepository.delete(userId);
        
        if (!deletedUser) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: 'User not found'
            };
        }

        return {
            message: 'Account deleted successfully',
            user: deletedUser.toAuthJSON()
        };
    }
}

module.exports = AuthService;