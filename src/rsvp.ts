// RSVP Form Logic with invite ID support

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

export class RSVPManager {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1';
  }

  /**
   * Fetch invite details with family members and their RSVP status
   */
  async fetchInviteDetails(inviteId: string): Promise<InviteDetails | null> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/invites/${encodeURIComponent(inviteId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        console.error(`HTTP ${response.status}: Failed to fetch invite details`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invite details:', error);
      return null;
    }
  }

  /**
   * Submit or update RSVP responses for family members
   */
  async submitRsvp(
    inviteId: string,
    responses: MemberRsvp[],
  ): Promise<RsvpResponse | null> {
    try {
      const payload: RsvpRequest = { responses };

      const response = await fetch(
        `${this.apiBaseUrl}/invites/${encodeURIComponent(inviteId)}/rsvp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        console.error(`HTTP ${response.status}: Failed to submit RSVP`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      return null;
    }
  }
}

/**
 * Get invite ID from URL query parameters
 */
export function getInviteIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('invite_id');
}

/**
 * Initialize RSVP form with invite details
 */
export async function initializeRsvpForm() {
  const form = document.getElementById('rsvp-form') as HTMLFormElement;
  const submitBtn = document.getElementById('rsvp-submit') as HTMLButtonElement;
  const rsvpError = document.getElementById('rsvp-error') as HTMLElement;

  if (!form || !submitBtn) return;

  const inviteId = getInviteIdFromUrl();

  if (!inviteId) {
    console.warn('No invite_id found in URL. Using fallback mode.');
    displayFallbackForm();
    return;
  }

  // Fetch invite details
  const manager = new RSVPManager();
  const inviteDetails = await manager.fetchInviteDetails(inviteId);

  if (!inviteDetails) {
    if (rsvpError) {
      rsvpError.style.display = 'block';
    }
    if (form) {
      form.style.display = 'none';
    }
    return;
  }

  // Update family name display
  const familyNameDisplay = document.getElementById('family-name-display');
  if (familyNameDisplay) {
    familyNameDisplay.textContent = inviteDetails.main_invitee_name;
  }

  // Populate family members list with current response status
  const membersContainer = document.getElementById('family-members');
  if (membersContainer) {
    membersContainer.innerHTML = '';
    inviteDetails.family_members.forEach((member) => {
      const label = document.createElement('label');
      label.className = 'member-checkbox';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = member.member_id;
      checkbox.checked = member.rsvp_status === 'yes';
      checkbox.dataset.memberName = member.name;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(member.name));
      membersContainer.appendChild(label);
    });
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get selected members
    const selectedCheckboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    const responses: MemberRsvp[] = Array.from(selectedCheckboxes).map((checkbox: any) => ({
      member_id: checkbox.value,
      name: checkbox.dataset.memberName || checkbox.value,
      attending: true,
    }));

    // Add non-selected members as not attending
    const allCheckboxes = form.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach((checkbox: any) => {
      if (!checkbox.checked) {
        const existingResponse = responses.find((r) => r.member_id === checkbox.value);
        if (!existingResponse) {
          responses.push({
            member_id: checkbox.value,
            name: checkbox.dataset.memberName || checkbox.value,
            attending: false,
          });
        }
      }
    });

    // Disable submit button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Submit RSVP
    const result = await manager.submitRsvp(inviteId, responses);

    if (result && result.success) {
      submitBtn.textContent = '✅ RSVP Confirmed!';
      submitBtn.classList.add('success');
      setTimeout(() => {
        form.style.display = 'none';
        const successMsg = document.getElementById('rsvp-success');
        if (successMsg) {
          successMsg.style.display = 'block';
          const successText = successMsg.querySelector('p');
          if (successText) {
            successText.textContent = `Your RSVP has been confirmed. We look forward to seeing you!`;
          }
        }
      }, 1000);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'RSVP';
      alert('Failed to submit RSVP. Please try again.');
    }
  });
}

/**
 * Display fallback form when no invite ID is provided
 */
function displayFallbackForm(): void {
  const familyMembersList = document.getElementById('family-members');
  if (familyMembersList) {
    familyMembersList.innerHTML =
      '<p style="text-align: center; color: #999; font-size: 0.9rem;">Please provide an invite ID in the URL: ?invite_id=your_invite_id</p>';
  }
}
