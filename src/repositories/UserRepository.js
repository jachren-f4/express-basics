const User = require('../models/User');

class UserRepository {
    constructor() {
        this.users = [
            { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
        ];
        this.nextId = 3;
    }

    async findAll() {
        return this.users.map(userData => User.fromData(userData));
    }

    async findById(id) {
        const userData = this.users.find(u => u.id === parseInt(id));
        return userData ? User.fromData(userData) : null;
    }

    async findByEmail(email) {
        const userData = this.users.find(u => u.email === email.toLowerCase());
        return userData ? User.fromData(userData) : null;
    }

    async create(userData) {
        const newUser = {
            id: this.nextId++,
            name: userData.name,
            email: userData.email,
            age: userData.age
        };
        
        this.users.push(newUser);
        return User.fromData(newUser);
    }

    async update(id, userData) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        
        if (userIndex === -1) {
            return null;
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...userData
        };

        return User.fromData(this.users[userIndex]);
    }

    async delete(id) {
        const userIndex = this.users.findIndex(u => u.id === parseInt(id));
        
        if (userIndex === -1) {
            return null;
        }

        const deletedUser = this.users.splice(userIndex, 1)[0];
        return User.fromData(deletedUser);
    }

    async count() {
        return this.users.length;
    }
}

module.exports = UserRepository;