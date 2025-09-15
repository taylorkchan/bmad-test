# Coding Standards - Simple Medicine Logger

## Overview

This document defines the coding standards for the Simple Medicine Logger project, a full-stack React/Node.js application with offline-first architecture. These standards are based on analysis of the existing codebase patterns and industry best practices.

## General Principles

### Code Quality
- **Readability First**: Code should be self-documenting and easily understood by other developers
- **Consistency**: Follow established patterns within the codebase
- **Maintainability**: Write code that can be easily modified and extended
- **Error Handling**: Implement comprehensive error handling at all levels

### Security
- Always validate user input on both client and server sides
- Use helmet.js for security headers (already implemented)
- Implement rate limiting for API endpoints (already configured)
- Never expose sensitive information in error messages to clients
- Use environment variables for configuration (follow .env.example pattern)

## Backend Standards (Node.js/Express)

### File Structure and Naming
- Use lowercase with dashes for file names: `medication-service.js`
- Use camelCase for variables and functions: `getMedicationById`
- Use PascalCase for classes and constructors: `MedicationModel`
- Place route handlers in `/routes` directory
- Place database models in `/models` directory
- Place middleware in `/middleware` directory

### API Design
```javascript
// ✅ Good: RESTful endpoint structure
app.get('/api/medications', getAllMedications);
app.post('/api/medications', createMedication);
app.put('/api/medications/:id', updateMedication);
app.delete('/api/medications/:id', deleteMedication);

// ✅ Good: Consistent response structure
res.json({
  success: true,
  data: medications,
  message: 'Medications retrieved successfully'
});

// ✅ Good: Error response structure
res.status(400).json({
  success: false,
  error: 'Validation failed',
  details: validationErrors
});
```

### Error Handling
```javascript
// ✅ Good: Async error handling pattern
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ Good: Route with error handling
router.get('/medications', asyncHandler(async (req, res) => {
  try {
    const medications = await medicationService.getAll();
    res.json({ success: true, data: medications });
  } catch (error) {
    throw new Error(`Failed to fetch medications: ${error.message}`);
  }
}));
```

### Database (SQLite)
- Use parameterized queries to prevent SQL injection
- Implement proper connection management
- Use database migrations for schema changes (to be implemented)
- Follow existing database naming conventions (snake_case for columns)

```javascript
// ✅ Good: Parameterized query
const stmt = db.prepare('SELECT * FROM medications WHERE user_id = ? AND active = ?');
const medications = stmt.all(userId, 1);

// ❌ Bad: String concatenation (SQL injection risk)
const query = `SELECT * FROM medications WHERE user_id = ${userId}`;
```

### Validation
- Validate all input on server-side regardless of client-side validation
- Use consistent validation patterns
- Return meaningful validation error messages

## Frontend Standards (React)

### Component Structure
- Use functional components with hooks (existing pattern)
- Place components in `/src/components` directory
- Place pages in `/src/pages` directory
- Use PascalCase for component file names: `MedicationCard.js`

### Component Pattern
```javascript
// ✅ Good: Functional component structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MedicationCard = ({ medication, onUpdate, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Effect logic here
  }, [medication]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(medication.id);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="medication-card">
      {/* Component JSX */}
    </div>
  );
};

MedicationCard.propTypes = {
  medication: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default MedicationCard;
```

### State Management
- Use React hooks for local state management
- Keep state as close to where it's used as possible
- Use useState for simple state, useReducer for complex state
- Follow existing patterns for API calls in services

### CSS and Styling
- Use existing CSS class naming conventions (kebab-case)
- Keep styles modular and component-specific when possible
- Use existing utility classes from index.css
- Maintain responsive design principles

```css
/* ✅ Good: Component-specific class naming */
.medication-card {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.medication-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### API Integration
- Use the existing api service pattern in `/src/services/api.js`
- Implement proper error handling for network requests
- Handle offline scenarios gracefully
- Use async/await for asynchronous operations

```javascript
// ✅ Good: API service pattern
import { apiCall } from '../services/api';

const medicationService = {
  async getAll() {
    return apiCall('/api/medications', 'GET');
  },
  
  async create(medication) {
    return apiCall('/api/medications', 'POST', medication);
  }
};
```

## Offline-First Architecture Standards

### Local Storage
- Use localStorage for user preferences and temporary data
- Use IndexedDB for larger datasets (if implemented)
- Implement data synchronization patterns
- Handle storage quotas gracefully

### Network Status Handling
- Always check network status before API calls
- Implement graceful degradation for offline scenarios
- Queue failed operations for retry when online
- Provide clear feedback to users about offline status

## Testing Standards

### Unit Testing
- Write tests for all business logic functions
- Use React Testing Library for component tests
- Mock external dependencies (API calls, localStorage)
- Aim for high test coverage on critical paths

### Integration Testing
- Test API endpoints with real database interactions
- Test React component integration with services
- Verify offline/online behavior transitions

## Code Review Guidelines

### Before Submitting
- [ ] Code follows established patterns in the codebase
- [ ] All new functions have appropriate error handling
- [ ] Security considerations have been addressed
- [ ] Code is properly formatted and documented
- [ ] Tests are included for new functionality

### Review Checklist
- [ ] No hardcoded values (use environment variables)
- [ ] Proper input validation implemented
- [ ] Error handling is comprehensive
- [ ] Code follows DRY principles
- [ ] Performance implications considered
- [ ] Offline functionality maintained

## Documentation Standards

### Code Documentation
- Use JSDoc comments for complex functions
- Include parameter types and return value descriptions
- Document any non-obvious business logic
- Keep README files updated with setup instructions

### Commit Messages
- Use conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep first line under 72 characters
- Include issue references when applicable

```
feat(api): add medication reminder functionality
fix(client): resolve offline sync issue with medication updates
docs(readme): update installation instructions
```

## Performance Guidelines

### Frontend Performance
- Minimize bundle size by importing only needed components
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets

### Backend Performance
- Implement proper database indexing
- Use connection pooling for database connections
- Cache frequently accessed data
- Monitor and log performance metrics

## Accessibility Standards

### UI Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

### Mobile Responsiveness
- Follow mobile-first design approach
- Test on various screen sizes
- Ensure touch targets are appropriately sized
- Consider offline usage patterns on mobile

## Environment Configuration

### Development
- Use nodemon for server auto-restart
- Enable detailed error logging
- Use development database
- Enable React development tools

### Production
- Minimize logging to essential information only
- Use production database with proper backups
- Enable security middleware
- Optimize static asset delivery

## Deployment Standards

### Build Process
- Run linting and tests before deployment
- Generate production builds
- Verify environment variables are set
- Check database migration status

### Monitoring
- Implement health check endpoints
- Log critical application events
- Monitor database performance
- Track user experience metrics

---

*This document should be updated as the codebase evolves and new patterns are established.*