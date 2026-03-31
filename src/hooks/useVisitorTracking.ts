import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useVisitorTracking = () => {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                // 1. Get basic visitor session info
                const path = window.location.pathname;

                // 2. Resolve IP and location via a public API
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const { ip } = await ipResponse.json();

                // 3. Prepare the lead record (Using the new schema)
                const newVisit = {
                    visitor_id: `vstr-${Math.random().toString(36).substring(7)}`,
                    ip_address: ip,
                    full_name: 'Anonymous Visitor',
                    company_name: 'Resolving Identiy...',
                    last_page_viewed: path,
                    last_seen: new Date().toISOString(),
                    visit_count: 1,
                    intent_score: 15, // Higher initial score for real activity
                };

                // 4. Push to Supabase visitor_leads table
                const { data, error } = await supabase
                    .from('visitor_leads')
                    .insert([newVisit])
                    .select();

                if (error) {
                    console.error('❌ Tracking Error:', error.message);
                } else {
                    console.log('✅ Real-time visit captured at Executive Reveal dashboard.', data);
                }
            } catch (err) {
                console.warn('Visitor tracking skipped:', err);
            }
        };

        // Track only once per session
        const sessionKey = `tracked-${window.location.hostname}`;
        if (!sessionStorage.getItem(sessionKey)) {
            trackVisit();
            sessionStorage.setItem(sessionKey, 'true');
        }
    }, []);
};
