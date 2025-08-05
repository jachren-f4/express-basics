const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authValidators = require('../validators/authValidators');
const handleValidationErrors = require('../middleware/validationHandler');
const { authenticate } = require('../middleware/auth');
const { 
    authenticationLimiter, 
    registrationLimiter, 
    passwordResetLimiter 
} = require('../middleware/rateLimiter');

const authController = new AuthController();

// Public routes with rate limiting for security
router.post('/register',
    registrationLimiter,
    authValidators.register,
    handleValidationErrors,
    authController.register
);

router.post('/login',
    authenticationLimiter,
    authValidators.login,
    handleValidationErrors,
    authController.login
);

// Protected routes (require authentication)
router.get('/profile',
    authenticate,
    authController.getProfile
);

router.put('/profile',
    authenticate,
    authValidators.updateProfile,
    handleValidationErrors,
    authController.updateProfile
);

router.post('/change-password',
    authenticate,
    passwordResetLimiter,
    authValidators.changePassword,
    handleValidationErrors,
    authController.changePassword
);

router.delete('/account',
    authenticate,
    authController.deleteAccount
);

router.post('/logout',
    authenticate,
    authController.logout
);

router.post('/refresh-token',
    authenticate,
    authController.refreshToken
);

module.exports = router;