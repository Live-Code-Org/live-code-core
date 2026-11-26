# Configuration Directory

**Current Version:** `v0.2.0-alpha (MVP)`

This directory isolates infrastructure setup, environment loading, and external service connections from application routes, controllers, and models.

## Role in Open Core Architecture

In the Live Code **Open Core** model, `config/` is part of the public backend foundation. Its responsibility is to bootstrap the server cleanly and establish reliable connections to infrastructure dependencies such as MongoDB.

- **Public layer (`config/`):** Connection helpers, fail-fast startup behavior, and safe configuration patterns.
- **Protected layer (outside version control / internal services):** Production credentials, OAuth client secrets, webhook signing secrets, and internal service keys are never committed here; local values live in `.env` (gitignored) and production values are injected via environment configuration.

## Modules in This Directory

- `db.js` — Loads environment variables via `dotenv` and exports `connectDB()`, which establishes the Mongoose connection using `MONGO_URI`. Follows a fail-fast strategy: if MongoDB cannot be reached, it logs the error and exits with `process.exit(1)`. Can also be run standalone (`node config/db.js`) to verify database connectivity.

## Environment Requirements

Create a `.env` file in the project root (see `.env.example`) with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/livecode
```

## Development Roadmap and Progress

- [x] MongoDB connection module (`db.js`) using Mongoose.
- [x] Environment variable loading with `dotenv` and `.env.example` template.
- [x] Fail-fast startup handling (`process.exit(1)`) on database connection failure.
- [ ] Centralized application and HTTP request logging (In Progress / Planned).
- [ ] Environment-aware CORS whitelist and rate-limiting configuration (Planned).
