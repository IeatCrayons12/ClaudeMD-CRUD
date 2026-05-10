# Local Setup

## Prerequisites
- Go 1.22+
- Node.js 18+
- A Supabase project with Google OAuth enabled

## Steps

### 1. Clone the repo
```bash
git clone <repo-url>
cd ClaudeMD-CRUD
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
go mod tidy
go run main.go
# API runs on http://localhost:8080
```

### 3. Frontend setup
```bash
cd frontend
cp .env.local.example .env.local
# Fill in your values in .env.local
npm install
npm run dev
# App runs on http://localhost:3000
```

### 4. Database setup
Run this SQL in your Supabase SQL editor:
```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Common Issues
- **CORS error**: Make sure `FRONTEND_URL` in backend `.env` matches exactly
- **JWT invalid**: Make sure `JWT_SECRET` matches your Supabase project's JWT secret
- **DB connection failed**: Use the Session Pooler URL if on IPv4
