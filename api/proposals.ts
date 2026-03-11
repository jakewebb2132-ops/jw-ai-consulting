import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id } = req.query;

    if (id && typeof id === 'string') {
      // Fetch a specific proposal's telemetry
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          status,
          total_value,
          last_viewed_at,
          accepted_at,
          signature_name
        `)
        .eq('id', id)
        .single();
        
      if (error) {
          // If env vars not set, fail gracefully for demo
          return res.status(200).json({ success: true, telemetry: null });
      }

      return res.status(200).json({ 
         success: true, 
         telemetry: {
             status: data.status,
             lastViewedAt: data.last_viewed_at,
             acceptedAt: data.accepted_at,
             signatureName: data.signature_name
         } 
      });
    }

    // Default: fetch all for the dashboard
    const { data: proposals, error } = await supabase
       .from('proposals')
       .select('*')
       .order('updated_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, proposals });
  } catch (error) {
    console.error('Fetch Proposals Error:', error);
    res.status(500).json({ error: 'Failed to fetch proposal telemetry' });
  }
}
