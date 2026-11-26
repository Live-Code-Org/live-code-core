# Controllers Directory

**Current Version:** `v0.2.0-alpha (MVP)`

This directory contains the Express request handlers that validate input, enforce application rules, and perform database operations against the Mongoose models.

## Role in Open Core Architecture

In the Live Code **Open Core** model, `controllers/` is part of the public API layer. It handles transparent CRUD operations and domain-level validation rules that govern how users and teams interact through the REST API.

- **Public layer (`controllers/`):** Input validation, whitelisted field updates, team capacity and role-policy enforcement, and state synchronization between `User` and `Team` documents.
- **Protected layer (internal services):** Reputation score calculations, escrow vesting jobs, anti-gaming checks, and GitHub webhook event processing are handled outside this directory in private services.

## Modules in This Directory

- `userController.js` — Manages developer profile operations keyed by case-insensitive `githubHandle`:
  - `getUserProfile` — Fetches a user document (excluding `__v`) and returns `404` if not found.
  - `updateUserProfile` — Applies a strict allowlist (`fullName`, `avatarUrl`, `primaryRole`, `skillLevel`, `techStack`, `weeklyHours`, `workStyle`) with Mongoose validators enabled, protecting system-managed fields such as `reputationScore`, `metrics`, and `certification`.
- `teamController.js` — Manages team lifecycle and membership operations:
  - `getAllTeams` — Lists teams for the Discovery Lobby (defaults to `status=recruiting`), supports optional `tech` filtering, populates basic member profiles, and sorts newest first.
  - `createTeam` — Creates a team with the creator assigned as admin, validates initial members, and updates all participating users to `status: 'in_team'` with `currentTeam`.
  - `joinTeam` — Validates team recruitment status, user eligibility, and role constraints before appending a new member and syncing the user's `currentTeam`.
  - `updateTeamSettings` — Allows team admins to update `allowDuplicateRoles`, `description`, and `status`.
  - `validateTeamMembers` (internal helper) — Enforces the 5-member limit, valid/existing user IDs, no duplicate users, single active team per user, and the team's `allowDuplicateRoles` policy (`409` with `DUPLICATE_ROLE_NOT_ALLOWED`).

## Conventions

- Handlers return JSON responses with standard HTTP status codes (`200`, `201`, `400`, `403`, `404`, `409`, `500`).
- Mongoose `ValidationError` and duplicate key errors (`11000`) are mapped to `400` responses with descriptive messages.

## Development Roadmap and Progress

- [x] User profile retrieval and whitelisted update handlers (`userController.js`).
- [x] Team discovery, creation, join, and admin settings handlers (`teamController.js`).
- [x] Shared team membership and duplicate-role validation (`validateTeamMembers`).
- [ ] Additional lifecycle handlers: user onboarding, single-team lookup, and leave/archive team (In Progress).
- [ ] Authentication context integration: derive acting user from verified auth middleware instead of request body IDs (`creatorId`, `userId`) (Planned).
- [ ] Read-only `ScoreEvent` history handlers for user and team activity feeds (Planned).
