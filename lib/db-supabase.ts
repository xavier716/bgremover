import { supabase, type Order } from './supabase';

export interface UserUsage {
  id?: number;
  user_id?: string;
  anonymous_id?: string;
  usage_count: number;
  plan_type: string;
  credits_purchased: number;
  total_credits: number;
  reset_date: string;
  created_at?: string;
  updated_at?: string;
}

// Initialize anonymous user
export async function initAnonymousUser(anonymousId: string): Promise<UserUsage> {
  const { data, error } = await supabase
    .from('user_usage')
    .upsert({
      anonymous_id: anonymousId,
      usage_count: 0,
      plan_type: 'free',
      credits_purchased: 0,
      total_credits: 3,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserUsage;
}

// Get user usage by anonymous ID
export async function getUsageByAnonymousId(anonymousId: string): Promise<UserUsage | null> {
  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('anonymous_id', anonymousId)
    .single();

  if (error || !data) return null;
  return data as UserUsage;
}

// Get or create user usage by user ID
export async function getOrCreateUserUsage(userId: string): Promise<UserUsage> {
  const { data, error } = await supabase
    .from('user_usage')
    .upsert({
      user_id: userId,
      usage_count: 0,
      plan_type: 'free',
      credits_purchased: 0,
      total_credits: 3,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserUsage;
}

// Get user usage by user ID
export async function getUsageByUserId(userId: string): Promise<UserUsage | null> {
  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data as UserUsage;
}

// Increment usage count
export async function incrementUsage(
  userId?: string,
  anonymousId?: string
): Promise<void> {
  if (userId) {
    const { error } = await supabase.rpc('increment_usage', { user_id: userId });
    if (error) throw error;
  } else if (anonymousId) {
    const { error } = await supabase.rpc('increment_usage_anonymous', { anonymous_id: anonymousId });
    if (error) throw error;
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
  const { error } = await supabase
    .from('user_usage')
    .update({
      credits_purchased: supabase.raw('credits_purchased + ' + credits),
      total_credits: supabase.raw('3 + ' + credits),
      plan_type: planType,
    })
    .eq('user_id', userId);

  if (error) throw error;
}

// Create order
export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// Get user orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data || []) as Order[];
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_id', orderId);

  if (error) throw error;
}

// Log usage
export async function logUsage(
  userId: string | undefined,
  anonymousId: string | undefined,
  status: string,
  imageSize?: number,
  processingTime?: number
): Promise<void> {
  const { error } = await supabase
    .from('usage_logs')
    .insert({
      user_id: userId || null,
      anonymous_id: anonymousId || null,
      status,
      image_size: imageSize || null,
      processing_time: processingTime || null,
    });

  if (error) throw error;
}
