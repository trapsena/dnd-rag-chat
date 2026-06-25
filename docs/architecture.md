# Architecture

## Current Layout

- `src/backend`: FastAPI entry point and RAG query logic
- `src/frontend`: React chat interface, markdown rendering, and styling
-`src/frontend/public/character-sheet`: DND 5e character sheet
- `specs/`: project requirements and acceptance criteria
- `.codex/`: agent guidance, prompts, and workflows
- `tests/`: smoke checks and validation examples

## Design Notes

- Keep API routes thin and move business logic into service modules
- Keep UI rendering in React components and visual rules in CSS
- Preserve retrieval metadata so citations can be added later without reworking the pipeline
- Design chat responses so they can evolve into interactive cards and actions
