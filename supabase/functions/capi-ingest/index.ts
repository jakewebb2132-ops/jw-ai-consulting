// supabase/functions/capi-ingest/index.ts
// Receives CAPI events from GTM server-side container, hashes PII, scores leads,
// queues outreach, and forwards to platform CAPIs in parallel.

import { createClient } from 'npm:@supabase/supabase-js@2';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CAPIPayload {
  channel: 'linkedin' | 'meta' | 'tiktok' | 'x';
  event_id: string;
  event_type: string;
  event_time?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  page_url?: string;
  referrer?: string;
  user_data?: {
    email?: string;
    linkedin_id?: string;
    client_ip?: string;
    user_agent?: string;
  };
  custom_data?: Record<string, unknown>;
}

interface ForwardResult {
  channel: string;
  status: 'sent' | 'skipped' | 'failed';
  http_status?: number;
  error?: string;
}

// ─── Env ─────────────────────────────────────────────────────────────────────

const SUPABASE_URL             = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CAPI_INGEST_SECRET       = Deno.env.get('CAPI_INGEST_SECRET')!;
const OUTREACH_THRESHOLD       = parseInt(Deno.env.get('OUTREACH_SCORE_THRESHOLD') ?? '20');

// Platform CAPI credentials — optional; forwarding is skipped if not set
const LINKEDIN_ACCESS_TOKEN    = Deno.env.get('LINKEDIN_CAPI_ACCESS_TOKEN');
const LINKEDIN_CONVERSION_URN  = Deno.env.get('LINKEDIN_CAPI_CONVERSION_URN');
const META_PIXEL_ID            = Deno.env.get('META_PIXEL_ID');
const META_ACCESS_TOKEN        = Deno.env.get('META_ACCESS_TOKEN');
const TIKTOK_PIXEL_ID          = Deno.env.get('TIKTOK_PIXEL_ID');
const TIKTOK_ACCESS_TOKEN      = Deno.env.get('TIKTOK_ACCESS_TOKEN');
const X_PIXEL_ID               = Deno.env.get('X_PIXEL_ID');
const X_ACCESS_TOKEN           = Deno.env.get('X_ACCESS_TOKEN');

// ─── Scoring table ────────────────────────────────────────────────────────────
// Adjust weights here; the function just calls supabase RPC to increment atomically.

const SCORE_WEIGHTS: Record<string, number> = {
  PageView:             1,
  ViewContent:          2,
  InitiateCheckout:     5,
  Purchase:             8,
  generate_lead:        8,
  Lead:                 8,
  Contact:              6,
  SubmitApplication:    6,
  CompleteRegistration: 6,
};

function scoreForEvent(eventType: string): number {
  return SCORE_WEIGHTS[eventType] ?? 1;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function sha256hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value.trim().toLowerCase()),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

// ─── Platform CAPI forwarders ─────────────────────────────────────────────────

async function forwardLinkedIn(
  payload: CAPIPayload,
  emailHash: string | null,
): Promise<ForwardResult> {
  if (!LINKEDIN_ACCESS_TOKEN || !LINKEDIN_CONVERSION_URN) {
    return { channel: 'linkedin', status: 'skipped' };
  }
  try {
    const body = {
      conversion: LINKEDIN_CONVERSION_URN,
      conversionHappenedAt: (payload.event_time ?? Math.floor(Date.now() / 1000)) * 1000,
      eventId: payload.event_id,
      user: {
        userIds: [
          ...(emailHash ? [{ idType: 'SHA256_EMAIL', idValue: emailHash }] : []),
          ...(payload.user_data?.linkedin_id
            ? [{ idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID', idValue: payload.user_data.linkedin_id }]
            : []),
        ],
      },
    };
    const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202409',
      },
      body: JSON.stringify(body),
    });
    return { channel: 'linkedin', status: res.ok ? 'sent' : 'failed', http_status: res.status };
  } catch (e: unknown) {
    return { channel: 'linkedin', status: 'failed', error: String(e) };
  }
}

async function forwardMeta(
  payload: CAPIPayload,
  emailHash: string | null,
): Promise<ForwardResult> {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) {
    return { channel: 'meta', status: 'skipped' };
  }
  try {
    const event: Record<string, unknown> = {
      event_name: payload.event_type,
      event_time: payload.event_time ?? Math.floor(Date.now() / 1000),
      event_id: payload.event_id,
      action_source: 'website',
      event_source_url: payload.page_url,
      user_data: {
        ...(emailHash ? { em: [emailHash] } : {}),
        ...(payload.user_data?.client_ip ? { client_ip_address: payload.user_data.client_ip } : {}),
        ...(payload.user_data?.user_agent ? { client_user_agent: payload.user_data.user_agent } : {}),
      },
      custom_data: payload.custom_data ?? {},
    };
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event] }),
      },
    );
    return { channel: 'meta', status: res.ok ? 'sent' : 'failed', http_status: res.status };
  } catch (e: unknown) {
    return { channel: 'meta', status: 'failed', error: String(e) };
  }
}

async function forwardTikTok(
  payload: CAPIPayload,
  emailHash: string | null,
): Promise<ForwardResult> {
  if (!TIKTOK_PIXEL_ID || !TIKTOK_ACCESS_TOKEN) {
    return { channel: 'tiktok', status: 'skipped' };
  }
  try {
    const body = {
      pixel_code: TIKTOK_PIXEL_ID,
      event: payload.event_type,
      event_id: payload.event_id,
      timestamp: new Date((payload.event_time ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
      context: {
        user: {
          ...(emailHash ? { sha256_email: emailHash } : {}),
        },
        page: { url: payload.page_url, referrer: payload.referrer },
        ip: payload.user_data?.client_ip,
        user_agent: payload.user_data?.user_agent,
      },
      properties: payload.custom_data ?? {},
    };
    const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Access-Token': TIKTOK_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return { channel: 'tiktok', status: res.ok ? 'sent' : 'failed', http_status: res.status };
  } catch (e: unknown) {
    return { channel: 'tiktok', status: 'failed', error: String(e) };
  }
}

async function forwardX(
  payload: CAPIPayload,
  emailHash: string | null,
): Promise<ForwardResult> {
  if (!X_PIXEL_ID || !X_ACCESS_TOKEN) {
    return { channel: 'x', status: 'skipped' };
  }
  try {
    // X Ads Measurement API (pixel events)
    const body = {
      pixel_id: X_PIXEL_ID,
      events: [
        {
          event_type: payload.event_type,
          event_id: payload.event_id,
          event_time: payload.event_time ?? Math.floor(Date.now() / 1000),
          identifiers: [
            ...(emailHash ? [{ hashed_email: emailHash }] : []),
          ],
          page_url: payload.page_url,
          custom_data: payload.custom_data ?? {},
        },
      ],
    };
    const res = await fetch('https://ads-api.twitter.com/12/measurement/pixel/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${X_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return { channel: 'x', status: res.ok ? 'sent' : 'failed', http_status: res.status };
  } catch (e: unknown) {
    return { channel: 'x', status: 'failed', error: String(e) };
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!CAPI_INGEST_SECRET || token !== CAPI_INGEST_SECRET) {
    return json({ error: 'Unauthorized' }, 401);
  }

  // ── Parse payload ─────────────────────────────────────────────────────────
  let payload: CAPIPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { channel, event_id, event_type } = payload;
  if (!channel || !event_id || !event_type) {
    return json({ error: 'Missing required fields: channel, event_id, event_type' }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // ── Hash PII ──────────────────────────────────────────────────────────────
  const email = payload.user_data?.email?.trim().toLowerCase();
  const emailHash = email ? await sha256hex(email) : null;
  const linkedinId = payload.user_data?.linkedin_id ?? null;

  // ── Upsert lead ───────────────────────────────────────────────────────────
  // We need a lead_id to attach the signal and score to.
  // Look up existing lead by email_hash or linkedin_id first.
  let leadId: string | null = null;

  if (emailHash || linkedinId) {
    // Try to find existing lead
    const orFilter = [
      emailHash   ? `email_hash.eq.${emailHash}`    : null,
      linkedinId  ? `linkedin_id.eq.${linkedinId}`  : null,
    ].filter(Boolean).join(',');

    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .or(orFilter)
      .maybeSingle();

    if (existing) {
      leadId = existing.id;
      // Update last_seen_at
      await supabase
        .from('leads')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', leadId);
    } else {
      // Create new lead
      const { data: created, error: createErr } = await supabase
        .from('leads')
        .insert({
          email_hash:  emailHash,
          linkedin_id: linkedinId,
          first_seen_at: new Date().toISOString(),
          last_seen_at:  new Date().toISOString(),
        })
        .select('id')
        .single();

      if (createErr) {
        console.error('Lead insert error:', createErr);
      } else {
        leadId = created.id;
      }
    }
  }

  // ── Insert signal (dedup via unique index on event_id + channel) ──────────
  const { data: insertedSignal } = await supabase
    .from('capi_signals')
    .insert({
      event_id,
      channel,
      event_type,
      utm_source:   payload.utm_source   ?? null,
      utm_medium:   payload.utm_medium   ?? null,
      utm_campaign: payload.utm_campaign ?? null,
      utm_content:  payload.utm_content  ?? null,
      page_url:     payload.page_url     ?? null,
      referrer:     payload.referrer     ?? null,
      raw_payload:  payload,
      lead_id:      leadId,
    })
    .select('id')
    .maybeSingle();  // returns null on ON CONFLICT DO NOTHING (duplicate)

  const isDuplicate = !insertedSignal;

  // ── Score lead (only if signal was new, not a dup) ────────────────────────
  let newScore: number | null = null;

  if (!isDuplicate && leadId) {
    const delta = scoreForEvent(event_type);

    // Atomic increment via RPC — returns new score in one round-trip
    const { data: rpcResult, error: rpcErr } = await supabase.rpc('increment_lead_score', {
      lead_id: leadId,
      delta,
    });

    if (rpcErr) console.error('Score increment error:', rpcErr);
    newScore = rpcResult as number | null;

    // ── Queue for outreach if threshold crossed ───────────────────────────
    if (newScore >= OUTREACH_THRESHOLD) {
      // Check if already pending
      const { count } = await supabase
        .from('outreach_queue')
        .select('id', { count: 'exact', head: true })
        .eq('lead_id', leadId)
        .eq('status', 'pending');

      if ((count ?? 0) === 0) {
        await supabase.from('outreach_queue').insert({
          lead_id:          leadId,
          trigger_event:    event_type,
          channel,
          priority:         newScore >= OUTREACH_THRESHOLD * 2 ? 5 : 3,
          status:           'pending',
          outreach_payload: {
            triggered_by_event_id: event_id,
            score_at_trigger:      newScore,
          },
        });
      }
    }
  }

  // ── Forward to platform CAPIs in parallel ─────────────────────────────────
  const forwardMap: Record<string, (p: CAPIPayload, h: string | null) => Promise<ForwardResult>> = {
    linkedin: forwardLinkedIn,
    meta:     forwardMeta,
    tiktok:   forwardTikTok,
    x:        forwardX,
  };

  const forwarder = forwardMap[channel];
  const forwardResults: ForwardResult[] = [];

  if (forwarder) {
    const settled = await Promise.allSettled([forwarder(payload, emailHash)]);
    for (const result of settled) {
      forwardResults.push(
        result.status === 'fulfilled'
          ? result.value
          : { channel, status: 'failed', error: String(result.reason) },
      );
    }
  }

  // ── Response ──────────────────────────────────────────────────────────────
  return json({
    ok: true,
    lead_id:    leadId,
    duplicate:  isDuplicate,
    new_score:  newScore,
    queued:     !isDuplicate && leadId && newScore !== null && newScore >= OUTREACH_THRESHOLD,
    forwarded:  forwardResults,
  });
});
