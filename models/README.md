# Models Directory

**Current Version:** `v0.2.0-alpha (MVP)`

This directory defines the Mongoose schemas that serve as the data contract for the Live Code backend.

## Role in Open Core Architecture

In the Live Code **Open Core** model, `models/` is completely public and documented so contributors and integrators can inspect the exact data structures, validation rules, and compound indexes used by the platform.

- **Public layer (`models/`):** Schema definitions, field constraints, enum values, relationships, and query indexes.
- **Protected layer (internal services):** Algorithms that compute `reputationScore`, update 4-axis ratings, evaluate team health/synergy, and process 14-day `ScoreEvent` escrow vesting live in separate internal services.

## Modules in This Directory

- `User.js` — Developer profiles including identity (`fullName`, `email`, `githubHandle`, `authProvider`), matchmaking attributes (`status`, `primaryRole`, `skillLevel`, `techStack`, `weeklyHours`, `workStyle`, `currentTeam`), proof-of-work counters, the 4-axis rating model (`codeQuality`, `collaboration`, `reliability`, `productImpact`), and certification metadata (`planTier`, `certification`). Indexed for matchmaking queries.
- `Team.js` — Team and project records including metadata (`name`, `description`, `techStack`, `status`, `allowDuplicateRoles`), lifecycle and hierarchy (`lifecycleStage`, `parentTeam`), GitHub repository and GitHub App sync configuration (`github`, `githubConfig`), capped team membership (`members`, maximum 5 members with `roleInTeam` and `isAdmin`), and activity/health metrics (`projectHealth`, `teamSynergy`). Indexed for discovery queries.
- `ScoreEvent.js` — Immutable reputation audit log capturing `authorId`, `reviewerIds` (Shared Fate), `teamId`, `eventType`, non-zero `pointsDelta`, `sourceRef`, and 14-day escrow vesting (`status`, `vestsAt`). Indexed on `{ status, vestsAt }` for background escrow workers.

## Development Roadmap and Progress

- [x] `User` schema: identity, matchmaking fields, 4-axis ratings, certification metadata, and discovery index.
- [x] `Team` schema: project metadata, `allowDuplicateRoles` policy, lifecycle stages, GitHub config, 5-member cap, and discovery index.
- [x] `ScoreEvent` schema: reputation ledger with 14-day vesting escrow and worker index.
- [ ] Schema refinements as authentication and onboarding endpoints are added (In Progress).
- [ ] `Showcase` schema: public portfolio records for graduated teams and verified contribution breakdowns (Planned).
