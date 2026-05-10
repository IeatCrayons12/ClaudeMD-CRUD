# ADR 001 — Why Supabase

## Decision
Use Supabase for both the database (PostgreSQL) and authentication.

## Reason
- Free tier is sufficient for a showcase project
- Built-in Google OAuth support — no need to implement OAuth from scratch
- PostgreSQL is production-grade and familiar
- Supabase dashboard makes it easy to inspect data during development

## Trade-offs
- Vendor lock-in for auth (acceptable for a portfolio project)
- Free tier has connection limits — mitigated by using the Session Pooler
