-- supabase/migrations/202604040002_increment_lead_score_rpc.sql
-- Atomic lead score increment used by capi-ingest edge function.
-- Returns the updated score so the caller can check the outreach threshold
-- without a second round-trip.

CREATE OR REPLACE FUNCTION increment_lead_score(lead_id uuid, delta int)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_score int;
BEGIN
  UPDATE leads
  SET score = score + delta
  WHERE id = lead_id
  RETURNING score INTO new_score;
  RETURN new_score;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_lead_score(uuid, int) TO service_role;
