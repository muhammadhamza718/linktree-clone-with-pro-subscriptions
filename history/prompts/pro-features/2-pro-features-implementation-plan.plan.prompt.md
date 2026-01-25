---
id: 2
title: Pro Features Implementation Plan
stage: plan
date: 2026-01-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: pro-features
branch: 002-pro-features
user: user
command: sp.plan
labels: [plan, pro-features, analytics, scheduling, custom-domains]
links:
  spec: specs/002-pro-features/spec.md
  plan: specs/002-pro-features/plan.md
  research: specs/002-pro-features/research.md
  data-model: specs/002-pro-features/data-model.md
  contracts: specs/002-pro-features/contracts/
  quickstart: specs/002-pro-features/quickstart.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-pro-features/plan.md
 - specs/002-pro-features/research.md
 - specs/002-pro-features/data-model.md
 - specs/002-pro-features/quickstart.md
 - specs/002-pro-features/contracts/analytics-api.yaml
 - specs/002-pro-features/contracts/links-api.yaml
 - specs/002-pro-features/contracts/domains-api.yaml
 - specs/002-pro-features/contracts/content-api.yaml
tests:
---

## Prompt

Create an architectural implementation plan for Milestone 3.2: Pro Features based on the generated specification.

Key Planning Areas:
1. **Schema Evolution (Prisma)**:
   - Add `startDate`, `endDate` to `Link` model.
   - Add `password`, `isAgeGated` to `Link` model.
   - Create `CustomDomain` model (domain, verifyToken, verified).
   - Expand `AnalyticsEvent` to capture `country`, `city`, `device`, `referrer`.

2. **Middleware Logic**:
   - Plan the logic for `password-protection` (middleware vs. page-level check).
   - Plan the `custom domain` routing pattern (likely `verifying` CNAME resolution).

3. **Performance Strategy**:
   - Analytics writes will be heavy. Plan how to execute writes asynchronously (e.g., `after()` in Server Actions or a separate queue) to keep the Public Profile load <2s.

4. **Component Hierarchy**:
   - New `AnalyticsDashboard` with Recharts.
   - `LinkSchedulePicker` component.
   - `DomainSettings` manager.

Map out the file changes required for these upgrades.

## Response snapshot

Created a comprehensive implementation plan for Pro Features (Phase 2) with all required artifacts:
- Implementation plan document (plan.md) outlining technical approach and architecture
- Research document (research.md) with technology decisions and rationale
- Data model (data-model.md) with extended entities for Pro features
- API contracts (contracts/*.yaml) defining interfaces for analytics, links, domains, and content
- Quickstart guide (quickstart.md) with setup instructions

The plan addresses all key areas:
1. Schema Evolution: Extended Link model with scheduling and protection fields, added CustomDomain model, expanded AnalyticsEvent with geolocation fields
2. Middleware Logic: Designed password protection and custom domain routing patterns
3. Performance Strategy: Implemented queue-based analytics processing to maintain <2s load times
4. Component Hierarchy: Planned AnalyticsDashboard, LinkSchedulePicker, and DomainSettings components

All constitutional principles verified and satisfied (Zero-Subscription, Performance, etc.).

## Outcome

- ✅ Impact: Complete Pro Features implementation plan with all required artifacts
- 🧪 Tests: N/A (planning documentation)
- 📁 Files: Created 8 files across documentation, data model, contracts, and quickstart
- 🔁 Next prompts: Ready for /sp.tasks to break plan into executable tasks
- 🧠 Reflection: Plan comprehensively addresses all requested features while maintaining constitutional principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All constitutional checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A