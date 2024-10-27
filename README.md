# Project-goldmine
Creating a learning platform where all nuggets can shine

## Project Overview
An interactive learning platform that allows students to engage with educational content through:
- Paragraph-level interactions (questions, highlights, comments)
- Text selection tools (highlighting, underlining, bolding)
- Future cloud integration for teacher monitoring

## Project Structure
Current implementation includes:
- `client/`
  - `script.js`: Core interaction handling (text selection, styling, icon management)
  - `styles.css`: Styling for content and interactive elements
- `tests/`
  - `example.test.js`: Test file structure in place (currently empty)
- `homepage.html`: Sample educational content

## Code Quality and Consistency
- ESLint configuration in place with:
  - Prettier integration
  - React plugin support
  - Custom rules for console statements
  - Husky pre-push hook for linting
- SonarQube analysis configured for main branch pushes

## Development Setup
1. Install dependencies:
```bash
npm install
```

2. Available npm scripts:
```bash
npm run lint        # Run ESLint
npm run lint:report # Generate ESLint report
npm run test       # Run Jest tests
npm run sonar      # Run SonarQube analysis (requires .env setup)
```

## Version Control Practices
- Husky hooks configured for:
  - Pre-push: Runs linting and tests
  - Additional SonarQube analysis on main branch pushes

## Required Dependencies
Key development dependencies:
- ESLint & Prettier for code quality
- Jest for testing
- React & React DOM for future component development
- Husky for Git hooks

## Documentation
Future documentation needs:
- API documentation for cloud integration
- User interaction tracking specifications
- Testing strategy documentation
- Component development guidelines

## Work in Progress
- Cloud integration for sharing interactions
- Teacher monitoring interface
- Testing implementation
- Database integration

Remember to check for updated documentation as new features are implemented.