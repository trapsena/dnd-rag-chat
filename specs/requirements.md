# Requirements

## Functional Requirements

1. Users can submit Dungeons & Dragons questions from the frontend chat interface.
2. The frontend sends questions to FastAPI using the `/ask` endpoint.
3. FastAPI calls the RAG pipeline and returns an answer.
4. Answers are rendered in the chat interface.
5. The backend preserves retrieval metadata so future citations remain possible.
6. The frontend supports markdown content so responses can become richer over time.
7. The UI structure should allow future card components and action buttons.

## Non-Functional Requirements

1. Preserve existing functionality unless a change is explicitly requested.
2. Keep backend business logic separate from API routes.
3. Keep React UI logic separate from styling.
4. Favor modular code over large monolithic files.
5. Prefer TypeScript-ready patterns even if the current code is JavaScript.
6. Keep the codebase easy to extend for future D&D systems.

## Future-Friendly Requirements

1. Support clickable spell, weapon, monster, item, character, and NPC cards.
2. Support source citations without reworking retrieval output.
3. Support streaming responses.
4. Support conversation memory.
5. Support dice rolling and other action commands.
