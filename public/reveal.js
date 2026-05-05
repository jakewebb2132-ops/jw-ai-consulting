/**
 * Executive Reveal - Visitor Identification Pixel (RB2B Clone)
 * This script captures anonymous visitor signals and sends them to the identification engine.
 * UPDATED: Only fires upon reaching an intent threshold to save API credits.
 */
(function() {
    // Configuration
    const currentScript = document.currentScript;
    const SCRIPT_URL = currentScript ? currentScript.src : '';
    const SCRIPT_ORIGIN = SCRIPT_URL ? new URL(SCRIPT_URL).origin : '';
    
    // Allow manual override via data-api attribute
    const OVERRIDE_ENDPOINT = currentScript ? currentScript.getAttribute('data-api') : null;
    const API_ENDPOINT = OVERRIDE_ENDPOINT || (SCRIPT_ORIGIN ? `${SCRIPT_ORIGIN}/api/identify` : '/api/identify');
    
    let hasSentIntent = false;

    // Simple Fingerprinting
    function getFingerprint() {
        const screen = window.screen;
        const navigator = window.navigator;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("ExecutiveReveal", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("ExecutiveReveal", 4, 17);
        const canvasHash = canvas.toDataURL();

        return btoa([
            navigator.userAgent,
            navigator.language,
            screen.colorDepth,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvasHash.substring(0, 100)
        ].join('|'));
    }

    async function sendPulse(event = 'intent_reached') {
        if (hasSentIntent) return;
        hasSentIntent = true;

        const data = {
            visitor_id: getFingerprint(),
            url: window.location.href,
            referrer: document.referrer,
            event: event,
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                keepalive: true
            });
            console.log(`✅ Executive Reveal: Intent Captured (${event})`);
        } catch (e) {
            // Silently fail
        }
    }

    // Intent Rules
    const highIntentPaths = ['/services', '/contact', '/pricing', '/austin-events'];
    const currentPath = window.location.pathname.toLowerCase();
    
    if (highIntentPaths.some(p => currentPath.includes(p))) {
        // High-intent page: fire immediately
        if (document.readyState === 'complete') {
            sendPulse('high_intent_page');
        } else {
            window.addEventListener('load', () => sendPulse('high_intent_page'));
        }
    } else {
        // Low-intent page: wait 30 seconds before firing
        setTimeout(() => {
            sendPulse('time_on_site_30s');
        }, 30000);
    }
})();
