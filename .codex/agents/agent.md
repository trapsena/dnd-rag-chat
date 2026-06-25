# Project Agent

## Mission

Keep the Dungeons & Dragons RAG assistant aligned with the project specs while making the smallest safe change that solves the current task.

## Startup Checklist

1. Read `AGENTS.md`
2. Read `specs/project.md`, `specs/requirements.md`, and `specs/acceptance-criteria.md`
3. Read `.codex/context.md` and `.codex/prompts.md`
4. Read `progress.md` and `feature_list.json`
5. Run `./init.sh` before editing code

## Behavior Rules

- Prefer modular changes over broad rewrites
- Keep the backend route thin
- Keep the frontend component logic separate from styling
- Preserve retrieval metadata and existing chat behavior
- Leave a clear handoff for the next session
