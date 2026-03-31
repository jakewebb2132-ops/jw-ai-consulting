import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Ensure these are in your Vercel Environment Variables)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// PDL API Key (Ensure this is in your Vercel Environment Variables)
const PDL_API_KEY = process.env.PDL_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { visitor_id, url, referrer, event } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        console.log(`[REVEAL] Pulse from ${visitor_id} at ${ipAddress} (${event})`);

        // Check if we already have this visitor
        const { data: existingLead } = await supabase
            .from('visitor_leads')
            .select('*')
            .eq('visitor_id', visitor_id)
            .single();

        if (existingLead) {
            // Update the visit count and last seen
            await supabase
                .from('visitor_leads')
                .update({ 
                    last_seen: new Date().toISOString(),
                    last_page_viewed: url,
                    visit_count: (existingLead.visit_count || 1) + 1,
                    intent_score: (existingLead.intent_score || 0) + (event === 'heartbeat' ? 5 : 0)
                })
                .eq('id', existingLead.id);
        } else {
            // New Visitor - Enrich via People Data Labs
            let enrichedData = {
                full_name: 'Anonymous Visitor',
                job_title: 'Unknown',
                company_name: 'Unknown',
                linkedin_url: null
            };

            if (PDL_API_KEY && ipAddress) {
                try {
                    // Step 1: Identify Company via IP
                    const pdlResponse = await fetch(`https://api.peopledatalabs.com/v5/ip/enrich?ip=${ipAddress}&api_key=${PDL_API_KEY}`);
                    const pdlData = await pdlResponse.json();

                    if (pdlData.status === 200 && pdlData.data) {
                        const company = pdlData.data.company;
                        enrichedData = {
                            full_name: 'Individual from ' + (company?.name || 'Unknown Company'),
                            job_title: 'Likely Decision Maker',
                            company_name: company?.name || 'Unknown',
                            linkedin_url: company?.linkedin_url || null
                        };
                    }
                } catch (pdlErr) {
                    console.error('[REVEAL] PDL Enrichment Error:', pdlErr);
                }
            }

            // Store the initial lead
            await supabase
                .from('visitor_leads')
                .insert({
                    visitor_id,
                    ip_address: typeof ipAddress === 'string' ? ipAddress : JSON.stringify(ipAddress),
                    last_page_viewed: url,
                    ...enrichedData
                });
        }

        return res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('[REVEAL] Handler Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
