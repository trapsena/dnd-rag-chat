# Tests and Validation

This folder collects validation examples and future automated checks.

## Current Checks

- Run `./init.sh`
- Run `cd src/frontend && npm run build`
- Run `python -m py_compile src/backend/api.py src/backend/query.py`

## Manual Smoke Test

1. Start the backend with `cd src/backend && uvicorn api:app --reload`
2. Open the frontend chat UI
3. Ask a Dungeons & Dragons rules question
4. Confirm the assistant returns a graceful response
5. Confirm markdown content renders correctly when present

## Future Additions

- API tests for `/ask`
- Frontend interaction tests for chat message rendering
- Markdown rendering coverage
- Error-state validation
