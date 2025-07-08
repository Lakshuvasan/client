# CERTI-BOT - Intelligent Certification Assistant

## Overview

CERTI-BOT is a modern web application built as an AI-powered certification assistant. The application helps users discover and learn about various professional certifications through an interactive chat interface. It's designed as a full-stack TypeScript application with a React frontend and Express backend, utilizing AI to provide personalized certification recommendations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for intelligent responses
- **Session Management**: In-memory storage with planned database persistence

### Database Design
The application uses PostgreSQL with the following schema:
- **users**: User authentication and profiles
- **chat_sessions**: Individual chat conversation tracking
- **chat_messages**: Message history with metadata
- **certifications**: Comprehensive certification database with categorization

## Key Components

### Chat System
- Real-time conversation interface with typing indicators
- Message persistence across sessions
- AI-powered responses with certification recommendations
- Interactive suggestion cards for quick user engagement

### Certification Database
- Pre-populated with popular certifications across multiple domains
- Categories include cloud computing, cybersecurity, project management, and data science
- Rich metadata including difficulty levels, prep time, costs, and provider information

### AI Integration
- OpenAI GPT-4o integration for natural language processing
- Contextual certification recommendations based on user queries
- Relevance scoring system for recommendation ranking
- Chat history consideration for personalized responses

### UI/UX Features
- Responsive design with mobile-first approach
- Dark/light theme support through CSS variables
- Animated components and smooth transitions
- Accessible design following modern standards

## Data Flow

1. **User Interaction**: User sends message through chat interface
2. **Session Management**: System creates or retrieves existing chat session
3. **Message Processing**: User message is stored and sent to AI service
4. **AI Processing**: OpenAI analyzes message against certification database
5. **Response Generation**: AI returns structured response with recommendations
6. **Data Persistence**: Both user message and AI response are stored
7. **UI Update**: Interface updates with new messages and certification cards

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL driver for serverless deployment
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **openai**: Official OpenAI API client
- **zod**: Runtime type validation
- **react-hook-form**: Form handling and validation

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Utility for component variants

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and tooling
- **drizzle-kit**: Database migration and introspection tools

## Deployment Strategy

### Development Setup
- Vite dev server for frontend with HMR
- Express server with automatic restart using tsx
- Database migrations using Drizzle Kit
- Environment variable configuration for API keys and database URL

### Production Build
- Vite builds optimized frontend bundle to dist/public
- ESBuild bundles backend code for Node.js deployment
- Single-command deployment with `npm run build && npm start`
- Supports deployment to Replit, Vercel, or traditional Node.js hosting

### Database Deployment
- Configured for Neon serverless PostgreSQL
- Drizzle migrations for schema management
- Environment-based configuration for different deployment targets

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment configuration

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 08, 2025. Initial setup