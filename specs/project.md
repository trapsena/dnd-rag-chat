# Project Overview

## Problem Statement

Build a Dungeons & Dragons RAG assistant that can answer rules and lore questions from a curated knowledge base, while keeping the system ready for future interactive companion features.

## Product Goal

Users should be able to ask a question in the React chat UI, send it to FastAPI, run the retrieval and LLM pipeline, and receive a readable answer that can later evolve into markdown-rich, card-based responses.

## Current Architecture

- `src/backend`: FastAPI route layer and RAG/query logic
- `src/frontend`: React chat UI and styling
- `specs/`: project requirements and acceptance criteria
- `.codex/`: AI guidance and reusable workflow notes
- `docs/`: living repository knowledge base
- `tests/`: validation examples and smoke checks

## Design Direction

Keep the app modular so spells, monsters, weapons, items, NPCs, and characters can later become reusable cards with actions such as roll damage, cast spell, or apply effect.
