# System Architecture

## Overview

Backend Cookbook is a full-stack monorepo demonstrating production backend engineering patterns.

## Architecture Diagram

```
Browser (Next.js)
      │
      ├── REST API ────────────► Express (Node.js)
      │                               │
      └── WebSocket ◄─────────────────┤
                                      ├──► MongoDB Atlas
                                      ├──► AWS S3
                                      └──► Redis + BullMQ
```

## Layers

### Client Layer
- Next.js 15 App Router with TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- Socket.io client for real-time events

### API Layer
- Express.js with TypeScript
- JWT authentication middleware
- Rate limiting (express-rate-limit)
- Helmet.js security headers
- Trace ID injection on every request
- Zod schema validation

### Data Layer
- MongoDB Atlas (NoSQL document store)
- Mongoose ODM with typed schemas
- Collections: Users, Tasks, Logs
- Indexes: email, createdAt, traceId

### Cloud Layer
- AWS S3 for file uploads
- Pre-signed URL generation for secure access
- Multer for multipart form handling

### Queue Layer
- Redis for job queue backing store
- BullMQ for email and file processing queues
- Workers running in same Node.js process

### Real-Time Layer
- Socket.io server attached to Express HTTP server
- Backend events emitted via Node.js EventEmitter
- Events broadcast to all connected clients

## Request Tracing

Every request receives a unique `X-Trace-ID` (UUID v4). This trace ID follows the request through:

1. HTTP request received
2. Auth middleware
3. Controller logic
4. Database operation
5. HTTP response

All steps emit events with the same traceId — visible in the Event Timeline page.
