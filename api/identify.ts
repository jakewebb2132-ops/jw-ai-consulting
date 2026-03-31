import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Apollo.io API Key (Required for live de-anonymization)
const APOLLO_API_KEY = process.env.APOLLO_API_KEY || '';

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
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

    try {
        console.log(`[REVEAL] Pulse from ${visitor_id} at ${ipAddress} (${event})`);

        // Check if we already have this visitor
        const { data: existingLead } = await supabase
            .from('visitor_leads')
            .select('*')
            .eq('visitor_id', visitor_id)
            .single();

        if (existingLead) {
            // Update activity
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
            // New Visitor - Enrich via Apollo.io
            let enrichedData: any = {
                full_name: 'Visitor from ' + ipAddress,
                job_title: 'Identifying...',
                company_name: 'Scanning...',
                company_domain: null,
                linkedin_url: null,
                profile_image_url: null
            };

            // DEMO MODE if no API Key
            if (!APOLLO_API_KEY) {
                console.log('[REVEAL] No Apollo API Key found. Using DEMO DATA.');
                enrichedData = {
                    full_name: 'John Doe (Demo)',
                    job_title: 'VP of Product',
                    company_name: 'Aether Insights',
                    company_domain: 'aether.io',
                    linkedin_url: 'https://www.linkedin.com/in/johndoe',
                    profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
                };
            } else {
                try {
                    // Apollo.io Enrichment via IP
                    const apolloResponse = await fetch(`https://api.apollo.io/v1/organizations/enrich?ip=${ipAddress}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Content-Type': 'application/json',
                            'X-Api-Key': APOLLO_API_KEY
                        }
                    });
                    
                    if (apolloResponse.ok) {
                        const apolloData = await apolloResponse.json();
                        if (apolloData.organization) {
                            const org = apolloData.organization;
                            enrichedData = {
                                full_name: 'Exec from ' + org.name,
                                job_title: 'Decision Maker',
                                company_name: org.name,
                                company_domain: org.primary_domain,
                                linkedin_url: org.linkedin_url,
                                profile_image_url: org.logo_url
                            };
                        }
                    }
                } catch (apolloErr) {
                    console.error('[REVEAL] Apollo Enrichment Error:', apolloErr);
                }
            }

            // Store the initial lead
            await supabase
                .from('visitor_leads')
                .insert({
                    visitor_id,
                    ip_address: ipAddress,
                    last_page_viewed: url,
                    ...enrichedData,
                    intent_score: 10
                });
        }

        return res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('[REVEAL] Handler Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
