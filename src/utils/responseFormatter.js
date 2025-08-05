const HTTP_STATUS = require('../constants/httpStatus');

class ResponseFormatter {
    static success(res, data, status = HTTP_STATUS.OK) {
        return res.status(status).json({
            success: true,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message, status = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
        const response = {
            success: false,
            error: {
                message,
                status
            },
            timestamp: new Date().toISOString()
        };

        if (details && process.env.NODE_ENV === 'development') {
            response.error.details = details;
        }

        return res.status(status).json(response);
    }

    static created(res, data) {
        return ResponseFormatter.success(res, data, HTTP_STATUS.CREATED);
    }

    static notFound(res, message = 'Resource not found') {
        return ResponseFormatter.error(res, message, HTTP_STATUS.NOT_FOUND);
    }

    static badRequest(res, message = 'Bad request') {
        return ResponseFormatter.error(res, message, HTTP_STATUS.BAD_REQUEST);
    }

    static conflict(res, message = 'Conflict') {
        return ResponseFormatter.error(res, message, HTTP_STATUS.CONFLICT);
    }

    static validationError(res, errors) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: 'Validation failed',
                status: HTTP_STATUS.BAD_REQUEST,
                errors
            },
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ResponseFormatter;