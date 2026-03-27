// API Service for RSVP integration with Lambda backend

interface FamilyMember {
  member_id: string;
  name: string;
  responded: boolean;
  rsvp_status: 'yes' | 'no' | 'maybe' | null;
}

interface InviteDetails {
  invite_id: string;
  main_invitee_name: string;
  family_members: FamilyMember[];
  created_at?: string;
  updated_at?: string;
}

interface MemberRsvp {
  member_id: string;
  name: string;
  attending: boolean;
  notes?: string;
}

interface RsvpRequest {
  responses: MemberRsvp[];
}

interface RsvpResponse {
  success: boolean;
  invite_id: string;
  message: string;
  total_attending?: number;
  total_not_attending?: number;
  submitted_at?: string;
}

interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1';

/**
 * Fetch invite details including family members and their RSVP status
 */
export async function fetchInviteDetails(inviteId: string): Promise<InviteDetails> {
  try {
    const response = await fetch(`${API_BASE_URL}/invites/${encodeURIComponent(inviteId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError;
      throw new Error(
        `Failed to fetch invite: ${errorData.error || 'Unknown error'}`,
      );
    }

    return await response.json() as InviteDetails;
  } catch (error) {
    console.error('Error fetching invite details:', error);
    throw error;
  }
}

/**
 * Submit or update RSVP responses for family members
 */
export async function submitRsvp(
  inviteId: string,
  responses: MemberRsvp[],
): Promise<RsvpResponse> {
  try {
    const payload: RsvpRequest = { responses };

    const response = await fetch(
      `${API_BASE_URL}/invites/${encodeURIComponent(inviteId)}/rsvp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError;
      throw new Error(
        `Failed to submit RSVP: ${errorData.error || 'Unknown error'}`,
      );
    }

    return await response.json() as RsvpResponse;
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    throw error;
  }
}

/**
 * Get invite ID from URL query parameters
 */
export function getInviteIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('invite_id');
}
