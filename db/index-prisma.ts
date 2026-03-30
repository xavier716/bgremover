import { canUseService as canUseServiceOld } from '@/db';

export interface UserUsage {
  id: string;
  userId?: string;
  anonymousId?: string;
  usageCount: number;
  planType: string;
  creditsPurchased: number;
  totalCredits: number;
  resetDate: Date;
}

// Get user usage by anonymous ID
export async function getUsageByAnonymousId(anonymousId: string): Promise<UserUsage | null> {
  const result = await canUseServiceOld(undefined, anonymousId);
  return {
    id: 'temp',
    userId: undefined,
    anonymousId,
    usageCount: 0,
    planType: result.plan,
    creditsPurchased: 0,
    totalCredits: result.remaining,
    resetDate: new Date()
  };
}

// Init anonymous user
export async function initAnonymousUser(anonymousId: string): Promise<UserUsage> {
  const result = await canUseServiceOld(undefined, anonymousId);
  return {
    id: 'temp',
    userId: undefined,
    anonymousId,
    usageCount: 0,
    planType: result.plan,
    creditsPurchased: 0,
    totalCredits: result.remaining,
    resetDate: new Date()
  };
}

// Check if user can use service
export async function canUseService(
  userId?: string,
  anonymousId?: string
): Promise<{ allowed: boolean; remaining: number; plan: string }> {
  return await canUseServiceOld(userId, anonymousId);
}

// Increment usage count
export async function incrementUsage(
  userId?: string,
  anonymousId?: string
): Promise<void> {
  // TODO: Implement once database is set up
  console.log('Increment usage for:', { userId, anonymousId });
}

// Add purchased credits
export async function addCredits(
  userId: string,
  credits: number,
  planType: string
): Promise<void> {
  // TODO: Implement once database is set up
  console.log('Add credits for:', { userId, credits, planType });
}

// Log usage
export async function logUsage(
  userId: string | undefined,
  anonymousId: string | undefined,
  status: string,
  imageSize?: number,
  processingTime?: number
): Promise<void> {
  console.log('Log usage:', { userId, anonymousId, status });
}
