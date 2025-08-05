class User {
    constructor({ id, name, email, age }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }

    static create(userData) {
        return new User({
            id: userData.id,
            name: userData.name?.trim(),
            email: userData.email?.toLowerCase().trim(),
            age: userData.age ? parseInt(userData.age) : null
        });
    }

    static fromData(data) {
        return new User(data);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            age: this.age
        };
    }

    isValid() {
        return this.name && this.email && this.email.includes('@');
    }
}

module.exports = User;