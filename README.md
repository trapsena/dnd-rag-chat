# D&D RAG Chat

A Dungeons & Dragons assistant built with a FastAPI backend, a React/Vite frontend, and a local RAG pipeline for answering rules and lore questions.

## What It Does

This project lets you:

- Ask D&D questions through a chat interface
- Receive markdown-formatted answers from the RAG backend
- Roll dice locally without calling the API
- Use quick dice buttons for common dice sizes
- Roll character ability scores with `/roll stats`
- Open a floating character sheet window from the header
- Open a dice reference panel with supported commands and examples

The app is designed so the chat can grow into a richer D&D companion with reusable cards, actions, and future citations.

## Main Features

### RAG Chat

- FastAPI exposes a single `/ask` endpoint
- The backend loads a Chroma vector store and queries a Groq model
- Responses are rendered in the frontend with markdown support

### Local Dice Commands

The frontend handles dice commands locally and does not send them to the RAG API.

Supported examples:

- `/r 3d6+2`
- `/roll 2d6+5 + 1d8`
- `/roll 3d10k`
- `/roll 4d6k3`
- `/roll 2d20kh + 2`
- `/roll 4d6kl3`
- `/roll 2d20kl + 5`
- `/roll stats`

Dice modifiers supported:

- `kh` or `k` - keep highest
- `kl` - keep lowest
- `dl` or `d` - drop lowest
- `dh` - drop highest

### Ability Score Rolling

`/roll stats` rolls six ability scores for:

- Strength
- Dexterity
- Constitution
- Intelligence
- Wisdom
- Charisma

Each score uses 4d6 drop lowest.

### Character Sheet Window

- The `Character` button opens a standalone character sheet inside the app
- The window is draggable and resizable
- The chat remains usable while the sheet is open

### Dice Info Panel

- The `Info` button opens a help panel beside the Character button
- It lists all supported dice commands
- It includes a combat roll example
- It reminds you to read spell details before rolling for spells

## Project Structure

- `src/backend` - FastAPI app and RAG query logic
- `src/frontend` - React chat UI, markdown rendering, styling, and local dice handling
- `specs` - project requirements and acceptance criteria
- `docs` - architecture notes and project documentation
- `.codex` - prompt and workflow guidance for Codex sessions
- `tests` - validation notes and smoke-test guidance

## Local Development

### Backend

From the backend folder:

```powershell
cd C:\Users\goten\Documents\mycloset\cod\RAG\laboratorio_inovacao_2026_1-aula10\dnd-rag-chat\src\backend
py -m uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

If `py` is not available, use your installed Python launcher or virtual environment.

### Frontend

From the frontend folder:

```powershell
cd C:\Users\goten\Documents\mycloset\cod\RAG\laboratorio_inovacao_2026_1-aula10\dnd-rag-chat\src\frontend
cmd /c npm install
cmd /c npm run dev
```

For a production build check:

```powershell
cmd /c npm run build
```

## Environment Variables

### Backend

The backend expects the model and embedding environment variables used by the RAG stack, especially:

- `GROQ_API_KEY`

The exact set depends on your local model and retrieval setup.

### Frontend

The frontend can point to a deployed backend by setting:

- `VITE_API_URL`

Example:

```text
VITE_API_URL=https://dnd-rag-chat-production.up.railway.app
```

If `VITE_API_URL` is not set, the frontend falls back to `http://localhost:8000`.

## Railway Deployment

This repo includes Railway config files for both services:

- [src/backend/railway.json](src/backend/railway.json)
- [src/frontend/railway.json](src/frontend/railway.json)

Recommended setup:

### Backend service

- Root directory: `src/backend`
- Build: install Python requirements
- Start: run Uvicorn on `0.0.0.0` and `$PORT`

### Frontend service

- Root directory: `src/frontend`
- Build: `npm install && npm run build`
- Start: `npm run preview -- --host 0.0.0.0 --port $PORT`

Then set `VITE_API_URL` on the frontend service to the backend Railway URL.

## Startup Workflow

1. Read `AGENTS.md`
2. Run `./init.sh`
3. Start the backend from `src/backend`
4. Start the frontend from `src/frontend`

## Notes

- The backend RAG stack is lazy-loaded so the API can boot cleanly even if the model or vector store is slow to initialize.
- The frontend keeps chat markdown separate from styling so the UI can evolve into richer cards and actions later.
- Retrieval metadata is preserved in the backend so citations can be added later without reworking the pipeline.
