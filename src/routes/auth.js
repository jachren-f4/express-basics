const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authValidators = require('../validators/authValidators');
const handleValidationErrors = require('../middleware/validationHandler');
const { authenticate } = require('../middleware/auth');
const { 
    loginLimiter, 
    registerLimiter, 
    passwordResetLimiter, 
    emailVerificationLimiter 
} = require('../middleware/rateLimiter');

const authController = new AuthController();

// Public routes
router.post('/register',
    registerLimiter,
    authValidators.register,
    handleValidationErrors,
    authController.register
);

router.post('/login',
    loginLimiter,
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

// Email verification routes
router.post('/verify-email',
    emailVerificationLimiter,
    authValidators.verifyEmail,
    handleValidationErrors,
    authController.verifyEmail
);

router.post('/resend-verification',
    emailVerificationLimiter,
    authValidators.resendVerification,
    handleValidationErrors,
    authController.resendVerification
);

// Password reset routes
router.post('/forgot-password',
    passwordResetLimiter,
    authValidators.forgotPassword,
    handleValidationErrors,
    authController.forgotPassword
);

router.post('/reset-password',
    passwordResetLimiter,
    authValidators.resetPassword,
    handleValidationErrors,
    authController.resetPassword
);

module.exports = router;