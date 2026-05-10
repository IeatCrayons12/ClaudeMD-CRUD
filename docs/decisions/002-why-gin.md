# ADR 002 — Why Gin

## Decision
Use the Gin framework for the Go REST API.

## Reason
- Minimal boilerplate — routes and middleware are clean to read
- Fast and well-maintained
- Great middleware ecosystem (CORS, JWT)
- Easy to understand for anyone reviewing the code

## Trade-offs
- Adds a dependency vs. using net/http directly
- Slightly more magic than stdlib, but acceptable for a simple CRUD app
