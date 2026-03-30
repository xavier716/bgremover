import { v4 as uuidv4 } from 'uuid';

const ANONYMOUS_ID_KEY = 'anonymous_user_id';
const FIRST_VISIT_KEY = 'first_visit_date';

export interface AnonymousUser {
  id: string;
  firstVisit: string;
}

// Get or create anonymous user ID
export function getAnonymousUser(): AnonymousUser {
  if (typeof window === 'undefined') {
    return { id: '', firstVisit: '' };
  }

  const storedId = localStorage.getItem(ANONYMOUS_ID_KEY);

  if (storedId) {
    return {
      id: storedId,
      firstVisit: localStorage.getItem(FIRST_VISIT_KEY) || new Date().toISOString()
    };
  }

  // Create new anonymous user
  const newId = uuidv4();
  const now = new Date().toISOString();

  localStorage.setItem(ANONYMOUS_ID_KEY, newId);
  localStorage.setItem(FIRST_VISIT_KEY, now);

  return {
    id: newId,
    firstVisit: now
  };
}

// Reset anonymous user (for testing)
export function resetAnonymousUser(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ANONYMOUS_ID_KEY);
  localStorage.removeItem(FIRST_VISIT_KEY);
}

// Get anonymous user ID only
export function getAnonymousId(): string {
  const user = getAnonymousUser();
  return user.id;
}
