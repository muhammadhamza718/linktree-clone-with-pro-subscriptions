# Data Model: System Architecture Refinement

## Entity: AnalyticsEventExtended (Enhanced)
- id: String (Primary Key, cuid)
- profileId: String? (Optional, for profile views)
- linkId: String? (Optional, for link clicks)
- eventType: String (Enum: 'profile_view', 'link_click', 'asset_upload', 'security_event')
- ipAddress: String? (Hashed for privacy)
- userAgent: String? (Optional)
- referrer: String? (Optional)
- timestamp: DateTime (Default: now())
- **NEW ENHANCED FIELDS FOR PERFORMANCE:**
- country: String? (From IP geolocation)
- city: String? (From IP geolocation)
- deviceType: String? (Enum: 'mobile', 'tablet', 'desktop')
- browser: String? (Browser name)
- os: String? (Operating system)
- timezoneOffset: Int? (For timezone tracking)
- loadTimeMs: Int? (For performance tracking)
- responseSizeBytes: Int? (For bandwidth tracking)
- profile: Profile? (Optional relationship)
- link: Link? (Optional relationship)

## Entity: GitHubSyncJob
- id: String (Primary Key, cuid)
- linkId: String (Foreign Key, Required)
- lastSyncAt: DateTime? (When the metadata was last updated)
- nextSyncAt: DateTime (When the next sync is scheduled)
- syncIntervalHours: Int (Default: 24, how often to sync)
- status: String (Enum: 'pending', 'in_progress', 'success', 'failed', Default: 'pending')
- errorCount: Int (Default: 0, for retry logic)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- link: Link (Many-to-One relationship)

## Entity: AssetUpload
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Required)
- fileName: String (Required, original filename)
- fileType: String (Required, MIME type)
- fileSize: Int (Required, in bytes)
- originalSize: Int (Before compression)
- compressedSize: Int? (After client-side compression)
- storageProvider: String (Enum: 's3', 'r2', 'local', Default: 's3')
- storageKey: String (Required, key in object storage)
- publicUrl: String (Required, URL to access the asset)
- uploadStatus: String (Enum: 'uploading', 'processing', 'ready', 'failed', Default: 'processing')
- uploadError: String? (If upload failed)
- uploadedAt: DateTime (Default: now())
- expiresAt: DateTime? (When the asset expires, if applicable)
- profile: Profile (Many-to-One relationship)

## Entity: RateLimitRecord
- id: String (Primary Key, cuid)
- identifier: String (IP address, user ID, or other identifier being limited)
- endpoint: String (Which API endpoint is being limited)
- windowStart: DateTime (Start of the rate limit window)
- requestCount: Int (Number of requests in the current window)
- limit: Int (Maximum requests allowed in the window)
- windowMs: Int (Duration of the rate limit window in milliseconds)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime

## Entity: SecurityAuditLog
- id: String (Primary Key, cuid)
- userId: String? (Who triggered the event, if authenticated)
- ipAddress: String (Hashed IP of the requester)
- userAgent: String? (User agent of the requester)
- action: String (What action was attempted)
- resource: String? (Which resource was accessed/attempted)
- status: String (Enum: 'success', 'denied', 'error', Default: 'success')
- details: String? (Additional details about the security event)
- timestamp: DateTime (Default: now())

## Validation Rules
- AnalyticsEventExtended IP addresses must be hashed before storage
- GitHubSyncJob intervals must be between 1 and 168 hours (1 week)
- AssetUpload file types must be validated against allowed MIME types
- AssetUpload file sizes must not exceed configured limits (e.g., 5MB)
- RateLimitRecord windows must be reasonable (between 1 minute and 1 hour)
- SecurityAuditLog entries must be created for sensitive operations

## Relationships
- Profile has many AssetUploads (1:M)
- Link has one GitHubSyncJob (1:1)
- Profile has many AnalyticsEventExtended records (1:M)
- User optionally has many SecurityAuditLogs (1:M)
- Each entity connects to existing Profile and Link entities to maintain data integrity