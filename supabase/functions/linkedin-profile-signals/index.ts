import { createClient } from 'npm:@supabase/supabase-js@2';

// ─── Env ──────────────────────────────────────────────────────────────────────

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LINKEDIN_TOKEN       = Deno.env.get('LINKEDIN_ACCESS_TOKEN')!;
const LINKEDIN_PERSON_URN  = Deno.env.get('LINKEDIN_PERSON_URN')!; // urn:li:person:XXXXXXX
const CRON_SECRET          = Deno.env.get('CRON_SECRET')!;

// ─── Recruiter keyword filter ─────────────────────────────────────────────────

const RECRUITER_KEYWORDS = [
  'recruiter',
  'talent',
  'sourcer',
  'talent acquisition',
  'ta partner',
  'people operations',
  'head of people',
  'hr',
  'hiring manager',
];

function isRecruiter(headline: string): boolean {
  const lower = headline.toLowerCase();
  return RECRUITER_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── LinkedIn API helpers ─────────────────────────────────────────────────────

const LI_HEADERS = {
  Authorization: `Bearer ${LINKEDIN_TOKEN}`,
  'X-Restli-Protocol-Version': '2.0.0',
  'LinkedIn-Version': '202401',
};

async function liGet(path: string): Promise<unknown> {
  const res = await fetch(`https://api.linkedin.com${path}`, { headers: LI_HEADERS });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn API ${res.status} for ${path}: ${text}`);
  }
  return res.json();
}

// Returns the preferred-locale string value from a LinkedIn multi-locale field.
function localized(field: { localized: Record<string, string>; preferredLocale: { language: string; country: string } }): string {
  const key = `${field.preferredLocale.language}_${field.preferredLocale.country}`;
  return field.localized[key] ?? Object.values(field.localized)[0] ?? '';
}

// Extracts company from headline using common "Title at Company" patterns.
function extractCompany(headline: string): string | null {
  const match = headline.match(/ at (.+)$/i) ?? headline.match(/ @ (.+)$/i);
  return match ? match[1].trim() : null;
}

// ─── Fetch recent posts ───────────────────────────────────────────────────────

interface UgcPost {
  id: string;
}

async function fetchRecentPosts(authorUrn: string): Promise<UgcPost[]> {
  const encoded = encodeURIComponent(authorUrn);
  const data = await liGet(
    `/v2/ugcPosts?q=authors&authors=List(${encoded})&count=5&sortBy=LAST_MODIFIED`,
  ) as { elements?: UgcPost[] };
  return data.elements ?? [];
}

// ─── Fetch likes ──────────────────────────────────────────────────────────────

interface LikeElement {
  actor: string; // urn:li:person:XXX
}

async function fetchLikes(postUrn: string): Promise<string[]> {
  const encoded = encodeURIComponent(postUrn);
  const data = await liGet(`/v2/socialActions/${encoded}/likes?count=50`) as {
    elements?: LikeElement[];
  };
  return (data.elements ?? []).map((el) => el.actor);
}

// ─── Fetch comments ───────────────────────────────────────────────────────────

interface CommentElement {
  actor: string;
}

async function fetchComments(postUrn: string): Promise<string[]> {
  const encoded = encodeURIComponent(postUrn);
  const data = await liGet(`/v2/socialActions/${encoded}/comments?count=50`) as {
    elements?: CommentElement[];
  };
  return (data.elements ?? []).map((el) => el.actor);
}

// ─── Fetch profile ────────────────────────────────────────────────────────────

interface LinkedInProfile {
  id: string;
  firstName: { localized: Record<string, string>; preferredLocale: { language: string; country: string } };
  lastName:  { localized: Record<string, string>; preferredLocale: { language: string; country: string } };
  headline?: { localized: Record<string, string>; preferredLocale: { language: string; country: string } };
}

const profileCache = new Map<string, LinkedInProfile>();

async function fetchProfile(personUrn: string): Promise<LinkedInProfile | null> {
  if (profileCache.has(personUrn)) return profileCache.get(personUrn)!;
  const personId = personUrn.replace('urn:li:person:', '');
  try {
    const profile = await liGet(
      `/v2/people/(id:${personId})?projection=(id,firstName,lastName,headline)`,
    ) as LinkedInProfile;
    profileCache.set(personUrn, profile);
    return profile;
  } catch (e) {
    console.warn(`Could not fetch profile for ${personUrn}:`, e);
    return null;
  }
}

// ─── Hashing ──────────────────────────────────────────────────────────────────

async function sha256hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Process signals ──────────────────────────────────────────────────────────

interface SignalRow {
  profile_urn:   string;
  display_name:  string | null;
  company:       string | null;
  title:         string | null;
  signal_type:   string;
  signal_source: string;
  signal_detail: Record<string, unknown>;
  icp_score:     number | null;
  signal_hash:   string;
  detected_at:   string;
}

async function buildSignalRow(
  profileUrn: string,
  signalType: 'post_engagement',
  signalSource: 'linkedin_post_likes' | 'linkedin_post_comments',
  postUrn: string,
): Promise<SignalRow | null> {
  const profile = await fetchProfile(profileUrn);
  if (!profile) return null;

  const firstName = localized(profile.firstName);
  const lastName  = localized(profile.lastName);
  const headline  = profile.headline ? localized(profile.headline) : '';

  if (!isRecruiter(headline)) return null;

  const today = new Date().toISOString().slice(0, 10);
  const signalHash = await sha256hex(`${profileUrn}:${signalType}:${today}`);

  return {
    profile_urn:   profileUrn,
    display_name:  `${firstName} ${lastName}`.trim() || null,
    company:       extractCompany(headline),
    title:         headline || null,
    signal_type:   signalType,
    signal_source: signalSource,
    signal_detail: { post_urn: postUrn },
    icp_score:     80,
    signal_hash:   signalHash,
    detected_at:   new Date().toISOString(),
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('authorization') ?? '';
  if (!CRON_SECRET || authHeader.replace(/^Bearer\s+/i, '') !== CRON_SECRET) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  let totalProcessed = 0;
  let totalUpserted  = 0;
  const errors: string[] = [];

  try {
    const posts = await fetchRecentPosts(LINKEDIN_PERSON_URN);
    console.log(`Found ${posts.length} recent posts`);

    for (const post of posts) {
      const [likerUrns, commenterUrns] = await Promise.all([
        fetchLikes(post.id).catch((e) => { errors.push(`likes ${post.id}: ${e}`); return [] as string[]; }),
        fetchComments(post.id).catch((e) => { errors.push(`comments ${post.id}: ${e}`); return [] as string[]; }),
      ]);

      // Build signal rows; profile fetches are sequential to stay within rate limits
      const signalRows: SignalRow[] = [];

      for (const urn of likerUrns) {
        totalProcessed++;
        const row = await buildSignalRow(urn, 'post_engagement', 'linkedin_post_likes', post.id);
        if (row) signalRows.push(row);
      }

      for (const urn of commenterUrns) {
        totalProcessed++;
        const row = await buildSignalRow(urn, 'post_engagement', 'linkedin_post_comments', post.id);
        if (row) signalRows.push(row);
      }

      if (signalRows.length === 0) continue;

      const { error: upsertErr } = await supabase
        .from('intent_signals')
        .upsert(signalRows, { onConflict: 'signal_hash', ignoreDuplicates: true });

      if (upsertErr) {
        errors.push(`upsert for post ${post.id}: ${upsertErr.message}`);
      } else {
        totalUpserted += signalRows.length;
      }
    }
  } catch (e) {
    errors.push(`fatal: ${e}`);
    return json({ ok: false, errors }, 500);
  }

  return json({ ok: true, processed: totalProcessed, upserted: totalUpserted, errors });
});
