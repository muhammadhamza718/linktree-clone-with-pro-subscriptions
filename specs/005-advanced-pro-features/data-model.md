# Data Model: Advanced Pro Features

## Webhook System

### WebhookEndpoint Entity
**Description**: Stores user-configured webhook endpoints for external integrations
- **id**: String (Primary Key, cuid)
- **userId**: String (Foreign Key to User)
- **url**: String (Webhook endpoint URL)
- **events**: String (Comma-separated list of events to trigger on)
- **secret**: String (HMAC secret for signature verification)
- **isActive**: Boolean (Default: true)
- **retryCount**: Int (Default: 0)
- **lastTriggered**: DateTime? (Timestamp of last delivery attempt)
- **createdAt**: DateTime (Default: now())
- **updatedAt**: DateTime (Auto-updated)

**Relationships**:
- Belongs to User (many-to-one)
- Has many WebhookDelivery (one-to-many)

### WebhookDelivery Entity
**Description**: Records of webhook delivery attempts with status and response
- **id**: String (Primary Key, cuid)
- **webhookId**: String (Foreign Key to WebhookEndpoint)
- **payload**: Json (Webhook payload data)
- **statusCode**: Int? (Response status from webhook endpoint)
- **response**: String? (Response body from webhook endpoint)
- **attemptCount**: Int (Default: 0)
- **status**: String (Values: 'pending', 'success', 'failed')
- **deliveredAt**: DateTime? (Timestamp when delivered successfully)
- **createdAt**: DateTime (Default: now())
- **updatedAt**: DateTime (Auto-updated)

**Relationships**:
- Belongs to WebhookEndpoint (many-to-one)

## A/B Testing System

### LinkVariant Entity
**Description**: Alternative versions of the same link for A/B testing
- **id**: String (Primary Key, cuid)
- **linkId**: String (Foreign Key to Link)
- **variantName**: String (Name of this variant)
- **title**: String (Different title for A/B testing)
- **iconUrl**: String? (Different icon for A/B testing)
- **description**: String? (Different description for A/B testing)
- **trafficSplitPercent**: Int (Percentage of traffic to this variant, 0-100)
- **clickCount**: Int (Default: 0, for statistical analysis)
- **viewCount**: Int (Default: 0, for CTR calculation)
- **createdAt**: DateTime (Default: now())
- **updatedAt**: DateTime (Auto-updated)

**Relationships**:
- Belongs to Link (many-to-one)
- Optionally belongs to ABTest (many-to-one)

### ABTest Entity
**Description**: A/B test configuration with traffic split ratios and statistical data
- **id**: String (Primary Key, cuid)
- **userId**: String (Foreign Key to User)
- **testName**: String (Name of the A/B test)
- **status**: String (Values: 'draft', 'running', 'paused', 'completed')
- **winnerVariantId**: String? (Foreign Key to LinkVariant)
- **startedAt**: DateTime? (When the test started)
- **endedAt**: DateTime? (When the test ended)
- **confidenceLevel**: Float? (Statistical confidence level)
- **sampleSize**: Int (Default: 0, number of samples collected)
- **createdAt**: DateTime (Default: now())
- **updatedAt**: DateTime (Auto-updated)

**Relationships**:
- Belongs to User (many-to-one)
- Has many LinkVariant (one-to-many)
- Optionally belongs to LinkVariant (one-to-one) as winner

## Team Collaboration System

### TeamMember Entity
**Description**: Team member invitation and access record with role and permissions
- **id**: String (Primary Key, cuid)
- **profileId**: String (Foreign Key to Profile)
- **userId**: String (Foreign Key to User - the invited member)
- **role**: String (Values: 'owner', 'editor', 'viewer')
- **invitedBy**: String (Foreign Key to User - who sent the invitation)
- **invitedAt**: DateTime (Default: now())
- **acceptedAt**: DateTime? (When the invitation was accepted)
- **isActive**: Boolean (Default: true)
- **createdAt**: DateTime (Default: now())
- **updatedAt**: DateTime (Auto-updated)

**Relationships**:
- Belongs to Profile (many-to-one)
- Belongs to User (many-to-one) as team member
- Belongs to User (many-to-one) as inviter via "InvitedByRelation"

### ActivityLog Entity
**Description**: Audit trail of all profile changes with user, action, and timestamp
- **id**: String (Primary Key, cuid)
- **profileId**: String (Foreign Key to Profile)
- **userId**: String? (Foreign Key to User - nullable for system actions)
- **action**: String (Action performed: create, update, delete, invite, etc.)
- **entityType**: String (Type of entity: link, profile, theme, webhook, etc.)
- **entityId**: String (ID of the entity affected)
- **changes**: Json? (JSON of what changed)
- **ipAddress**: String? (IP address of the user - hashed for privacy)
- **userAgent**: String? (User agent of the user)
- **timestamp**: DateTime (Default: now())
- **createdAt**: DateTime (Default: now())

**Relationships**:
- Belongs to Profile (many-to-one)
- Optionally belongs to User (many-to-one)

### BrandKitAsset Entity
**Description**: Shared brand assets (colors, logos, media) accessible to team members
- **id**: String (Primary Key, cuid)
- **profileId**: String (Foreign Key to Profile)
- **assetType**: String (Values: 'color_palette', 'logo', 'media', 'font', etc.)
- **assetUrl**: String (URL to the asset)
- **assetName**: String (Display name for the asset)
- **isShared**: Boolean (Default: true, whether shared with team)
- **createdBy**: String (Foreign Key to User)
- **createdAt**: DateTime (Default: now())
- **updatedAt**: DateTime (Auto-updated)

**Relationships**:
- Belongs to Profile (many-to-one)
- Belongs to User (many-to-one) as creator

## Validation Rules

### WebhookEndpoint
- URL must be valid HTTP/HTTPS URL
- Events must be from approved list (profile_view, link_click, form_submission, profile_updated)
- Secret must be at least 16 characters long

### LinkVariant
- Traffic split percentage must be between 0 and 100
- For a complete A/B test, all variants of the same link must sum to 100%
- Title must not be empty

### ABTest
- Status transitions must follow valid sequence (draft → running → completed)
- Confidence level must be between 0 and 1
- Sample size must be positive

### TeamMember
- Role must be one of 'owner', 'editor', 'viewer'
- Only 'owner' and 'editor' can be invited initially
- A profile must have at least one 'owner'

### ActivityLog
- Action must be from approved list
- Entity type must be from approved list
- Changes should be valid JSON

### BrandKitAsset
- Asset type must be from approved list
- Asset URL must be valid
- Asset name must not be empty