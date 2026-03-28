# Wedding RSVP Frontend - Quick Start Guide

## Overview

Your wedding RSVP system is fully integrated with the Lambda backend. The frontend automatically fetches invite data and submits responses.

## How It Works

### 1. **Invite ID from URL**
The frontend reads the invite ID from the URL query parameter:
```
http://localhost:5173/wedding-invite-racha/?invite_id=inv_001
```

### 2. **On Page Load**
- Frontend calls: `GET /invites/inv_001`
- Receives: Main invitee name + family members with RSVP status
- Displays: Family members as checkboxes

### 3. **Checkbox Pre-population**
Checkboxes are **pre-checked** for members who previously responded "yes":
- ✅ Checked if `rsvp_status === "yes"`
- ❌ Unchecked if `rsvp_status === "no"` or `null`

### 4. **User Interaction**
- Click checkboxes to select who's attending
- Click RSVP button to submit

### 5. **Submission**
- Frontend calls: `POST /invites/inv_001/rsvp` with responses
- Receives: Success confirmation with counts
- Shows: "RSVP Confirmed!" message

---

## Running the Frontend

### Start Development Server
```bash
npm run dev
```

### Access the Page
```
http://localhost:5173/wedding-invite-racha/?invite_id=inv_001
```

You'll see:
- Main invitee name at the top
- List of family members with checkboxes
- Submit button
- Success message after submission

---

## Example Flow

### Initial Load
```
URL: http://localhost:5173/...?invite_id=inv_001
↓
GET https://ukybdph35e.execute-api.eu-central-1.amazonaws.com/invites/inv_001
↓
Response:
{
  "main_invitee_name": "George Khoury",
  "family_members": [
    { "name": "Sarah Johnson", "rsvp_status": "yes", ... },
    { "name": "George Khoury", "rsvp_status": "yes", ... },
    { "name": "Maya Khoury", "rsvp_status": null, ... }
  ]
}
↓
Display:
□ Sarah Johnson      ✅ (pre-checked because status="yes")
☑ George Khoury     ✅ (pre-checked because status="yes")
□ Maya Khoury       ❌ (unchecked because status=null)
```

### After User Updates & Submits
```
User checks/unchecks boxes and clicks "RSVP"
↓
POST https://...com/invites/inv_001/rsvp
Body:
{
  "responses": [
    { "member_id": "...", "name": "Sarah Johnson", "attending": true },
    { "member_id": "...", "name": "George Khoury", "attending": false },
    { "member_id": "...", "name": "Maya Khoury", "attending": true }
  ]
}
↓
Response:
{
  "success": true,
  "total_attending": 2,
  "total_not_attending": 1,
  "message": "RSVP successfully submitted"
}
↓
Display: "✅ RSVP Confirmed! We look forward to seeing you!"
```

---

## Customization

### Change the Invite ID
Modify the URL parameter:
```
?invite_id=inv_002
?invite_id=inv_003
```

### Add More Family Members
Update the Lambda function's test data in `lambda/index.mjs`:
```javascript
const inviteData = {
  "inv_001": { ... },
  "inv_002": {
    invite_id: "inv_002",
    main_invitee_name: "Your Name",
    family_members: [
      { member_id: "...", name: "...", ... }
    ]
  }
};
```

### Connect to a Real Database
Replace the in-memory `inviteData` object with database queries:
```javascript
// Instead of const inviteData = { ... }
const getInvite = async (inviteId) => {
  const invite = await dynamodb.getItem({ Key: { id: inviteId } });
  return invite;
};
```

---

## Troubleshooting

### Issue: "No invite data loaded"
- Check the invite ID in the URL
- Verify the Lambda endpoint is running
- Check browser console for errors

### Issue: Checkboxes don't pre-populate
- Make sure the Lambda returns `rsvp_status: "yes"` for attending members
- Check the exact response format in browser DevTools

### Issue: RSVP doesn't submit
- Check browser network tab for the POST request
- Verify the Lambda URL in `.env` is correct
- Check for CORS errors in the console

### Issue: Changes don't persist
- The in-memory storage resets when Lambda restarts
- For production, migrate to DynamoDB or RDS

---

## API Integration Details

### GET Request
```javascript
fetch(`${API_BASE_URL}/invites/${encodeURIComponent(inviteId)}`)
  .then(response => response.json())
  .then(data => {
    // data.main_invitee_name
    // data.family_members[]
  });
```

### POST Request
```javascript
fetch(`${API_BASE_URL}/invites/${encodeURIComponent(inviteId)}/rsvp`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    responses: [
      { member_id: "...", name: "...", attending: true/false }
    ]
  })
});
```

---

## Environment Configuration

The frontend uses `.env` for configuration:
```env
VITE_API_BASE_URL=https://ukybdph35e.execute-api.eu-central-1.amazonaws.com
```

This is automatically loaded by Vite and used in the API calls.

---

## For Multiple Weddings

To support multiple weddings, create different pages or use URL routing:

```
/wedding/racha/?invite_id=inv_001
/wedding/john/?invite_id=inv_002
/wedding/marie/?invite_id=inv_003
```

Each uses the same Lambda but with different invite IDs.

---

## Next Steps

1. **Test it**: `npm run dev` and visit the URL
2. **Customize**: Update names, styling, messaging
3. **Deploy**: Push to production hosting
4. **Monitor**: Watch for RSVP submissions
5. **Export**: Generate guest lists and headcounts

---

## Support

- **API Details**: See `lambda/API-SPEC.md`
- **Setup Help**: See `LAMBDA-SETUP.md`
- **Testing Guide**: See `TEST-LAMBDA.md`

---

**Status**: ✅ Ready to Use  
**Frontend**: Configured and working  
**Backend**: Live and tested  
**Integration**: Complete
