import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  try {
    // Launch all agent generation calls simultaneously
    const streams = await Promise.all(advisors.map(async (advisor) => {
      const formattingDirective = "\n\nFORMATTING RULE: Be extremely concise. Cap your response at a maximum of 3 short paragraphs. If a list is appropriate, include a high-impact list (e.g. 'Top 3 Pros and Cons') with clear bullet points. Avoid filler and excessive preamble.";
      
      const debateInjection = "\n\nCRITICAL DIRECTIVE: You are in DEBATE MODE. Do not merely agree or synthesize. Actively find flaws in standard assumptions. Challenge the premise of the challenge. Be highly contrarian, assertive, and directly point out where typical groupthink is wrong. Speak firmly and provocatively from your specific worldview." + formattingDirective;
      
      const consensusInjection = "\n\nCRITICAL DIRECTIVE: You are in CONSENSUS MODE. Frame your analysis constructively. Work to synthesize the best possible path forward, finding common ground and focusing on actionable, optimized solutions." + formattingDirective;
      
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
