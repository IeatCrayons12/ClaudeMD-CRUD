# Decision 002 — Supabase Auth with Google OAuth

## Status
Accepted

## Context
The app needs user authentication. Options considered: Auth0, NextAuth.js, Clerk, custom JWT, Supabase Auth.

## Decision
Use **Supabase Auth** with Google OAuth as the provider.

## Reasons
- **Integrated with the database**: Supabase Auth and PostgreSQL live in the same project — user UUIDs from auth are directly usable as `user_id` foreign keys
- **No separate auth server**: Supabase handles token issuance, refresh, and the Google OAuth handshake
- **SSR support**: `@supabase/ssr` is purpose-built for Next.js App Router with proper cookie-based session handling
- **Google OAuth**: Familiar sign-in flow, no password management needed

## How it works
Supabase issues **ES256 JWTs** signed with an EC P-256 key. The Go backend verifies these by fetching the public key from Supabase's JWKS discovery endpoint (`/auth/v1/.well-known/jwks.json`) rather than hardcoding a secret — so key rotation is handled automatically.

## Trade-offs
- Tightly coupled to Supabase — switching auth providers later requires refactoring both frontend and backend
- Supabase's newer ES256 signing required custom JWKS parsing in Go since most tutorials only cover the legacy HS256 approach
- Google Cloud Console OAuth setup adds initial configuration overhead
