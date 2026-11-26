# Live Code | Core API

**Current Version:** `v0.2.0-alpha (MVP)`

Welcome to the **Live Code Core API** repository. This is the public Node.js, Express, and MongoDB backend powering the Live Code platform, which connects developers into small, balanced teams to build open-source software products and establish verifiable proof of work.

## Architecture and Open Core Model

Live Code follows an **Open Core** architecture. This repository contains the transparent, open-source backend layer that contributors and integrators can inspect, run locally, and extend:

- [`config/`](config/README.md) — Environment loading and MongoDB connection bootstrap.
- [`models/`](models/README.md) — Mongoose schemas (`User`, `Team`, `ScoreEvent`) defining the platform data contract.
- [`controllers/`](controllers/README.md) — Request validation, Open Core domain rules, and database operations.
- [`routes/`](routes/README.md) — Express routers mapping REST endpoints to controllers.
- `server.js` — Express application entry point, middleware setup (`cors`, `express.json`), and route mounting (`/api/users`, `/api/teams`).

**Protected Internal Services:** Proprietary reputation scoring algorithms, 14-day escrow vesting workers, anti-gaming heuristics, and GitHub webhook verification/processing are maintained in separate internal services to protect platform integrity.

## API Overview

The server mounts the following REST route groups:

- `/api/users` — Retrieve developer profiles and update whitelisted profile fields by GitHub handle.
- `/api/teams` — Browse recruiting teams, create new teams, join teams, and update team settings.

See [`routes/README.md`](routes/README.md) for the full endpoint list.

## Development Roadmap and Progress

- [x] **Phase 1: Core Data Models** — `User`, `Team`, and `ScoreEvent` Mongoose schemas with compound indexes.
- [x] **Phase 2: Server and Database Bootstrap** — Express server initialization (`server.js`) and fail-fast MongoDB connection (`config/db.js`).
- [ ] **Phase 3: Core API Layer (In Progress)** — User profile read/update and Team create/list/join/settings endpoints are implemented; user onboarding, single-team lookup, and leave/archive team flows are remaining.
- [ ] **Phase 4: Authentication and Authorization** — OAuth (GitHub/Google) and middleware to verify the acting user on protected routes.
- [ ] **Phase 5: Matchmaking and Discovery** — Enhanced filtering, pagination, and developer-to-team matching endpoints.
- [ ] **Phase 6: GitHub Webhooks and Reputation Integration** — Syncing GitHub activity with the `ScoreEvent` escrow ledger.

## Local Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas connection string)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Live-Code-Org/TeamCode-mvp.git
   cd TeamCode-mvp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env` in the repository root and set your values:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/livecode
   ```

   Never commit `.env` to version control.

4. **Start the server:**

   ```bash
   node server.js
   ```

   For automatic restarts during development:

   ```bash
   npx nodemon server.js
   ```

   When started successfully, the console logs `MongoDB Connected` and `Server is running on port 5000`.

---

#### _bulded with ❤️ by Live Code community_ 