import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Apollo.io API Key (Required for live de-anonymization)
const APOLLO_API_KEY = process.env.APOLLO_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'GET') {
        const hasApollo = !!process.env.APOLLO_API_KEY;
        return res.status(200).json({ 
            status: 'Healthy', 
            service: 'Executive Reveal API',
            apollo_configured: hasApollo,
            timestamp: new Date().toISOString()
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { visitor_id, url, referrer, event } = req.body;
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || 
                      (req.headers['x-real-ip'] as string) || 
                      req.socket.remoteAddress || 
                      '127.0.0.1';

    try {
        console.log(`[REVEAL] Pulse: ID=${visitor_id} IP=${ipAddress} Event=${event} URL=${url}`);

        // Check if we already have this visitor
        const { data: existingLead } = await supabase
            .from('visitor_leads')
            .select('*')
            .eq('visitor_id', visitor_id)
            .single();

        if (existingLead) {
            console.log(`[REVEAL] Existing visitor recognized: ${existingLead.full_name} (${existingLead.visit_count} views)`);
            // Update activity
            await supabase
                .from('visitor_leads')
                .update({ 
                    last_seen: new Date().toISOString(),
                    last_page_viewed: url,
                    visit_count: (existingLead.visit_count || 1) + 1,
                    intent_score: (existingLead.intent_score || 0) + (event === 'heartbeat' ? 2 : 5)
                })
                .eq('id', existingLead.id);
        } else {
            // New Visitor - Enrich via Apollo.io
            console.log(`[REVEAL] New visitor detected. Starting enrichment...`);
            let enrichedData: any = {
                full_name: 'Visitor from ' + ipAddress,
                job_title: 'Identifying...',
                company_name: 'Scanning...',
                company_domain: null,
                linkedin_url: null,
                profile_image_url: null
            };

            // Live Enrichment via Apollo.io
            if (!APOLLO_API_KEY) {
                console.warn('[REVEAL] Apollo API Key is missing. Check your environment variables.');
            } else if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
                console.warn(`[REVEAL] Skipping enrichment for internal/local IP: ${ipAddress}`);
            } else {
                try {
                    console.log(`[REVEAL] Enrichment: Fetching company data for IP ${ipAddress}`);
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
                            console.log(`[REVEAL] Enrichment: Found Organization: ${org.name}`);
                            
                            enrichedData = {
                                full_name: 'Exec from ' + org.name,
                                job_title: 'Decision Maker',
                                company_name: org.name,
                                company_domain: org.primary_domain,
                                linkedin_url: org.linkedin_url,
                                profile_image_url: org.logo_url
                            };

                            // PERSON UPGRADE: Search for a top contact at this company
                            try {
                                console.log(`[REVEAL] Enrichment: Searching for key contacts at ${org.primary_domain}`);
                                const peopleResponse = await fetch(`https://api.apollo.io/v1/mixed_people/search`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-Api-Key': APOLLO_API_KEY
                                    },
                                    body: JSON.stringify({
                                        q_organization_domains: org.primary_domain,
                                        prospected_by_current_team: [false],
                                        page: 1,
                                        per_page: 1,
                                        person_titles: ['CEO', 'Founder', 'President', 'Owner', 'Head of Marketing', 'VP of Sales', 'Director of Engineering']
                                    })
                                });

                                if (peopleResponse.ok) {
                                    const peopleData = await peopleResponse.json();
                                    if (peopleData.people && peopleData.people.length > 0) {
                                        const person = peopleData.people[0];
                                        console.log(`[REVEAL] Enrichment: Identified Person: ${person.name} (${person.title})`);
                                        enrichedData.full_name = person.name;
                                        enrichedData.job_title = person.title;
                                        enrichedData.linkedin_url = person.linkedin_url;
                                        if (person.photo_url) enrichedData.profile_image_url = person.photo_url;
                                    }
                                }
                            } catch (peopleErr) {
                                console.error('[REVEAL] Person Search Error:', peopleErr);
                            }
                        } else {
                            console.log(`[REVEAL] Enrichment: No organization found for IP ${ipAddress}`);
                        }
                    } else {
                        const errText = await apolloResponse.text();
                        console.error(`[REVEAL] Apollo API Error (${apolloResponse.status}):`, errText);
                    }
                } catch (apolloErr) {
                    console.error('[REVEAL] Apollo Enrichment Network Error:', apolloErr);
                }
            }

            // Store the initial lead
            console.log(`[REVEAL] Saving new lead to Supabase: ${enrichedData.full_name}`);
            const { error: insertError } = await supabase
                .from('visitor_leads')
                .insert({
                    visitor_id,
                    ip_address: ipAddress,
                    last_page_viewed: url,
                    ...enrichedData,
                    intent_score: 10
                });
            
            if (insertError) {
                console.error('[REVEAL] Supabase Insert Error:', insertError.message);
            }
        }
        return res.status(200).json({ status: 'ok' });

    } catch (err) {
        if (err instanceof Error) {
            console.error('[REVEAL] Handler Error:', err.message, err.stack);
        } else {
            console.error('[REVEAL] Handler Error:', err);
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
