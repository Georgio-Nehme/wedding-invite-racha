// Sample RSVP data for demo purposes
export const sampleRSVPData = {
  inviteId: "sample_family_001",
  familyName: "Johnson Family",
  members: [
    "Michael Johnson",
    "Sarah Johnson",
    "Emma Johnson",
    "Daniel Johnson"
  ]
};

// Mock API for demo
export class MockRSVPManager {
  async fetchInvitees(_inviteId: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return sampleRSVPData;
  }

  async submitRSVP(inviteId: string, attendingMembers: string[]) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('RSVP Submitted:', { inviteId, attendingMembers });
    return true;
  }
}
