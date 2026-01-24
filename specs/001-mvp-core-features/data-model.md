# Data Model: MVP Core Features

## Entity: User
- id: String (Primary Key, cuid)
- email: String (Unique, Required)
- name: String (Required)
- emailVerified: DateTime (Optional)
- image: String (Optional)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- profile: Profile (One-to-One relationship)

## Entity: Profile
- id: String (Primary Key, cuid)
- userId: String (Foreign Key, Unique, Required)
- username: String (Unique, Required, 3-30 chars, alphanumeric + hyphens)
- displayName: String (Required)
- bio: String (Optional, max 280 chars)
- avatar: String (Optional)
- avatarLayout: String (Enum: 'classic', 'hero', Default: 'classic')
- title: String (Optional)
- themeId: String (Foreign Key, Optional)
- isActive: Boolean (Default: true)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- user: User (One-to-One relationship)
- links: Link[] (One-to-Many relationship)
- theme: Theme (Optional relationship)

## Entity: Link
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

## Entity: Theme
- id: String (Primary Key, cuid)
- name: String (Required)
- userId: String (Foreign Key, Optional)
- presetName: String (Optional, for predefined themes)
- backgroundColor: String (Optional)
- textColor: String (Optional)
- linkColor: String (Optional)
- buttonStyle: String (Enum: 'rounded', 'square', 'pill', Default: 'rounded')
- buttonColor: String (Enum: 'solid', 'gradient', 'glass', Default: 'solid')
- fontFamily: String (Optional)
- fontSize: String (Optional)
- isLightMode: Boolean (Default: true)
- createdAt: DateTime (Default: now())
- updatedAt: DateTime
- user: User (Optional relationship)
- profiles: Profile[] (Optional One-to-Many relationship)

## Entity: AnalyticsEvent
- id: String (Primary Key, cuid)
- profileId: String (Foreign Key, Optional)
- linkId: String (Foreign Key, Optional)
- eventType: String (Enum: 'profile_view', 'link_click', Required)
- ipAddress: String (Optional)
- userAgent: String (Optional)
- referrer: String (Optional)
- timestamp: DateTime (Default: now())
- profile: Profile (Optional Many-to-One relationship)
- link: Link (Optional Many-to-One relationship)

## Validation Rules
- Username: Alphanumeric + hyphens only, 3-30 characters, must be unique
- URL: Must pass URL validation, no malicious protocols
- Bio: Maximum 280 characters
- Avatar: Valid image URL or base64 encoded image
- Link title: Required, maximum 100 characters
- Link URL: Required and must be a valid URL

## Relationships
- User has one Profile (1:1)
- Profile belongs to one User (1:1)
- Profile has many Links (1:M)
- Link belongs to one Profile (M:1)
- User has one Theme (1:1 optional)
- Profile has one Theme (1:1 optional)
- AnalyticsEvent optionally belongs to Profile (M:1 optional)
- AnalyticsEvent optionally belongs to Link (M:1 optional)