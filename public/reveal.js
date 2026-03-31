/**
 * Executive Reveal - Visitor Identification Pixel (RB2B Clone)
 * This script captures anonymous visitor signals and sends them to the identification engine.
 */
(function() {
    // Configuration
    // Use the script's origin as the base for the API if we're on a different domain.
    const SCRIPT_URL = document.currentScript ? document.currentScript.src : '';
    const SCRIPT_ORIGIN = SCRIPT_URL ? new URL(SCRIPT_URL).origin : '';
    const API_ENDPOINT = SCRIPT_ORIGIN ? `${SCRIPT_ORIGIN}/api/identify` : '/api/identify';
    const HEARTBEAT_INTERVAL = 30000; // 30 seconds

    // Simple Fingerprinting
    function getFingerprint() {
        const screen = window.screen;
        const navigator = window.navigator;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Basic canvas fingerprinting
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

    async function sendPulse(event = 'heartbeat') {
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
                keepalive: true // Ensure request finishes even if page closes
            });
        } catch (e) {
            // Silently fail to avoid disrupting user experience
        }
    }

    // Initialize
    if (document.readyState === 'complete') {
        sendPulse('page_view');
    } else {
        window.addEventListener('load', () => sendPulse('page_view'));
    }

    // Set Heartbeat
    setInterval(() => sendPulse('heartbeat'), HEARTBEAT_INTERVAL);

    // Track visibility change (returning to tab)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            sendPulse('return');
        }
    });

    console.log('✅ Executive Reveal Active');
})();
