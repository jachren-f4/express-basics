const { body, param } = require('express-validator');
const VALIDATION_LIMITS = require('../constants/validation');
const MESSAGES = require('../constants/messages');

const userValidators = {
    createUser: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage(MESSAGES.VALIDATION.NAME_REQUIRED)
            .isLength({ max: VALIDATION_LIMITS.USER.NAME_MAX_LENGTH })
            .withMessage(`Name must be less than ${VALIDATION_LIMITS.USER.NAME_MAX_LENGTH} characters`),
        
        body('email')
            .isEmail()
            .withMessage(MESSAGES.VALIDATION.EMAIL_INVALID)
            .normalizeEmail()
            .isLength({ max: VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH })
            .withMessage(`Email must be less than ${VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH} characters`),
        
        body('age')
            .optional()
            .isInt({ min: VALIDATION_LIMITS.AGE.MIN, max: VALIDATION_LIMITS.AGE.MAX })
            .withMessage(MESSAGES.VALIDATION.AGE_INVALID)
    ],

    updateUser: [
        param('id')
            .isInt()
            .withMessage(MESSAGES.VALIDATION.ID_INVALID),
        
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage(MESSAGES.VALIDATION.NAME_EMPTY)
            .isLength({ max: VALIDATION_LIMITS.USER.NAME_MAX_LENGTH })
            .withMessage(`Name must be less than ${VALIDATION_LIMITS.USER.NAME_MAX_LENGTH} characters`),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage(MESSAGES.VALIDATION.EMAIL_INVALID)
            .normalizeEmail()
            .isLength({ max: VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH })
            .withMessage(`Email must be less than ${VALIDATION_LIMITS.USER.EMAIL_MAX_LENGTH} characters`),
        
        body('age')
            .optional()
            .isInt({ min: VALIDATION_LIMITS.AGE.MIN, max: VALIDATION_LIMITS.AGE.MAX })
            .withMessage(MESSAGES.VALIDATION.AGE_INVALID)
    ],

    getUserById: [
        param('id')
            .isInt()
            .withMessage(MESSAGES.VALIDATION.ID_INVALID)
    ],

    deleteUser: [
        param('id')
            .isInt()
            .withMessage(MESSAGES.VALIDATION.ID_INVALID)
    ]
};

module.exports = userValidators;