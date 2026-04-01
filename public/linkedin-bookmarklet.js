/**
 * LinkedIn Signals - Scraper Bookmarklet
 * Drag this to your bookmarks bar and click it while on your LinkedIn "Who viewed your profile" page.
 */
(function() {
    const API_URL = 'https://jwaiconsulting.com/api/linkedin-signal';
    const SCAN_LIMIT = 50;

    // UI Helper: Notify user
    function notify(msg, type = 'info') {
        const div = document.createElement('div');
        div.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 25px;background:${type === 'error' ? '#ef4444' : '#2563eb'};color:white;z-index:999999;border-radius:12px;font-family:sans-serif;font-weight:bold;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);transition:opacity 0.5s;`;
        div.innerText = '🚀 ' + msg;
        document.body.appendChild(div);
        setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 3000);
    }

    function scrapeProfileViews() {
        console.log('🔍 Identifying Profile Views...');
        const items = document.querySelectorAll('.me-pv-view-card, .profile-views-v2__item');
        const signals = [];

        items.forEach((item, index) => {
            if (index >= SCAN_LIMIT) return;
            try {
                const nameEl = item.querySelector('.artdeco-entity-lockup__title, [class*="name"]');
                const titleEl = item.querySelector('.artdeco-entity-lockup__subtitle, [class*="headline"]');
                const imageEl = item.querySelector('img');
                const linkEl = item.querySelector('a[href*="/in/"]');

                if (nameEl && linkEl) {
                    signals.push({
                        type: 'profile_view',
                        person_name: nameEl.innerText.trim(),
                        person_title: titleEl ? titleEl.innerText.trim() : 'LinkedIn Member',
                        person_company: '',
                        person_image: imageEl ? imageEl.src : '',
                        linkedin_url: linkEl.href,
                        interaction_text: 'Viewed your profile recently',
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (e) { console.warn('Parse error', e); }
        });
        return signals;
    }

    function scrapePostInteractions() {
        console.log('🔍 Identifying Post Interactions...');
        // This targets the reactions modal if open, or the feed items
        const items = document.querySelectorAll('.social-details-reactors-facepile__list-item, .comments-comment-item, .artdeco-entity-lockup--size-4');
        const signals = [];

        items.forEach((item, index) => {
            if (index >= SCAN_LIMIT) return;
            try {
                const nameEl = item.querySelector('.artdeco-entity-lockup__title, .comments-post-meta__name-text');
                const titleEl = item.querySelector('.artdeco-entity-lockup__subtitle, .comments-post-meta__headline');
                const imageEl = item.querySelector('img');
                const linkEl = item.querySelector('a[href*="/in/"]');
                
                // Determine if it's a like or a comment
                const isComment = item.classList.contains('comments-comment-item') || !!item.querySelector('.comments-comment-item__main-content');

                if (nameEl && linkEl) {
                    signals.push({
                        type: isComment ? 'post_comment' : 'post_reaction',
                        person_name: nameEl.innerText.trim(),
                        person_title: titleEl ? titleEl.innerText.trim() : 'LinkedIn Member',
                        person_company: '',
                        person_image: imageEl ? imageEl.src : '',
                        linkedin_url: linkEl.href,
                        interaction_text: isComment ? 'Commented on your post' : 'Liked your post',
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (e) { console.warn('Parse error', e); }
        });
        return signals;
    }

    async function startSync() {
        notify('LinkedIn Stealth Scan Starting...');
        
        let signals = [];
        const url = window.location.href;

        if (url.includes('/me/profile-views/')) {
            signals = scrapeProfileViews();
        } else if (url.includes('/posts/') || url.includes('/feed/update/') || document.querySelector('.social-details-reactors-modal')) {
            signals = scrapePostInteractions();
        } else {
            const proceed = confirm("You don't seem to be on the 'Profile Views' page or a 'Post Reactions' modal. Scrape anyway?");
            if (proceed) signals = [...scrapeProfileViews(), ...scrapePostInteractions()];
            else return;
        }

        if (signals.length === 0) {
            notify('No signals found. Try opening the "Reactions" list or "Profile Views" page.', 'error');
            return;
        }

        notify(`Syncing ${signals.length} signals to Sales Dashboard...`);
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signals })
            });

            if (response.ok) {
                const result = await response.json();
                notify(`Success! ${result.count} new interactions captured.`, 'success');
            } else {
                const error = await response.text();
                notify(`Sync failed: ${response.status}`, 'error');
            }
        } catch (e) {
            notify('Network Error: Check console for details.', 'error');
            console.error(e);
        }
    }

    startSync();

})();
