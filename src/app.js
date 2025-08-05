const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configuration
const { config, validateConfig } = require('./config');

// Import routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Validate configuration
validateConfig();

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
    const ResponseFormatter = require('./utils/responseFormatter');
    const MESSAGES = require('./constants/messages');
    const HTTP_STATUS = require('./constants/httpStatus');
    
    ResponseFormatter.error(res, `${MESSAGES.SERVER.NOT_FOUND}: Cannot ${req.method} ${req.url}`, HTTP_STATUS.NOT_FOUND);
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
    console.log(`🚀 Server is running on http://localhost:${config.port}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🔧 API: ${config.api.name} v${config.api.version}`);
});

module.exports = app;