# Prompts

## Standard Development Prompt

Implement one focused change at a time. Preserve the existing chat flow, keep modules small, and add verification before claiming completion.

## Feature Prompt Template

1. Restate the user-visible behavior.
2. Identify the smallest safe files to change.
3. Keep backend logic in backend modules and UI logic in React components.
4. Add tests or smoke checks when practical.
5. Record verification evidence in `progress.md`.

## Debug Prompt Template

1. Reproduce the issue.
2. Inspect the route, service, component, and styling layers separately.
3. Fix the smallest layer that owns the problem.
4. Re-run the relevant verification command.

## Session Log

### 2026-06-15 - Dice Command Request

- User asked for a dice button beside the chat, plus local `/roll` and `/r` commands that bypass the RAG API.
- Added a dice picker for `d4`, `d6`, `d8`, `d10`, `d12`, `d20`, and `d100`.
- Added local dice parsing and chat output for commands like `/roll 3d6+2` and `/roll 2d6+5 + 1d8`.

### 2026-06-15 - Static Header Component

- User asked to make the page header a static frontend component.
- Extracted the title block into `AppHeader` and kept the existing layout and styling intact.

### 2026-06-15 - Sticky Header

- User clarified that the header should stay visible while scrolling.
- Updated the layout so the page behaves like a fixed chat panel with a pinned header and a scrollable message area.

### 2026-06-15 - Stat Roll Command

- User asked for a command to roll D&D ability scores with keep/drop modifiers.
- Extended the dice parser to support `kh`, `kl`, `dh`, and `dl`, and added a local `/roll stats` command that rolls six 4d6 drop-lowest scores.

### 2026-06-16 - Dice Info Button

- User asked for an `Info` button next to the `Character` button.
- Added a dice reference overlay with all local roll commands, the combat-roll example, and a reminder to read spells before rolling for them.

### 2026-06-19 - Railway Backend Config

- User asked for a Railway config file in the backend folder.
- Added `src/backend/railway.json` with a Railpack builder, a Python package install step, and a production-safe FastAPI start command for Railway.

### 2026-06-19 - Railway Config Nesting Fix

- User clarified that Railway expects `buildCommand` under `build` and `startCommand` under `deploy`.
- Nested the Railway config fields to match the config-as-code schema so Railway can read the build and start settings correctly.

### 2026-06-20 - Frontend Railway Config

- User asked for a frontend Railway config that installs dependencies and starts Vite.
- Added `src/frontend/railway.json` with `npm install` and a Railway-hosted `npm run dev` command on `$PORT`.

### 2026-06-20 - Frontend Railway Start Fix

- User reported that the Vite dev server was being terminated on Railway.
- Switched the frontend Railway config to build the app first and serve the production bundle with `vite preview` on `$PORT`.

### 2026-06-20 - Frontend API Base URL

- User wanted the frontend request to hit the Railway backend domain instead of localhost.
- Made the frontend API base URL configurable with `VITE_API_URL` and defaulted it to localhost for local development.

### 2026-06-20 - README Rewrite

- User asked for a full README describing the project and its functionality.
- Rewrote the root README with a project overview, feature summary, local setup, environment variables, and Railway deployment notes.

### 2026-06-20 - README em PT-BR

- User asked to rewrite the README in Brazilian Portuguese.
- Translated the root README while preserving setup, deployment, and feature documentation.

### 2026-06-17 - Character Sheet Integration

- User asked how to add a D&D character sheet to the project.
- Integrated a D&D character sheet sourced from GitHub into the application.
- Applied design adjustments and styling refinements so the sheet matches the project's existing color scheme and overall visual identity.
