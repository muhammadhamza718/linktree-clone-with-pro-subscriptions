# Tasks: Advanced Pro Features (Webhooks, A/B Testing, Team Collaboration)

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

## Phase 1: Database Schema & Models (Foundation)

**Purpose**: Implement Prisma schema updates and foundational data models for all three features

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [P] Design Webhook table schema with user_id, url, events, secret, is_active, retry_count, last_triggered_at (FR-001, FR-002, FR-003)
  - **Acceptance Criteria**: WebhookEndpoint model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: None

- [x] T002 [P] Design WebhookDelivery table schema with webhookId, payload, statusCode, response, attemptCount, status, deliveredAt (FR-004)
  - **Acceptance Criteria**: WebhookDelivery model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: T001

- [x] T003 [P] Design LinkVariant table schema with linkId, variantName, title, iconUrl, trafficSplitPercent, clickCount, viewCount (FR-008, FR-009)
  - **Acceptance Criteria**: LinkVariant model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: None

- [x] T004 [P] Design ABTest table schema with userId, testName, status, winnerVariantId, startedAt, endedAt, confidenceLevel, sampleSize (FR-011, FR-012)
  - **Acceptance Criteria**: ABTest model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: None

- [x] T005 [P] Design TeamMember table schema with profileId, userId, role, invitedBy, invitedAt, acceptedAt, isActive (FR-015, FR-016)
  - **Acceptance Criteria**: TeamMember model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: None

- [x] T006 [P] Design ActivityLog table schema with profileId, userId, action, entityType, entityId, changes, ipAddress, userAgent, timestamp (FR-018)
  - **Acceptance Criteria**: ActivityLog model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: None

- [x] T007 [P] Design BrandKitAsset table schema with profileId, assetType, assetUrl, assetName, isShared, createdBy (FR-019)
  - **Acceptance Criteria**: BrandKitAsset model exists with all required fields in prisma/schema.prisma
  - **Testing Strategy**: Unit test for schema validation
  - **Files to Create/Modify**: prisma/schema.prisma
  - **Dependencies**: None

- [x] T008 [P] Run 'npx prisma migrate dev' and verify migration success (FR-001, FR-002, FR-003, FR-004, FR-008, FR-009, FR-011, FR-012, FR-015, FR-016, FR-018, FR-019)
  - **Acceptance Criteria**: Database migration runs successfully with all new tables created
  - **Testing Strategy**: Manual verification of database tables
  - **Files to Create/Modify**: None (database)
  - **Dependencies**: T001, T002, T003, T004, T005, T006, T007

- [x] T009 [P] Create Prisma seed scripts for test data (FR-001, FR-002, FR-003, FR-004, FR-008, FR-009, FR-011, FR-012, FR-015, FR-016, FR-018, FR-019)
  - **Acceptance Criteria**: Seed script populates database with test data for all new entities
  - **Testing Strategy**: Run seed script and verify data exists
  - **Files to Create/Modify**: prisma/seed.ts
  - **Dependencies**: T008

- [x] T010 [P] Validate schema integrity and foreign key constraints (FR-001, FR-002, FR-003, FR-004, FR-008, FR-009, FR-011, FR-012, FR-015, FR-016, FR-018, FR-019)
  - **Acceptance Criteria**: All relationships properly defined with foreign key constraints
  - **Testing Strategy**: Unit test for relationship validation
  - **Files to Create/Modify**: None
  - **Dependencies**: T008

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 2: Webhooks Infrastructure (Event-Driven Architecture)

**Goal**: Build secure webhook delivery system with retry logic and management UI (linktree_srd.md:3.2.7, spec.md:US1)

**Independent Test**: Configure a webhook endpoint and verify that profile_view and link_click events trigger the webhook with proper payload and security signatures. Verify retry mechanism works when endpoint fails (spec.md:US1)

### Tests for User Story 1 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Write unit tests for webhook HMAC signature generation (FR-003)
  - **Acceptance Criteria**: Tests verify HMAC SHA-256 signature generation with user secret
  - **Testing Strategy**: Unit test file in tests/unit/webhooks/hmac.test.ts
  - **Files to Create/Modify**: tests/unit/webhooks/hmac.test.ts
  - **Dependencies**: None

- [x] T012 [P] [US1] Write unit tests for webhook delivery worker (FR-004)
  - **Acceptance Criteria**: Tests verify webhook delivery with retry logic and exponential backoff
  - **Testing Strategy**: Unit test file in tests/unit/webhooks/delivery-worker.test.ts
  - **Files to Create/Modify**: tests/unit/webhooks/delivery-worker.test.ts
  - **Dependencies**: None

- [x] T013 [P] [US1] Write integration tests for webhook event triggering (FR-002)
  - **Acceptance Criteria**: Tests verify webhooks triggered on profile_view, link_click, form_submission events
  - **Testing Strategy**: Integration test file in tests/integration/webhooks/events.test.ts
  - **Files to Create/Modify**: tests/integration/webhooks/events.test.ts
  - **Dependencies**: None

- [x] T014 [P] [US1] Write security tests for webhook rate limiting (FR-007)
  - **Acceptance Criteria**: Tests verify webhook rate limiting prevents abuse
  - **Testing Strategy**: Security test file in tests/security/webhooks/rate-limit.test.ts
  - **Files to Create/Modify**: tests/security/webhooks/rate-limit.test.ts
  - **Dependencies**: None

### Implementation for User Story 1

- [x] T015 [US1] Create webhook event emitter service in frontend/services/webhooks/event-emitter.ts (FR-002)
  - **Acceptance Criteria**: Service triggers webhooks on profile_view, link_click, form_submission events
  - **Testing Strategy**: Run T013 integration tests and verify they pass
  - **Files to Create/Modify**: frontend/services/webhooks/event-emitter.ts
  - **Dependencies**: T008, T013

- [x] T016 [US1] Build webhook delivery worker with retry logic in frontend/services/webhooks/delivery-worker.ts (FR-004)
  - **Acceptance Criteria**: Worker processes webhook deliveries with exponential backoff and max 3 retries
  - **Testing Strategy**: Run T012 unit tests and verify they pass
  - **Files to Create/Modify**: frontend/services/webhooks/delivery-worker.ts
  - **Dependencies**: T008, T012

- [x] T017 [US1] Implement HMAC signature generation for webhook payloads in frontend/lib/webhooks/security.ts (FR-003)
  - **Acceptance Criteria**: Service generates SHA-256 HMAC signatures with user's webhook secret
  - **Testing Strategy**: Run T011 unit tests and verify they pass
  - **Files to Create/Modify**: frontend/lib/webhooks/security.ts
  - **Dependencies**: T011

- [x] T018 [US1] Create webhook management API endpoints in frontend/app/api/webhooks/[id]/route.ts (FR-005)
  - **Acceptance Criteria**: API provides CRUD operations, test endpoint, and delivery log retrieval
  - **Testing Strategy**: Manual testing of all endpoints
  - **Files to Create/Modify**: frontend/app/api/webhooks/[id]/route.ts
  - **Dependencies**: T008, T015, T016, T017

- [x] T019 [US1] Implement WebhookConfigForm component in frontend/components/webhooks/config-form.tsx (FR-005)
  - **Acceptance Criteria**: Form allows creation, editing, and deletion of webhook endpoints
  - **Testing Strategy**: Manual testing of form functionality
  - **Files to Create/Modify**: frontend/components/webhooks/config-form.tsx
  - **Dependencies**: T018

- [x] T020 [US1] Implement WebhookLogsTable component in frontend/components/webhooks/logs-table.tsx (FR-005)
  - **Acceptance Criteria**: Table displays delivery logs with status and timestamps
  - **Testing Strategy**: Manual testing of table functionality
  - **Files to Create/Modify**: frontend/components/webhooks/logs-table.tsx
  - **Dependencies**: T018

- [x] T021 [US1] Add rate limiting to prevent webhook spam in frontend/middleware/rate-limit.ts (FR-007)
  - **Acceptance Criteria**: Webhook delivery limited to max 100/minute per user
  - **Testing Strategy**: Run T014 security tests and verify they pass
  - **Files to Create/Modify**: frontend/middleware/rate-limit.ts
  - **Dependencies**: T014

- [x] T022 [US1] Integrate webhook event emitter with profile view and link click events (FR-002)
  - **Acceptance Criteria**: Webhooks triggered when users visit profiles or click links
  - **Testing Strategy**: Manual verification of webhook triggering
  - **Files to Create/Modify**: frontend/app/@/[username]/page.tsx, frontend/lib/analytics.ts
  - **Dependencies**: T015

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 3: A/B Testing Engine (Traffic Splitting & Analytics)

**Goal**: Implement traffic splitting algorithm and statistical analysis for A/B testing (linktree_srd.md:3.2.8, spec.md:US2)

**Independent Test**: Create link variants, enable A/B testing, and verify traffic splits correctly between variants while tracking performance metrics. Verify statistical significance calculations and auto-promotion of winning variants (spec.md:US2)

### Tests for User Story 2 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T023 [P] [US2] Write unit tests for traffic splitting algorithm (FR-009)
  - **Acceptance Criteria**: Tests verify traffic splits according to configured ratios (50/50, 60/40, custom)
  - **Testing Strategy**: Unit test file in tests/unit/ab-testing/traffic-splitter.test.ts
  - **Files to Create/Modify**: tests/unit/ab-testing/traffic-splitter.test.ts
  - **Dependencies**: None

- [x] T024 [P] [US2] Write unit tests for statistical significance calculations (FR-011)
  - **Acceptance Criteria**: Tests verify statistical significance calculations with Chi-squared tests
  - **Testing Strategy**: Unit test file in tests/unit/ab-testing/statistics.test.ts
  - **Files to Create/Modify**: tests/unit/ab-testing/statistics.test.ts
  - **Dependencies**: None

- [x] T025 [P] [US2] Write integration tests for A/B test auto-promotion (FR-012)
  - **Acceptance Criteria**: Tests verify auto-promotion when confidence threshold (95%) is reached
  - **Testing Strategy**: Integration test file in tests/integration/ab-testing/auto-promotion.test.ts
  - **Files to Create/Modify**: tests/integration/ab-testing/auto-promotion.test.ts
  - **Dependencies**: None

- [x] T026 [P] [US2] Write performance tests for A/B testing overhead (FR-022)
  - **Acceptance Criteria**: Tests verify <50ms overhead on link redirects
  - **Testing Strategy**: Performance test file in tests/performance/ab-testing/redirect.test.ts
  - **Files to Create/Modify**: tests/performance/ab-testing/redirect.test.ts
  - **Dependencies**: None

### Implementation for User Story 2

- [x] T027 [US2] Build traffic splitting algorithm for link redirects in frontend/services/ab-testing/traffic-splitter.ts (FR-009)
  - **Acceptance Criteria**: Algorithm splits traffic based on LinkVariant percentages with consistent user assignment
  - **Testing Strategy**: Run T023 unit tests and verify they pass
  - **Files to Create/Modify**: frontend/services/ab-testing/traffic-splitter.ts
  - **Dependencies**: T008, T023

- [x] T028 [US2] Implement variant performance tracking in frontend/services/ab-testing/statistics.ts (FR-010, FR-011)
  - **Acceptance Criteria**: Service tracks CTR and calculates statistical significance with confidence levels
  - **Testing Strategy**: Run T024 unit tests and verify they pass
  - **Files to Create/Modify**: frontend/services/ab-testing/statistics.ts
  - **Dependencies**: T008, T024

- [x] T029 [US2] Create A/B test dashboard component in frontend/components/ab-testing/dashboard.tsx (FR-014)
  - **Acceptance Criteria**: Dashboard shows clear visualizations comparing variant performance with statistical significance
  - **Testing Strategy**: Manual testing of dashboard functionality
  - **Files to Create/Modify**: frontend/components/ab-testing/dashboard.tsx
  - **Dependencies**: T028

- [x] T030 [US2] Add 'Create Variant' and 'Manage Test' flows to link editor in frontend/components/profile/link-editor.tsx (FR-008, FR-009)
  - **Acceptance Criteria**: UI allows creating link variants and managing A/B tests
  - **Testing Strategy**: Manual testing of UI flows
  - **Files to Create/Modify**: frontend/components/profile/link-editor.tsx
  - **Dependencies**: T008, T027, T028

- [x] T031 [US2] Implement auto-promote winner logic in frontend/services/ab-testing/auto-promoter.ts (FR-012)
  - **Acceptance Criteria**: Service promotes winner when 95% confidence threshold is reached
  - **Testing Strategy**: Run T025 integration tests and verify they pass
  - **Files to Create/Modify**: frontend/services/ab-testing/auto-promoter.ts
  - **Dependencies**: T008, T028, T025

- [x] T032 [US2] Add theme snapshot system in frontend/services/ab-testing/theme-snapshot.ts (FR-013)
  - **Acceptance Criteria**: Service saves, previews, and rolls back theme versions
  - **Testing Strategy**: Manual testing of theme snapshot functionality
  - **Files to Create/Modify**: frontend/services/ab-testing/theme-snapshot.ts
  - **Dependencies**: None

- [x] T033 [US2] Create A/B test management API endpoints in frontend/app/api/ab-tests/[id]/route.ts (FR-009, FR-012)
  - **Acceptance Criteria**: API provides CRUD operations for A/B tests
  - **Testing Strategy**: Manual testing of all endpoints
  - **Files to Create/Modify**: frontend/app/api/ab-tests/[id]/route.ts
  - **Dependencies**: T008, T031

- [x] T034 [US2] Verify A/B testing adds no measurable latency to link redirects (FR-022)
  - **Acceptance Criteria**: Link redirects maintain <50ms overhead with A/B testing enabled
  - **Testing Strategy**: Run T026 performance tests and verify they pass
  - **Files to Create/Modify**: frontend/services/ab-testing/traffic-splitter.ts
  - **Dependencies**: T027, T026

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 4: Team Collaboration & RBAC (Multi-User Access)

**Goal**: Implement role-based access control and team management features (linktree_srd.md:3.2.9, spec.md:US3)

**Independent Test**: Invite team members with different roles, verify access permissions, and confirm audit logs track all changes. Verify that users can only access profiles they have permission for (spec.md:US3)

### Tests for User Story 3 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T035 [P] [US3] Write security tests for RBAC middleware (FR-016, FR-020)
  - **Acceptance Criteria**: Tests verify Owner/Editor/Viewer permissions enforced correctly
  - **Testing Strategy**: Security test file in tests/security/teams/rbac.test.ts
  - **Files to Create/Modify**: tests/security/teams/rbac.test.ts
  - **Dependencies**: None

- [x] T036 [P] [US3] Write integration tests for team member invitation flow (FR-017)
  - **Acceptance Criteria**: Tests verify invitation, token validation, and acceptance workflow
  - **Testing Strategy**: Integration test file in tests/integration/teams/invitation.test.ts
  - **Files to Create/Modify**: tests/integration/teams/invitation.test.ts
  - **Dependencies**: None

- [x] T037 [P] [US3] Write audit log tests for profile changes (FR-018)
  - **Acceptance Criteria**: Tests verify all profile changes logged with user, action, and timestamp
  - **Testing Strategy**: Integration test file in tests/integration/audit/profile-changes.test.ts
  - **Files to Create/Modify**: tests/integration/audit/profile-changes.test.ts
  - **Dependencies**: None

- [x] T038 [P] [US3] Write penetration tests for permission bypass attempts (FR-020)
  - **Acceptance Criteria**: Tests verify users cannot access unauthorized profiles or perform unauthorized actions
  - **Testing Strategy**: Security test file in tests/security/teams/penetration.test.ts
  - **Files to Create/Modify**: tests/security/teams/penetration.test.ts
  - **Dependencies**: None

### Implementation for User Story 3

- [x] T039 [US3] Implement team member invitation service in frontend/services/teams/invitation-service.ts (FR-017)
  - **Acceptance Criteria**: Service generates unique tokens, sends email invites, validates and accepts invitations
  - **Testing Strategy**: Run T036 integration tests and verify they pass
  - **Files to Create/Modify**: frontend/services/teams/invitation-service.ts
  - **Dependencies**: T008, T036

- [x] T040 [US3] Build RBAC middleware for permissions in frontend/middleware/rbac.ts (FR-016, FR-020)
  - **Acceptance Criteria**: Middleware enforces Owner/Editor/Viewer permissions on all profile modification endpoints
  - **Testing Strategy**: Run T035 security tests and verify they pass
  - **Files to Create/Modify**: frontend/middleware/rbac.ts
  - **Dependencies**: T008, T035

- [x] T041 [US3] Create TeamMemberManagement component in frontend/components/teams/member-management.tsx (FR-017)
  - **Acceptance Criteria**: UI allows inviting, managing roles, and removing team members
  - **Testing Strategy**: Manual testing of UI functionality
  - **Files to Create/Modify**: frontend/components/teams/member-management.tsx
  - **Dependencies**: T039, T040

- [x] T042 [US3] Implement activity audit logging in frontend/services/audit/activity-logger.ts (FR-018)
  - **Acceptance Criteria**: Service automatically logs all profile changes with user, action, and timestamp
  - **Testing Strategy**: Run T037 audit log tests and verify they pass
  - **Files to Create/Modify**: frontend/services/audit/activity-logger.ts
  - **Dependencies**: T008, T037

- [x] T043 [US3] Build shared brand kit UI in frontend/components/brand-kit/library.tsx (FR-019)
  - **Acceptance Criteria**: UI allows asset upload, color palette management, and team-wide media library access
  - **Testing Strategy**: Manual testing of UI functionality
  - **Files to Create/Modify**: frontend/components/brand-kit/library.tsx
  - **Dependencies**: T008

- [x] T044 [US3] Add permission validation to all existing API endpoints (FR-020)
  - **Acceptance Criteria**: All profile modification endpoints verify user permissions before allowing changes
  - **Testing Strategy**: Run T038 penetration tests and verify they pass
  - **Files to Create/Modify**: frontend/app/api/**/*, frontend/middleware/rbac.ts
  - **Dependencies**: T040, T038

- [x] T045 [US3] Create team management API endpoints in frontend/app/api/teams/[id]/route.ts (FR-017, FR-021)
  - **Acceptance Criteria**: API provides CRUD operations for team members
  - **Testing Strategy**: Manual testing of all endpoints
  - **Files to Create/Modify**: frontend/app/api/teams/[id]/route.ts
  - **Dependencies**: T008, T039

- [x] T046 [US3] Verify users can only access profiles they have permission for (FR-020)
  - **Acceptance Criteria**: Users cannot access profiles without proper permissions
  - **Testing Strategy**: Manual verification of access controls
  - **Files to Create/Modify**: frontend/middleware/rbac.ts
  - **Dependencies**: T040

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 5: Integration, Testing & Security Hardening

**Purpose**: Comprehensive testing and security validation of all features

- [x] T047 [P] Write comprehensive unit tests for all new services (FR-001-025)
  - **Acceptance Criteria**: 100% test coverage for RBAC logic and critical business logic
  - **Testing Strategy**: Unit tests for webhook delivery, traffic splitting, RBAC
  - **Files to Create/Modify**: tests/unit/**/*.test.ts
  - **Dependencies**: All previous tasks

- [x] T048 [P] Create integration tests for end-to-end workflows (FR-001-025)
  - **Acceptance Criteria**: Tests cover invite team member → accept → edit profile → verify audit log
  - **Testing Strategy**: End-to-end integration tests
  - **Files to Create/Modify**: tests/integration/**/*.test.ts
  - **Dependencies**: T039, T042

- [x] T049 [P] Perform security audit and penetration testing (FR-001-025)
  - **Acceptance Criteria**: All security vulnerabilities addressed, no critical issues found
  - **Testing Strategy**: Security audit checklist
  - **Files to Create/Modify**: None
  - **Dependencies**: All previous tasks

- [x] T050 [P] Load test A/B testing redirect performance (FR-022)
  - **Acceptance Criteria**: A/B testing maintains <50ms overhead under load
  - **Testing Strategy**: Load testing with tools like Artillery
  - **Files to Create/Modify**: tests/performance/load-test.yml
  - **Dependencies**: T027

- [x] T051 [P] Document all new API endpoints and UI flows in README (FR-001-025)
  - **Acceptance Criteria**: All new API endpoints documented with examples
  - **Testing Strategy**: Documentation review
  - **Files to Create/Modify**: README.md
  - **Dependencies**: All previous tasks

- [x] T052 [P] Verify webhook delivery success rate >95% under normal load (FR-001, FR-002, FR-004)
  - **Acceptance Criteria**: Webhook delivery system handles failures gracefully with 95%+ success rate
  - **Testing Strategy**: Load testing with webhook delivery verification
  - **Files to Create/Modify**: tests/performance/webhooks/load.test.ts
  - **Dependencies**: T016

- [x] T053 [P] Verify A/B tests show statistical significance within 100 clicks (FR-010, FR-011)
  - **Acceptance Criteria**: Statistical significance achieved within 100 clicks for typical traffic
  - **Testing Strategy**: Statistical validation tests
  - **Files to Create/Modify**: tests/unit/ab-testing/statistics.test.ts
  - **Dependencies**: T028

- [x] T054 [P] Verify activity logs capture 100% of profile changes (FR-018)
  - **Acceptance Criteria**: Every profile modification logged with full audit trail
  - **Testing Strategy**: Audit verification tests
  - **Files to Create/Modify**: tests/integration/audit/verification.test.ts
  - **Dependencies**: T042

- [x] T055 [P] Verify <2s profile load times with all new features enabled (FR-022)
  - **Acceptance Criteria**: Profile load times remain under 2 seconds with all features active
  - **Testing Strategy**: Performance benchmarking tests
  - **Files to Create/Modify**: tests/performance/profile-load.test.ts
  - **Dependencies**: All previous tasks

- [x] T056 [P] Create user guides for new features (FR-001-025)
  - **Acceptance Criteria**: User guides available for webhook configuration, A/B testing, and team collaboration
  - **Testing Strategy**: Documentation review
  - **Files to Create/Modify**: docs/user-guides/webhooks.md, docs/user-guides/ab-testing.md, docs/user-guides/team-collaboration.md
  - **Dependencies**: All previous tasks

**Checkpoint**: All user stories should now be independently functional

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
Task: "Write unit tests for webhook HMAC signature generation (FR-003)"
Task: "Write unit tests for webhook delivery worker (FR-004)"
Task: "Write integration tests for webhook event triggering (FR-002)"
Task: "Write security tests for webhook rate limiting (FR-007)"

# Launch all models for User Story 1 together:
Task: "Create webhook event emitter service in frontend/services/webhooks/event-emitter.ts (FR-002)"
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
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Webhooks)
   - Developer B: User Story 2 (A/B Testing)
   - Developer C: User Story 3 (Team Collaboration)
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