import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS for anything (pixels/bookmarklets)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let signals: any[] = [];

    if (req.method === 'POST') {
        signals = req.body.signals;
    } else if (req.method === 'GET') {
        // Handle "Stealth Mode" via query parameter for CSP bypass
        const { data } = req.query;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(decodeURIComponent(data));
                signals = parsed.signals || [];
            } catch (e) {
                console.error('[LINKEDIN] JSON Parse Error (GET):', e);
            }
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!Array.isArray(signals) || signals.length === 0) {
        return res.status(400).json({ error: 'No signals found' });
    }

    try {
        console.log(`[LINKEDIN] Received ${signals.length} signals`);

        // Bulk insert into signals table
        const { error } = await supabase
            .from('signals')
            .insert(signals.map(s => ({
                type: s.type || 'profile_view',
                person_name: s.person_name,
                person_title: s.person_title,
                person_company: s.person_company,
                person_image: s.person_image,
                interaction_text: s.interaction_text,
                linkedin_url: s.linkedin_url,
                timestamp: s.timestamp || new Date().toISOString()
            })));

        if (error) {
            console.error('[LINKEDIN] Supabase Insert Error:', error.message);
            throw error;
        }

        return res.status(200).json({ status: 'ok', count: signals.length });
    } catch (err) {
        if (err instanceof Error) {
            console.error('[LINKEDIN] Handler Error:', err.message);
        } else {
            console.error('[LINKEDIN] Handler Error:', err);
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
