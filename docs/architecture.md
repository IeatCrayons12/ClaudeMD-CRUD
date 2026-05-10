# Architecture

## Overview
A simple CRUD Todo app split into two services: a Go REST API and a Next.js frontend, both connected to Supabase.

## Flow
```
User → Next.js (frontend)
     → Supabase Auth (Google OAuth)
     → Go API (JWT validated)
     → Supabase PostgreSQL (data)
```

## Auth Flow
1. User clicks "Login with Google" on frontend
2. Supabase Auth handles the OAuth redirect with Google
3. Google returns to Supabase callback URL
4. Supabase issues a JWT and redirects to frontend
5. Frontend stores the JWT (Supabase client handles this)
6. Frontend sends JWT in every API request: `Authorization: Bearer <token>`
7. Go middleware validates JWT using the Supabase JWT secret
8. If valid, request proceeds — user ID extracted from JWT claims

## Data Model
```sql
todos (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  title      TEXT NOT NULL,
  done       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/todos | Get all todos for the logged-in user |
| POST | /api/todos | Create a new todo |
| PUT | /api/todos/:id | Toggle todo done/undone |
| DELETE | /api/todos/:id | Delete a todo |
