// Usage tracking using localStorage (no database required)

const USAGE_KEY_PREFIX = 'usage_';
const ANONYMOUS_LIMIT = 3;
const REGISTERED_LIMIT = 0; // Registered users need to purchase credits

export interface UsageData {
  userId?: string;
  anonymousId?: string;
  usageCount: number;
  limit: number;
  planType: 'free' | 'starter' | 'pro';
  lastReset: string;
}

// Get storage key for user
function getStorageKey(userId?: string, anonymousId?: string): string {
  if (userId) {
    return `${USAGE_KEY_PREFIX}user_${userId}`;
  }
  if (anonymousId) {
    return `${USAGE_KEY_PREFIX}anon_${anonymousId}`;
  }
  return '';
}

// Get or create usage data
export function getUsageData(userId?: string, anonymousId?: string): UsageData {
  if (typeof window === 'undefined') {
    return {
      userId,
      anonymousId,
      usageCount: 0,
      limit: userId ? REGISTERED_LIMIT : ANONYMOUS_LIMIT,
      planType: 'free',
      lastReset: new Date().toISOString()
    };
  }

  const key = getStorageKey(userId, anonymousId);
  if (!key) {
    return {
      userId,
      anonymousId,
      usageCount: 0,
      limit: userId ? REGISTERED_LIMIT : ANONYMOUS_LIMIT,
      planType: 'free',
      lastReset: new Date().toISOString()
    };
  }

  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const data = JSON.parse(stored) as UsageData;
      // Check if reset is needed (monthly reset)
      const lastReset = new Date(data.lastReset);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - lastReset.getFullYear()) * 12 +
                        (now.getMonth() - lastReset.getMonth());

      if (monthsDiff >= 1) {
        // Reset usage
        const resetData: UsageData = {
          ...data,
          usageCount: 0,
          lastReset: now.toISOString()
        };
        localStorage.setItem(key, JSON.stringify(resetData));
        return resetData;
      }

      return data;
    } catch (e) {
      console.error('Error parsing usage data:', e);
    }
  }

  // Create new usage data
  const newData: UsageData = {
    userId,
    anonymousId,
    usageCount: 0,
    limit: userId ? REGISTERED_LIMIT : ANONYMOUS_LIMIT,
    planType: 'free',
    lastReset: new Date().toISOString()
  };

  localStorage.setItem(key, JSON.stringify(newData));
  return newData;
}

// Check if user can use service
export function canUseService(userId?: string, anonymousId?: string): {
  allowed: boolean;
  remaining: number;
  plan: string;
} {
  const data = getUsageData(userId, anonymousId);
  const remaining = Math.max(0, data.limit - data.usageCount);

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

  const key = getStorageKey(userId, anonymousId);
  if (key) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Add purchased credits (for registered users)
export function addCredits(
  userId: string,
  credits: number,
  planType: 'starter' | 'pro'
): void {
  if (typeof window === 'undefined') return;

  const key = getStorageKey(userId);
  if (!key) return;

  const data = getUsageData(userId);
  data.limit = credits;
  data.planType = planType;
  // Reset usage count when purchasing
  data.usageCount = 0;

  localStorage.setItem(key, JSON.stringify(data));
}

// Get remaining credits
export function getRemainingCredits(userId?: string, anonymousId?: string): number {
  const result = canUseService(userId, anonymousId);
  return result.remaining;
}

// Reset usage data (for testing)
export function resetUsage(userId?: string, anonymousId?: string): void {
  if (typeof window === 'undefined') return;

  const key = getStorageKey(userId, anonymousId);
  if (key) {
    localStorage.removeItem(key);
  }
}
