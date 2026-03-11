# Backend Cookbook

> A gamified backend engineering showcase platform. Demonstrates real backend systems through interactive visualizations and recruiter-friendly explanations.

## What is this?

Backend Cookbook is an interactive full-stack application that visually demonstrates how backend systems work — from authentication to cloud storage, background jobs to real-time event streams.

**Every feature follows three rules:**
1. Demonstrates a real backend capability
2. Visually shows what's happening in the system
3. Explains the concept in simple language

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas |
| Cloud Storage | AWS S3 |
| Queue | Redis + BullMQ |
| Real-time | Socket.io |
| Infrastructure | Docker, GitHub Actions |
| Deployment | Vercel (frontend), Render (backend) |

## Modules

- **Authentication** — JWT tokens, bcrypt password hashing, protected routes
- **Database Systems** — MongoDB CRUD, data modeling, indexed queries
- **REST API** — Structured endpoints, Zod validation, error handling
- **Cloud Storage** — File uploads to AWS S3, pre-signed URLs
- **Background Jobs** — BullMQ queues, async workers
- **Security** — Rate limiting, Helmet.js, input sanitization

## Getting Started

### Prerequisites

- Node.js 22+
- Docker (for local MongoDB and Redis)

### 1. Clone and install

```bash
git clone https://github.com/your-username/backend-cookbook
cd backend-cookbook
npm install
```

### 2. Start MongoDB and Redis

```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

### 3. Configure backend environment

```bash
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your values (JWT_SECRET, AWS credentials, etc.)
```

### 4. Configure frontend environment

```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

### 5. Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Health check: http://localhost:4000/health

## Project Structure

```
backend-cookbook/
  apps/
    frontend/     Next.js App Router
    backend/      Express API
  infrastructure/
    docker/       docker-compose.yml
    deployment/   Vercel + Render configs
  docs/
    architecture.md
    api-design.md
  .github/
    workflows/    GitHub Actions CI
```

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | / | Platform overview |
| Dashboard | /dashboard | Central hub with live activity |
| Architecture | /architecture | Interactive system map |
| API Monitor | /api-monitor | Real-time request stream |
| Timeline | /timeline | Backend event timeline |
| Console | /console | Log viewer + error simulation |
| Infrastructure | /infrastructure | Tech stack explained |

## Deployment

See `infrastructure/deployment/` for Vercel and Render configuration files.
