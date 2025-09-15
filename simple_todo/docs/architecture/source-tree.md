# Source Tree Structure - Simple Medicine Logger

## Project Overview

Simple Medicine Logger follows a **monorepo structure** with separate client and server applications, organized for clear separation of concerns while maintaining a unified development workflow.

## Root Directory Structure

```
simple_todo/
├── .bmad-core/              # BMAD agent system files
│   ├── core-config.yaml    # Core configuration
│   └── [agent files...]    # Agent definitions and tasks
├── .claude/                 # Claude Code configuration
├── client/                  # React frontend application
├── server/                  # Node.js/Express backend API
├── docs/                    # Project documentation
│   ├── architecture/        # Architecture documentation
│   ├── prd/                # Product requirements (sharded)
│   └── stories/            # Development stories
├── public/                  # Static assets (root level)
├── node_modules/           # Root dependencies
├── package.json            # Root package configuration
├── package-lock.json       # Root dependency lock
└── README.md              # Project documentation
```

## Client Directory (`/client`)

### Structure
```
client/
├── public/                 # Static assets
│   ├── index.html         # Main HTML template
│   ├── manifest.json      # PWA manifest (future)
│   └── favicon.ico        # App icon
├── src/                   # Source code
│   ├── components/        # Reusable React components
│   │   ├── Charts/        # Chart components
│   │   ├── Navigation.js  # Main navigation component
│   │   └── PhotoCapture/  # Camera/OCR components
│   ├── pages/            # Page components (routes)
│   │   ├── Dashboard.js      # Main dashboard page
│   │   ├── MedicationList.js # Medication listing page
│   │   ├── AddMedication.js  # Add medication form
│   │   ├── MedicationHistory.js # History view
│   │   └── Progress.js       # Progress tracking page
│   ├── services/         # API and utility services
│   │   └── api.js        # API communication service
│   ├── utils/            # Utility functions
│   ├── App.js            # Main App component
│   ├── index.js          # React DOM entry point
│   └── index.css         # Global styles
├── node_modules/         # Client dependencies
├── package.json          # Client package configuration
└── package-lock.json     # Client dependency lock
```

### Key Directories Explained

#### `/client/src/components`
**Purpose**: Reusable UI components that can be used across multiple pages

- **Charts/**: Data visualization components using Chart.js
- **Navigation.js**: Main navigation bar with offline status indicator
- **PhotoCapture/**: Camera integration and OCR functionality for medication labels

#### `/client/src/pages`
**Purpose**: Page-level components that represent different routes in the application

- **Dashboard.js**: Main landing page with overview and quick actions
- **MedicationList.js**: Display all medications with filtering/sorting
- **AddMedication.js**: Form for adding new medications with photo capture
- **MedicationHistory.js**: Historical view of medication intake
- **Progress.js**: Analytics and progress tracking with charts

#### `/client/src/services`
**Purpose**: Business logic and external service integration

- **api.js**: Centralized API communication with error handling and offline support

#### `/client/src/utils`
**Purpose**: Pure utility functions and helpers

- Date formatting utilities
- Local storage helpers
- Data transformation functions

## Server Directory (`/server`)

### Structure
```
server/
├── db/                    # Database files and migrations
│   └── [sqlite files]     # SQLite database files
├── middleware/            # Express middleware (currently empty)
├── models/               # Database models and queries
│   ├── medications.js    # Medication data model
│   └── users.js          # User data model
├── routes/               # API route handlers
│   ├── medications.js    # Medication API endpoints
│   └── users.js          # User API endpoints
├── node_modules/         # Server dependencies
├── package.json          # Server package configuration
├── package-lock.json     # Server dependency lock
├── index.js              # Express server entry point
└── .env.example          # Environment variables template
```

### Key Directories Explained

#### `/server/models`
**Purpose**: Database interaction layer with SQLite

- **medications.js**: CRUD operations for medication data
- **users.js**: User management and authentication logic
- **Pattern**: Direct SQL queries with prepared statements (no ORM)

#### `/server/routes`
**Purpose**: Express route handlers implementing REST API endpoints

- **medications.js**: `/api/medications` endpoints
- **users.js**: `/api/users` endpoints  
- **Pattern**: Router modules with middleware integration

#### `/server/middleware`
**Purpose**: Custom Express middleware (currently minimal)

- Authentication middleware (future)
- Validation middleware (future)  
- Custom error handling middleware

#### `/server/db`
**Purpose**: Database files and future migration scripts

- SQLite database files
- Database backup location
- Migration scripts (future implementation)

## Documentation Directory (`/docs`)

### Structure
```
docs/
├── architecture/          # Architecture documentation
│   ├── coding-standards.md   # Development standards
│   ├── tech-stack.md        # Technology documentation
│   └── source-tree.md       # This file
├── prd/                   # Product Requirements (sharded)
│   └── [prd sections...]   # Individual requirement sections
└── stories/               # Development stories
    └── [story files...]    # Individual development stories
```

## File Naming Conventions

### JavaScript/React Files
- **Components**: PascalCase (e.g., `MedicationCard.js`, `Navigation.js`)
- **Pages**: PascalCase (e.g., `Dashboard.js`, `AddMedication.js`)
- **Services**: camelCase (e.g., `api.js`, `medicationService.js`)
- **Utilities**: camelCase (e.g., `dateHelpers.js`, `validators.js`)

### Backend Files
- **Routes**: camelCase (e.g., `medications.js`, `users.js`)
- **Models**: camelCase (e.g., `medications.js`, `users.js`)
- **Entry point**: `index.js` (standard)

### Documentation
- **Markdown files**: kebab-case (e.g., `coding-standards.md`, `source-tree.md`)
- **Configuration**: camelCase or standard names (e.g., `package.json`, `core-config.yaml`)

## Configuration Files

### Root Level
- **package.json**: Root package configuration for monorepo management
- **README.md**: Project overview and setup instructions

### Client Configuration
- **package.json**: React app dependencies and scripts
- **public/manifest.json**: PWA configuration (future)

### Server Configuration  
- **.env.example**: Environment variable template
- **package.json**: Express server dependencies and scripts

### Development Tools
- **.bmad-core/**: BMAD agent system configuration
- **.claude/**: Claude Code IDE configuration

## Import/Export Patterns

### Client Side
```javascript
// Component imports (absolute from src/)
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import { healthCheck } from './services/api';

// External library imports
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
```

### Server Side
```javascript
// Node.js requires
const express = require('express');
const cors = require('cors');

// Local module requires (relative paths)
const medicationRoutes = require('./routes/medications');
const userRoutes = require('./routes/users');
```

## Build Output Structure

### Development
- **Client**: Served from memory by webpack-dev-server on port 3000
- **Server**: Running directly from source on port 3001
- **Proxy**: Client proxies API calls to server automatically

### Production Build
```
client/build/              # React production build
├── static/               # Optimized static assets
│   ├── css/             # Minified CSS
│   ├── js/              # Minified JavaScript bundles
│   └── media/           # Optimized images
├── index.html           # Production HTML
└── manifest.json        # PWA manifest
```

## Data Flow Architecture

```
User Interface (React Components)
         ↓
    Services Layer (api.js)  
         ↓
    REST API (Express Routes)
         ↓
    Business Logic (Models)
         ↓  
    Database Layer (SQLite)
```

## Future Structure Considerations

### Potential Additions
```
server/
├── services/             # Business logic services
├── utils/               # Server-side utilities  
├── config/              # Configuration management
├── tests/               # Server-side tests
└── migrations/          # Database migrations

client/
├── hooks/               # Custom React hooks
├── contexts/            # React Context providers
├── tests/               # Client-side tests
└── assets/              # Static assets (images, fonts)

root/
├── scripts/             # Build and deployment scripts
├── docker/              # Docker configuration
└── .github/             # GitHub Actions workflows
```

### Scaling Considerations
- **Microservices**: Could split server into multiple services
- **Shared Libraries**: Common utilities between client/server
- **Build Optimization**: Webpack configuration customization
- **Testing Structure**: Comprehensive test organization
- **CI/CD**: Automated testing and deployment pipelines

## Development Workflow Integration

### File Organization Principles
1. **Separation of Concerns**: Clear boundaries between client/server
2. **Feature Organization**: Group related functionality together
3. **Reusability**: Components and services designed for reuse
4. **Maintainability**: Clear file structure for easy navigation
5. **Scalability**: Structure supports future growth

### Key Integration Points
- **API Communication**: `/client/src/services/api.js` ↔ `/server/routes/`
- **Data Models**: Client components ↔ Server models via API
- **Configuration**: Environment variables shared between client/server
- **Development Scripts**: Root package.json orchestrates both sides

---

*This source tree structure supports the offline-first architecture while maintaining clear separation between frontend and backend concerns.*