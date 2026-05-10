#!/bin/bash
# Pre-commit hook — runs before Claude commits any changes

echo "Running pre-commit checks..."

echo "→ Checking Go build..."
cd backend && go build ./... 2>&1
if [ $? -ne 0 ]; then
  echo "Go build failed. Commit aborted."
  exit 1
fi

echo "→ Running go vet..."
go vet ./... 2>&1
if [ $? -ne 0 ]; then
  echo "go vet failed. Commit aborted."
  exit 1
fi

echo "→ Checking TypeScript..."
cd ../frontend && npx tsc --noEmit 2>&1
if [ $? -ne 0 ]; then
  echo "TypeScript errors found. Commit aborted."
  exit 1
fi

echo "All checks passed."
exit 0
