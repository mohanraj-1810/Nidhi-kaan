# Nidhi Kaan — AI Fund Utilization & Anti-Corruption Compliance System

**நிதி கண்** (Fund's Eye) is a prototype compliance and anti-corruption system for the
Government of Tamil Nadu. It verifies that government money only moves when real,
geo-stamped evidence and financial records pass three AI verification systems and an
autonomous escalation workflow.

This repository is a single merged full-stack application: a React + TypeScript frontend
and an Express + TypeScript backend. The Express server is both the API and — in a
production build — the web server for the React client, so the whole app runs on one port.

---

## Architecture

```
                 ┌──────────────────────────────────────────────────────────┐
   browser  ───▶ │  Express (server/, port 3001)                            │
                 │   ├── /                → built React app (client/dist)   │
                 │   ├── /api/v1/cases    → case intake, GST, escalation    │
                 │   ├── /api/v1/dashboard→ analytics & reporting           │
                 │   ├── /health          → health checks                   │
                 │   └── /api-docs        → Swagger UI                      │
                 └──────────┬───────────────────────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
        Supabase (PostgreSQL)      In-memory fallback store
        via @supabase/supabase-js  (keeps demo working offline)
```

- **Frontend** — `client/` · React 19 + TypeScript + Vite + Tailwind CSS v4 + anime.js.
  Bilingual (Tamil/English), light & dark themes, five views: Overview, Dashboard,
  Case Inspector, New Case, GST Verification.
- **Backend** — `server/` · Express 4 + TypeScript + Zod validation + Swagger/OpenAPI 3.0.
  Business logic in `src/services/caseService.ts` mirrors itself to Supabase when
  configured and otherwise falls back to an in-memory store.

---

## Quick Start

Prerequisites: Node.js 20+ and npm (or bun).

```bash
# 1. Install dependencies (root + client + server)
npm install
```

### Development (both servers)

```bash
npm run dev
```

Starts both processes in one terminal:

| Name | Port | Purpose |
|------|------|---------|
| `api` | `3001` | Express API (`/api/v1`, `/health`, `/api-docs`) |
| `web` | `5173` | Vite dev server (proxies `/api` → `:3001`) |

Open http://localhost:5173. The API client uses `/api/v1` relative paths, so the
proxy keeps frontend and backend talking to each other during development.

Individual processes:

```bash
npm run dev:client   # web only
npm run dev:server   # api only
```

### Production (single deployable)

```bash
npm run build   # compiles client/ and server/
npm start       # builds if needed, then runs Express on :3001
```

In production the Express server serves the built React app plus the API on one port:
http://localhost:3001. Every non-API GET falls back to the SPA, so deep links like
`/cases` work. `/api-docs` still serves Swagger UI.

### Package scripts

| Script          | Description                                          |
|-----------------|------------------------------------------------------|
| `dev`           | Runs API + Vite dev server together                  |
| `dev:client`    | Vite dev server only                                 |
| `dev:server`    | Express dev server (tsx watch) only                  |
| `build`         | Builds client (`tsc -b && vite build`) then server (`tsc`) |
| `build:client`  | Builds the React app into `client/dist`              |
| `build:server`  | Compiles Express into `server/dist`                  |
| `start`         | Builds everything and starts the merged production server |

---

## API Overview

All endpoints are documented interactively at `/api-docs` (Swagger UI).

| Method | Path                                  | Description                              |
|--------|---------------------------------------|------------------------------------------|
| `POST` | `/api/v1/cases/submit`                | Register a case + run Systems 1, 2, 3    |
| `GET`  | `/api/v1/cases`                       | List all cases (newest first)            |
| `GET`  | `/api/v1/cases/:id`                   | Fetch a single case                      |
| `POST` | `/api/v1/cases/:id/verify-gst`        | Re-check stored invoice against GSTN     |
| `POST` | `/api/v1/cases/:id/fast-forward`      | Escalate to the next authority tier      |
| `GET`  | `/api/v1/dashboard/stats`             | Aggregate compliance metrics             |
| `GET`  | `/health`                             | Health check                             |

Error responses follow one of two shapes, both already handled by the React client:

```json
{ "error": "Case not found" }                          // request/API errors
{ "errors": { "id": ["Invalid uuid"] } }               // Zod validation errors
```

### Verification logic

- **System 1 — Authenticity:** latitude/longitude of `0,0` fails (GPS tampering).
- **System 2 — Stage:** claimed stage must be one of `Foundation`, `Plinth`, `Roof`,
  `Finishing`, `Complete`.
- **System 3 — GST:** an invoice number containing `FAKE` is flagged
  `FRAUD_FLAGGED`; no invoice stays `PENDING`.
- **Escalation order:** `LOCAL_STAFF` → `DISTRICT` → `STATE` → `CM_DASHBOARD`.

---

## Environment Configuration

The server reads `.env` from `server/.env` (not committed). Only two variables are
required; without them the API transparently uses its in-memory store so the demo
keeps working.

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<service-role key>
```

Optional: `PORT` (defaults to `3001`). The database schema (a single `cases` table)
is documented in `server/README.md`.

---

## Repository Layout

```
├── client/               React + Vite frontend
│   ├── src/App.tsx       Root state, API wiring, seed/fallback data
│   ├── src/services/     API client (normalizes backend error contract)
│   ├── src/components/   Five views: overview, dashboard, inspector, submit, GST
│   └── src/types/        Shared TypeScript contracts (mirror Zod schemas)
├── server/               Express backend
│   ├── src/routes/       /cases and /dashboard routers
│   ├── src/services/     caseService (Supabase + in-memory fallback)
│   ├── src/schemas/      Zod request/response schemas
│   └── src/config/       Supabase client + OpenAPI spec
│   └── README.md         Detailed backend & database documentation
└── Nidhi-Kaan.md         Product / architecture narrative
```

---

## License

MIT — see `package.json`. Government prototype for pitch/demo purposes.