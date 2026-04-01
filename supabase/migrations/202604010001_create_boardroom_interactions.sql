-- Create the boardroom_interactions table to track Strategic Consultations
CREATE TABLE IF NOT EXISTS public.boardroom_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    question TEXT NOT NULL,
    mode TEXT NOT NULL, -- 'consensus' or 'debate'
    advisors TEXT[] NOT NULL, -- array of advisor IDs
    visitor_id TEXT -- optional session identifier
);

-- Index for performance on the admin dashboard timeline
CREATE INDEX IF NOT EXISTS idx_boardroom_interactions_created_at ON public.boardroom_interactions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.boardroom_interactions ENABLE ROW LEVEL SECURITY;

-- Allow the authenticated service role to manage everything (backend use)
CREATE POLICY "Service role can do everything on boardroom_interactions" 
ON public.boardroom_interactions 
USING (true) 
WITH CHECK (true);

-- Allow public read access (optional, depending on if the dashboard uses a public key)
-- For now, we'll use the service role key in the Vercel backend.
CREATE POLICY "Allow public read access for monitoring" 
ON public.boardroom_interactions 
FOR SELECT 
USING (true);
