# Wedding RSVP API Specification

## Base URL
```
https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws
```

## Authentication
No authentication required. CORS is enabled for all origins.

## Common Headers

### Request Headers
```
Content-Type: application/json
```

### Response Headers (All Responses)
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Content-Type: application/json
```

---

## Endpoints

### 1. GET /invites/{inviteId}

Retrieve invite details including family members and their current RSVP status.

#### Request
```
GET /invites/inv_001
```

#### Response (200 OK)
```json
{
  "invite_id": "inv_001",
  "main_invitee_name": "Sarah Johnson",
  "family_members": [
    {
      "member_id": "mem_001",
      "name": "Sarah Johnson",
      "responded": false,
      "rsvp_status": null
    },
    {
      "member_id": "mem_002",
      "name": "Michael Johnson",
      "responded": true,
      "rsvp_status": "yes"
    },
    {
      "member_id": "mem_003",
      "name": "Emma Johnson",
      "responded": false,
      "rsvp_status": null
    },
    {
      "member_id": "mem_004",
      "name": "Oliver Johnson",
      "responded": true,
      "rsvp_status": "no"
    }
  ],
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-27T14:00:00Z"
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `invite_id` | string | Unique invite identifier |
| `main_invitee_name` | string | Name of the primary invitee |
| `family_members` | array | Array of family member objects |
| `family_members[].member_id` | string | Unique member identifier |
| `family_members[].name` | string | Member's name |
| `family_members[].responded` | boolean | Whether member has responded to RSVP |
| `family_members[].rsvp_status` | string\|null | "yes", "no", "maybe", or null if not responded |
| `created_at` | string | ISO 8601 timestamp of invite creation |
| `updated_at` | string | ISO 8601 timestamp of last update |

#### Error Response (404 Not Found)
```json
{
  "error": "Invite not found",
  "code": "INVITE_NOT_FOUND"
}
```

#### Example cURL
```bash
curl -X GET "https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001" \
  -H "Content-Type: application/json"
```

---

### 2. POST /invites/{inviteId}/rsvp

Submit or update RSVP responses for family members.

#### Request
```
POST /invites/inv_001/rsvp
Content-Type: application/json

{
  "responses": [
    {
      "member_id": "mem_001",
      "name": "Sarah Johnson",
      "attending": true
    },
    {
      "member_id": "mem_002",
      "name": "Michael Johnson",
      "attending": false
    },
    {
      "member_id": "mem_003",
      "name": "Emma Johnson",
      "attending": true
    },
    {
      "member_id": "mem_004",
      "name": "Oliver Johnson",
      "attending": true
    }
  ]
}
```

#### Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `responses` | array | Yes | Array of RSVP responses |
| `responses[].member_id` | string | Yes | ID of family member |
| `responses[].name` | string | Yes | Name of family member |
| `responses[].attending` | boolean | Yes | Whether attending (true) or not (false) |
| `responses[].notes` | string | No | Optional notes from attendee |

#### Response (200 OK)
```json
{
  "success": true,
  "invite_id": "inv_001",
  "message": "RSVP successfully submitted",
  "total_attending": 3,
  "total_not_attending": 1,
  "submitted_at": "2026-03-27T14:43:00Z"
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always true on successful submission |
| `invite_id` | string | The invite ID that was submitted |
| `message` | string | Success message |
| `total_attending` | number | Count of members attending |
| `total_not_attending` | number | Count of members not attending |
| `submitted_at` | string | ISO 8601 timestamp of submission |

#### Error Response (400 Bad Request) - Invalid Format
```json
{
  "error": "Invalid request format: 'responses' must be an array",
  "code": "INVALID_REQUEST"
}
```

#### Error Response (400 Bad Request) - Invalid JSON
```json
{
  "error": "Invalid JSON in request body",
  "code": "INVALID_JSON",
  "details": "Unexpected token } in JSON at position 125"
}
```

#### Error Response (404 Not Found)
```json
{
  "error": "Invite not found",
  "code": "INVITE_NOT_FOUND"
}
```

#### Example cURL
```bash
curl -X POST "https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001/rsvp" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {"member_id": "mem_001", "name": "Sarah Johnson", "attending": true},
      {"member_id": "mem_002", "name": "Michael Johnson", "attending": false},
      {"member_id": "mem_003", "name": "Emma Johnson", "attending": true},
      {"member_id": "mem_004", "name": "Oliver Johnson", "attending": true}
    ]
  }'
```

---

### 3. OPTIONS /invites/{inviteId}

Handle CORS preflight requests.

#### Request
```
OPTIONS /invites/inv_001
Origin: http://localhost:5173
Access-Control-Request-Method: POST
```

#### Response (200 OK)
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Content-Type: application/json
```

#### Example cURL
```bash
curl -X OPTIONS "https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

---

## Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request format or missing required fields |
| 404 | Not Found | Invite ID does not exist |
| 405 | Method Not Allowed | Invalid HTTP method or endpoint |

---

## Test Data

The API includes pre-loaded test data for `invite_id = "inv_001"`:

### Main Invitee
- **Name**: Sarah Johnson

### Family Members
1. **Sarah Johnson** (mem_001)
   - responded: false
   - rsvp_status: null
   - Status: Hasn't responded yet

2. **Michael Johnson** (mem_002)
   - responded: true
   - rsvp_status: "yes"
   - Status: Attending ✅

3. **Emma Johnson** (mem_003)
   - responded: false
   - rsvp_status: null
   - Status: Hasn't responded yet

4. **Oliver Johnson** (mem_004)
   - responded: true
   - rsvp_status: "no"
   - Status: Not Attending ❌

---

## Usage Examples

### JavaScript/Fetch API

```javascript
// Get invite details
const inviteResponse = await fetch(
  'https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001'
);
const inviteData = await inviteResponse.json();
console.log(inviteData.family_members);

// Submit RSVP
const rsvpResponse = await fetch(
  'https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001/rsvp',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      responses: [
        { member_id: "mem_001", name: "Sarah Johnson", attending: true },
        { member_id: "mem_002", name: "Michael Johnson", attending: true },
        { member_id: "mem_003", name: "Emma Johnson", attending: false },
        { member_id: "mem_004", name: "Oliver Johnson", attending: true }
      ]
    })
  }
);
const result = await rsvpResponse.json();
console.log(result.message);
```

### Python

```python
import requests
import json

base_url = "https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws"

# Get invite
response = requests.get(f"{base_url}/invites/inv_001")
invite = response.json()
print(f"Main invitee: {invite['main_invitee_name']}")

# Submit RSVP
rsvp_data = {
    "responses": [
        {"member_id": "mem_001", "name": "Sarah Johnson", "attending": True},
        {"member_id": "mem_002", "name": "Michael Johnson", "attending": True},
        {"member_id": "mem_003", "name": "Emma Johnson", "attending": False},
        {"member_id": "mem_004", "name": "Oliver Johnson", "attending": True}
    ]
}
response = requests.post(
    f"{base_url}/invites/inv_001/rsvp",
    json=rsvp_data
)
result = response.json()
print(f"Attending: {result['total_attending']}, Not attending: {result['total_not_attending']}")
```

---

## Rate Limiting

No rate limiting is currently implemented. For production use, consider adding:
- API key authentication
- Rate limiting per IP/key
- Request throttling

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- The invite ID is case-sensitive
- Member responses are stored in-memory (will be lost on Lambda restart)
- For production, implement persistent storage (DynamoDB, RDS, etc.)
