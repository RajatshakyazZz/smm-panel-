-- Supabase PostgreSQL Schema for SMM Panel
-- Copy and paste this into your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    fame_provider_api_url TEXT NOT NULL DEFAULT 'https://fameprovider.com/api/v2',
    fame_provider_api_key TEXT NOT NULL DEFAULT 'demo_fame_provider_key_2026',
    usd_to_inr_rate NUMERIC(10,2) NOT NULL DEFAULT 87.00,
    rate_exchange_mode TEXT NOT NULL DEFAULT 'manual',
    global_margin_percent NUMERIC(5,2) NOT NULL DEFAULT 35.00,
    min_profit_inr NUMERIC(10,2) NOT NULL DEFAULT 2.00,
    auto_sync_enabled BOOLEAN NOT NULL DEFAULT true,
    sync_interval_minutes INT NOT NULL DEFAULT 60,
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    site_name TEXT NOT NULL DEFAULT 'FameProvider - Premier SMM Panel',
    site_description TEXT NOT NULL DEFAULT 'Cheapest & Non-Drop Indian SMM Panel for Instagram, YouTube, Telegram & Facebook',
    telegram_support TEXT DEFAULT 'Fameprovider_help',
    whatsapp_support TEXT DEFAULT '7050259916',
    support_email TEXT DEFAULT 'support@fameprovider.com',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer', -- 'super_admin' or 'customer'
    balance_inr NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    spent_inr NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    api_key TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' or 'suspended'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'Layers',
    sort_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    provider_service_id INT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Default',
    provider_rate_usd NUMERIC(10,4) NOT NULL DEFAULT 0.0,
    calculated_rate_inr NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    margin_percent NUMERIC(5,2) NOT NULL DEFAULT 35.0,
    selling_rate_inr NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    is_price_locked BOOLEAN NOT NULL DEFAULT false,
    min_quantity INT NOT NULL DEFAULT 10,
    max_quantity INT NOT NULL DEFAULT 1000000,
    refill_supported BOOLEAN NOT NULL DEFAULT false,
    cancel_supported BOOLEAN NOT NULL DEFAULT false,
    description TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    category TEXT NOT NULL,
    link TEXT NOT NULL,
    quantity INT NOT NULL,
    charge_inr NUMERIC(12,2) NOT NULL,
    start_count INT DEFAULT 0,
    remains INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending','Processing','In progress','Completed','Partial','Canceled'
    provider_order_id TEXT,
    provider_status TEXT,
    is_refill_eligible BOOLEAN DEFAULT false,
    last_refill_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'deposit', 'order', 'refund', 'bonus'
    amount_inr NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    status TEXT NOT NULL DEFAULT 'Completed', -- 'Completed', 'Pending', 'Failed'
    txn_hash TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Order', 'Payment', 'Service', 'Other'
    order_id TEXT,
    status TEXT NOT NULL DEFAULT 'Open', -- 'Open', 'Answered', 'Closed'
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'price_increase', 'price_decrease', 'service_disabled', 'sync_error'
    service_id TEXT,
    service_name TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REFILL REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.refill_requests (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_refill_id TEXT,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Processing', 'Completed', 'Rejected'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refill_requests ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ & SERVICE ROLE FULL ACCESS POLICIES
DROP POLICY IF EXISTS "Public Read Settings" ON public.settings;
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service Role Full Settings" ON public.settings;
CREATE POLICY "Service Role Full Settings" ON public.settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service Role Full Categories" ON public.categories;
CREATE POLICY "Service Role Full Categories" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Services" ON public.services;
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service Role Full Services" ON public.services;
CREATE POLICY "Service Role Full Services" ON public.services FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Users Select" ON public.users;
CREATE POLICY "Allow All Users Select" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow All Users Modify" ON public.users;
CREATE POLICY "Allow All Users Modify" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Orders" ON public.orders;
CREATE POLICY "Allow All Orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Transactions" ON public.transactions;
CREATE POLICY "Allow All Transactions" ON public.transactions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Tickets" ON public.tickets;
CREATE POLICY "Allow All Tickets" ON public.tickets FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Alerts" ON public.alerts;
CREATE POLICY "Allow All Alerts" ON public.alerts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow All Refills" ON public.refill_requests;
CREATE POLICY "Allow All Refills" ON public.refill_requests FOR ALL USING (true);

-- INITIAL SEED SETTINGS
INSERT INTO public.settings (id, site_name, fame_provider_api_url)
VALUES ('default', 'FameProvider - Premier SMM Panel', 'https://fameprovider.com/api/v2')
ON CONFLICT (id) DO NOTHING;
