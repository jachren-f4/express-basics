# Express Basics - Week 1 Project

A simple Node.js Express web application demonstrating fundamental concepts including routing, middleware, error handling, and REST API design.

## Features

- ✅ Basic Express server setup
- ✅ RESTful API endpoints (CRUD operations)
- ✅ Input validation using express-validator
- ✅ Centralized error handling
- ✅ Security middleware (helmet, cors)
- ✅ Request logging with morgan
- ✅ Environment configuration
- ✅ Well-organized project structure
- ✅ Interactive HTML frontend with modern UI
- ✅ Real-time API interaction from browser

## Project Structure

```
express-basics/
├── src/
│   ├── app.js              # Main application file
│   ├── routes/
│   │   ├── index.js        # Home and health routes
│   │   └── users.js        # User CRUD operations
│   ├── middleware/
│   │   └── errorHandler.js # Central error handling
│   └── config/
├── public/                 # Frontend static files
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styling
│   └── app.js             # Frontend JavaScript
├── tests/                  # Test files (to be added)
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## File Breakdown

### **Core Application Files**

#### **1. `package.json`**
**Purpose:** Project configuration and dependency management
- Lists all npm packages your app needs
- Defines scripts (`npm run dev`, `npm start`, `npm test`)
- Contains project metadata (name, version, author)
- Think of it as your project's "recipe card"

#### **2. `src/app.js`**
**Purpose:** Main application entry point - the "brain" of your application
- Creates and configures the Express server
- Sets up all middleware in the correct order:
  - `helmet` - Security headers
  - `cors` - Cross-origin requests
  - `morgan` - Request logging
  - `express.json()` - Parse JSON bodies
- Connects route files to URL paths
- Handles 404 errors for undefined routes
- Attaches error handling middleware (must be last)
- Starts the server listening on specified port

#### **3. `src/routes/index.js`**
**Purpose:** Home and general routes
- **`GET /`** - Returns API information and lists all available endpoints
- **`GET /health`** - Health check endpoint (useful for monitoring/uptime checks)
- Serves as the "welcome page" and documentation for your API
- Helps developers understand what endpoints are available

#### **4. `src/routes/users.js`**
**Purpose:** User management API endpoints (full CRUD operations)
- **`GET /api/users`** - List all users with count
- **`GET /api/users/:id`** - Get specific user by ID
- **`POST /api/users`** - Create new user with validation
- **`PUT /api/users/:id`** - Update existing user
- **`DELETE /api/users/:id`** - Delete user
- Includes input validation using express-validator
- Uses in-memory array as temporary "database"
- Demonstrates RESTful API best practices

#### **5. `src/middleware/errorHandler.js`**
**Purpose:** Centralized error handling for the entire application
- Catches ALL errors that occur anywhere in the app
- Logs detailed error information for debugging
- Sends user-friendly error responses
- Handles different error types:
  - Validation errors (400)
  - Not found errors (404)
  - Server errors (500)
- Shows stack traces only in development mode
- Prevents sensitive error details from leaking in production

### **Configuration Files**

#### **6. `.env.example`**
**Purpose:** Environment configuration template
- Shows developers what environment variables are needed
- Provides example/default values
- Users copy this to `.env` and add real values
- Keeps sensitive data (API keys, passwords) out of code
- Never committed to version control

#### **7. `.gitignore`**
**Purpose:** Tells Git what files NOT to track
- Excludes `node_modules/` (too large, can be regenerated)
- Excludes `.env` (contains secrets)
- Excludes logs, temporary files, IDE settings
- Keeps repository clean and secure
- Prevents accidental commits of sensitive data

#### **8. `package-lock.json`** (generated)
**Purpose:** Locks exact dependency versions
- Created automatically by npm
- Ensures everyone gets exact same package versions
- Prevents "works on my machine" issues
- Should be committed to version control

### **How The Files Work Together**

```
Request Flow:
1. User makes request → 
2. app.js receives it →
3. Middleware processes it (helmet, cors, morgan) →
4. Router directs to correct route file →
5. Route handler processes request →
6. Response sent back
   OR
   Error → errorHandler.js → Error response

File Dependencies:
app.js
  ├── imports routes/index.js
  ├── imports routes/users.js
  └── imports middleware/errorHandler.js
```

### **Frontend Files**

#### **9. `public/index.html`**
**Purpose:** Main user interface for the application
- Provides forms for creating and editing users
- Displays all users in a card-based layout
- Shows real-time server health status
- Includes a modal for editing users
- Responsive design for mobile and desktop

#### **10. `public/styles.css`**
**Purpose:** Styling for the frontend interface
- Modern, clean design with gradient header
- Card-based user display
- Smooth animations and transitions
- Responsive grid layout
- Success/error message styling
- Modal dialog styling

#### **11. `public/app.js`**
**Purpose:** Frontend JavaScript for API interactions
- Handles all API calls (GET, POST, PUT, DELETE)
- Updates UI dynamically without page refreshes
- Form validation and submission
- Error handling and user feedback
- Modal management for editing
- XSS protection with HTML escaping

### **Directory Organization Benefits**

- **`src/`** - All source code in one place
- **`routes/`** - All API endpoints grouped together
- **`middleware/`** - Reusable middleware functions
- **`config/`** - Configuration files (ready for expansion)
- **`public/`** - Frontend assets served statically
- **`tests/`** - Test files mirror src structure

This structure follows the **"separation of concerns"** principle where each file has one clear purpose, making the code easier to understand, test, and maintain.

## Installation

1. Navigate to the project directory:
```bash
cd projects/week1/express-basics
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. (Optional) Modify `.env` with your settings

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

### Accessing the Frontend:
Open your browser and navigate to:
```
http://localhost:3000
```

You'll see the interactive user management interface where you can:
- View server health status
- Add new users
- View all users
- Edit existing users
- Delete users
- See real-time feedback for all operations

## API Endpoints

### Home & Health
- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Testing the API

### Using curl:

1. **Get API info:**
```bash
curl http://localhost:3000/
```

2. **Get all users:**
```bash
curl http://localhost:3000/api/users
```

3. **Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson", "email": "alice@example.com", "age": 28}'
```

4. **Update a user:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "age": 31}'
```

5. **Delete a user:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Error Handling Examples:

1. **Invalid ID format:**
```bash
curl http://localhost:3000/api/users/abc
# Returns 400 with validation error
```

2. **Non-existent user:**
```bash
curl http://localhost:3000/api/users/999
# Returns 404 with "User not found"
```

3. **Invalid email:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "invalid-email"}'
# Returns 400 with validation error
```

## Key Learning Points

1. **Express Basics:**
   - Setting up an Express server
   - Middleware chain concept
   - Route handling

2. **REST API Design:**
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Status codes (200, 201, 400, 404, 500)
   - JSON request/response format

3. **Validation:**
   - Input validation using express-validator
   - Custom validation middleware
   - Error response formatting

4. **Error Handling:**
   - Centralized error middleware
   - Different error types handling
   - Development vs production error info

5. **Security:**
   - Helmet for security headers
   - CORS configuration
   - Environment variables for secrets

## Next Steps

- Add database integration (PostgreSQL/MongoDB)
- Implement authentication (JWT)
- Add unit tests with Jest
- Create API documentation (Swagger)
- Add rate limiting
- Implement caching

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **dotenv** - Environment variables
- **express-validator** - Input validation
- **nodemon** (dev) - Auto-reload server

## Troubleshooting

1. **Port already in use:**
   - Change PORT in .env file
   - Or kill the process using the port

2. **Module not found:**
   - Run `npm install` again
   - Check Node.js version (requires >=14.0.0)

3. **Environment variables not loading:**
   - Ensure .env file exists
   - Check file permissions
   - Restart the server