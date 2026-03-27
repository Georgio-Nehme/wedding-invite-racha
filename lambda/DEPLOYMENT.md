# Lambda Function Deployment Guide

## Quick Deployment Steps

### Step 1: Package the Lambda Function

```bash
# Navigate to the lambda directory
cd lambda

# Create a deployment package
zip lambda-deployment.zip index.mjs
```

### Step 2: Deploy to AWS Lambda

You have three options:

#### Option A: AWS Console (Easiest)

1. Go to [AWS Lambda Console](https://eu-central-1.console.aws.amazon.com/lambda)
2. Click "Create function"
3. Choose "Author from scratch"
4. Fill in:
   - Function name: `wedding-rsvp`
   - Runtime: `Node.js 20.x`
   - Role: Create a new role with basic Lambda permissions
5. Click "Create function"
6. In the "Code" section, upload the `lambda-deployment.zip` file or paste the code directly
7. Set Handler to: `index.handler`
8. Click "Deploy"

#### Option B: AWS CLI

```bash
# Set these variables
ACCOUNT_ID="your-aws-account-id"
REGION="eu-central-1"
ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/lambda-basic-execution"

# Create function
aws lambda create-function \
  --function-name wedding-rsvp \
  --runtime nodejs20.x \
  --role $ROLE_ARN \
  --handler index.handler \
  --zip-file fileb://lambda-deployment.zip \
  --region $REGION

# Or update existing function
aws lambda update-function-code \
  --function-name wedding-rsvp \
  --zip-file fileb://lambda-deployment.zip \
  --region $REGION
```

### Step 3: Create a Function URL

In AWS Console:
1. Go to your Lambda function
2. Click "Configuration" → "Function URL"
3. Click "Create function URL"
4. Set Auth type to: `NONE` (since we handle CORS in code)
5. Enable CORS
6. Click "Save"
7. Copy the Function URL

Or with AWS CLI:
```bash
aws lambda create-function-url-config \
  --function-name wedding-rsvp \
  --auth-type NONE \
  --cors '{
    "AllowOrigins": ["*"],
    "AllowMethods": ["GET", "POST", "OPTIONS"],
    "AllowHeaders": ["Content-Type"],
    "MaxAge": 86400
  }' \
  --region eu-central-1
```

### Step 4: Update Frontend Configuration

Update `.env` file with your Lambda Function URL:

```env
VITE_API_BASE_URL=https://[your-function-url].lambda-url.eu-central-1.on.aws
```

## Testing the Lambda Function

### Using curl

#### Test 1: Get Invite Details
```bash
curl -X GET "https://[your-function-url].lambda-url.eu-central-1.on.aws/invites/inv_001"
```

Expected output:
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

#### Test 2: Submit RSVP Responses
```bash
curl -X POST "https://[your-function-url].lambda-url.eu-central-1.on.aws/invites/inv_001/rsvp" \
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

Expected output:
```json
{
  "success": true,
  "invite_id": "inv_001",
  "message": "RSVP successfully submitted",
  "total_attending": 3,
  "total_not_attending": 1,
  "submitted_at": "2026-03-27T14:56:39.013Z"
}
```

#### Test 3: OPTIONS Request (CORS Preflight)
```bash
curl -X OPTIONS "https://[your-function-url].lambda-url.eu-central-1.on.aws/invites/inv_001" \
  -H "Access-Control-Request-Method: POST" \
  -H "Origin: http://localhost:5173" \
  -v
```

You should see CORS headers in the response.

### Using JavaScript (in browser console or Node.js)

```javascript
// Get invite details
const inviteResponse = await fetch('https://[your-function-url].lambda-url.eu-central-1.on.aws/invites/inv_001');
const inviteData = await inviteResponse.json();
console.log(inviteData);

// Submit RSVP
const rsvpResponse = await fetch('https://[your-function-url].lambda-url.eu-central-1.on.aws/invites/inv_001/rsvp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    responses: [
      { member_id: "mem_001", name: "Sarah Johnson", attending: true },
      { member_id: "mem_002", name: "Michael Johnson", attending: false },
      { member_id: "mem_003", name: "Emma Johnson", attending: true },
      { member_id: "mem_004", name: "Oliver Johnson", attending: true }
    ]
  })
});
const result = await rsvpResponse.json();
console.log(result);
```

## Frontend Testing

Once the Lambda is deployed and the `.env` is updated:

1. Start the frontend:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:5173/wedding-invite-racha/?invite_id=inv_001`

3. You should see:
   - "Sarah Johnson" as the main invitee
   - 4 family members with checkboxes:
     - Sarah Johnson (unchecked - responded: false)
     - Michael Johnson (checked - responded: true, status: yes)
     - Emma Johnson (unchecked - responded: false)
     - Oliver Johnson (unchecked - responded: true, but status: no, so NOT attending)
   
4. Try checking/unchecking boxes and clicking "RSVP"

5. Verify the response shows correct counts

## Troubleshooting

### Issue: CORS error in browser

**Solution**: Ensure:
- Lambda function has CORS enabled
- The `Access-Control-Allow-Origin` header is `*` (or your frontend URL)
- OPTIONS requests are handled (preflight)

### Issue: 404 Not Found

**Solution**: Check that:
- The Lambda Function URL is correct in `.env`
- The path format is correct: `/invites/{inviteId}` or `/invites/{inviteId}/rsvp`
- The Lambda function is deployed and active

### Issue: Invalid JSON errors

**Solution**: Ensure:
- Request body is valid JSON
- POST requests have `Content-Type: application/json` header
- The `responses` field is an array of objects with `member_id`, `name`, and `attending`

## Lambda Function Architecture

The function handles:

1. **Request Parsing**:
   - Extracts HTTP method, path, and body
   - Parses path to identify `inviteId` and action

2. **CORS Handling**:
   - Adds CORS headers to all responses
   - Handles OPTIONS preflight requests

3. **Endpoints**:
   - `GET /invites/{inviteId}` - Returns invite + family members
   - `POST /invites/{inviteId}/rsvp` - Stores RSVP responses
   - Applies stored responses to GET results

4. **Error Handling**:
   - 404 for missing invites
   - 400 for invalid requests
   - 405 for unsupported methods
   - Detailed error messages

## Data Persistence

**Note**: The current implementation uses in-memory storage. For production:

1. **Use DynamoDB**:
   ```javascript
   import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
   ```

2. **Use RDS**:
   - PostgreSQL or MySQL database
   - Use AWS RDS Proxy for connection pooling

3. **Use S3**:
   - Store RSVP responses as JSON files
   - Use versioning for tracking changes

## Next Steps

1. Deploy the Lambda function to AWS
2. Create a Function URL
3. Test with curl
4. Update `.env` with the Function URL
5. Test the frontend integration
6. Consider adding:
   - Authentication (API keys, auth tokens)
   - Data persistence (DynamoDB, RDS)
   - Logging (CloudWatch)
   - Monitoring (X-Ray, alarms)
