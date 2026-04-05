import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Order {
  id?: number;
  user_id: string;
  order_id: string;
  plan_type: string;
  credits: number;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
}
