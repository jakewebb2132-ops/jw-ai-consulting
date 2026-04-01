import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question, advisors, mode = 'consensus' } = req.body as { question: string, mode?: 'consensus' | 'debate', advisors: { id: string, persona: string }[] };

  // Set headers for Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!API_KEY) {
    res.write('data: ' + JSON.stringify({ error: 'Missing process.env.GOOGLE_API_KEY' }) + '\n\n');
    res.end();
    return;
  }

  // We are using native fetch to hit Gemini's REST streaming API to avoid any dependency bloat,
  // which works seamlessly and cleanly inside a Vercel serverless function.
  const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${API_KEY}`;

  // Log the interaction to Supabase for monitoring (Reliable Await)
  try {
    await supabase.from('boardroom_interactions').insert([{
      question,
      mode,
      advisors: advisors.map(a => a.id)
    }]);
  } catch (logError) {
    console.error('[MONITOR] Logging Error:', logError);
  }

  try {
    // Launch all agent generation calls simultaneously
    const streams = await Promise.all(advisors.map(async (advisor) => {
      const formattingDirective = "\n\nFORMATTING RULE: Be concise and structural. Use numbered lists (1., 2., 3.) for your primary strategic points. Each point MUST start with a **Bold Summary Header** followed by a direct explanation. Avoid excessive whitespace—one blank line between major blocks is sufficient. No fluff, no generic introductory filler.";
      
      const debateInjection = "\n\nCRITICAL DIRECTIVE: You are in DEBATE MODE. Be provocatively contrarian. Focus on the 'dark side' or the vital risks others ignore. Challenge assumptions directly and firmly. " + formattingDirective;
      
      const consensusInjection = "\n\nCRITICAL DIRECTIVE: You are in CONSENSUS MODE. Frame your analysis constructively to find the most optimized, high-leverage path forward through synthesis. " + formattingDirective;
      
      const finalPersona = advisor.persona + (mode === 'debate' ? debateInjection : consensusInjection);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: finalPersona }] },
          contents: [{ role: 'user', parts: [{ text: question }] }]
        })
      });

      return { id: advisor.id, body: response.body };
    }));

    // Pipe all external streams into our single Vercel SSE response (multiplexing)
    const readStream = async (id: string, stream: ReadableStream<Uint8Array> | null) => {
      if (!stream) return;
      const reader = stream.getReader();
      const decoder = new TextDecoder('utf-8');

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              // Gemini's raw SSE chunk is passed straight to the client with the agent's ID attached
              res.write(`data: ${JSON.stringify({ id, raw: line })}\n\n`);
            }
          }
        }
      } finally {
        res.write(`data: ${JSON.stringify({ id, done: true })}\n\n`);
      }
    };

    // Wait for all agents to finish streaming
    await Promise.all(streams.map(s => readStream(s.id, s.body)));

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Convene Proxy Error:', error);
    res.write('data: ' + JSON.stringify({ error: 'Server error occurred during generation' }) + '\n\n');
    res.end();
  }
}
