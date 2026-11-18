# Models: The Data Contract

**Current Version:** `v0.2.0-alpha (MVP)`

## Overview
This directory defines the **Mongoose Schemas** that serve as the data contract for the **Live Code** platform. 

In accordance with our **Open Core** architecture, our database structures are completely open-source and documented. Contributors and integrators can inspect the exact data shapes, validation rules, and compound indexes powering our matchmaking engine and proof-of-work tracking.

## Schemas in This Directory

* **`User.js`:** Developer profiles, matchmaking parameters (`techStack`, `workStyle`, `weeklyHours`), certification status, and the 4-axis rating system (`codeQuality`, `collaboration`, `reliability`, `productImpact`).
* **`Team.js`:** Project metadata, lifecycle stages (`sandbox` to `market_product`), sub-team hierarchy (`parentTeam`), GitHub App automation configs, and project/team health metrics.
* **`ScoreEvent.js`:** Immutable audit log for reputation changes, implementing the **14-Day Escrow** (`vestsAt`) and **Shared Fate** (`reviewerIds`) anti-gaming mechanisms.

## Development Roadmap & Progress

- [x] **User Schema:** Identity, Matchmaking parameters, Certification engine, and 4-Axis Rating model.
- [x] **Team Schema:** Project metadata, Lifecycle stages, GitHub automation config, and Team/Project metrics.
- [x] **ScoreEvent Schema:** Reputation event ledger with 14-day vesting escrow and background worker indexing.
- [ ] **Showcase Schema (Planned):** Public portfolio records for graduated teams and verified contribution breakdowns.