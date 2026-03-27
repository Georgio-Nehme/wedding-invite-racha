// Wedding RSVP Lambda Function
// Handles GET and POST requests for RSVP management with CORS support

// Test data for invite_id "inv_001"
const inviteData = {
  "inv_001": {
    invite_id: "inv_001",
    main_invitee_name: "Sarah Johnson",
    family_members: [
      {
        member_id: "mem_001",
        name: "Sarah Johnson",
        responded: false,
        rsvp_status: null
      },
      {
        member_id: "mem_002",
        name: "Michael Johnson",
        responded: true,
        rsvp_status: "yes"
      },
      {
        member_id: "mem_003",
        name: "Emma Johnson",
        responded: false,
        rsvp_status: null
      },
      {
        member_id: "mem_004",
        name: "Oliver Johnson",
        responded: true,
        rsvp_status: "no"
      }
    ],
    created_at: "2026-01-15T10:30:00Z",
    updated_at: "2026-03-27T14:00:00Z"
  }
};

// In-memory storage for RSVP updates
const rsvpResponses = {};

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

/**
 * Helper function to create response with CORS headers
 */
function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

/**
 * GET /invites/{inviteId}
 * Returns invite details with family members and their RSVP status
 */
function handleGetInvite(inviteId) {
  const invite = inviteData[inviteId];
  
  if (!invite) {
    return createResponse(404, {
      error: "Invite not found",
      code: "INVITE_NOT_FOUND"
    });
  }

  // Return a copy with any stored RSVP updates applied
  const responseData = { ...invite };
  
  if (rsvpResponses[inviteId]) {
    responseData.family_members = responseData.family_members.map(member => {
      const storedResponse = rsvpResponses[inviteId].find(r => r.member_id === member.member_id);
      if (storedResponse) {
        return {
          ...member,
          responded: true,
          rsvp_status: storedResponse.attending ? "yes" : "no"
        };
      }
      return member;
    });
    responseData.updated_at = new Date().toISOString();
  }

  return createResponse(200, responseData);
}

/**
 * POST /invites/{inviteId}/rsvp
 * Accepts and stores RSVP responses
 */
function handlePostRsvp(inviteId, body) {
  const invite = inviteData[inviteId];
  
  if (!invite) {
    return createResponse(404, {
      error: "Invite not found",
      code: "INVITE_NOT_FOUND"
    });
  }

  try {
    const { responses } = body;
    
    if (!Array.isArray(responses)) {
      return createResponse(400, {
        error: "Invalid request format: 'responses' must be an array",
        code: "INVALID_REQUEST"
      });
    }

    // Store RSVP responses
    rsvpResponses[inviteId] = responses;

    // Calculate attendance counts
    const totalAttending = responses.filter(r => r.attending === true).length;
    const totalNotAttending = responses.filter(r => r.attending === false).length;

    const successResponse = {
      success: true,
      invite_id: inviteId,
      message: "RSVP successfully submitted",
      total_attending: totalAttending,
      total_not_attending: totalNotAttending,
      submitted_at: new Date().toISOString()
    };

    return createResponse(200, successResponse);
  } catch (error) {
    return createResponse(400, {
      error: "Failed to process RSVP request",
      code: "PROCESSING_ERROR",
      details: error.message
    });
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
function handleOptions() {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: ""
  };
}

/**
 * Main Lambda handler
 */
export async function handler(event) {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Extract request details
  const httpMethod = event.requestContext?.http?.method || event.httpMethod || "GET";
  const rawPath = event.rawPath || event.path || "";
  
  // Parse the path to extract invite ID and action
  // Paths: /invites/{inviteId} or /invites/{inviteId}/rsvp
  const pathParts = rawPath.split("/").filter(p => p);
  
  if (pathParts[0] !== "invites") {
    return createResponse(404, {
      error: "Not found",
      code: "NOT_FOUND"
    });
  }

  const inviteId = pathParts[1];
  const action = pathParts[2];

  if (!inviteId) {
    return createResponse(400, {
      error: "Invite ID is required",
      code: "MISSING_INVITE_ID"
    });
  }

  // Handle CORS preflight requests
  if (httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Handle GET request for invite details
  if (httpMethod === "GET" && !action) {
    return handleGetInvite(inviteId);
  }

  // Handle POST request for RSVP submission
  if (httpMethod === "POST" && action === "rsvp") {
    try {
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      return handlePostRsvp(inviteId, body);
    } catch (error) {
      return createResponse(400, {
        error: "Invalid JSON in request body",
        code: "INVALID_JSON",
        details: error.message
      });
    }
  }

  // Handle unsupported methods/paths
  return createResponse(405, {
    error: "Method not allowed",
    code: "METHOD_NOT_ALLOWED"
  });
}
