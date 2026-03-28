-- Migration: Add atomic view_count increment RPC
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
--
-- This eliminates the read-then-write race condition in api/track-view.ts.
-- Two simultaneous magic-link opens both call this function; SQL's row-level
-- locking ensures view_count is always correct.

CREATE OR REPLACE FUNCTION increment_view_count(proposal_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER  -- Runs with the privileges of the function owner (service role)
AS $$
  UPDATE proposals
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = proposal_id;
$$;

-- Grant execution rights to the anon and authenticated roles
-- (the function is called server-side with service role, but this is belt-and-suspenders)
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon, authenticated, service_role;
