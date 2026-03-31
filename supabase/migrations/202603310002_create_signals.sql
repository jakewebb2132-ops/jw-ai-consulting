-- Create signals table for LinkedIn Intelligence
CREATE TABLE IF NOT EXISTS public.signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'profile_view' or 'post_interaction'
    person_name TEXT NOT NULL,
    person_title TEXT,
    person_company TEXT,
    person_image TEXT,
    interaction_text TEXT,
    linkedin_url TEXT,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for temporal queries
CREATE INDEX IF NOT EXISTS idx_signals_timestamp ON public.signals(timestamp);

-- Row Level Security (RLS)
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Allow the service role to perform all actions
CREATE POLICY "Allow service role all access" 
ON public.signals 
FOR ALL 
USING (auth.role() = 'service_role');

-- Allow authenticated users (admin) to view signals
CREATE POLICY "Allow authenticated users to view signals" 
ON public.signals 
FOR SELECT 
USING (auth.role() = 'authenticated');
