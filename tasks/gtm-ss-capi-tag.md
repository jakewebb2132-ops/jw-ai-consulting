# GTM Server-Side CAPI Tag — Setup Guide

## Architecture

```
Browser (gtag / GTM web container)
  │  fires dataLayer events with user_data, UTM, event metadata
  ▼
GTM Server-Side Container  (hosted on Cloud Run / AppEngine)
  │  Custom Tag Template: "JW CAPI Ingest"
  │  reads event data → builds CAPIPayload → POST /functions/v1/capi-ingest
  ▼
Supabase Edge Function: capi-ingest
  │  hashes PII, upserts leads, inserts capi_signals, scores lead
  ▼
Platform CAPIs (LinkedIn, Meta, TikTok, X) — forwarded in parallel
```

---

## 1. Custom Tag Template Code

Create a new **Custom Tag Template** in your GTM SS workspace.
Name: `JW CAPI Ingest`

Paste the following into the **Code** tab:

```javascript
const sendHttpRequest = require('sendHttpRequest');
const getEventData    = require('getEventData');
const JSON            = require('JSON');
const getTimestampMillis = require('getTimestampMillis');
const generateRandom  = require('generateRandom');
const logToConsole    = require('logToConsole');

// ─── Read tag fields (set via template UI fields below) ───────────────────────
const INGEST_URL  = data.ingestUrl;   // e.g. https://<ref>.supabase.co/functions/v1/capi-ingest
const INGEST_KEY  = data.ingestKey;   // CAPI_INGEST_SECRET (not the service-role key)
const CHANNEL     = data.channel;     // linkedin | meta | tiktok | x

// ─── Build payload from event data ────────────────────────────────────────────
const eventId = getEventData('event_id') ||
                getEventData('transaction_id') ||
                'gtm_' + getTimestampMillis() + '_' + generateRandom(1000, 9999);

const payload = {
  channel:    CHANNEL,
  event_id:   eventId,
  event_type: getEventData('event_name') || 'PageView',
  event_time: Math.floor(getTimestampMillis() / 1000),

  utm_source:   getEventData('page_location') ? undefined : getEventData('utm_source'),
  utm_medium:   getEventData('utm_medium'),
  utm_campaign: getEventData('utm_campaign'),
  utm_content:  getEventData('utm_content'),
  page_url:     getEventData('page_location'),
  referrer:     getEventData('page_referrer'),

  user_data: {
    email:      getEventData('user_data.email_address') || getEventData('email'),
    linkedin_id: getEventData('user_data.linkedin_id'),
    client_ip:  getEventData('ip_override') || getEventData('client_ip_address'),
    user_agent: getEventData('user_agent'),
  },

  custom_data: {
    value:    getEventData('value'),
    currency: getEventData('currency'),
    content_ids: getEventData('items'),
  },
};

// ─── POST to capi-ingest ───────────────────────────────────────────────────────
sendHttpRequest(
  INGEST_URL,
  {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + INGEST_KEY,
    },
  },
  JSON.stringify(payload),
  function(statusCode, headers, body) {
    if (statusCode >= 200 && statusCode < 300) {
      logToConsole('capi-ingest OK', statusCode, body);
      data.gtmOnSuccess();
    } else {
      logToConsole('capi-ingest ERROR', statusCode, body);
      data.gtmOnFailure();
    }
  }
);
```

---

## 2. Template Fields (UI tab in template editor)

Add these fields in the **Fields** tab of the template:

| Field name   | Display name          | Type     | Notes                                      |
|--------------|-----------------------|----------|--------------------------------------------|
| `ingestUrl`  | Ingest Endpoint URL   | Text     | `https://cdbvlnxirrfczxdccwbr.supabase.co/functions/v1/capi-ingest` |
| `ingestKey`  | Ingest Secret         | Text     | `792dadfadcab3990d7d17013484f6074e1815eddd3d96a3c68eaaa873506e680` — mark as **Secret** |
| `channel`    | Ad Channel            | Select   | Options: linkedin, meta, tiktok, x         |

---

## 3. Permissions (Permissions tab)

The template needs these permissions declared:

- **Sends HTTP requests** → Allow: `https://cdbvlnxirrfczxdccwbr.supabase.co/*`
- **Reads event data** → Allow all keys (or enumerate: `event_name`, `event_id`, `page_location`, `page_referrer`, `utm_*`, `user_data.*`, `ip_override`, `user_agent`, `value`, `currency`, `items`)
- **Logs to console** → Allow

---

## 4. Tag Configuration (per channel)

Create one tag instance per ad channel. Example for LinkedIn:

| Setting       | Value                                          |
|---------------|------------------------------------------------|
| Tag type      | JW CAPI Ingest (your custom template)          |
| Channel       | `linkedin`                                     |
| Ingest URL    | `https://cdbvlnxirrfczxdccwbr.supabase.co/functions/v1/capi-ingest` |
| Ingest Key    | `{{CAPI Ingest Secret}}` (GTM variable — store the `CAPI_INGEST_SECRET` value) |
| Trigger       | All Pages + any conversion events              |

Duplicate the tag for `meta`, `tiktok`, `x` — only the `channel` field changes.

---

## 5. GTM Web Container — Required Data Layer Variables

The server container reads these keys from the event. Make sure your web container pushes them:

```javascript
// On every page load (via gtag config or GTM trigger)
dataLayer.push({
  event: 'page_view',
  event_id: crypto.randomUUID(),          // browser-side dedup ID
  user_data: {
    email_address: '<hashed or raw — edge fn hashes it>',
    linkedin_id: '<if available from LinkedIn Insight Tag>',
  },
  utm_source:   '<from URL params>',
  utm_medium:   '<from URL params>',
  utm_campaign: '<from URL params>',
  utm_content:  '<from URL params>',
});

// On conversion events (form submit, demo book, etc.)
dataLayer.push({
  event: 'generate_lead',
  event_id: crypto.randomUUID(),
  value: 500,
  currency: 'USD',
  user_data: { email_address: document.querySelector('#email').value }
});
```

---

## 6. Dedup Strategy

The `event_id` field is the dedup key in `capi_signals(event_id, channel)` (unique index).

- **Browser pixel fires** with a `event_id = crypto.randomUUID()`
- **GTM SS tag fires** with the same `event_id` forwarded from the web container
- The edge function's `ON CONFLICT DO NOTHING` on the unique index prevents double-counting

Rule: always generate `event_id` client-side and forward it through the data layer → GTM SS → capi-ingest. Never generate it server-side.

---

## 7. Testing

Use GTM's **Preview mode** on the server container:
1. Open your site with `?gtm_debug=x`
2. Watch the server container preview panel for the `capi-ingest` tag
3. Confirm `200 OK` response and check Supabase `capi_signals` table for the row
