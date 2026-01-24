---
description: "Task list for MVP Core Features implementation"
---

# Tasks: MVP Core Features (Phase 1)

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks following Red-Green-Refactor workflow from constitutional requirements.

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

- [X] T001 Create Next.js 16.1.4 project structure with React 19.2.3
- [X] T002 Install dependencies: Better Auth, Prisma ORM, Tailwind CSS 4, shadcn/ui, PostgreSQL
- [X] T003 [P] Configure TypeScript with Next.js App Router settings
- [X] T004 [P] Initialize Git repository and set up basic configuration
- [X] T005 [P] Configure ESLint and Prettier for code formatting

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Set up Prisma schema with User, Profile, Link, Theme, and AnalyticsEvent entities (linktree_srd.md:131-135)
- [X] T007 [P] Initialize PostgreSQL database connection with Prisma
- [X] T008 [P] Configure Better Auth with email/password and OAuth (Google, GitHub) (linktree_srd.md:72, spec.md:FR-001)
- [X] T009 Create database migration and seed scripts for initial data
- [X] T010 Configure Next.js middleware for authentication protection
- [X] T011 Set up environment variables and configuration management
- [X] T012 [P] Configure Tailwind CSS 4 with custom theme support
- [X] T013 Create shared utility functions and validation helpers
- [X] T014 Define TypeScript types for all entities (linktree_srd.md:131-135)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Profile Setup (Priority: P1) 🎯 MVP

**Goal**: Enable new users to register accounts, set up profile information, and publish profiles within 5 minutes (linktree_srd.md:72-78, spec.md:US1)

**Independent Test**: Register a new account and complete profile setup, delivering immediate value of having a personalized profile page (spec.md:US1)

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T015 [P] [US1] Unit test for User registration validation in tests/unit/auth.test.ts
- [X] T016 [P] [US1] Integration test for profile creation in tests/integration/profile.test.ts
- [X] T017 [P] [US1] E2E test for registration flow in tests/e2e/auth-flow.test.ts

### Implementation for User Story 1

- [X] T018 [P] [US1] Create User model in prisma/schema.prisma (spec.md:User entity)
- [X] T019 [P] [US1] Create Profile model in prisma/schema.prisma (spec.md:Profile entity)
- [X] T020 [US1] Implement registration page in app/(auth)/register/page.tsx (linktree_srd.md:72-73)
- [X] T021 [US1] Implement login page in app/(auth)/login/page.tsx (linktree_srd.md:72-73)
- [X] T022 [US1] Create profile setup form in app/(dashboard)/profile/page.tsx (linktree_srd.md:82-89)
- [X] T023 [US1] Implement username validation API endpoint in app/api/profile/username-available/route.ts (linktree_srd.md:88-91, spec.md:FR-002)
- [X] T024 [US1] Create profile editor component in components/profile/profile-editor.tsx (linktree_srd.md:82-89)
- [X] T025 [US1] Add profile image upload functionality with validation (linktree_srd.md:83, spec.md:FR-014)
- [X] T026 [US1] Implement real-time slug availability checking (linktree_srd.md:88-91, spec.md:FR-015)
- [X] T027 [US1] Add OAuth buttons component for Google and GitHub login (linktree_srd.md:74, spec.md:FR-001)
- [X] T028 [US1] Set up profile preview functionality (spec.md:US1 scenario 2)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Link Management and Organization (Priority: P1)

**Goal**: Enable users to add, organize, and customize links with drag-and-drop functionality (linktree_srd.md:93-115, spec.md:US2)

**Independent Test**: Add multiple links, arrange their order, and view them on the public profile page (spec.md:US2)

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T029 [P] [US2] Unit test for Link validation in tests/unit/link.test.ts
- [ ] T030 [P] [US2] Integration test for link CRUD operations in tests/integration/link.test.ts
- [ ] T031 [P] [US2] E2E test for drag-and-drop reordering in tests/e2e/link-management.test.ts

### Implementation for User Story 2

- [X] T032 [P] [US2] Create Link model in prisma/schema.prisma (spec.md:Link entity)
- [X] T033 [US2] Implement link management page in app/(dashboard)/dashboard/links/page.tsx (linktree_srd.md:95-110)
- [X] T034 [US2] Create link manager component in components/profile/link-manager.tsx (linktree_srd.md:95-110)
- [X] T035 [US2] Implement link CRUD API endpoints in app/api/links/route.ts (linktree_srd.md:95-104, spec.md:FR-003)
- [X] T036 [US2] Create drag-and-drop component in components/profile/drag-and-drop.tsx (linktree_srd.md:105-107, spec.md:FR-003)
- [X] T037 [US2] Implement link reordering API endpoint in app/api/links/reorder/route.ts (linktree_srd.md:105-107, spec.md:FR-003)
- [X] T038 [US2] Add link visibility toggle functionality in app/api/links/[id]/visibility/route.ts (linktree_srd.md:108-110, spec.md:FR-003)
- [X] T039 [US2] Create link card component in components/public-profile/link-card.tsx (linktree_srd.md:99-104)
- [X] T040 [US2] Implement link type classification (social, website, project, etc.) (linktree_srd.md:99-104, spec.md:FR-004)
- [X] T041 [US2] Add link validation for URL security (linktree_srd.md:97, spec.md:FR-013)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Theme and Design Customization (Priority: P2)

**Goal**: Enable users to customize profile appearance with themes, colors, and layout options (linktree_srd.md:117-135, spec.md:US3)

**Independent Test**: Select various theme options and see changes reflected on the public profile page (spec.md:US3)

### Tests for User Story 3 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T042 [P] [US3] Unit test for Theme validation in tests/unit/theme.test.ts
- [ ] T043 [P] [US3] Integration test for theme application in tests/integration/theme.test.ts
- [ ] T044 [P] [US3] E2E test for theme customization in tests/e2e/theme-customization.test.ts

### Implementation for User Story 3

- [X] T045 [P] [US3] Create Theme model in prisma/schema.prisma (spec.md:Theme entity)
- [X] T046 [US3] Implement theme selection page in app/(dashboard)/dashboard/themes/page.tsx (linktree_srd.md:119-135)
- [X] T047 [US3] Create theme customizer component in components/profile/theme-customizer.tsx (linktree_srd.md:123-130)
- [ ] T048 [US3] Implement predefined themes with light/dark mode options (linktree_srd.md:119-122, spec.md:FR-005)
- [X] T049 [US3] Create theme API endpoints in app/api/themes/route.ts (linktree_srd.md:117-135)
- [ ] T050 [US3] Add theme application logic to profile rendering (linktree_srd.md:117-135)
- [X] T051 [US3] Implement custom theme builder with color picker (linktree_srd.md:124-129)
- [ ] T052 [US3] Add layout options (profile image position, button sizes) (linktree_srd.md:132-135)
- [X] T053 [US3] Create theme preview functionality (linktree_srd.md:123-130)

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - GitHub Repository Integration (Priority: P2)

**Goal**: Connect GitHub repositories to profiles and automatically pull metadata (linktree_srd.md:112-114, spec.md:US4)

**Independent Test**: Connect a GitHub repository and see metadata automatically populated on the profile (spec.md:US4)

### Tests for User Story 4 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T054 [P] [US4] Unit test for GitHub metadata fetching in tests/unit/github.test.ts
- [ ] T055 [P] [US4] Integration test for GitHub link creation in tests/integration/github-link.test.ts
- [ ] T056 [P] [US4] E2E test for GitHub integration in tests/e2e/github-integration.test.ts

### Implementation for User Story 4

- [ ] T057 [US4] Extend Link model to support GitHub repo metadata (linktree_srd.md:113, spec.md:FR-009)
- [ ] T058 [US4] Implement GitHub metadata fetching service in lib/github.ts (linktree_srd.md:113, spec.md:FR-009)
- [ ] T059 [US4] Create GitHub link creation form in components/profile/github-link-form.tsx (linktree_srd.md:112-114)
- [ ] T060 [US4] Add GitHub metadata API endpoint in app/api/profile/github-metadata/route.ts (linktree_srd.md:113, spec.md:FR-009)
- [ ] T061 [US4] Implement periodic GitHub data refresh mechanism (linktree_srd.md:113)
- [ ] T062 [US4] Create GitHub project link component with dual buttons (linktree_srd.md:114)
- [ ] T063 [US4] Add GitHub API rate limiting handling (linktree_srd.md:103, spec.md:edge case)

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Public Profile Viewing and Sharing (Priority: P1)

**Goal**: Create fast-loading, mobile-optimized public profiles with rich social sharing (linktree_srd.md:137-144, spec.md:US5)

**Independent Test**: Visit a public profile URL and verify loading speed, mobile responsiveness, and SEO metadata (spec.md:US5)

### Tests for User Story 5 ⚟️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T064 [P] [US5] Unit test for public profile rendering in tests/unit/profile-rendering.test.ts
- [ ] T065 [P] [US5] Performance test for loading speed in tests/performance/load-time.test.ts
- [ ] T066 [P] [US5] E2E test for public profile viewing in tests/e2e/public-profile.test.ts

### Implementation for User Story 5

- [X] T067 [US5] Implement dynamic public profile route in app/@/[username]/page.tsx (linktree_srd.md:137-144, spec.md:FR-006)
- [X] T068 [US5] Create public profile view component in components/public-profile/profile-view.tsx (linktree_srd.md:137-144)
- [X] T069 [US5] Add SEO metadata generation with Open Graph and Twitter Cards (linktree_srd.md:139, spec.md:FR-010)
- [X] T070 [US5] Implement mobile-responsive design for public profiles (linktree_srd.md:140, spec.md:FR-008)
- [X] T071 [US5] Add server-side rendering for SEO optimization (linktree_srd.md:139, spec.md:FR-006)
- [X] T072 [US5] Create analytics tracking for profile views and link clicks (linktree_srd.md:144, spec.md:FR-011)
- [X] T073 [US5] Add AnalyticsEvent model for tracking in prisma/schema.prisma (spec.md:AnalyticsEvent entity)
- [X] T074 [US5] Implement API endpoint for analytics tracking in app/api/analytics/route.ts (spec.md:FR-011)
- [X] T075 [US5] Optimize for <2s load times with lazy loading and caching (linktree_srd.md:141, spec.md:FR-007)
- [X] T076 [US5] Add QR code generation for profile URL sharing (linktree_srd.md:143)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T077 [P] Documentation updates in README.md and docs/
- [ ] T078 Code cleanup and refactoring across all components
- [ ] T079 Performance optimization across all user stories
- [ ] T080 [P] Additional unit tests in tests/unit/
- [ ] T081 Security hardening for all API endpoints
- [ ] T082 Accessibility improvements for all UI components
- [ ] T083 Internationalization setup for multi-language support
- [ ] T084 Run quickstart.md validation
- [ ] T085 Zero-Subscription barrier enforcement across all features (spec.md:FR-016)

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
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on User Story 1 (requires user/profile)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on User Story 1 (requires user/profile)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on User Story 1 and 2 (extends links)
- **User Story 5 (P1)**: Can start after Foundational (Phase 2) - Depends on User Story 1, 2, and 3 (requires profile, links, themes)

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
Task: "Unit test for User registration validation in tests/unit/auth.test.ts"
Task: "Integration test for profile creation in tests/integration/profile.test.ts"
Task: "E2E test for registration flow in tests/e2e/auth-flow.test.ts"

# Launch all models for User Story 1 together:
Task: "Create User model in prisma/schema.prisma"
Task: "Create Profile model in prisma/schema.prisma"
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
   - Developer A: User Story 1
   - Developer B: User Story 2 (after US1 foundation)
   - Developer C: User Story 3 (after US1 foundation)
   - Developer D: User Story 5 (after US1, US2, US3 foundations)
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