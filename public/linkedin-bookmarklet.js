/**
 * LinkedIn Signals - Scraper Bookmarklet
 * Drag this to your bookmarks bar and click it while on your LinkedIn "Who viewed your profile" page.
 */
(function() {
    const API_URL = 'https://jwaiconsulting.com/api/linkedin-signal'; // Adjust if needed
    const SCAN_LIMIT = 20;

    console.log('🚀 LinkedIn Signal Scraper Starting...');

    function scrapeProfileViews() {
        // LinkedIn "Who viewed your profile" selectors
        const items = document.querySelectorAll('.me-pv-view-card'); // Common class for view cards
        const signals = [];

        items.forEach((item, index) => {
            if (index >= SCAN_LIMIT) return;

            try {
                const nameEl = item.querySelector('.artdeco-entity-lockup__title');
                const titleEl = item.querySelector('.artdeco-entity-lockup__subtitle');
                const imageEl = item.querySelector('.artdeco-entity-lockup__image img');
                const linkEl = item.querySelector('a[href*="/in/"]');

                if (nameEl && linkEl) {
                    signals.push({
                        type: 'profile_view',
                        person_name: nameEl.innerText.trim(),
                        person_title: titleEl ? titleEl.innerText.trim() : 'LinkedIn Member',
                        person_company: '', // Often hard to parse directly from the list view
                        person_image: imageEl ? imageEl.src : '',
                        linkedin_url: linkEl.href,
                        interaction_text: 'Viewed your profile recently',
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (e) {
                console.warn('Skipping item due to parse error', e);
            }
        });

        return signals;
    }

    async function syncSignals(signals) {
        if (signals.length === 0) {
            alert('No signals found to sync. Make sure you are on the "Who viewed your profile" page!');
            return;
        }

        console.log(`📡 Syncing ${signals.length} signals...`);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signals })
            });

            if (response.ok) {
                const result = await response.json();
                alert(`✅ Successfully synced ${result.count} signals to your dashboard!`);
            } else {
                const error = await response.text();
                alert(`❌ Sync failed: ${response.status} - ${error}`);
            }
        } catch (e) {
            alert(`❌ Network Error: Could not connect to dashboard API.`);
            console.error(e);
        }
    }

    const signals = scrapeProfileViews();
    syncSignals(signals);
})();
