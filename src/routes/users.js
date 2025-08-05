const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userValidators = require('../validators/userValidators');
const handleValidationErrors = require('../middleware/validationHandler');
const { authenticate, requireAdmin, authorizeOwner } = require('../middleware/auth');

const userController = new UserController();

// GET all users - require authentication
router.get('/', 
    authenticate,
    userController.getAllUsers
);

// GET user by ID - require authentication and user can only access their own data
router.get('/:id', 
    authenticate,
    userValidators.getUserById,
    handleValidationErrors,
    authorizeOwner(),
    userController.getUserById
);

// POST create new user - require admin access
router.post('/',
    authenticate,
    requireAdmin,
    userValidators.createUser,
    handleValidationErrors,
    userController.createUser
);

// PUT update user - require authentication and user can only update their own data
router.put('/:id',
    authenticate,
    userValidators.updateUser,
    handleValidationErrors,
    authorizeOwner(),
    userController.updateUser
);

// DELETE user - require authentication and user can only delete their own data
router.delete('/:id',
    authenticate,
    userValidators.deleteUser,
    handleValidationErrors,
    authorizeOwner(),
    userController.deleteUser
);

// GET user profile - authenticated user's own profile
router.get('/profile/me',
    authenticate,
    userController.getUserProfile
);

// PUT update user profile - authenticated user's own profile
router.put('/profile/me',
    authenticate,
    userValidators.updateProfile,
    handleValidationErrors,
    userController.updateUserProfile
);

module.exports = router;