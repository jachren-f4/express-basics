const AUTH_CONSTANTS = {
    JWT: {
        EXPIRES_IN: '24h',
        ALGORITHM: 'HS256'
    },
    BCRYPT: {
        SALT_ROUNDS: 12
    },
    PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 128
    },
    TOKEN: {
        HEADER_NAME: 'authorization',
        PREFIX: 'Bearer '
    }
};

const AUTH_MESSAGES = {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists with this email',
    UNAUTHORIZED: 'Access denied. No token provided',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    ACCESS_DENIED: 'Access denied. Insufficient permissions',
    PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} characters long`,
    PASSWORD_TOO_LONG: `Password must be no more than ${AUTH_CONSTANTS.PASSWORD.MAX_LENGTH} characters long`
};

module.exports = { AUTH_CONSTANTS, AUTH_MESSAGES };