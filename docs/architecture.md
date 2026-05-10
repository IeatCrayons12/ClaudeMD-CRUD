# Architecture

## Overview

ClaudeMD CRUD is a full-stack Todo app with a clear separation between frontend and backend. The frontend never touches the database directly — all data goes through the Go API.

```
Browser
  │
  ├── Next.js Frontend (Vercel)
  │     ├── Supabase Auth (Google OAuth)
  │     └── Fetch API → Go backend
  │
  └── Go REST API (Railway)
        ├── JWT middleware (ES256 via JWKS)
        └── GORM → PostgreSQL (Supabase)
```

## Auth Flow

```
1. User clicks "Continue with Google"
2. Supabase redirects to Google OAuth consent screen
3. Google redirects back to Supabase callback URL
4. Supabase exchanges the code → creates a session
5. Supabase redirects to /api/auth/callback (Next.js Route Handler)
6. Route Handler calls exchangeCodeForSession() → sets session cookie
7. User lands on /dashboard with a valid session
8. Every API call sends the Supabase JWT as Bearer token
9. Go middleware fetches JWKS from Supabase, verifies ES256 signature
10. Verified user_id is injected into the Gin context
```

## Backend

- **Framework**: Gin (HTTP router)
- **ORM**: GORM (PostgreSQL driver)
- **Auth**: `golang-jwt/jwt` — verifies ES256 JWTs using Supabase's JWKS endpoint
- **CORS**: Configurable via `FRONTEND_URL` env var (comma-separated for multiple origins)

### API Routes

| Method | Path            | Description              |
|--------|-----------------|--------------------------|
| GET    | /health         | Health check             |
| GET    | /api/todos      | Get all todos for user   |
| POST   | /api/todos      | Create a new todo        |
| PUT    | /api/todos/:id  | Toggle todo done status  |
| DELETE | /api/todos/:id  | Delete a todo            |

All `/api` routes require a valid `Authorization: Bearer <token>` header.

### Data Model

```go
type Todo struct {
    ID        uint      // primary key
    UserID    string    // Supabase user UUID — scopes todos per user
    Title     string    // todo text
    Done      bool      // completion status
    CreatedAt time.Time // auto-set by GORM
}
```

## Frontend

- **Framework**: Next.js 15 (App Router)
- **Auth**: `@supabase/ssr` — server-side session handling via cookies
- **Middleware**: Refreshes Supabase session on every request
- **State**: Local React state — no external state library needed for this scope

### Key Files

```
app/
  page.tsx                   → Login page (Google OAuth button)
  dashboard/page.tsx         → Main todo UI (protected)
  api/auth/callback/route.ts → OAuth callback handler
middleware.ts                → Session refresh on every request
lib/supabase.ts              → Browser Supabase client
```

## Deployment

| Service  | Platform | Config                        |
|----------|----------|-------------------------------|
| Frontend | Vercel   | Root dir: frontend            |
| Backend  | Railway  | Root dir: backend (Docker)    |
| Database | Supabase | Managed PostgreSQL             |
