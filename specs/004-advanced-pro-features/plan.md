# Implementation Plan: Advanced Pro Features (Webhooks, A/B Testing, Team Collaboration)

**Branch**: `004-advanced-pro-features` | **Date**: 2026-01-28 | **Spec**: [link](../spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

Implementation of three advanced Pro features: Webhooks for external integrations with secure delivery and retry mechanisms, A/B testing engine for traffic splitting and statistical analysis, and team collaboration with role-based access control and audit trails. Following a 'Database First, Security Second' approach with comprehensive testing and security hardening.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16.1.4, React 19.2.3, Node.js 18+
**Primary Dependencies**: Prisma ORM, PostgreSQL, Better Auth, Recharts, @upstash/redis, aws-sdk, @octokit/rest
**Storage**: PostgreSQL for primary data, Redis for caching and queues, S3-compatible for assets
**Testing**: Jest for unit tests, Playwright for E2E tests, custom integration tests
**Target Platform**: Web application (Vercel deployment), responsive for mobile/desktop
**Project Type**: Web application (frontend with Next.js App Router)
**Performance Goals**: <2s profile load times, <50ms A/B test redirect overhead, 99.5% webhook delivery success, <3s dashboard load times
**Constraints**: <2s load times maintained, 100% test coverage for RBAC logic, 95% statistical confidence for A/B tests, GDPR compliance for webhook data
**Scale/Scope**: Up to 10 team members per profile, 100+ daily views for statistical significance, 1000+ concurrent webhook deliveries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

All features comply with the constitution principles:
- Zero-Subscription Barrier: All features remain free and accessible
- Developer-First Integration: GitHub sync and webhook integrations support developer workflows
- Premium Visual Standard: Modern UI with Recharts dashboards
- Onboarding Speed: Streamlined workflows maintain fast onboarding
- High-Efficiency Performance: <2s load times maintained
- Production-Grade Reliability: Robust error handling and security measures

## Project Structure

### Documentation (this feature)

```text
specs/004-advanced-pro-features/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── components/
│   ├── webhooks/
│   ├── ab-testing/
│   ├── teams/
│   └── brand-kit/
├── services/
│   ├── webhooks/
│   ├── ab-testing/
│   ├── teams/
│   └── audit/
├── lib/
│   ├── validation/
│   └── security/
├── app/
│   ├── api/
│   │   ├── webhooks/
│   │   ├── ab-tests/
│   │   └── teams/
│   └── (dashboard)/
│       ├── webhooks/
│       ├── ab-testing/
│       └── teams/
├── middleware/
└── types/
```

**Structure Decision**: Web application structure following Next.js conventions with components, lib, and services organized by feature domain. API routes separated by feature area with dashboard pages for management interfaces.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| RBAC Middleware Complexity | Security-critical feature requiring multiple layers of validation | Direct DB queries would bypass critical security checks |
| Webhook Retry Logic | Reliability requirement for business-critical integrations | Simpler fire-and-forget approach would lead to missed events |

---

## Phase 1: Database Schema & Models (Foundation)

**Goal**: Implement Prisma schema updates and foundational data models for all three features

### Schema Updates

*Webhook table (user_id, url, events, secret, is_active, retry_count, last_triggered_at)*
```prisma
model WebhookEndpoint {
  id          String   @id @default(cuid())
  userId      String
  url         String   // Webhook endpoint URL
  events      String   // Events to trigger on (comma-separated: profile_view,link_click,etc.)
  secret      String   // HMAC secret for signature verification
  isActive    Boolean  @default(true)
  retryCount  Int      @default(0)
  lastTriggered DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deliveries  WebhookDelivery[]
}

model WebhookDelivery {
  id           String   @id @default(cuid())
  webhookId    String
  payload      Json     // Webhook payload data
  statusCode   Int?     // Response status from webhook endpoint
  response     String?  // Response body from webhook endpoint
  attemptCount Int      @default(0)
  status       String   // 'pending', 'success', 'failed'
  deliveredAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  webhook      WebhookEndpoint @relation(fields: [webhookId], references: [id], onDelete: Cascade)
}
```

*LinkVariant table (link_id, variant_name, title, icon_url, traffic_split_percentage, click_count)*
```prisma
model LinkVariant {
  id                    String   @id @default(cuid())
  linkId                String
  variantName           String   // Name of this variant
  title                 String   // Different title for A/B testing
  iconUrl               String?  // Different icon for A/B testing
  description           String?  // Different description for A/B testing
  trafficSplitPercent   Int      // Percentage of traffic to this variant (0-100)
  clickCount            Int      @default(0) // Track clicks for statistical analysis
  viewCount             Int      @default(0) // Track views for CTR calculation
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  link                  Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)
  abTest                ABTest?
}

model ABTest {
  id             String        @id @default(cuid())
  userId         String
  testName       String        // Name of the A/B test
  status         String        // 'draft', 'running', 'paused', 'completed'
  winnerVariantId String?      // ID of winning variant (when test is completed)
  startedAt      DateTime?
  endedAt        DateTime?
  confidenceLevel Float?       // Statistical confidence level
  sampleSize     Int          // Number of samples collected
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  variants       LinkVariant[]
  winnerVariant  LinkVariant? @relation(fields: [winnerVariantId], references: [id])
}
```

*TeamMember table (profile_id, user_id, role, invited_by, invited_at, accepted_at)*
```prisma
model TeamMember {
  id          String   @id @default(cuid())
  profileId   String
  userId      String   // ID of the invited team member
  role        String   // 'owner', 'editor', 'viewer'
  invitedBy   String   // ID of user who sent invitation
  invitedAt   DateTime @default(now())
  acceptedAt  DateTime?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  invitedByUser User   @relation("InvitedByRelation", fields: [invitedBy], references: [id])
}

model ActivityLog {
  id          String   @id @default(cuid())
  profileId   String
  userId      String?  // User who made the change (nullable for system actions)
  action      String   // Action performed (create, update, delete, invite, etc.)
  entityType  String   // Type of entity (link, profile, theme, webhook, etc.)
  entityId    String   // ID of the entity affected
  changes     Json?    // JSON of what changed
  ipAddress   String?  // IP address of the user (hashed for privacy)
  userAgent   String?  // User agent of the user
  timestamp   DateTime @default(now())
  createdAt   DateTime @default(now())
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}

model BrandKitAsset {
  id          String   @id @default(cuid())
  profileId   String
  assetType   String   // 'color_palette', 'logo', 'media', 'font', etc.
  assetUrl    String   // URL to the asset
  assetName   String   // Display name for the asset
  isShared    Boolean  @default(true) // Whether this is shared with team
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  creator     User     @relation(fields: [createdBy], references: [id])
}
```

### Implementation Steps
1. Update Prisma schema with new models
2. Run `npx prisma migrate dev` to create database migrations
3. Generate Prisma client with `npx prisma generate`
4. Create seed scripts for test data
5. Validate schema integrity

### Acceptance Criteria
- New database tables created successfully
- All relationships properly defined
- Foreign key constraints in place
- Seed data populated for testing
- Row-level security policies applied for data isolation

### TDD Workflow
- Write database schema tests first
- Verify relationships and constraints
- Test migration scripts
- Validate data integrity

---

## Phase 2: Webhooks Infrastructure (Event-Driven Architecture)

**Goal**: Build secure webhook delivery system with retry logic and management UI

### Implementation Steps
1. Create webhook event emitter service to trigger on profile_view, link_click, form_submission events
2. Build webhook delivery worker with retry logic (exponential backoff, max 3 attempts)
3. Add HMAC signature generation for webhook payloads (SHA-256 with user's webhook secret)
4. Create webhook management API endpoints (CRUD, test endpoint, delivery log retrieval)
5. Implement webhook UI components: configuration form, test button, delivery logs table
6. Add rate limiting to prevent webhook spam (max 100/minute per user)

### Key Components
- `frontend/services/webhooks/event-emitter.ts` - Triggers webhooks on events
- `frontend/services/webhooks/delivery-worker.ts` - Processes webhook deliveries
- `frontend/app/api/webhooks/[id]/route.ts` - Management endpoints
- `frontend/components/webhooks/config-form.tsx` - Configuration UI
- `frontend/lib/webhooks/security.ts` - HMAC signature utilities
- `frontend/components/webhooks/logs-table.tsx` - Delivery logs UI

### Acceptance Criteria
- Webhooks deliver with 99.5% success rate under normal conditions
- Retry mechanism works with exponential backoff (1s, 2s, 4s)
- HMAC signatures verify correctly using SHA-256
- Rate limiting prevents more than 100 requests per minute per user
- UI allows full management of webhooks with test functionality
- Webhook failures don't block user-facing actions (async processing)

### TDD Workflow
- Write tests for delivery worker with failure scenarios
- Test HMAC signature generation and verification
- Verify rate limiting functionality
- Test retry logic with various failure conditions
- Validate webhook payload structure

---

## Phase 3: A/B Testing Engine (Traffic Splitting & Analytics)

**Goal**: Implement traffic splitting algorithm and statistical analysis for A/B testing

### Implementation Steps
1. Build traffic splitting algorithm for link redirects based on LinkVariant percentages
2. Implement variant performance tracking (CTR calculation, statistical significance tests)
3. Create A/B test dashboard UI with comparison charts (Recharts)
4. Add 'Create Variant' and 'Manage Test' UI flows to the link editor
5. Implement auto-promote winner logic when confidence threshold (95%) is reached
6. Add theme snapshot system: save, preview, and rollback theme versions

### Key Components
- `frontend/services/ab-testing/traffic-splitter.ts` - Algorithm for splitting traffic
- `frontend/services/ab-testing/statistics.ts` - Statistical significance calculations
- `frontend/components/ab-testing/dashboard.tsx` - Performance dashboard
- `frontend/app/api/ab-tests/[id]/route.ts` - A/B test management
- `frontend/services/ab-testing/auto-promoter.ts` - Winner promotion logic
- `frontend/services/ab-testing/theme-snapshot.ts` - Theme versioning system

### Acceptance Criteria
- Traffic splits according to configured ratios (50/50, 60/40, custom percentages)
- Statistical significance calculates using proper statistical methods (Chi-square, t-test)
- Dashboard shows clear performance comparisons with confidence intervals
- Auto-promotion works when 95% confidence threshold is reached
- <50ms overhead on link redirects to maintain performance
- Theme snapshots can be saved, previewed, and rolled back

### TDD Workflow
- Write statistical calculation tests with known datasets
- Test traffic splitting algorithm with various ratios
- Verify auto-promotion logic with different confidence levels
- Validate performance impact on redirects
- Test theme snapshot functionality

---

## Phase 4: Team Collaboration & RBAC (Multi-User Access)

**Goal**: Implement role-based access control and team management features

### Implementation Steps
1. Implement team member invitation flow: generate unique tokens, send email invites, validate and accept
2. Build RBAC middleware to enforce Owner/Editor/Viewer permissions on all profile modification endpoints
3. Create TeamMember management UI: invite modal, active members table, role change dropdown, remove member action
4. Implement activity audit log tracking for all profile changes (automatic logging in Prisma middleware)
5. Build shared brand kit UI: asset upload, color palette manager, team-wide media library
6. Add permission validation to all existing API endpoints (ensure backwards compatibility for solo users)

### Key Components
- `frontend/services/teams/invitation-service.ts` - Handle team invitations
- `frontend/middleware/rbac.ts` - Role-based access control
- `frontend/components/teams/member-management.tsx` - Team management UI
- `frontend/services/audit/activity-logger.ts` - Audit trail system
- `frontend/components/brand-kit/library.tsx` - Shared asset library
- `frontend/middleware/permission-validator.ts` - Endpoint permission validation

### Acceptance Criteria
- Team members can be invited via email and accept invitations with unique tokens
- RBAC enforces proper permissions (Owner=full, Editor=links/themes, Viewer=analytics only)
- Audit logs capture all changes with user identity, timestamp, and details
- Shared brand kit assets accessible to all team members
- No privilege escalation possible between role levels
- Backwards compatibility maintained for single-user profiles
- Activity logs capture 100% of profile modifications

### TDD Workflow
- Write comprehensive RBAC permission tests for all role combinations
- Test invitation flow with token validation
- Verify audit logging for all modification actions
- Validate security boundaries and permission checks
- Test backwards compatibility for solo users

---

## Phase 5: Integration, Testing & Security Hardening

**Goal**: Comprehensive testing and security validation of all features

### Implementation Steps
1. Write comprehensive unit tests for all new services (webhook delivery, traffic splitting, RBAC)
2. Create integration tests for end-to-end workflows (invite team member → accept → edit profile → verify audit log)
3. Perform security audit: test permission bypass attempts, validate HMAC signature verification, ensure no data leakage
4. Load test A/B testing redirect performance (ensure <50ms overhead)
5. Document all new API endpoints and UI flows in the project README

### Key Components
- Unit tests for webhook delivery, traffic splitting, RBAC logic
- Integration tests for invitation → acceptance → profile edit → audit log workflows
- Security tests for permission bypass, HMAC verification, data leakage prevention
- Performance tests for A/B testing overhead and webhook delivery
- API documentation and user guides

### Acceptance Criteria
- 100% test coverage for RBAC logic (critical security requirement)
- A/B tests show statistically significant results within 100 clicks minimum for typical traffic patterns
- Webhook delivery success rate >95% under normal load conditions
- Activity logs capture every profile modification with full audit trail
- <2s profile load times maintained with all new features enabled
- Security audit passes with no critical vulnerabilities found
- All new API endpoints documented with examples

### TDD Workflow
- Write security boundary tests first for RBAC and webhook validation
- Test integration workflows covering all user journeys
- Verify performance benchmarks under load conditions
- Validate all acceptance criteria from previous phases
- Conduct security penetration testing
