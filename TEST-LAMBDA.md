# Lambda Function Integration - Complete Guide

## Summary

I've created a **fully functional Lambda function** for the wedding RSVP system that:

✅ Implements both required endpoints:
  - `GET /invites/{inviteId}` - Returns invite details with family members
  - `POST /invites/{inviteId}/rsvp` - Accepts and stores RSVP responses

✅ Includes all required features:
  - CORS headers on all responses
  - OPTIONS request handling for preflight checks
  - Test data for `invite_id "inv_001"`
  - Proper error handling (400, 404, 405 status codes)
  - Request/response formats matching frontend expectations exactly

✅ Test data for `inv_001`:
  ```
  Main Invitee: Sarah Johnson
  Family Members:
    - Sarah Johnson (responded: false, status: null)
    - Michael Johnson (responded: true, status: "yes")
    - Emma Johnson (responded: false, status: null)
    - Oliver Johnson (responded: true, status: "no")
  ```

## Files Created

1. **`lambda/index.mjs`** - Main Lambda handler with both endpoints
2. **`lambda/test.mjs`** - Comprehensive test suite (already verified ✅)
3. **`lambda/README.md`** - Quick reference documentation
4. **`lambda/DEPLOYMENT.md`** - Detailed deployment instructions

## Verified Functionality

All tests passed locally:

### ✅ Test 1: GET /invites/inv_001
Returns invite with 4 family members and correct RSVP status (Michael: yes, Oliver: no)

### ✅ Test 2: POST /invites/inv_001/rsvp
Accepts RSVP submission and returns success with attendance counts

### ✅ Test 3: GET /invites/inv_001 (after submission)
Returns updated family member statuses based on submitted responses

### ✅ Test 4: OPTIONS /invites/inv_001
Handles CORS preflight correctly with all required headers

### ✅ Test 5: Invalid Invite ID
Returns 404 with proper error message

### ✅ Test 6: Invalid Request
Returns 400 with validation error message

## Deployment Instructions

### Quick Deploy (AWS Console):

1. Go to https://eu-central-1.console.aws.amazon.com/lambda
2. Click "Create function" → "Author from scratch"
3. Runtime: `Node.js 20.x`
4. Copy code from `lambda/index.mjs` into the editor
5. Handler: `index.handler`
6. Click "Deploy"
7. Go to "Configuration" → "Function URL" → Create URL (Auth: NONE)
8. Copy the URL and update `.env`:
   ```
   VITE_API_BASE_URL=https://[your-function-url].lambda-url.eu-central-1.on.aws
   ```

### Or use AWS CLI:
```bash
cd lambda
zip deployment.zip index.mjs
aws lambda create-function \
  --function-name wedding-rsvp \
  --runtime nodejs20.x \
  --handler index.handler \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role \
  --zip-file fileb://deployment.zip
```

## Frontend Integration - Already Configured

The frontend in `src/rsvp.ts` is already set up to:

1. ✅ Read `VITE_API_BASE_URL` from `.env` → Points to your Lambda
2. ✅ Parse `invite_id` from URL query parameter
3. ✅ Call `GET /invites/{inviteId}` on page load
4. ✅ Display family members with checkboxes
5. ✅ Pre-check members with `rsvp_status === "yes"`
6. ✅ Submit form to `POST /invites/{inviteId}/rsvp`
7. ✅ Show success message with attendance counts

### Frontend Usage:
```
http://localhost:5173/wedding-invite-racha/?invite_id=inv_001
```

This will:
- Show "Sarah Johnson" as main invitee
- Display 4 family members with checkboxes
- Michael Johnson will be pre-checked (responded: yes)
- Oliver Johnson will be unchecked (responded: no)
- Users can modify selections and submit RSVP

## RSVP Response Status Logic

**Frontend shows checkbox as CHECKED when:**
- `rsvp_status === "yes"` → Person is attending

**Frontend shows checkbox as UNCHECKED when:**
- `rsvp_status === "no"` → Person is NOT attending
- `rsvp_status === null` → Person hasn't responded yet
- `responded === false` → No response recorded

**Current test data:**
- Sarah Johnson: `responded: false, status: null` → ❌ Unchecked
- Michael Johnson: `responded: true, status: "yes"` → ✅ Checked
- Emma Johnson: `responded: false, status: null` → ❌ Unchecked
- Oliver Johnson: `responded: true, status: "no"` → ❌ Unchecked

## Testing the Integration

### Test with curl (after deployment):

**Get invite details:**
```bash
curl "https://a2kv5prthff3u7ikgctk524wna0drrez.lambda-url.eu-central-1.on.aws/invites/inv_001"
```

**Submit RSVP:**
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
  "submitted_at": "2026-03-27T14:56:39.013Z"
}
```

### Test with browser (after deployment):

1. Start frontend: `npm run dev`
2. Visit: `http://localhost:5173/wedding-invite-racha/?invite_id=inv_001`
3. Verify:
   - ✅ Page loads without CORS errors
   - ✅ "Sarah Johnson" displays as main invitee
   - ✅ 4 family members appear with checkboxes
   - ✅ Michael is pre-checked, others unchecked
   - ✅ Clicking checkboxes works
   - ✅ RSVP button submits successfully
   - ✅ Success message displays with counts

## Next Steps for Production

1. **Persistent Storage**: Replace in-memory storage with:
   - DynamoDB for scalable NoSQL
   - RDS for relational data
   - S3 for file-based storage

2. **Security**:
   - Add API key authentication
   - Implement request validation
   - Add rate limiting
   - Consider IP whitelisting

3. **Monitoring**:
   - Enable CloudWatch logs
   - Set up alarms for errors
   - Monitor invocation metrics

4. **Add More Invites**:
   - Expand `inviteData` object in Lambda
   - Or query from database based on `inviteId`

## Support

The Lambda function code includes:
- Comprehensive comments
- Proper error handling
- CORS configuration
- Test suite for validation
- Deployment documentation

All files are in the `lambda/` directory of this project.
