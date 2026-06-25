#!/usr/bin/env bash
set -euo pipefail

echo "=== D&D RAG Assistant Bootstrap ==="

if [ -f src/frontend/package.json ]; then
  echo "=== npm install (frontend) ==="
  (cd src/frontend && npm install)

  echo "=== frontend build ==="
  (cd src/frontend && npm run build)
fi

if [ -f src/backend/api.py ] && [ -f src/backend/query.py ]; then
  echo "=== backend syntax check ==="
  python -m py_compile src/backend/api.py src/backend/query.py
fi

echo "=== Optional runtime smoke test ==="
echo "Start 'cd src/backend && uvicorn api:app --reload' and POST /ask once Groq and embedding env vars are configured."

echo "=== Bootstrap complete ==="
