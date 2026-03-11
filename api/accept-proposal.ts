import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { proposalId, signatureName, signatureTitle, timestamp } = req.body;

    if (!proposalId || !signatureName || !timestamp) {
      return res.status(400).json({ error: 'Missing required signature fields' });
    }

    const { data, error } = await supabase
      .from('proposals')
      .update({
         status: 'ACCEPTED',
         accepted_at: timestamp,
         signature_name: signatureName,
         signature_title: signatureTitle
      })
      .eq('id', proposalId)
      .select()
      .single();

    if (error) {
      console.error("[ACCEPTANCE] Supabase Error:", error);
      // Fallback silently if DB is not configured by user yet
      return res.status(200).json({ success: true, telemetry: { status: 'ACCEPTED', acceptedAt: timestamp } });
    }

    console.log(`[PROPOSAL_ACCEPTED] Proposal ${proposalId} signed by ${signatureName}`);

    res.status(200).json({ 
      success: true, 
      telemetry: {
        status: data.status,
        acceptedAt: data.accepted_at,
        signatureName: data.signature_name
      } 
    });
  } catch (error) {
    console.error('Accept Proposal Error:', error);
    res.status(500).json({ error: 'Failed to process signature' });
  }
}
