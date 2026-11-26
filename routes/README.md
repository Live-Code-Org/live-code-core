# Routes Directory

**Current Version:** `v0.2.0-alpha (MVP)`

This directory defines the Express routers that expose the Live Code REST API and bind URL paths and HTTP methods to controller handlers.

## Role in Open Core Architecture

In the Live Code **Open Core** model, `routes/` represents the public HTTP contract mounted in `server.js`. Keeping routing separate from controller logic makes the public API surface easy to audit and extend.

- **Public layer (`routes/`):** REST endpoint definitions, path parameters, and middleware attachment points.
- **Protected layer (internal services):** Internal-only endpoints for reputation computation, escrow processing, and private webhook ingestion are hosted in separate internal services rather than exposed through these public routers.

## Modules in This Directory

- `userRoutes.js` — Mounted at `/api/users` in `server.js`. Maps developer profile routes to `controllers/userController.js`.
- `teamRoutes.js` — Mounted at `/api/teams` in `server.js`. Maps team discovery, creation, membership, and settings routes to `controllers/teamController.js`.

## Endpoint Reference

### Users (`/api/users`)

| Method | Path | Handler | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/:githubHandle` | `getUserProfile` | Fetch a developer profile by GitHub handle. |
| `PUT` | `/api/users/:githubHandle` | `updateUserProfile` | Update whitelisted profile fields for a developer. |

### Teams (`/api/teams`)

| Method | Path | Handler | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/teams` | `getAllTeams` | List teams (supports `status` and `tech` query parameters). |
| `POST` | `/api/teams` | `createTeam` | Create a new team with creator and optional initial members. |
| `POST` | `/api/teams/:teamId/join` | `joinTeam` | Add an eligible user to a recruiting team. |
| `PATCH` | `/api/teams/:teamId/settings` | `updateTeamSettings` | Update team settings (team admins only). |

## Development Roadmap and Progress

- [x] User profile routes (`/api/users`).
- [x] Team discovery, creation, join, and settings routes (`/api/teams`).
- [ ] Route-level authentication and authorization middleware on mutating endpoints (In Progress).
- [ ] Expanded endpoints for user onboarding, single-team details (`GET /api/teams/:teamId`), and leaving or archiving teams (Planned).
- [ ] Health-check endpoint and request validation/rate-limiting middleware (Planned).
