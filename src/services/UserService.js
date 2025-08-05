const UserRepository = require('../repositories/UserRepository');
const User = require('../models/User');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll();
        const count = await this.userRepository.count();
        
        return {
            users: users.map(user => user.toJSON()),
            count
        };
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: MESSAGES.USER.NOT_FOUND
            };
        }

        return user.toJSON();
    }

    async createUser(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        
        if (existingUser) {
            throw {
                status: HTTP_STATUS.CONFLICT,
                message: MESSAGES.USER.EMAIL_EXISTS
            };
        }

        const user = User.create(userData);
        
        if (!user.isValid()) {
            throw {
                status: HTTP_STATUS.BAD_REQUEST,
                message: MESSAGES.USER.VALIDATION_ERROR
            };
        }

        const createdUser = await this.userRepository.create(user.toJSON());
        
        return {
            message: MESSAGES.USER.CREATED,
            user: createdUser.toJSON()
        };
    }

    async updateUser(id, userData) {
        const existingUser = await this.userRepository.findById(id);
        
        if (!existingUser) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: MESSAGES.USER.NOT_FOUND
            };
        }

        if (userData.email && userData.email !== existingUser.email) {
            const emailUser = await this.userRepository.findByEmail(userData.email);
            if (emailUser) {
                throw {
                    status: HTTP_STATUS.CONFLICT,
                    message: MESSAGES.USER.EMAIL_EXISTS
                };
            }
        }

        const updatedUser = await this.userRepository.update(id, userData);
        
        return {
            message: MESSAGES.USER.UPDATED,
            user: updatedUser.toJSON()
        };
    }

    async deleteUser(id) {
        const deletedUser = await this.userRepository.delete(id);
        
        if (!deletedUser) {
            throw {
                status: HTTP_STATUS.NOT_FOUND,
                message: MESSAGES.USER.NOT_FOUND
            };
        }

        return {
            message: MESSAGES.USER.DELETED,
            user: deletedUser.toJSON()
        };
    }
}

module.exports = UserService;