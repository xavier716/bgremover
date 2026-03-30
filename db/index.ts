import { sql } from '@vercel/postgres';

export interface UserUsage {
  id?: number;
  user_id?: string;
  anonymous_id?: string;
  usage_count: number;
  plan_type: string;
  credits_purchased: number;
  total_credits: number;
  reset_date: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Initialize anonymous user
export async function initAnonymousUser(anonymousId: string): Promise<UserUsage> {
  const result = await sql`
    INSERT INTO user_usage (anonymous_id, usage_count, plan_type, credits_purchased, total_credits)
    VALUES (${anonymousId}, 0, 'free', 0, 3)
    ON CONFLICT (anonymous_id)
    DO UPDATE SET usage_count = user_usage.usage_count
    RETURNING *
  `;
  return result.rows[0] as UserUsage;
}

// Get user usage by anonymous ID
export async function getUsageByAnonymousId(anonymousId: string): Promise<UserUsage | null> {
  const result = await sql`
    SELECT * FROM user_usage
    WHERE anonymous_id = ${anonymousId}
  `;
  return (result.rows[0] || null) as UserUsage | null;
}

// Get or create user usage by Clerk user ID
export async function getOrCreateUserUsage(userId: string): Promise<UserUsage> {
  const result = await sql`
    INSERT INTO user_usage (user_id, usage_count, plan_type, credits_purchased, total_credits)
    VALUES (${userId}, 0, 'free', 0, 10)
    ON CONFLICT (user_id)
    DO UPDATE SET usage_count = user_usage.usage_count
    RETURNING *
  `;
  return result.rows[0] as UserUsage;
}

// Get user usage by Clerk user ID
export async function getUsageByUserId(userId: string): Promise<UserUsage | null> {
  const result = await sql`
    SELECT * FROM user_usage
    WHERE user_id = ${userId}
  `;
  return (result.rows[0] || null) as UserUsage | null;
}

// Increment usage count
export async function incrementUsage(
  userId?: string,
  anonymousId?: string
): Promise<void> {
  if (userId) {
    await sql`
      UPDATE user_usage
      SET usage_count = usage_count + 1
      WHERE user_id = ${userId}
    `;
  } else if (anonymousId) {
    await sql`
      UPDATE user_usage
      SET usage_count = usage_count + 1
      WHERE anonymous_id = ${anonymousId}
    `;
  }
}

// Check if user can use the service
export async function canUseService(
  userId?: string,
  anonymousId?: string
): Promise<{ allowed: boolean; remaining: number; plan: string }> {
  let usage: UserUsage | null = null;

  if (userId) {
    usage = await getUsageByUserId(userId);
  } else if (anonymousId) {
    usage = await getUsageByAnonymousId(anonymousId);
  }

  if (!usage) {
    return { allowed: false, remaining: 0, plan: 'none' };
  }

  // Check if reset date has passed
  const now = new Date();
  const resetDate = new Date(usage.reset_date);

  if (now > resetDate) {
    // Reset usage count
    await sql`
      UPDATE user_usage
      SET usage_count = 0, reset_date = ${now.toISOString().split('T')[0]} + INTERVAL '1 month'
      WHERE id = ${usage.id}
    `;
    usage.usage_count = 0;
  }

  const remaining = usage.total_credits - usage.usage_count;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    plan: usage.plan_type
  };
}

// Add purchased credits
export async function addCredits(
  userId: string,
  credits: number,
  planType: string
): Promise<void> {
  await sql`
    UPDATE user_usage
    SET
      credits_purchased = credits_purchased + ${credits},
      total_credits = 10 + ${credits},
      plan_type = ${planType}
    WHERE user_id = ${userId}
  `;
}

// Log usage
export async function logUsage(
  userId: string | undefined,
  anonymousId: string | undefined,
  status: string,
  imageSize?: number,
  processingTime?: number
): Promise<void> {
  await sql`
    INSERT INTO usage_logs (user_id, anonymous_id, status, image_size, processing_time)
    VALUES (${userId || null}, ${anonymousId || null}, ${status}, ${imageSize || null}, ${processingTime || null})
  `;
}
