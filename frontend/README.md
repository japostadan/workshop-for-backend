# Frontend

Vite + React app for the quote generator.

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_BACKEND_URL
npm run dev            # http://localhost:5173
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend API URL. Used at build time and in development. |

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build static files to `dist/` |
| `npm test` | Run component tests with Vitest |
| `npm run lint` | Run ESLint |
