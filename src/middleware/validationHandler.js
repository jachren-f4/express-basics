const { validationResult } = require('express-validator');
const ResponseFormatter = require('../utils/responseFormatter');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseFormatter.validationError(res, errors.array());
    }
    next();
};

module.exports = handleValidationErrors;