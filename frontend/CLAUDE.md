# Frontend — Next.js App

## Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Auth**: Supabase Auth (Google OAuth)
- **Styling**: Inline CSS only

## Structure
```
app/
  layout.tsx              → root layout, Supabase session provider
  page.tsx                → login page (Google OAuth button)
  dashboard/page.tsx      → main todo list (protected)
  api/auth/callback/route.ts → Supabase OAuth callback handler
lib/
  supabase.ts             → Supabase browser client
components/
  TodoList.tsx            → renders list of todos
  TodoItem.tsx            → single todo row (toggle + delete)
  AddTodo.tsx             → form to add a new todo
```

## Auth Flow
1. `page.tsx` shows a "Login with Google" button
2. Supabase handles the OAuth redirect
3. `/api/auth/callback` exchanges the code for a session
4. User is redirected to `/dashboard`
5. All API calls to Go backend use: `session.access_token` as Bearer token

## Rules
- Never use `any` types
- Always handle loading + error states
- All styles are inline — no CSS files, no Tailwind
- API base URL comes from `NEXT_PUBLIC_API_URL` env var
