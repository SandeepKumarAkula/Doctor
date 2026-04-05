# GramAarogya

GramAarogya is now a self-contained rural healthcare demo built around local synthetic data and offline AI-style agents. The project no longer depends on live model APIs, Google Maps, or a Flask backend with external packages. The optional API server now uses a local SQLite database file.

## What is included

- Offline symptom triage with a synthetic training set
- Local doctor matching based on bundled profiles
- A unified control center for patients, doctors, hospitals, and admins
- Multilingual health news briefs stored in the repository
- Healthcare access and outcomes insights rendered with plain SVG and HTML
- A Python backend that uses only the standard library and SQLite

## Project structure

- `app/` - Next.js routes and pages
- `components/` - Shared layout components
- `lib/` - Local data and synthetic AI logic
- `backend.py` - Optional standard-library JSON server backed by SQLite
- `data/` - Auto-created local SQLite database file for seeded records

## Running the app

1. Install the JavaScript dependencies used by Next.js.

```bash
pnpm install
```

2. Start the frontend.

```bash
pnpm dev
```

The dev and build scripts automatically clear the `.next` cache first so stale chunks do not linger after route changes.

3. If you want the optional offline Python API, run it separately.

```bash
python backend.py
```

## Deploy on Render

This repository now includes a `render.yaml` blueprint with one service:

- `gramaarogya-web` (Next.js frontend)

To deploy:

1. Push the repository to GitHub.
2. In Render, click **New +** -> **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` and create the web service.
5. Wait for deploy to finish, then open the `gramaarogya-web` URL.

The Python server in `backend.py` is optional and can stay local-only for demos.

## Offline AI behavior

The AI-like behavior is simulated with deterministic synthetic examples bundled in `lib/synthetic-ai.ts` and `backend.py`.

- Symptom inputs are scored against synthetic training phrases
- Doctors are ranked by specialty, language, location, and teleconsult availability
- Patients, doctors, hospitals, and admins each have a dedicated portal view
- News articles are selected from local language bundles stored in SQLite
- Health-center results are computed from local coordinates and distance math

This keeps the project reproducible and demo-friendly even with no internet access.

## Notes

- The app is designed to run without any external service keys.
- The Python backend does not require Flask, requests, dotenv, or aiXplain.
- The UI pages are built from local React and CSS only.
