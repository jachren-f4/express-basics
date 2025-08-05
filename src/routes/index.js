const express = require('express');
const router = express.Router();
const { config } = require('../config');
const ResponseFormatter = require('../utils/responseFormatter');
const MESSAGES = require('../constants/messages');

// Home route
router.get('/', (req, res) => {
    const data = {
        message: MESSAGES.SERVER.WELCOME,
        version: config.api.version,
        name: config.api.name,
        endpoints: {
            home: 'GET /',
            health: 'GET /health',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile',
                updateProfile: 'PUT /api/auth/profile',
                changePassword: 'POST /api/auth/change-password',
                logout: 'POST /api/auth/logout',
                refreshToken: 'POST /api/auth/refresh-token',
                deleteAccount: 'DELETE /api/auth/account'
            },
            users: {
                list: 'GET /api/users (requires auth)',
                get: 'GET /api/users/:id (requires auth)',
                create: 'POST /api/users (requires admin)',
                update: 'PUT /api/users/:id (requires auth)',
                delete: 'DELETE /api/users/:id (requires auth)'
            }
        }
    };
    
    ResponseFormatter.success(res, data);
});

// Health check route
router.get('/health', (req, res) => {
    const data = {
        status: MESSAGES.SERVER.HEALTH_OK,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv
    };
    
    ResponseFormatter.success(res, data);
});

module.exports = router;