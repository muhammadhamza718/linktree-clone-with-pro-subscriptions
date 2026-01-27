# Tasks: Pro Features (Phase 2)

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `app/`, `components/`, `lib/`, `prisma/`, `types/` at repository root
- Paths adjusted based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Update package.json with new dependencies for analytics, queue processing, and advanced UI components
- [X] T002 [P] Install additional dependencies: Recharts, react-datepicker, sharp for image processing
- [X] T003 Update environment variables with new configuration for analytics and domain services

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Update Prisma schema with new fields for Link (startDate, endDate, timezone, passwordHash, isAgeGated, isPinned) (linktree_srd.md:178-188)
- [X] T005 Create CustomDomain model in prisma/schema.prisma (linktree_srd.md:208-212)
- [X] T006 Extend AnalyticsEvent model with geolocation and device tracking fields (linktree_srd.md:164-172)
- [X] T007 Create RichContentBlock model in prisma/schema.prisma (linktree_srd.md:221-237)
- [X] T008 Create CustomCSS model in prisma/schema.prisma for advanced styling (linktree_srd.md:215-218)
- [X] T009 Create ContactSubmission model in prisma/schema.prisma for contact forms (linktree_srd.md:234-237)
- [X] T010 Generate Prisma client with new models and fields (Note: Requires database setup for full generation)
- [X] T011 Create analytics queue service for processing events asynchronously to maintain <2s load times (linktree_srd.md:168-172)
- [X] T012 Implement IP geolocation service for visitor demographics (linktree_srd.md:164-167)
- [X] T013 Create link scheduling service with timezone-aware visibility checks (linktree_srd.md:180-188)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Advanced Analytics (Priority: P1) 🎯

**Goal**: Implement detailed visitor analytics with geolocation, device tracking, and click heatmaps to enable data-driven decisions (linktree_srd.md:163-176, spec.md:US1)

**Independent Test**: Access the analytics dashboard and view geographic location, device type, browser detection, and click heatmaps for profile visits and link clicks (spec.md:US1)

### Tests for User Story 1 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Unit test for analytics event validation in tests/unit/analytics.test.ts
- [ ] T015 [P] [US1] Integration test for analytics data collection in tests/integration/analytics.test.ts
- [ ] T016 [P] [US1] E2E test for analytics dashboard access in tests/e2e/analytics.test.ts

### Implementation for User Story 1

- [X] T017 [P] [US1] Create AnalyticsEventExtended model with geolocation and device tracking fields in prisma/schema.prisma (spec.md:AnalyticsEventExtended entity)
- [X] T018 [US1] Implement analytics API route for tracking events in app/api/analytics/track/route.ts (linktree_srd.md:168-172)
- [X] T019 [US1] Create analytics service for processing and storing events in lib/analytics.ts (linktree_srd.md:168-172)
- [X] T020 [US1] Implement analytics dashboard page in app/(dashboard)/dashboard/analytics/page.tsx (linktree_srd.md:163-176)
- [X] T021 [US1] Create analytics dashboard component with Recharts visualizations in components/analytics/analytics-dashboard.tsx (linktree_srd.md:163-176)
- [X] T022 [US1] Add geographic visualization component for country/city data in components/analytics/geographic-chart.tsx (linktree_srd.md:164-167)
- [X] T023 [US1] Create device and browser detection component in components/analytics/device-chart.tsx (linktree_srd.md:165-167)
- [X] T024 [US1] Implement click heatmap visualization in components/analytics/heatmap.tsx (linktree_srd.md:169-170)
- [X] T025 [US1] Add CSV export functionality for analytics data in lib/analytics-export.ts (linktree_srd.md:173-176)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Link Scheduling & Automation (Priority: P1)

**Goal**: Enable users to schedule links with activation/expiry dates and timezone-aware visibility for automated content management (linktree_srd.md:180-188, spec.md:US2)

**Independent Test**: Schedule a link to activate in the future and verify it becomes visible at the scheduled time, and schedule another to expire and verify it disappears after the scheduled end time (spec.md:US2)

### Tests for User Story 2 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T026 [P] [US2] Unit test for link scheduling validation in tests/unit/link-scheduling.test.ts
- [X] T027 [P] [US2] Integration test for scheduled link visibility in tests/integration/scheduled-links.test.ts
- [X] T028 [P] [US2] E2E test for link scheduling workflow in tests/e2e/link-scheduling.test.ts

### Implementation for User Story 2

- [X] T029 [P] [US2] Update Link model with scheduling fields (startDate, endDate, timezone) in prisma/schema.prisma (linktree_srd.md:180-188)
- [X] T030 [US2] Implement link scheduling API endpoints in app/api/links/schedule/route.ts (linktree_srd.md:180-188)
- [X] T031 [US2] Create link schedule picker component in components/links/link-schedule-picker.tsx (linktree_srd.md:180-188)
- [X] T032 [US2] Write test -> Implement "Is link visible based on schedule?" logic in lib/link-scheduling.ts (linktree_srd.md:180-188)
- [X] T033 [US2] Update profile rendering to respect scheduled visibility in app/@/[username]/page.tsx (linktree_srd.md:180-188)
- [X] T034 [US2] Add scheduled links section to link manager in components/profile/link-manager.tsx (linktree_srd.md:180-188)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Advanced Link Options (Priority: P2)

**Goal**: Add password protection, age-gating, and link pinning to enhance control and privacy for specific links (linktree_srd.md:192-204, spec.md:US3)

**Independent Test**: Create a password-protected link and verify it requires password entry, create an age-gated link and verify it shows age verification, and pin an important link to verify it stays at the top (spec.md:US3)

### Tests for User Story 3 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T035 [P] [US3] Unit test for password protection validation in tests/unit/password-protection.test.ts
- [X] T036 [P] [US3] Integration test for age-gate functionality in tests/integration/age-gate.test.ts
- [X] T037 [P] [US3] E2E test for link pinning in tests/e2e/link-pinning.test.ts

### Implementation for User Story 3

- [X] T038 [P] [US3] Update Link model with password and age-gate fields in prisma/schema.prisma (linktree_srd.md:195-198)
- [X] T039 [US3] Implement password protection middleware in middleware/password-protection.ts (linktree_srd.md:196)
- [X] T040 [US3] Create password-protected link component in components/links/password-protected-link.tsx (linktree_srd.md:196)
- [X] T041 [US3] Implement age-gate modal component in components/links/age-gate-modal.tsx (linktree_srd.md:197)
- [X] T042 [US3] Add link pinning functionality in components/profile/link-manager.tsx (linktree_srd.md:192-194)
- [X] T043 [US3] Create API endpoint for updating link pinning status in app/api/links/[id]/pin/route.ts (linktree_srd.md:192-194)

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Custom Branding & White-Label (Priority: P2)

**Goal**: Enable custom domain connections with SSL provisioning and advanced CSS customization for white-label experience (linktree_srd.md:208-218, spec.md:US4)

**Independent Test**: Connect a custom domain and verify the profile is accessible via that domain, and apply custom CSS to verify it changes the profile appearance (spec.md:US4)

### Tests for User Story 4 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T044 [P] [US4] Unit test for custom domain validation in tests/unit/custom-domain.test.ts
- [ ] T045 [P] [US4] Integration test for domain connection flow in tests/integration/domain-connection.test.ts
- [ ] T046 [P] [US4] E2E test for custom CSS application in tests/e2e/custom-css.test.ts

### Implementation for User Story 4

- [X] T047 [P] [US4] Create CustomDomain model in prisma/schema.prisma (linktree_srd.md:208-212)
- [X] T048 [US4] Implement custom domain API endpoints in app/api/domains/route.ts (linktree_srd.md:208-212)
- [X] T049 [US4] Create domain connection wizard component in components/domains/domain-connect-wizard.tsx (linktree_srd.md:208-212)
- [X] T050 [US4] Implement custom domain middleware in middleware.ts (linktree_srd.md:208-212)
- [X] T051 [US4] Create custom CSS editor component in components/branding/custom-css-editor.tsx (linktree_srd.md:215-218)
- [X] T052 [US4] Add SSL certificate provisioning logic in lib/domain-ssl.ts (linktree_srd.md:210-211)
- [X] T053 [US4] Update public profile rendering to support custom domains and CSS in app/@/[username]/page.tsx (linktree_srd.md:208-218)

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Rich Content Blocks (Priority: P2)

**Goal**: Add embedded content (YouTube, Spotify), contact forms, and formatted text blocks to enrich profiles beyond simple links (linktree_srd.md:221-237, spec.md:US5)

**Independent Test**: Add a YouTube embed and verify it displays properly, add a contact form and verify it captures submissions, and add a text block with formatting and verify it renders correctly (spec.md:US5)

### Tests for User Story 5 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T054 [P] [US5] Unit test for rich content validation in tests/unit/rich-content.test.ts
- [ ] T055 [P] [US5] Integration test for embedded content security in tests/integration/embed-security.test.ts
- [ ] T056 [P] [US5] E2E test for contact form functionality in tests/e2e/contact-form.test.ts

### Implementation for User Story 5

- [X] T057 [P] [US5] Create RichContentBlock model in prisma/schema.prisma (linktree_srd.md:221-237)
- [X] T058 [US5] Implement rich content API endpoints in app/api/content/blocks/route.ts (linktree_srd.md:221-237)
- [X] T059 [US5] Create embedded content component with security sandboxing in components/content/embedded-content.tsx (linktree_srd.md:222-226)
- [X] T060 [US5] Implement contact form component with anti-spam protection in components/content/contact-form.tsx (linktree_srd.md:234-237)
- [X] T061 [US5] Add rich text editor component with markdown support in components/content/rich-text-editor.tsx (linktree_srd.md:227-230)
- [X] T062 [US5] Create contact form submission handler in app/api/content/form/submit/route.ts (linktree_srd.md:234-237)
- [ ] T063 [US5] Update public profile to render rich content blocks in app/@/[username]/page.tsx (linktree_srd.md:221-237)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T064 [P] Add performance monitoring for analytics-heavy pages to ensure <2s load times (linktree_srd.md:172, spec.md:SC-006)
- [ ] T065 Update documentation in README.md to include Pro features
- [ ] T066 Add security headers for embedded content and password-protected links
- [ ] T067 Implement proper error handling for geolocation service failures
- [ ] T068 Add proper timezone handling for scheduled links across different regions
- [ ] T069 Run all user stories through quickstart validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for analytics event validation in tests/unit/analytics.test.ts"
Task: "Integration test for analytics data collection in tests/integration/analytics.test.ts"
Task: "E2E test for analytics dashboard access in tests/e2e/analytics.test.ts"

# Launch all models for User Story 1 together:
Task: "Create AnalyticsEventExtended model with geolocation and device tracking fields in prisma/schema.prisma"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Advanced Analytics)
   - Developer B: User Story 2 (Link Scheduling)
   - Developer C: User Story 3 (Link Protection)
   - Developer D: User Story 4 (Custom Branding)
   - Developer E: User Story 5 (Rich Content)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence