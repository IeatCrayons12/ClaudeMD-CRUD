# Code Review Skill

When reviewing code in this project, follow these rules:

## Go (Backend)
- Every handler must check for `user_id` from JWT — never trust client-provided user IDs
- All DB errors must be logged and return proper HTTP status codes (400, 404, 500)
- No raw SQL — use GORM methods only
- Env vars must never be hardcoded

## TypeScript (Frontend)
- No `any` types — always define proper interfaces
- All API calls must include the Supabase session token in Authorization header
- Handle loading and error states in every component
- No console.log left in production code

## General
- Keep functions small and single-purpose
- Every new endpoint needs a comment explaining what it does
