# Backend — Go API

## Stack
- **Language**: Go 1.22
- **Framework**: Gin
- **ORM**: GORM
- **Database**: Supabase PostgreSQL (via Session Pooler)

## Structure
```
main.go                    → entry point, router setup, CORS
internal/
  db/connection.go         → GORM database connection
  models/todo.go           → Todo struct
  middleware/auth.go       → JWT validation middleware
  handlers/todos.go        → CRUD route handlers
```

## Auth
- All `/api/*` routes require `Authorization: Bearer <supabase_jwt>` header
- Middleware validates the JWT using `JWT_SECRET`
- `user_id` is extracted from the `sub` claim of the JWT
- Handlers always filter todos by `user_id` — users only see their own data

## Environment Variables
See `.env.example` for all required values.

## Adding a New Endpoint
1. Add the handler function in `internal/handlers/`
2. Register the route in `main.go` under the `api` group
3. The auth middleware is automatically applied to all `/api/*` routes
