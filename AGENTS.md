# AGENTS.md

Project harness for the Dungeons & Dragons RAG assistant.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`
2. Read this file, `feature_list.json`, and `progress.md`
3. Read `specs/project.md`, `specs/requirements.md`, and `specs/acceptance-criteria.md`
4. Read `.codex/context.md` and `.codex/prompts.md`
5. Read `README.md` and `docs/architecture.md`
6. Run `./init.sh` to verify the local setup path
7. Review recent commits with `git log --oneline -5`
8. Inspect the current backend and frontend entry points before changing behavior

If baseline verification fails, fix that first before adding new scope.

## Working Rules

- Preserve the existing `/ask` contract and chat flow unless the user asks otherwise
- Treat `specs/` as the project source of truth for problem, requirements, and acceptance criteria
- Keep backend business logic in dedicated modules; keep FastAPI routes thin
- Keep React UI logic separate from styling
- Prefer reusable components for spells, monsters, weapons, items, characters, and NPCs
- Preserve retrieval metadata so future citations can be added without rework
- Add tests or build checks when practical
- Avoid broad refactors when a focused fix will do
- Update `feature_list.json` and `progress.md` before ending a session

## Definition of Done

A feature is done only when all of the following are true:

- Target behavior is implemented
- Required verification ran
- Evidence is recorded in `feature_list.json` or `progress.md`
- The app remains restartable from the standard startup path

## Verification Commands

```bash
./init.sh
cd src/frontend && npm run build
python -m py_compile src/backend/api.py src/backend/query.py
```

Optional runtime smoke test, once environment variables are configured:
- Start `cd src/backend && uvicorn api:app --reload`
- POST to `/ask` and confirm a graceful response

## End of Session

Before ending a session:

1. Update `progress.md` with the current state
2. Update `feature_list.json` with the current feature status
3. Record any unresolved risks or blockers
4. Leave a clear next step for the next session

## Scope Notes

- Current goal: D&D RAG assistant that answers questions about rules, classes, spells, monsters, weapons, and lore
- Future UI should support markdown content, clickable cards, and action buttons
- Future backend changes should preserve source metadata and compatibility with citations
- Source code lives under `src/backend` and `src/frontend`
- AI guidance lives under `.codex/`
