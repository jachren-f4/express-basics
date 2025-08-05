const bcrypt = require('bcryptjs');
const { config } = require('../config');
const { AUTH_CONSTANTS } = require('../constants/auth');

class AuthUser {
    constructor({ id, name, email, age, password, hashedPassword, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.password = password; // Plain text password (temporary, for validation)
        this.hashedPassword = hashedPassword;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    static async create(userData) {
        const user = new AuthUser({
            id: userData.id,
            name: userData.name?.trim(),
            email: userData.email?.toLowerCase().trim(),
            age: userData.age ? parseInt(userData.age) : null,
            password: userData.password
        });

        if (userData.password) {
            user.hashedPassword = await user.hashPassword(userData.password);
            delete user.password; // Remove plain text password
        }

        return user;
    }

    static fromData(data) {
        return new AuthUser({
            ...data,
            password: undefined // Never include plain text password
        });
    }

    async hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, config.bcrypt.saltRounds);
    }

    async comparePassword(plainPassword) {
        if (!this.hashedPassword) {
            return false;
        }
        return await bcrypt.compare(plainPassword, this.hashedPassword);
    }

    isValid() {
        return this.name && 
               this.email && 
               this.email.includes('@') &&
               this.hashedPassword;
    }

    isPasswordValid(password) {
        return password && 
               password.length >= AUTH_CONSTANTS.PASSWORD.MIN_LENGTH &&
               password.length <= AUTH_CONSTANTS.PASSWORD.MAX_LENGTH;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    toAuthJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }

    async updatePassword(newPassword) {
        if (!this.isPasswordValid(newPassword)) {
            throw new Error('Invalid password format');
        }
        this.hashedPassword = await this.hashPassword(newPassword);
        this.updatedAt = new Date();
    }
}

module.exports = AuthUser;