---
id: 3
title: Pro Features Tasks Generation
stage: tasks
date: 2026-01-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: pro-features
branch: 002-pro-features
user: user
command: sp.tasks
labels: [tasks, pro-features, analytics, scheduling, custom-domains, security]
links:
  spec: specs/002-pro-features/spec.md
  plan: specs/002-pro-features/plan.md
  tasks: specs/002-pro-features/tasks.md
  research: specs/002-pro-features/research.md
  data-model: specs/002-pro-features/data-model.md
  contracts: specs/002-pro-features/contracts/
  quickstart: specs/002-pro-features/quickstart.md
files:
 - specs/002-pro-features/tasks.md
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

Generate a granular checklist of tasks for Milestone 3.2: Pro Features (Phase 2), based on our new specification and plan.

Requirements for each task:
1. **Schema First**: Ensure the first set of tasks covers ALL Prisma schema updates (`Link` scheduling fields, `CustomDomain` model, `AnalyticsEvent` expansion).
2. **Logic Updates**: Tasks for updating `Link` creation/editing logic to handle start/end dates and sensitive content switches.
3. **New Components**:
    - `LinkSchedulePicker` (datepicker).
    - `AnalyticsDashboard` (using Recharts).
    - `DomainConnect` wizard.
4. **Middleware**: A specific task to implement password protection interception in middleware or server components.
5. **TDD Workflow**: Explicitly mention "Write Test -> Implement" for complex logic like "Is link visible based on schedule?".

Group tasks by feature: **Scheduling**, **Analytics**, **Domains**, **Security**.

## Response snapshot

Created comprehensive granular task list for Pro Features (Phase 2) in specs/002-pro-features/tasks.md with 63 detailed tasks organized by user stories. Tasks include:
- Schema updates (Link model extensions, CustomDomain, AnalyticsEvent expansion)
- Analytics dashboard with Recharts visualizations
- Link scheduling with timezone-aware visibility
- Password protection and age-gating
- Custom domain support with SSL provisioning
- Rich content blocks with embedded content and contact forms
- All tasks follow constitutional principles (Zero-Subscription, <2s performance)

Tasks organized in proper execution order with dependencies and parallelization opportunities identified. Each task includes specific file paths and references to requirements in the SRS document.

## Outcome

- ✅ Impact: Complete task breakdown with 63 granular tasks across 5 user stories
- 🧪 Tests: TDD approach integrated with test-first tasks for each user story
- 📁 Files: Created specs/002-pro-features/tasks.md with complete task breakdown
- 🔁 Next prompts: Ready for implementation following the task sequence
- 🧠 Reflection: Tasks are granular, traceable to requirements, and enable parallel development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All constitutional checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A