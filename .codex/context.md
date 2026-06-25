# Context

## Repo Purpose

This repository is a Dungeons & Dragons RAG assistant that will grow from a chat tool into a companion app with cards, actions, trackers, and richer knowledge retrieval.

## Important Paths

- `specs/`: project problem, requirements, and acceptance criteria
- `.codex/`: AI guidance, prompts, agents, and workflow notes
- `src/backend`: FastAPI and RAG logic
- `src/frontend`: React chat UI and styles
- `docs/`: living documentation
- `tests/`: validation examples and smoke checks

## Working Constraints

- Preserve the `/ask` endpoint contract unless asked to change it
- Keep business logic out of routes where possible
- Keep UI behavior separate from CSS
- Preserve metadata needed for citations later
- Prefer small, reusable components and functions
