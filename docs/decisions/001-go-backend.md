# Decision 001 — Go for the Backend

## Status
Accepted

## Context
Needed a backend language for a REST API that handles JWT auth and database operations. Options considered: Node.js/Express, Python/FastAPI, Go/Gin.

## Decision
Use **Go 1.22 with Gin and GORM**.

## Reasons
- **Performance**: Go compiles to a single binary and handles concurrency natively — faster than Node or Python for API workloads
- **Type safety**: Stronger guarantees than JavaScript at compile time, catches bugs before runtime
- **Single binary deployment**: The Dockerfile builds and runs one binary — no runtime dependencies, small container image
- **JWT handling**: `golang-jwt/jwt` gives full control over verification logic, needed to support Supabase's ES256 JWKS-based signing
- **Portfolio signal**: Demonstrating Go alongside Next.js is stronger than a Node/Node stack

## Trade-offs
- More verbose than Express or FastAPI for simple CRUD
- Smaller middleware ecosystem compared to Node.js
- Requires understanding of Go modules and package structure
