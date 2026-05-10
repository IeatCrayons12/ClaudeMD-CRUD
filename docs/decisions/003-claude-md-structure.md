# Decision 003 — Structured Claude Code Usage with CLAUDE.md

## Status
Accepted

## Context
This project was built with Claude Code as the primary development tool. Without structure, AI-assisted development becomes chaotic — Claude loses context, makes changes in the wrong places, and repeats mistakes.

## Decision
Use a structured Claude Code setup with `CLAUDE.md`, skills, and docs to keep AI assistance consistent and auditable.

## Structure

```
CLAUDE.md                        → Project memory: stack, conventions, run commands
docs/architecture.md             → How the system fits together
docs/decisions/                  → Why each major choice was made
.claude/skills/code-review/      → Reusable AI workflow for reviewing code
```

## Reasons
- **CLAUDE.md as project memory**: Every Claude session starts with full context — stack, conventions, what not to touch. No need to re-explain the project each time.
- **Decision docs**: Capturing *why* decisions were made means Claude doesn't second-guess or undo deliberate choices
- **Skills**: Reusable prompt workflows give consistent output for repeated tasks like code review
- **Auditability**: When AI makes a change, the docs make it easy to verify it respected the project's conventions

## Trade-offs
- Requires discipline to keep CLAUDE.md and docs up to date as the project evolves
- Adds files that non-Claude developers might find unfamiliar
- Upfront investment in structure pays off most on longer projects
