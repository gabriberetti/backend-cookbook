# API Design

## Base URL

```
http://localhost:4000
```

## Authentication

All protected routes require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

## Standard Response Format

```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "traceId": "uuid-v4"
}
```

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | No | Register a new user |
| POST | /auth/login | No | Login and receive JWT |
| GET | /auth/me | Yes | Get current user |

### Tasks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /tasks | Yes | List all tasks |
| GET | /tasks/:id | Yes | Get a single task |
| POST | /tasks | Yes | Create a task |
| PUT | /tasks/:id | Yes | Update a task |
| DELETE | /tasks/:id | Yes | Delete a task |

### Upload

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /upload | Yes | Upload file to S3 |
| GET | /upload | Yes | List uploaded files |
| GET | /upload/presigned/:key | Yes | Get pre-signed URL |

### Jobs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /jobs/email | Yes | Queue email job |
| GET | /jobs/:id | Yes | Get job status |

### Logs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /logs | Yes | Query backend logs |
| GET | /logs/stats | Yes | Log statistics |
| POST | /logs/simulate | Yes | Trigger error simulation |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Server health check |
