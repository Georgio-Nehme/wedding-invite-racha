// Routing system for invite URLs
export type Page = 'home' | 'rsvp';

export interface RouteState {
  page: Page;
  inviteId?: string;
}

class Router {
  private listeners: ((state: RouteState) => void)[] = [];
  private currentState: RouteState = { page: 'home' };

  constructor() {
    this.parseLocation();
    window.addEventListener('popstate', () => {
      this.parseLocation();
    });
  }

  private parseLocation(): void {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(seg => seg);
    
    let newState: RouteState = { page: 'home' };

    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      // Check if it looks like an invite ID (not a known route)
      if (firstSegment !== 'home' && firstSegment !== '') {
        newState = { page: 'rsvp', inviteId: firstSegment };
      }
    }

    if (JSON.stringify(newState) !== JSON.stringify(this.currentState)) {
      this.currentState = newState;
      this.notifyListeners();
    }
  }

  navigate(page: Page, inviteId?: string): void {
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'rsvp' && inviteId) {
      window.history.pushState({}, '', `/${inviteId}`);
    }

    this.parseLocation();
  }

  subscribe(listener: (state: RouteState) => void): () => void {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.currentState);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  getCurrentState(): RouteState {
    return { ...this.currentState };
  }
}

export const router = new Router();
