-- Create visitor_leads table for Executive Reveal (RB2B Clone)
CREATE TABLE IF NOT EXISTS public.visitor_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL, -- Stable fingerprint
    ip_address TEXT,
    full_name TEXT,
    job_title TEXT,
    company_name TEXT,
    company_domain TEXT,
    linkedin_url TEXT,
    profile_image_url TEXT,
    last_page_viewed TEXT,
    visit_count INTEGER DEFAULT 1,
    intent_score INTEGER DEFAULT 0,
    is_processed BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by visitor_id
CREATE INDEX IF NOT EXISTS idx_visitor_id ON public.visitor_leads(visitor_id);

-- Row Level Security (RLS)
ALTER TABLE public.visitor_leads ENABLE ROW LEVEL SECURITY;

-- Allow the service role to perform all actions
CREATE POLICY "Allow service role all access" 
ON public.visitor_leads 
FOR ALL 
USING (auth.role() = 'service_role');

-- Allow authenticated users (admin) to view leads
CREATE POLICY "Allow authenticated users to view leads" 
ON public.visitor_leads 
FOR SELECT 
USING (auth.role() = 'authenticated');
