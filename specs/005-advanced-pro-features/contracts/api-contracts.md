# API Contracts: Advanced Pro Features

## Webhook Endpoints

### POST /api/webhooks/
**Description**: Create a new webhook endpoint
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "url": "https://example.com/webhook",
  "events": ["profile_view", "link_click"],
  "secret": "your-secret-key"
}
```
**Response** (201 Created):
```json
{
  "id": "wh_abc123",
  "url": "https://example.com/webhook",
  "events": ["profile_view", "link_click"],
  "isActive": true,
  "createdAt": "2026-01-28T10:00:00Z"
}
```

### GET /api/webhooks/[id]
**Description**: Get webhook endpoint details
**Authentication**: Bearer token required
**Response** (200 OK):
```json
{
  "id": "wh_abc123",
  "url": "https://example.com/webhook",
  "events": ["profile_view", "link_click"],
  "isActive": true,
  "retryCount": 0,
  "lastTriggered": "2026-01-28T09:30:00Z",
  "createdAt": "2026-01-28T10:00:00Z"
}
```

### PUT /api/webhooks/[id]
**Description**: Update webhook endpoint
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "url": "https://new-example.com/webhook",
  "events": ["profile_view", "link_click", "form_submission"],
  "isActive": true
}
```
**Response** (200 OK):
```json
{
  "id": "wh_abc123",
  "url": "https://new-example.com/webhook",
  "events": ["profile_view", "link_click", "form_submission"],
  "isActive": true
}
```

### DELETE /api/webhooks/[id]
**Description**: Delete webhook endpoint
**Authentication**: Bearer token required
**Response** (204 No Content)

### POST /api/webhooks/[id]/test
**Description**: Test webhook delivery
**Authentication**: Bearer token required
**Response** (200 OK):
```json
{
  "success": true,
  "deliveryId": "wd_def456"
}
```

### GET /api/webhooks/[id]/logs
**Description**: Get webhook delivery logs
**Authentication**: Bearer token required
**Query Parameters**:
- limit: number (default 50)
- offset: number (default 0)
**Response** (200 OK):
```json
{
  "logs": [
    {
      "id": "wd_def456",
      "statusCode": 200,
      "status": "success",
      "deliveredAt": "2026-01-28T09:30:00Z",
      "createdAt": "2026-01-28T09:30:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

## A/B Testing Endpoints

### POST /api/ab-tests/
**Description**: Create a new A/B test
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "testName": "Link Button Color Test",
  "linkId": "lnk_xyz789",
  "variants": [
    {
      "variantName": "Blue Button",
      "title": "Visit My Site",
      "iconUrl": "/icons/blue-button.svg",
      "trafficSplitPercent": 50
    },
    {
      "variantName": "Green Button",
      "title": "Visit My Site",
      "iconUrl": "/icons/green-button.svg",
      "trafficSplitPercent": 50
    }
  ]
}
```
**Response** (201 Created):
```json
{
  "id": "abt_123xyz",
  "testName": "Link Button Color Test",
  "status": "running",
  "variants": [
    {
      "id": "lv_abc123",
      "variantName": "Blue Button",
      "title": "Visit My Site",
      "trafficSplitPercent": 50,
      "clickCount": 0,
      "viewCount": 0
    }
  ],
  "createdAt": "2026-01-28T10:00:00Z"
}
```

### GET /api/ab-tests/[id]
**Description**: Get A/B test details and results
**Authentication**: Bearer token required
**Response** (200 OK):
```json
{
  "id": "abt_123xyz",
  "testName": "Link Button Color Test",
  "status": "running",
  "confidenceLevel": 0.85,
  "sampleSize": 1200,
  "variants": [
    {
      "id": "lv_abc123",
      "variantName": "Blue Button",
      "title": "Visit My Site",
      "clickCount": 120,
      "viewCount": 600,
      "ctr": 0.20,
      "isWinner": false
    }
  ],
  "createdAt": "2026-01-28T10:00:00Z"
}
```

### PUT /api/ab-tests/[id]/promote-winner
**Description**: Manually promote winning variant
**Authentication**: Bearer token required
**Response** (200 OK):
```json
{
  "success": true,
  "winnerVariantId": "lv_abc123",
  "message": "Winner promoted successfully"
}
```

## Team Collaboration Endpoints

### POST /api/teams/invite
**Description**: Invite a team member
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "email": "member@example.com",
  "role": "editor"
}
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Invitation sent successfully"
}
```

### GET /api/teams/members
**Description**: Get team members for profile
**Authentication**: Bearer token required
**Response** (200 OK):
```json
{
  "members": [
    {
      "id": "tm_789def",
      "userId": "usr_abc123",
      "email": "member@example.com",
      "role": "editor",
      "invitedAt": "2026-01-28T10:00:00Z",
      "acceptedAt": "2026-01-28T10:30:00Z",
      "isActive": true
    }
  ]
}
```

### PUT /api/teams/members/[id]/role
**Description**: Update team member role
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "role": "viewer"
}
```
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Role updated successfully"
}
```

### DELETE /api/teams/members/[id]
**Description**: Remove team member
**Authentication**: Bearer token required
**Response** (200 OK):
```json
{
  "success": true,
  "message": "Team member removed successfully"
}
```

## Activity Log Endpoints

### GET /api/activity-log
**Description**: Get activity logs for profile
**Authentication**: Bearer token required
**Query Parameters**:
- limit: number (default 50)
- offset: number (default 0)
- startDate: string (ISO date)
- endDate: string (ISO date)
**Response** (200 OK):
```json
{
  "logs": [
    {
      "id": "al_456ghi",
      "action": "link_update",
      "entityType": "link",
      "entityId": "lnk_abc123",
      "userName": "John Doe",
      "timestamp": "2026-01-28T09:30:00Z",
      "changes": {
        "before": {"title": "Old Title"},
        "after": {"title": "New Title"}
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```