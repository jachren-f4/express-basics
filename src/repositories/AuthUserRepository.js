const AuthUser = require('../models/AuthUser');

class AuthUserRepository {
    constructor() {
        // In-memory storage - replace with database in production
        this.users = [];
        this.nextId = 1;
    }

    async findAll() {
        return this.users.map(userData => AuthUser.fromData(userData));
    }

    async findById(id) {
        const userData = this.users.find(u => u.id === parseInt(id));
        return userData ? AuthUser.fromData(userData) : null;
    }

    async findByEmail(email) {
        const userData = this.users.find(u => u.email === email.toLowerCase());
        return userData ? AuthUser.fromData(userData) : null;
    }

    async create(userData) {
        const newUser = {
            id: this.nextId++,
            name: userData.name,
            email: userData.email,
            age: userData.age,
            hashedPassword: userData.hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.users.push(newUser);
        return AuthUser.fromData(newUser);
    }

    async update(id, userData) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        
        if (userIndex === -1) {
            return null;
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...userData,
            updatedAt: new Date()
        };

        return AuthUser.fromData(this.users[userIndex]);
    }

    async updatePassword(id, hashedPassword) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        
        if (userIndex === -1) {
            return null;
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            hashedPassword,
            updatedAt: new Date()
        };

        return AuthUser.fromData(this.users[userIndex]);
    }

    async delete(id) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        
        if (userIndex === -1) {
            return null;
        }

        const deletedUser = this.users.splice(userIndex, 1)[0];
        return AuthUser.fromData(deletedUser);
    }

    async count() {
        return this.users.length;
    }

    async emailExists(email, excludeId = null) {
        return this.users.some(u => 
            u.email === email.toLowerCase() && 
            (excludeId === null || u.id !== parseInt(excludeId))
        );
    }
}

module.exports = AuthUserRepository;