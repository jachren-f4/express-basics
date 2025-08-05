const MESSAGES = {
    USER: {
        CREATED: 'User created successfully',
        UPDATED: 'User updated successfully',
        DELETED: 'User deleted successfully',
        NOT_FOUND: 'User not found',
        EMAIL_EXISTS: 'Email already exists',
        VALIDATION_ERROR: 'Validation Error'
    },
    SERVER: {
        HEALTH_OK: 'OK',
        WELCOME: 'Welcome to Express Basics API',
        NOT_FOUND: 'Not Found',
        INTERNAL_ERROR: 'Internal Server Error',
        SERVICE_UNAVAILABLE: 'Service unavailable'
    },
    VALIDATION: {
        NAME_REQUIRED: 'Name is required',
        EMAIL_REQUIRED: 'Valid email is required',
        EMAIL_INVALID: 'Valid email is required',
        AGE_INVALID: 'Age must be between 0 and 120',
        ID_INVALID: 'ID must be an integer',
        NAME_EMPTY: 'Name cannot be empty'
    }
};

module.exports = MESSAGES;