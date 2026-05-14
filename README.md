# Quote Generator

A quote generator with a Node.js/Express backend and a React/Vite frontend. Visitors can read random quotes and submit new ones.

## Project structure

```
backend/   Node.js/Express API (port 3001)
frontend/  Vite + React app
```

## Running locally

See `DEV.md` for full prerequisites (Docker for Postgres) and step-by-step setup.

**Quick start** (requires `DATABASE_URL` in `.env`):

```bash
# Backend
cd backend && npm install && npm start

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Copy `.env.example` to `.env` and fill in your values before starting the backend.

## Environment variables

### Backend (`.env` at repo root)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TEST_DATABASE_URL` | For PG tests | Separate test database |
| `CORS_ORIGIN` | No | Allowed frontend origin in production. Unset = allow all origins. |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | Yes | Backend URL, injected at build time |

## Running tests

```bash
# Backend (no database needed — PG tests are skipped automatically)
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Deployment

The backend and frontend are deployed as separate services. Two platforms are used for learning:

- **Coolify** — uses `frontend/nixpacks.toml` for the frontend build
- **Vercel** — uses `backend/vercel.json` and `frontend/vercel.json`

Set `CORS_ORIGIN` on the backend service to the deployed frontend URL.

## API

```
GET  /quotes          Returns a random quote: { quote, author }
POST /quotes          Adds a quote: { quote, author } → 201 { success: true }
                      Validation error → 400 { error: string }
```
