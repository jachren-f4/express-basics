const UserService = require('../services/UserService');
const ResponseFormatter = require('../utils/responseFormatter');
const HTTP_STATUS = require('../constants/httpStatus');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req, res, next) => {
        try {
            const result = await this.userService.getAllUsers();
            ResponseFormatter.success(res, result);
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req, res, next) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            ResponseFormatter.success(res, user);
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            next(error);
        }
    };

    createUser = async (req, res, next) => {
        try {
            const result = await this.userService.createUser(req.body);
            ResponseFormatter.created(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.CONFLICT) {
                return ResponseFormatter.conflict(res, error.message);
            }
            if (error.status === HTTP_STATUS.BAD_REQUEST) {
                return ResponseFormatter.badRequest(res, error.message);
            }
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const result = await this.userService.updateUser(req.params.id, req.body);
            ResponseFormatter.success(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            if (error.status === HTTP_STATUS.CONFLICT) {
                return ResponseFormatter.conflict(res, error.message);
            }
            next(error);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const result = await this.userService.deleteUser(req.params.id);
            ResponseFormatter.success(res, result);
        } catch (error) {
            if (error.status === HTTP_STATUS.NOT_FOUND) {
                return ResponseFormatter.notFound(res, error.message);
            }
            next(error);
        }
    };
}

module.exports = UserController;