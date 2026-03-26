// RSVP Form Logic
interface InviteeList {
  inviteId: string;
  familyName: string;
  members: string[];
}

interface RSVPResponse {
  inviteId: string;
  attendingMembers: string[];
  timestamp: string;
}

export class RSVPManager {
  private apiBaseUrl: string;
  private getInviteesEndpoint: string;
  private submitRsvpEndpoint: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    this.getInviteesEndpoint = import.meta.env.VITE_API_GET_INVITEES || '/invites';
    this.submitRsvpEndpoint = import.meta.env.VITE_API_SUBMIT_RSVP || '/invites/rsvp';
  }

  async fetchInvitees(inviteId: string): Promise<InviteeList | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${this.getInviteesEndpoint}/${inviteId}`);
      if (!response.ok) {
        console.error(`HTTP ${response.status}: Failed to fetch invitees`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching invitees:', error);
      return null;
    }
  }

  async submitRSVP(inviteId: string, attendingMembers: string[]): Promise<boolean> {
    try {
      const payload: RSVPResponse = {
        inviteId,
        attendingMembers,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${this.apiBaseUrl}${this.submitRsvpEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`HTTP ${response.status}: Failed to submit RSVP`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      return false;
    }
  }
}

export function initRSVPForm(
  inviteId: string, 
  inviteeData: InviteeList,
  manager?: { submitRSVP: (id: string, members: string[]) => Promise<boolean> }
) {
  const form = document.getElementById('rsvp-form') as HTMLFormElement;
  const submitBtn = document.getElementById('rsvp-submit') as HTMLButtonElement;
  
  // Use provided manager or default RSVPManager
  const rsvpManager = manager || new RSVPManager();

  if (!form || !submitBtn) return;

  // Create checkboxes for each family member
  const membersContainer = document.getElementById('family-members');
  if (membersContainer) {
    membersContainer.innerHTML = '';
    inviteeData.members.forEach(member => {
      const label = document.createElement('label');
      label.className = 'member-checkbox';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = member;
      checkbox.name = 'attending-members';
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(member));
      membersContainer.appendChild(label);
    });
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get selected members
    const selectedCheckboxes = form.querySelectorAll('input[name="attending-members"]:checked');
    const attendingMembers = Array.from(selectedCheckboxes).map((cb: any) => cb.value);

    if (attendingMembers.length === 0) {
      alert('Please select at least one family member');
      return;
    }

    // Disable submit button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Submit RSVP
    const success = await rsvpManager.submitRSVP(inviteId, attendingMembers);

    if (success) {
      submitBtn.textContent = '✅ RSVP Confirmed!';
      submitBtn.classList.add('success');
      setTimeout(() => {
        form.style.display = 'none';
        const successMsg = document.getElementById('rsvp-success');
        if (successMsg) {
          successMsg.style.display = 'block';
        }
      }, 1000);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'RSVP';
      alert('Failed to submit RSVP. Please try again.');
    }
  });
}
