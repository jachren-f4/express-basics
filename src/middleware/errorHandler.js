// Central error handling middleware
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    // Default error values
    let status = err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
    } else if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    } else if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    } else if (err.code === 'ECONNREFUSED') {
        status = 503;
        message = 'Service unavailable';
    }

    // Send error response
    res.status(status).json({
        error: {
            message: message,
            status: status,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err
            })
        },
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

module.exports = errorHandler;