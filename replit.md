# replit.md

## Overview

This is a full-stack web application for "Kenyetta's Healing Center" - a chakra and healing crystal meditation platform built with React, TypeScript, Express.js, and Firebase. The application provides users with chakra education, assessment tools, crystal e-commerce, guided meditation, and mood tracking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom chakra color scheme
- **State Management**: TanStack React Query for server state, local state with React hooks
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Server Type**: ESM modules with tsx for development
- **Database**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **Authentication**: Firebase Auth with Google OAuth
- **API Structure**: RESTful API with `/api` prefix

### Data Storage
- **Primary Database**: PostgreSQL via Drizzle ORM (fully implemented with proper schema)
- **Production Storage**: PostgreSQL with complete database tables for users, mood entries, meditation sessions, and chakra test results
- **Development Storage**: In-memory storage as fallback for rapid development
- **Firebase Integration**: Authentication and supplementary data storage
- **Session Storage**: PostgreSQL with connect-pg-simple

## Key Components

### Frontend Components
1. **Navigation**: Responsive navbar with authentication state
2. **Chakra System**: 
   - Educational cards for 7 chakras with frequencies and blockage information
   - Interactive chakra test with scoring algorithm
3. **Crystal Shop**: 
   - Product grid with filtering by chakra
   - Individual crystal detail pages
   - E-commerce interface (add to cart/wishlist)
4. **Meditation Platform**: 
   - Guided meditation based on chakra test results
   - Audio player component
   - Crystal recommendations
5. **User Dashboard**: 
   - Mood tracking with 1-10 scale and emoji interface
   - Progress visualization over time
   - Meditation session history

### Backend Services
1. **Authentication**: Firebase Auth integration
2. **Data Storage**: Firestore operations for user data
3. **API Routes**: Express.js routes (currently minimal, ready for expansion)
4. **Static Assets**: Vite-powered static file serving

## Data Flow

1. **User Authentication**: 
   - Google OAuth via Firebase Auth
   - Redirect handling for authentication flow
   - User document creation in Firestore

2. **Chakra Assessment**:
   - Multi-question test with weighted scoring
   - Results stored in Firebase with blocked chakra identification
   - Integration with meditation and crystal recommendations

3. **Mood Tracking**:
   - Daily mood entries (1-10 scale with notes)
   - Historical data for progress tracking
   - Visualization of improvement over time

4. **Crystal Recommendations**:
   - Filtering system based on chakra blockages
   - Product data with healing properties and meditation instructions
   - Shopping cart functionality (frontend only)

## External Dependencies

### Core Dependencies
- **Firebase**: Authentication and Firestore database
- **Drizzle ORM**: Database schema and migrations (PostgreSQL)
- **TanStack Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Production bundling
- **Replit Integration**: Runtime error overlay and cartographer

### External Services
- **Firebase Project**: Requires configuration via environment variables
- **PostgreSQL Database**: Via DATABASE_URL environment variable
- **Image Hosting**: Unsplash for crystal product images

## Deployment Strategy

### Development
- Uses Vite development server with HMR
- In-memory storage for rapid prototyping
- Firebase emulators can be configured for local development

### Production Build
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: PostgreSQL with Drizzle schema deployed via `npm run db:push`
4. **Static Assets**: Express serves built frontend files
5. **Deployment**: Ready for Replit deployment with build command configured

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `VITE_FIREBASE_API_KEY`: Firebase configuration
- `VITE_FIREBASE_PROJECT_ID`: Firebase project identifier
- `VITE_FIREBASE_APP_ID`: Firebase app identifier

### Architecture Notes
- The application is designed for single-page deployment
- Database schema is fully implemented with PostgreSQL tables created
- PERN stack (PostgreSQL, Express, React, Node.js) ready for production deployment
- Firebase configuration supports authentication and supplementary data storage
- The chakra color scheme and healing center branding is integrated throughout the UI
- Audio meditation files can be added to support guided meditation features
- Dual storage system: PostgreSQL for production, in-memory for development
- Comprehensive build system with Vite (frontend) and ESBuild (backend)