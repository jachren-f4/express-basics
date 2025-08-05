const { body } = require('express-validator');
const VALIDATION_LIMITS = require('../constants/validation');
const { AUTH_CONSTANTS, AUTH_MESSAGES } = require('../constants/auth');

const authValidators = {
    register: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: VALIDATION_LIMITS.USER.NAME_MAX_LENGTH })
            .withMessage(`Name must be between 2 and ${VALIDATION_LIMITS.USER.NAME_MAX_LENGTH} characters`),
        
        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail()
            .isLength({ max: VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH })
            .withMessage(`Email must be less than ${VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH} characters`),
        
        body('password')
            .isLength({ 
                min: AUTH_CONSTANTS.PASSWORD.MIN_LENGTH, 
                max: AUTH_CONSTANTS.PASSWORD.MAX_LENGTH 
            })
            .withMessage(AUTH_MESSAGES.PASSWORD_TOO_SHORT)
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
            .not().contains('password')
            .withMessage('Password cannot contain the word "password"'),
        
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
        
        body('age')
            .optional()
            .isInt({ min: VALIDATION_LIMITS.AGE.MIN, max: VALIDATION_LIMITS.AGE.MAX })
            .withMessage(`Age must be between ${VALIDATION_LIMITS.AGE.MIN} and ${VALIDATION_LIMITS.AGE.MAX}`)
    ],

    login: [
        body('email')
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail(),
        
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 1 })
            .withMessage('Password cannot be empty')
    ],

    updateProfile: [
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Name cannot be empty')
            .isLength({ min: 2, max: VALIDATION_LIMITS.USER.NAME_MAX_LENGTH })
            .withMessage(`Name must be between 2 and ${VALIDATION_LIMITS.USER.NAME_MAX_LENGTH} characters`),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Valid email is required')
            .normalizeEmail()
            .isLength({ max: VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH })
            .withMessage(`Email must be less than ${VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH} characters`),
        
        body('age')
            .optional()
            .isInt({ min: VALIDATION_LIMITS.AGE.MIN, max: VALIDATION_LIMITS.AGE.MAX })
            .withMessage(`Age must be between ${VALIDATION_LIMITS.AGE.MIN} and ${VALIDATION_LIMITS.AGE.MAX}`)
    ],

    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        
        body('newPassword')
            .isLength({ 
                min: AUTH_CONSTANTS.PASSWORD.MIN_LENGTH, 
                max: AUTH_CONSTANTS.PASSWORD.MAX_LENGTH 
            })
            .withMessage(AUTH_MESSAGES.PASSWORD_TOO_SHORT)
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
        
        body('confirmNewPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('New password confirmation does not match new password');
                }
                return true;
            })
    ],

    refreshToken: [
        // No body validation needed - token comes from header
    ]
};

module.exports = authValidators;