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

    if (req.method === 'GET' && !req.query.data) {
        const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        return res.status(200).json({ 
            status: 'Healthy', 
            service: 'LinkedIn Signal API',
            database_configured: hasSupabase,
            timestamp: new Date().toISOString()
        });
    }

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let incomingSignals: any[] = [];

    if (req.method === 'POST') {
        incomingSignals = req.body.signals || [];
    } else if (req.method === 'GET') {
        const { data } = req.query;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(decodeURIComponent(data));
                // Handle both {signals: [...]} and direct objects for single-fire
                const extracted = parsed.signals || parsed;
                incomingSignals = Array.isArray(extracted) ? extracted : [extracted];
                console.log(`[LINKEDIN] Stealth Mode Received: ${incomingSignals.length} signal(s)`);
            } catch (e) {
                console.error('[LINKEDIN] JSON Parse Error (GET):', e);
            }
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (incomingSignals.length === 0) {
        return res.status(400).json({ error: 'No signals found' });
    }

    try {
        console.log(`[LINKEDIN] Processing ${incomingSignals.length} incoming signals`);

        // Check for duplicates within the last 12 hours
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
        
        // Final list of signals to insert
        const filteredSignals: any[] = [];

        for (const s of incomingSignals) {
            const personaName = s.person_name;
            const signalType = s.type || 'profile_view';

            const { data: existing } = await supabase
                .from('signals')
                .select('id')
                .eq('person_name', personaName)
                .eq('type', signalType)
                .gte('timestamp', twelveHoursAgo)
                .limit(1);

            if (existing && existing.length > 0) {
                console.log(`[LINKEDIN] Skipping duplicate signal for ${personaName} (${signalType})`);
            } else {
                filteredSignals.push({
                    type: signalType,
                    person_name: s.person_name,
                    person_title: s.person_title,
                    person_company: s.person_company,
                    person_image: s.person_image,
                    interaction_text: s.interaction_text,
                    linkedin_url: s.linkedin_url,
                    timestamp: s.timestamp || new Date().toISOString()
                });
            }
        }

        if (filteredSignals.length === 0) {
            console.log('[LINKEDIN] No new unique signals to insert');
            return res.status(200).json({ status: 'ok', count: 0, message: 'No new unique signals found' });
        }

        console.log(`[LINKEDIN] Inserting ${filteredSignals.length} unique signals`);

        const { error } = await supabase
            .from('signals')
            .insert(filteredSignals);

        if (error) {
            console.error('[LINKEDIN] Supabase Insert Error:', error.message);
            throw error;
        }

        return res.status(200).json({ status: 'ok', count: filteredSignals.length });

    } catch (err) {
        if (err instanceof Error) {
            console.error('[LINKEDIN] Handler Error:', err.message);
        } else {
            console.error('[LINKEDIN] Handler Error:', err);
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
