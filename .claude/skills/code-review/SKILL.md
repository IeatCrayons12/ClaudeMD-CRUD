# Skill: Code Review

Use this skill when reviewing new code, PRs, or changes to this project.

## How to invoke
"Review [file or feature] for this project"

## Review Checklist

### Security
- [ ] No secrets or API keys hardcoded
- [ ] All `/api` routes go through `AuthRequired()` middleware
- [ ] User can only access their own todos (`user_id` scope enforced)
- [ ] JWT is validated — not just decoded

### Backend (Go)
- [ ] Errors are handled and return appropriate HTTP status codes
- [ ] New routes are added to `main.go` under the authenticated group
- [ ] Database queries use parameterized inputs (GORM handles this)
- [ ] No direct SQL strings with user input

### Frontend (Next.js)
- [ ] No secrets in `NEXT_PUBLIC_*` env vars
- [ ] Protected pages check session before rendering
- [ ] API calls include `Authorization: Bearer <token>` header
- [ ] Errors from the API are shown to the user, not swallowed

### Claude Code Conventions
- [ ] Changes respect the stack defined in `CLAUDE.md`
- [ ] TutorMatch files are untouched
- [ ] New decisions are documented in `docs/decisions/`
- [ ] Architecture changes are reflected in `docs/architecture.md`

## Output format
Summarize findings as: **Approved / Approved with suggestions / Needs changes**
Then list specific issues grouped by category above.
