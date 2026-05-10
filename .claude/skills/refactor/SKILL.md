# Refactor Skill

When refactoring code in this project:

## Goals
- Reduce duplication — extract repeated logic into helpers
- Keep handlers thin — move business logic to separate functions
- Improve naming clarity — function names should describe what they return/do

## Rules
- Do not change behaviour when refactoring — only structure
- Run `go build ./...` after every Go refactor
- Run `npx tsc --noEmit` after every TypeScript refactor
- Update comments if the logic changes

## Common Patterns
- Repeated auth checks → move to middleware
- Repeated fetch logic → move to `lib/api.ts`
- Repeated styles → extract to a shared style object
