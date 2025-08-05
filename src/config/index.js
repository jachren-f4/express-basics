const dotenv = require('dotenv');

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    api: {
        version: '1.0.0',
        name: 'Express Basics API'
    },

    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },

    validation: {
        maxNameLength: 100,
        maxEmailLength: 255,
        minAge: 0,
        maxAge: 120
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-for-development-only',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
    }
};

const validateConfig = () => {
    const requiredEnvVars = [];
    
    // In production, JWT_SECRET should be required
    if (config.nodeEnv === 'production' && !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required in production environment');
    }
    
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
};

module.exports = { config, validateConfig };