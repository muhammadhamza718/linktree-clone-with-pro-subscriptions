# Pro Features Quickstart Guide

**Feature**: Pro Features (Phase 2)
**Created**: 2026-01-24
**Input**: Implementation plan from `specs/002-pro-features/plan.md`

## Overview

This guide helps you get started with implementing the Pro Features (Phase 2) including advanced analytics, link scheduling, password protection, custom domains, and rich content blocks.

## Prerequisites

- Node.js 18+ with npm/yarn
- PostgreSQL database running
- Better Auth configured for authentication
- Next.js 16.1.4 with App Router
- Prisma ORM with database connection

## Setup Instructions

### 1. Environment Configuration

Copy the environment variables template and set your values:

```bash
cp frontend/.env.example frontend/.env.local
```

Required environment variables for Pro features:
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Secret for authentication (use a strong random value in production)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: For Google OAuth (optional)
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: For GitHub OAuth (optional)

### 2. Database Setup

Apply the schema changes for Pro features:

```bash
cd frontend
npx prisma db push
# or for initial setup
npx prisma migrate dev
```

Run the seed script to create default themes:

```bash
npx prisma db seed
```

### 3. Install Dependencies

```bash
cd frontend
npm install
```

## Development Workflow

### Running the Application

```bash
# Start the development server
npm run dev

# Access the application at http://localhost:3000
```

### Key Endpoints for Pro Features

- **Analytics Dashboard**: `/dashboard/analytics`
- **Link Scheduling**: `/dashboard/links/schedule`
- **Custom Domains**: `/dashboard/branding/domains`
- **Rich Content**: `/dashboard/content/blocks`

## Component Structure

### Core Components
- `components/profile/link-manager.tsx` - Manage links with scheduling and pinning
- `components/links/link-schedule-picker.tsx` - Date/time picker for link scheduling
- `components/links/password-protected-link.tsx` - Component for password-protected links
- `components/links/age-gate-modal.tsx` - Modal for age verification

### API Routes
- `app/api/links/[id]/pin/route.ts` - Update link pinning status
- `app/api/profile/username-available/route.ts` - Check username availability
- `app/api/analytics/track/route.ts` - Track analytics events
- `app/api/domains/route.ts` - Manage custom domains

## Testing

Run the tests to validate the Pro features:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Performance Considerations

- Analytics tracking is implemented asynchronously to maintain <2s load times
- Use the queue service for heavy analytics processing
- Implement proper caching for frequently accessed data
- Monitor profile load times especially with analytics enabled

## Troubleshooting

### Common Issues

1. **Database connection errors**: Verify your `DATABASE_URL` is correct
2. **Authentication issues**: Check that `BETTER_AUTH_SECRET` is properly set
3. **Custom domain not working**: Ensure DNS settings are properly configured with CNAME record
4. **Slow profile loading**: Verify analytics are being processed asynchronously

### Verification Steps

1. Create a scheduled link and verify it respects activation dates
2. Add a password-protected link and verify it requires password entry
3. Enable age-gating on a link and verify the age verification modal appears
4. Pin a link and verify it stays at the top of the list
5. Connect a custom domain and verify the profile is accessible via that domain