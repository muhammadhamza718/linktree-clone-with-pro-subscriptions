# Quickstart Guide: System Architecture Refinement

## Overview
This guide helps you implement the system architecture refinements for production readiness, including enhanced analytics, GitHub metadata syncing, production asset storage, and security hardening.

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database with RLS enabled
- Redis or compatible cache (for rate limiting and caching)
- S3-compatible object storage (e.g., Cloudflare R2, AWS S3)
- GitHub API credentials for metadata fetching
- Production environment with SSL

## Setup Steps

1. **Configure Environment Variables**
   ```bash
   # Add to your .env file:
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   REDIS_URL="redis://localhost:6379"  # For rate limiting and caching
   S3_ACCESS_KEY_ID="your-access-key"
   S3_SECRET_ACCESS_KEY="your-secret-key"
   S3_BUCKET_NAME="your-bucket-name"
   S3_ENDPOINT="https://your-s3-endpoint"  # For Cloudflare R2 or other S3-compatible
   GITHUB_TOKEN="your-github-token"  # For GitHub API access
   IP_GEOLOCATION_API_KEY="your-ip-geolocation-api-key"
   SECURITY_AUDIT_LOGGING="true"
   ```

2. **Enable PostgreSQL Row-Level Security**
   ```sql
   -- Enable RLS on tables that need user isolation
   ALTER TABLE "Link" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
   ALTER TABLE "AnalyticsEvent" ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can only access their own profiles" ON "Profile"
   FOR ALL USING ("userId" = current_setting('app.current_user_id')::text);

   CREATE POLICY "Users can only access their own links" ON "Link"
   FOR ALL USING ("profileId" IN (SELECT "id" FROM "Profile" WHERE "userId" = current_setting('app.current_user_id')::text));
   ```

3. **Install Required Dependencies**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   npm install @aws-sdk/client-s3  # For S3-compatible storage
   npm install crypto-js  # For IP hashing
   npm install ipgeolocation-api  # Or your preferred IP geolocation service
   ```

4. **Update Prisma Schema**
   ```bash
   npx prisma db push
   # OR for new migration
   npx prisma migrate dev
   ```

5. **Deploy Security Headers Middleware**
   - Configure CSP, HSTS, and other security headers
   - Set up rate limiting at the application level
   - Enable audit logging for security events

## Implementation Phases

### Phase 1: Enhanced Analytics Infrastructure
- Set up Redis caching layer for analytics data
- Implement queue-based processing for non-blocking analytics writes
- Add performance tracking to analytics events
- Verify <2s load times with high-volume data

### Phase 2: GitHub Metadata Syncing
- Create scheduled jobs for GitHub metadata updates
- Implement rate limiting to respect GitHub API limits
- Set up error handling and retry logic
- Test with various GitHub repositories

### Phase 3: Production Asset Storage
- Configure S3-compatible object storage
- Implement client-side compression
- Add server-side validation for uploads
- Set up proper caching headers for assets

### Phase 4: Security & Hardening
- Implement rate limiting for all API endpoints
- Add security headers (CSP, HSTS)
- Set up IP hashing for analytics privacy
- Configure PostgreSQL Row-Level Security

## Testing the Implementation
1. Verify analytics dashboard loads in <2s with large datasets
2. Check GitHub metadata updates automatically at scheduled intervals
3. Upload files and verify they're stored in object storage
4. Test rate limiting by exceeding configured limits
5. Verify security headers are present on all responses
6. Confirm that users can only access their own data with RLS

## Performance Validation
- Profile pages should load consistently under 2s
- Analytics tracking should not block page rendering
- Background jobs should complete without impacting user experience
- Asset uploads should be fast with compression

## Security Validation
- Rate limits should prevent API abuse
- IP addresses should be hashed before storage
- Users should not be able to access other users' data
- All responses should include appropriate security headers