import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Server-side: use service role key to bypass RLS.
// Falls back to anon key for local dev where service role isn't set.
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { proposalId, event } = req.body;

    if (!proposalId || typeof proposalId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid proposalId' });
    }

    // Step 1: Atomic view_count increment via SQL RPC — no read-then-write race.
    // Two simultaneous opens can't both read 0 and both write 1.
    const { error: rpcError } = await supabase.rpc('increment_view_count', {
      proposal_id: proposalId,
    });

    if (rpcError) {
      console.error('[TELEMETRY] RPC Error:', rpcError);
      // Non-fatal — fall through and still try the status update
    }

    // Step 2: Read current state to check status before updating
    const { data: current } = await supabase
      .from('proposals')
      .select('status')
      .eq('id', proposalId)
      .single();

    // Step 3: Update last_viewed_at and status (conditional on ACCEPTED guard)
    const updatePayload: Record<string, unknown> = {
      last_viewed_at: new Date().toISOString(),
    };
    if (event === 'VIEW' && current?.status !== 'ACCEPTED') {
      updatePayload.status = 'VIEWED';
    }

    const { data, error } = await supabase
      .from('proposals')
      .update(updatePayload)
      .eq('id', proposalId)
      .select('status, last_viewed_at, accepted_at, signature_name, view_count')
      .single();

    if (error) {
      console.error('[TELEMETRY] Supabase Error:', error);
      return res.status(200).json({ success: true, warning: 'Database missing', telemetry: null });
    }

    console.log(`[TELEMETRY] Proposal ${proposalId} - Event: ${event || 'VIEW'} - Views: ${data.view_count}`);

    res.status(200).json({
      success: true,
      telemetry: {
        status: data.status,
        lastViewedAt: data.last_viewed_at,
        acceptedAt: data.accepted_at,
        signatureName: data.signature_name,
        viewCount: data.view_count,
      },
    });
  } catch (error) {
    console.error('Telemetry Error:', error);
    res.status(500).json({ error: 'Failed to record telemetry' });
  }
}
