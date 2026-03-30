// Usage tracking using localStorage (no database required)

const USAGE_KEY_PREFIX = 'usage_';
const TOTAL_FREE_CREDITS = 3; // Total free credits for all users (anonymous + registered)
const USAGE_KEY = 'usage_data'; // Single key for tracking usage across anonymous/registered state

export interface UsageData {
  currentUserId?: string; // Current user ID (if registered)
  anonymousId: string; // Anonymous ID (always present for tracking)
  usageCount: number; // How many times used
  totalCredits: number; // Total credits available (free + purchased)
  planType: 'free' | 'starter' | 'pro';
  lastReset: string;
}

// Get the shared usage data (same for anonymous and registered users)
function getUsageDataFromStorage(): UsageData | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(USAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UsageData;
  } catch (e) {
    console.error('Error parsing usage data:', e);
    return null;
  }
}

// Get or create usage data
export function getUsageData(userId?: string, anonymousId?: string): UsageData {
  if (typeof window === 'undefined') {
    return {
      anonymousId: anonymousId || '',
      usageCount: 0,
      totalCredits: TOTAL_FREE_CREDITS,
      planType: 'free',
      lastReset: new Date().toISOString()
    };
  }

  // Try to get existing data
  let data = getUsageDataFromStorage();

  if (!data) {
    // Create new user data
    data = {
      anonymousId: anonymousId || '',
      usageCount: 0,
      totalCredits: TOTAL_FREE_CREDITS,
      planType: 'free',
      lastReset: new Date().toISOString()
    };
    localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  } else {
    // Update user ID if user just registered
    let needsUpdate = false;
    if (userId && data.currentUserId !== userId) {
      data.currentUserId = userId;
      needsUpdate = true;
    }
    if (anonymousId && data.anonymousId !== anonymousId) {
      data.anonymousId = anonymousId;
      needsUpdate = true;
    }

    // Check if reset is needed (monthly reset for free users)
    if (data.planType === 'free') {
      const lastReset = new Date(data.lastReset);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 +
                        (now.getMonth() - lastReset.getMonth());

      if (monthsDiff >= 1) {
        // Reset usage count and credits for free users
        data.usageCount = 0;
        data.totalCredits = TOTAL_FREE_CREDITS;
        data.lastReset = now.toISOString();
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      localStorage.setItem(USAGE_KEY, JSON.stringify(data));
    }
  }

  return data;
}

// Check if user can use service
export function canUseService(userId?: string, anonymousId?: string): {
  allowed: boolean;
  remaining: number;
  plan: string;
} {
  const data = getUsageData(userId, anonymousId);
  const remaining = Math.max(0, data.totalCredits - data.usageCount);

  return {
    allowed: remaining > 0,
    remaining,
    plan: data.planType
  };
}

// Increment usage count
export function incrementUsage(userId?: string, anonymousId?: string): void {
  if (typeof window === 'undefined') return;

  const data = getUsageData(userId, anonymousId);
  data.usageCount += 1;

  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

// Add purchased credits (for registered users)
export function addCredits(
  userId: string,
  credits: number,
  planType: 'starter' | 'pro'
): void {
  if (typeof window === 'undefined') return;

  const data = getUsageData(userId);
  data.totalCredits = credits;
  data.planType = planType;
  // Keep existing usage count, don't reset it
  // This ensures users don't lose their remaining free credits

  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

// Get remaining credits
export function getRemainingCredits(userId?: string, anonymousId?: string): number {
  const result = canUseService(userId, anonymousId);
  return result.remaining;
}

// Reset usage data (for testing)
export function resetUsage(userId?: string, anonymousId?: string): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(USAGE_KEY);
}
