import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL  = process.env.SUPABASE_URL!;
const CRON_SECRET   = process.env.CRON_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel cron jobs call with Authorization: Bearer {CRON_SECRET}
  const auth = req.headers['authorization'] ?? '';
  if (!CRON_SECRET || auth.replace(/^Bearer\s+/i, '') !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const edgeFnUrl = `${SUPABASE_URL}/functions/v1/linkedin-profile-signals`;

  const upstream = await fetch(edgeFnUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
  });

  const body = await upstream.json();
  return res.status(upstream.status).json(body);
}
