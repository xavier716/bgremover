-- User Usage Tracking Table
CREATE TABLE IF NOT EXISTS user_usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,           -- Clerk user ID (for authenticated users)
  anonymous_id VARCHAR(255) UNIQUE,       -- Anonymous user ID (for tracking)
  usage_count INTEGER DEFAULT 0,          -- Current month usage
  plan_type VARCHAR(50) DEFAULT 'free',   -- free, starter, pro
  credits_purchased INTEGER DEFAULT 0,    -- Purchased credits (one-time)
  total_credits INTEGER DEFAULT 10,       -- Total available credits
  reset_date DATE DEFAULT CURRENT_DATE + INTERVAL '1 month',  -- Next reset date
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage Logs Table (for analytics)
CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  anonymous_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50),                     -- success, failed
  image_size INTEGER,
  processing_time INTEGER                 -- in milliseconds
);

-- PayPal Orders Table
CREATE TABLE IF NOT EXISTS paypal_orders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  order_id VARCHAR(255) UNIQUE NOT NULL,  -- PayPal order ID
  plan_type VARCHAR(50),
  amount DECIMAL(10, 2),
  currency VARCHAR(10),
  status VARCHAR(50),                     -- CREATED, COMPLETED, FAILED
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_anonymous_id ON user_usage(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_anonymous_id ON usage_logs(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_paypal_orders_user_id ON paypal_orders(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_user_usage_updated_at BEFORE UPDATE ON user_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paypal_orders_updated_at BEFORE UPDATE ON paypal_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
