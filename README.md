# RAG Source Tree Startup Guide

This repository keeps the live application code under `src/backend` and `src/frontend`.

## What Runs Where

- `src/backend`: FastAPI app and RAG pipeline
- `src/frontend`: React/Vite chat UI

## Start the Backend

Open a terminal in the backend folder and run:

```powershell
cd \dnd-rag-chat\src\backend
py -m uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

If `py` is not available, use your installed Python launcher or activate your virtual environment first.

## Start the Frontend

Open a second terminal in the frontend folder and run:

```powershell
cd C:\dnd-rag-chat\src\frontend
cmd /c npm run dev
```

If you prefer plain `npm run dev`, run it in a shell that allows the `npm` script shim.

## Optional Build Check

To verify the frontend production build:

```powershell
cd C:\dnd-rag-chat\src\frontend
cmd /c npm run build
```

## Notes

- The RAG logic is not a separate service; it runs inside the FastAPI backend when `/ask` is called.
- The frontend talks to the backend at `http://localhost:8000/ask`.
- Start the backend before using the chat UI.
