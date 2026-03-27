# Wedding RSVP Lambda Function

This directory contains the Lambda function code for the Wedding RSVP system.

## Overview

The Lambda function provides two main endpoints:

1. **GET /invites/{inviteId}** - Returns invite details with family members and their RSVP status
2. **POST /invites/{inviteId}/rsvp** - Accepts and stores RSVP responses

The function includes:
- CORS support for browser requests
- Test data for invite_id "inv_001"
- In-memory RSVP response storage
- Proper error handling and validation

## Files

- `index.mjs` - Main Lambda function handler

## Deployment

### Option 1: AWS Lambda Console

1. Create a new Lambda function in AWS Console
2. Use Node.js 20.x or later runtime
3. Copy the contents of `index.mjs` into the function code editor
4. Set the handler to `index.handler`
5. Configure Lambda Function URL:
   - Enable Lambda Function URL
   - Auth type: NONE (for public access)
   - CORS: Already handled in code
6. Deploy the function
7. Copy the Function URL to your `.env` file as `VITE_API_BASE_URL`

### Option 2: AWS CLI

```bash
# Create deployment package
zip lambda-deployment.zip index.mjs

# Create Lambda function
aws lambda create-function \
  --function-name wedding-rsvp \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://lambda-deployment.zip \
  --region eu-central-1

# Create Function URL
aws lambda create-function-url-config \
  --function-name wedding-rsvp \
  --auth-type NONE \
  --cors AllowOrigins=*,AllowMethods=GET;POST;OPTIONS,AllowHeaders=Content-Type \
  --region eu-central-1
```

### Option 3: AWS SAM / CloudFormation

Use SAM for Infrastructure as Code deployment.

## Testing

### GET request for invite details

```bash
curl -X GET "https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001"
```

Expected response:
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
    ...
  ],
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-27T14:00:00Z"
}
```

### POST request with RSVP response

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

Expected response:
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

## Test Data

The function includes built-in test data for `invite_id "inv_001"`:

- **Main Invitee**: Sarah Johnson
- **Family Members**:
  - Sarah Johnson (responded: no, status: null)
  - Michael Johnson (responded: yes, status: "yes")
  - Emma Johnson (responded: no, status: null)
  - Oliver Johnson (responded: yes, status: "no")

## Frontend Integration

The frontend configuration is already set up in `.env`:

```
VITE_API_BASE_URL=https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws
```

The frontend will:
1. Parse `invite_id` from URL query parameter
2. Call GET `/invites/{inviteId}` to fetch invite details
3. Display family members with current RSVP status
4. Call POST `/invites/{inviteId}/rsvp` when user submits responses
5. Show success message on successful submission

## Error Handling

The function returns appropriate HTTP status codes:

- **200**: Successful GET or POST request
- **400**: Invalid request format or missing required fields
- **404**: Invite not found
- **405**: Method not allowed

All error responses include:
- `error`: Description of the error
- `code`: Machine-readable error code
- `details` (optional): Additional error information
