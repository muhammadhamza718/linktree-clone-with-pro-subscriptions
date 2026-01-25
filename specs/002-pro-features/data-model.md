# Data Model: Pro Features

## Entity: Link (Extended)
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Required)
- title: String (Required)
- url: String (Required, validated URL)
- linkType: String (Enum: 'social', 'website', 'project', 'email', 'phone', 'embed', 'custom')
- thumbnail: String (Optional)
- icon: String (Optional)
- order: Int (Required, for sorting)
- isVisible: Boolean (Default: true)
- isFeatured: Boolean (Default: false)
- githubRepo: String (Optional, for GitHub integration)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- profile: Profile (Many-to-One relationship)
- **NEW FIELDS FOR PRO FEATURES:**
- startDate: DateTime (Optional, for scheduling)
- endDate: DateTime (Optional, for scheduling)
- timezone: String (Optional, for timezone-aware scheduling)
- passwordHash: String (Optional, for password protection)
- isAgeGated: Boolean (Default: false, for age-gating)
- isPinned: Boolean (Default: false, for link pinning)

## Entity: CustomDomain
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Required)
- domain: String (Required, unique)
- verifyToken: String (Required, for DNS verification)
- isVerified: Boolean (Default: false)
- sslEnabled: Boolean (Default: false)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- profile: Profile (Many-to-One relationship)

## Entity: AnalyticsEventExtended (Extends AnalyticsEvent)
- id: String (Primary Key, cuid)
- profileId: String? (Optional, for profile views)
- linkId: String? (Optional, for link clicks)
- eventType: String ('profile_view', 'link_click', etc.)
- ipAddress: String (Optional)
- userAgent: String (Optional)
- referrer: String (Optional)
- timestamp: DateTime (Default: now())
- **NEW FIELDS FOR ADVANCED ANALYTICS:**
- country: String (Optional, from IP geolocation)
- city: String (Optional, from IP geolocation)
- deviceType: String (Optional, 'mobile', 'tablet', 'desktop')
- browser: String (Optional, browser name)
- os: String (Optional, operating system)
- timezoneOffset: Int (Optional, for timezone tracking)
- profile: Profile? (Optional relationship)
- link: Link? (Optional relationship)

## Entity: RichContentBlock
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Required)
- contentType: String (Enum: 'embed', 'text', 'form', 'gallery')
- content: String (Required, the actual content - embed code, text, form fields)
- title: String (Optional, for identification)
- position: Int (Required, for ordering)
- isVisible: Boolean (Default: true)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- profile: Profile (Many-to-One relationship)

## Entity: CustomCSS
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Required)
- cssCode: String (Required, the custom CSS)
- isLive: Boolean (Default: false)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- profile: Profile (Many-to-One relationship)

## Entity: ContactSubmission
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Required)
- formId: String (Optional, to identify which form)
- name: String (Optional)
- email: String (Optional)
- message: String (Optional)
- submittedAt: DateTime (Default: now())
- profile: Profile (Many-to-One relationship)

## Validation Rules
- Link startDate must be before endDate if both are set
- CustomDomain domain must be unique across all profiles
- AnalyticsEventExtended fields (country, city, etc.) are populated via IP geolocation service
- RichContentBlock content must pass security validation (XSS prevention)
- CustomCSS code must be validated for security (no dangerous CSS properties)

## Relationships
- Profile has many CustomDomains (1:M)
- Profile has many AnalyticsEventExtended records (1:M)
- Profile has many RichContentBlocks (1:M)
- Profile has many CustomCSS records (1:M)
- Profile has many ContactSubmissions (1:M)
- Link optionally has start/end dates for scheduling
- Link optionally has password protection
- Link optionally has age-gating
- Link optionally has pinning status