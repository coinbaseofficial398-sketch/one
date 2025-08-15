# Overview

This is a full-stack web application for BitNest, a decentralized finance (DeFi) platform built on blockchain technology. The application serves as a cryptocurrency banking smart contract interface, featuring multiple DeFi products including BitNest Loop, Saving Box, BitNest Savings, and BitNest DAO. The platform emphasizes transparency, accessibility, and full automation with assets stored directly on the blockchain.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Comprehensive component system built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with `/api` prefix for all endpoints
- **Development Server**: Custom Vite integration for hot module replacement and SSR capabilities
- **Build System**: ESBuild for production bundling with platform-specific optimizations

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Connection**: Neon Database serverless driver for cloud PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Local Development**: In-memory storage implementation with fallback to database
- **Session Storage**: Connect-pg-simple for PostgreSQL-backed session management

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL storage backend
- **User Schema**: Username/password authentication with UUID primary keys
- **Validation**: Zod schemas for input validation and type safety
- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations

## External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Blockchain Integration**: Ready for Web3 wallet connections (MetaMask, TokenPocket, CoinBase)
- **Oracle Services**: ChainLink integration for external data feeds
- **Development Tools**: Replit-specific plugins for development environment
- **UI Components**: Extensive Radix UI ecosystem for accessible components
- **Styling**: Google Fonts integration for typography
- **Build Tools**: PostCSS with Autoprefixer for CSS processing

## Design Patterns
- **Component Architecture**: Modular React components with separation of concerns
- **Custom Hooks**: Reusable logic for animations, mobile detection, and toast notifications
- **Type Safety**: Comprehensive TypeScript coverage with strict configuration
- **Error Handling**: Centralized error handling with user-friendly toast notifications
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Performance**: Code splitting and lazy loading for optimal bundle sizes