-- supabase/migrations/202604040001_capi_schema.sql
-- Run: supabase db push

create extension if not exists "pgcrypto";

-- ─── leads ───────────────────────────────────────────────────────────────────
create table if not exists leads (
  id                 uuid primary key default gen_random_uuid(),
  email_hash         text unique,          -- SHA-256 of normalized email, never raw
  linkedin_id        text unique,
  company            text,
  job_title          text,
  score              int not null default 0,
  enrichment_source  text,                 -- future: own identity resolution layer
  first_seen_at      timestamptz not null default now(),
  last_seen_at       timestamptz not null default now()
);

create index leads_email_hash_idx on leads(email_hash);
create index leads_linkedin_id_idx on leads(linkedin_id);
create index leads_score_idx on leads(score desc);

-- ─── capi_signals ─────────────────────────────────────────────────────────────
-- Named capi_signals (not signals) to avoid collision with the existing LinkedIn
-- signals table (202603310002_create_signals.sql).
create table if not exists capi_signals (
  id            uuid primary key default gen_random_uuid(),
  event_id      text not null,          -- shared with browser pixel for dedup
  channel       text not null           -- linkedin | meta | tiktok | x
                  check (channel in ('linkedin','meta','tiktok','x')),
  event_type    text not null,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  page_url      text,
  referrer      text,
  raw_payload   jsonb,
  received_at   timestamptz not null default now(),
  lead_id       uuid references leads(id) on delete set null
);

create unique index capi_signals_event_id_channel_idx on capi_signals(event_id, channel);
create index capi_signals_channel_idx on capi_signals(channel);
create index capi_signals_lead_id_idx on capi_signals(lead_id);
create index capi_signals_received_at_idx on capi_signals(received_at desc);

-- ─── outreach_queue ───────────────────────────────────────────────────────────
create table if not exists outreach_queue (
  id               uuid primary key default gen_random_uuid(),
  lead_id          uuid not null references leads(id) on delete cascade,
  trigger_event    text,
  channel          text,
  priority         int not null default 1 check (priority between 1 and 5),
  status           text not null default 'pending'
                     check (status in ('pending','sent','failed','skipped')),
  outreach_payload jsonb,          -- generic blob; provider-specific shape stored here
  queued_at        timestamptz not null default now(),
  sent_at          timestamptz
);

create index outreach_queue_status_priority_idx on outreach_queue(status, priority desc);
create index outreach_queue_lead_id_idx on outreach_queue(lead_id);

-- ─── crm_push_log ─────────────────────────────────────────────────────────────
create table if not exists crm_push_log (
  id                  uuid primary key default gen_random_uuid(),
  lead_id             uuid not null references leads(id) on delete cascade,
  crm                 text not null,         -- e.g. 'hubspot', 'custom' — no default
  external_contact_id text,                  -- contact ID in the target CRM
  action              text,                  -- create | update | associate
  status              text not null
                        check (status in ('success','failed')),
  error_detail        text,
  pushed_at           timestamptz not null default now()
);

create index crm_push_log_lead_id_idx on crm_push_log(lead_id);

-- ─── Row-level security ───────────────────────────────────────────────────────
-- Edge function uses service_role key so bypasses RLS.
-- Lock down anon/authenticated access for safety.

alter table leads          enable row level security;
alter table capi_signals   enable row level security;
alter table outreach_queue enable row level security;
alter table crm_push_log   enable row level security;

-- ─── Dashboard view (for Sales Dashboard queries) ─────────────────────────────
create or replace view lead_activity_summary as
select
  l.id,
  l.company,
  l.job_title,
  l.score,
  l.first_seen_at,
  l.last_seen_at,
  count(s.id)                                   as total_signals,
  array_agg(distinct s.channel)                  as channels,
  array_agg(distinct s.utm_campaign)
    filter (where s.utm_campaign is not null)    as campaigns,
  max(s.page_url)                                as last_page,
  (oq.status = 'pending')                        as in_outreach_queue
from leads l
left join capi_signals s on s.lead_id = l.id
left join outreach_queue oq on oq.lead_id = l.id and oq.status = 'pending'
group by l.id, l.company, l.job_title, l.score,
         l.first_seen_at, l.last_seen_at, oq.status
order by l.score desc;
