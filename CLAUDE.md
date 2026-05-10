# ClaudeMD CRUD — Project Overview

A simple full-stack Todo app built to showcase structured Claude Code usage with CLAUDE.md files, skills, and hooks.

## Stack
- **Backend**: Go 1.22 + Gin + GORM + PostgreSQL (Supabase)
- **Frontend**: Next.js 15 + TypeScript + Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth → Google OAuth → JWT validated by Go

## Project Structure
```
/backend    → Go REST API (port 8080)
/frontend   → Next.js app (port 3000)
```

## Key Conventions
- Backend handles all data logic — frontend only calls the API
- Every API route requires a valid Supabase JWT in the Authorization header
- Todos are scoped per user via `user_id` — users can only see their own
- Use `.env` for backend, `.env.local` for frontend — never commit secrets

## Running Locally
```bash
# Backend
cd backend && go run main.go

# Frontend
cd frontend && npm run dev
```

## Environment Files
- `backend/.env.example` — copy to `backend/.env`
- `frontend/.env.local.example` — copy to `frontend/.env.local`
