import type { VercelRequest, VercelResponse } from '@vercel/node';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Expect proposalId or the entire state if we needed it, but for our setup, 
  // since the Zustand store is client-side only (localStorage/memory),
  // a real-world app would fetch from DB by ID. 
  // For this SPA demo without a DB, we could either pass the HTML up or assume
  // the client is testing the route locally. Let's pass the proposal HTML directly, or 
  // navigate to the live URL.
  
  // Actually, wait: Zustand state in memory won't exist in the headless browser 
  // navigating to the URL unless it's persisted in LocalStorage and we seed it, OR
  // we pass the exact URL including a payload, OR we assume a backend.
  // Given the prompt: "navigate to the hidden print route... wait for networkidle0"
  // Let's implement the standard navigation approach.
  
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Missing target print URL' });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      // @ts-ignore
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      // @ts-ignore
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // The magical wait condition for iframes (Canva) and images
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=jw-proposal.pdf');
    
    // Return buffer directly
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
