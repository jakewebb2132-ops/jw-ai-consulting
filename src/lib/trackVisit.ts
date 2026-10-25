/**
 * trackVisit.ts
 * Fires on every page load. Fetches the visitor's IP from a public API,
 * then sends it to our Supabase enrich-ip Edge Function.
 * The Edge Function does the IP-to-Company lookup, filters residential IPs,
 * scores intent, and writes only valid corporate leads to Supabase.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Respect user privacy — don't track if they've opted out
function isDoNotTrack(): boolean {
  return (
    navigator.doNotTrack === '1' ||
    (window as Window & { doNotTrack?: string }).doNotTrack === '1'
  );
}

export async function trackVisit(): Promise<void> {
  if (isDoNotTrack()) return;
  // Analytics is non-essential: without config, skip rather than fail.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  try {
    // Step 1: Get the visitor's public IP from a free, no-auth API
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = (await ipResponse.json()) as { ip?: string };

    if (!ip) return;

    // Step 2: Fire and forget — send to our enrichment Edge Function
    // We don't await the result so we don't block page rendering
    fetch(`${SUPABASE_URL}/functions/v1/enrich-ip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        ip,
        path: window.location.pathname,
        user_agent: navigator.userAgent,
      }),
    }).catch(() => {
      // Silently fail — never interrupt the user experience for analytics
    });

  } catch {
    // Never throw — tracking must never break the site
  }
}
