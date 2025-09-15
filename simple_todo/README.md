# Simple Medicine Logger

A straightforward medication tracking app that helps users log what they take, set reminders, and view their history. Built with Node.js backend and React frontend with offline-first architecture.

## 🎯 Project Goals

- **Simple, reliable medication tracking** - Focus on core functionality first
- **Offline-first architecture** - Works without internet connection, syncs when available
- **Non-clinical interface** - Professional but approachable design
- **Prove MVP concept** before adding advanced features (AI, photo recognition)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd simple_todo
npm run install:all
```

2. **Set up environment variables:**
```bash
cd server
cp .env.example .env
# Edit .env with your preferred settings
```

3. **Start the application:**
```bash
# From root directory - starts both server and client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 📱 Features (MVP)

### ✅ Core Features
- **Manual Medication Entry** - Quick form to log medication name, dosage, and time
- **Medication History** - Simple list showing past entries with search
- **Basic Dashboard** - Overview showing stats and recent activity
- **Local Data Storage** - SQLite database with offline capability
- **Responsive Design** - Works on desktop and mobile

### 🔮 Future Features (Post-MVP)
- Photo recognition of pills/labels
- AI-powered medication explanations
- Smart reminders based on user patterns
- Doctor integration and sharing
- Advanced analytics and reporting

## 🏗️ Architecture

### Backend (Node.js + Express)
```
server/
├── index.js           # Express server setup
├── routes/            # API endpoints
│   ├── medications.js # Medication CRUD and logging
│   └── users.js       # User stats and profile
├── db/                # Database layer
│   └── database.js    # SQLite setup and helpers
└── middleware/        # Custom middleware (future)
```

### Frontend (React)
```
client/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── services/      # API communication layer
│   └── utils/         # Helper functions
└── public/            # Static assets
```

### Database Schema
- **medications** - User's medication list
- **medication_logs** - Individual dose tracking
- **users** - Basic user info (simplified for MVP)
- **reminders** - Notification settings (future)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both server and client in development mode
npm run server:dev       # Start only the server with nodemon
npm run client:dev       # Start only the React client

# Production
npm run build           # Build React client for production
npm start              # Start production server

# Setup
npm run install:all    # Install all dependencies (root, server, client)
```

### API Endpoints

#### Medications
- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create new medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication
- `POST /api/medications/:id/log` - Log a medication dose

#### History & Stats
- `GET /api/medications/logs` - Get medication history
- `GET /api/users/stats` - Get user statistics
- `GET /api/health` - Health check endpoint

## 📊 Success Metrics

### MVP Success Criteria
- Users consistently log medications for 30+ consecutive days
- App is more reliable than previous tracking methods
- Sub-30 second average log entry time

### Target Metrics
- **User Adoption**: 1,000+ active users within 6 months
- **User Retention**: 60%+ monthly active user retention
- **Usage Consistency**: Average of 5+ medication logs per user per week
- **User Satisfaction**: 4.0+ star rating with positive feedback

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (local), PostgreSQL (future cloud sync)
- **Security**: Helmet, CORS, Rate limiting
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Routing**: React Router
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Build Tool**: Create React App

### Development Tools
- **Process Manager**: concurrently
- **Server Development**: nodemon
- **Version Control**: Git

## 📝 Contributing

This is currently an MVP in development. Key areas for contribution:

1. **Core functionality** - Improve existing features
2. **User experience** - Enhance UI/UX design
3. **Testing** - Add unit and integration tests
4. **Documentation** - Improve setup and usage docs
5. **Performance** - Optimize load times and responsiveness

## 🎨 Design Philosophy

Based on extensive brainstorming (see `docs/brainstorming-session-results.md`):

- **Simplicity First** - Avoid feature bloat, focus on core needs
- **Offline Reliability** - Must work without internet connection
- **Human-Centered** - Professional but caring communication style
- **Privacy Focused** - User data stays under user control
- **Progressive Enhancement** - Start simple, build toward AI companion vision

## 📋 Roadmap

### Phase 1: MVP (Current)
- ✅ Basic medication tracking
- ✅ Simple history view
- ✅ Offline-first architecture
- ✅ Responsive design

### Phase 2: Enhanced UX
- 📋 Photo recognition for medication entry
- 📋 Smart reminder system
- 📋 Basic progress visualization
- 📋 Export functionality

### Phase 3: AI Companion
- 📋 Personalized medication explanations
- 📋 Predictive adherence support
- 📋 Caring communication style
- 📋 Educational content integration

## 🤝 Support

For questions, issues, or suggestions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Reference the Project Brief (`docs/brief.md`) for context

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ following the Project Brief created through comprehensive brainstorming analysis.