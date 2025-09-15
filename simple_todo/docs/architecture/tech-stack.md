# Tech Stack - Simple Medicine Logger

## Overview

Simple Medicine Logger is a full-stack JavaScript application built with modern web technologies and an offline-first architecture. This document details all technologies, their versions, purposes, and configuration within the project.

## Architecture Pattern

**Full-Stack JavaScript Monorepo**
- **Pattern**: Client-Server separation with shared development workflow
- **Communication**: REST API between React frontend and Express backend
- **Data Flow**: Client ↔ REST API ↔ SQLite Database
- **Deployment**: Separate client and server deployments with proxy configuration

## Frontend Stack

### Core Framework
- **React** `^18.2.0`
  - **Purpose**: UI framework for building component-based user interface
  - **Key Features**: Hooks, Context API, Functional Components
  - **Location**: `/client` directory

### UI Libraries & Components
- **React Router DOM** `^6.15.0`
  - **Purpose**: Client-side routing and navigation
  - **Implementation**: BrowserRouter with Routes/Route components
  - **Features**: Nested routing, programmatic navigation

- **Chart.js** `^4.5.0` + **React Chart.js 2** `^5.3.0`
  - **Purpose**: Data visualization for medication tracking and progress charts
  - **Usage**: Progress tracking, medication adherence analytics

### Utilities & Services
- **Axios** `^1.5.0`
  - **Purpose**: HTTP client for API communication
  - **Features**: Request/response interceptors, error handling

- **date-fns** `^2.30.0`
  - **Purpose**: Date manipulation and formatting
  - **Usage**: Medication scheduling, timestamp formatting

### Specialized Features
- **React Webcam** `^7.2.0`
  - **Purpose**: Camera integration for medication photo capture
  - **Feature**: OCR-enabled medication label reading

- **Tesseract.js** `^6.0.1`
  - **Purpose**: Optical Character Recognition (OCR)
  - **Usage**: Extract text from medication labels and bottles

### Development Tools
- **React Scripts** `5.0.1`
  - **Purpose**: Build toolchain (Webpack, Babel, ESLint)
  - **Scripts**: `start`, `build`, `test`, `eject`
  - **Features**: Hot reloading, production optimization

### Build Configuration
```json
{
  "proxy": "http://localhost:3001",
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

## Backend Stack

### Runtime & Framework
- **Node.js** (runtime environment)
  - **Express.js** `^4.18.2`
  - **Purpose**: Web application framework for REST API
  - **Features**: Middleware support, routing, HTTP utilities

### Security & Middleware
- **Helmet** `^7.0.0`
  - **Purpose**: Security headers and protection against common vulnerabilities
  - **Features**: XSS protection, CSRF protection, HSTS

- **CORS** `^2.8.5`
  - **Purpose**: Cross-Origin Resource Sharing configuration
  - **Configuration**: Restricted to client URL with credentials support

- **Express Rate Limit** `^6.8.1`
  - **Purpose**: Rate limiting middleware
  - **Configuration**: 100 requests per 15-minute window per IP

### Authentication & Encryption
- **bcryptjs** `^2.4.3`
  - **Purpose**: Password hashing and salt generation
  - **Usage**: User password security

- **jsonwebtoken** `^9.0.2`
  - **Purpose**: JWT token generation and verification
  - **Usage**: User session management

### Database
- **SQLite3** `^5.1.6`
  - **Purpose**: Embedded SQL database
  - **Advantages**: Zero-configuration, file-based, perfect for offline-first
  - **Location**: `/server/db` directory

### Configuration & Environment
- **dotenv** `^16.3.1`
  - **Purpose**: Environment variable management
  - **Files**: `.env` (local), `.env.example` (template)

### Development Tools
- **Nodemon** `^3.0.1`
  - **Purpose**: Development server with auto-restart
  - **Usage**: `npm run dev` script

## Root Project Configuration

### Package Manager
- **npm** (primary package manager)
- **Concurrently** `^8.2.2`
  - **Purpose**: Run multiple npm scripts simultaneously
  - **Usage**: Start both client and server in development

### Scripts
```json
{
  "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
  "build": "npm run client:build",
  "start": "cd server && npm start",
  "install:all": "npm install && cd server && npm install && cd ../client && npm install"
}
```

## Database Schema

### Current Tables
Based on the existing models:

**Users Table**
- Authentication and user profile data
- Location: `/server/models/users.js`

**Medications Table**  
- Medication information and tracking data
- Location: `/server/models/medications.js`

### Database Features
- **File-based storage**: SQLite database files
- **Offline capabilities**: Local database for offline-first architecture
- **No ORM**: Direct SQL queries with prepared statements

## API Architecture

### REST API Design
- **Base URL**: `http://localhost:3001/api`
- **Endpoints**:
  - `/api/health` - Health check
  - `/api/medications` - Medication CRUD operations
  - `/api/users` - User management

### Middleware Stack
1. Helmet (security headers)
2. CORS (cross-origin requests)  
3. Rate limiting (100 req/15min)
4. JSON parser (10mb limit)
5. URL-encoded parser
6. Custom error handling

## Development Workflow

### Local Development
1. **Install Dependencies**: `npm run install:all`
2. **Start Development**: `npm run dev`
   - Client: `http://localhost:3000`
   - Server: `http://localhost:3001`
   - Proxy: Client proxies API calls to server

### Environment Configuration
```bash
# Server (.env)
PORT=3001
CLIENT_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

### Build & Deployment
- **Client Build**: `npm run client:build` (creates `client/build/`)
- **Server Start**: `npm start` (production server)

## Offline-First Architecture

### Strategy
- **Local Storage**: Browser localStorage for user data
- **Network Detection**: Online/offline status monitoring
- **Graceful Degradation**: App functions without server connection
- **Sync Pattern**: Queue operations for when connectivity returns

### Implementation
```javascript
// Network status detection
const [isOnline, setIsOnline] = useState(navigator.onLine);
const [apiStatus, setApiStatus] = useState('checking');

// API health monitoring
const checkAPIHealth = async () => {
  try {
    await healthCheck();
    setApiStatus('online');
  } catch (error) {
    setApiStatus('offline');
  }
};
```

## Performance Considerations

### Frontend Optimizations
- React production builds with minification
- Code splitting with React Router
- Chart.js for efficient data visualization
- Image optimization for camera captures

### Backend Optimizations
- Express.js middleware optimization
- SQLite prepared statements
- Rate limiting to prevent abuse
- JSON payload size limits (10mb)

## Security Features

### Authentication
- JWT-based authentication
- bcrypt password hashing
- Secure token storage patterns

### API Security
- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input validation (to be enhanced)
- SQL injection prevention with prepared statements

## Mobile & PWA Considerations

### Current Mobile Features
- Responsive CSS design
- Camera integration via React Webcam
- Offline functionality
- Touch-friendly UI

### Future PWA Capabilities
- Service workers (not yet implemented)
- App manifest (not yet implemented)  
- Push notifications (not yet implemented)
- Background sync (not yet implemented)

## Development Dependencies

### Linting & Code Quality
- ESLint (via React Scripts)
- React App ESLint configuration
- Jest testing framework (via React Scripts)

## Deployment Architecture

### Current Setup
- **Development**: Concurrent client/server on different ports
- **Production**: Separate client and server deployments
- **Database**: File-based SQLite (portable)

### Environment Separation
- **Development**: Local SQLite, verbose logging
- **Production**: Production SQLite, minimal logging
- **Configuration**: Environment variables via dotenv

## Technology Decisions & Rationale

### Why SQLite?
- **Offline-first requirement**: No external database dependencies
- **Simplicity**: Zero-configuration embedded database
- **Portability**: Single file database, easy backup/restore
- **Performance**: Fast for read-heavy medication tracking

### Why React?
- **Component reusability**: Medication cards, forms, charts
- **Ecosystem**: Rich ecosystem for charts, camera, OCR
- **Developer experience**: Hot reloading, debugging tools
- **Community**: Large community and extensive documentation

### Why Express?
- **Simplicity**: Minimal, unopinionated framework
- **Middleware ecosystem**: Security, CORS, rate limiting
- **REST API**: Perfect fit for JSON API development
- **Node.js integration**: Same language for full stack

## Version Compatibility

### Node.js Requirements
- **Minimum**: Node.js 14+ (for React Scripts 5.0.1)
- **Recommended**: Node.js 16+ or 18+

### Browser Support
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile browsers**: iOS Safari 14+, Android Chrome 90+
- **PWA features**: Requires HTTPS for service workers

## Future Technology Considerations

### Potential Enhancements
- **Database**: Consider PostgreSQL for production scaling
- **Authentication**: OAuth integration (Google, Apple Health)
- **Real-time**: WebSocket for real-time medication reminders
- **PWA**: Service workers for true offline experience
- **Testing**: Jest + React Testing Library + Cypress
- **API**: GraphQL for more efficient data fetching
- **Deployment**: Docker containerization
- **Monitoring**: Application performance monitoring (APM)

---

*This document reflects the current state of the technology stack. Update as technologies are added, removed, or upgraded.*