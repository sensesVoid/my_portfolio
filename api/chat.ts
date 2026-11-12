import type { VercelRequest, VercelResponse } from '@vercel/node';

const PORTFOLIO_CONTEXT = `Gerald B. Aton — Trust & Safety consultant, 8 years content moderation/QA/US support. Built SQAC (portable LLM memory), Jamukot (web music player), Dococ (paper-first autonomous trading system). Available for consulting: T&S foundations, Support Ops & QA, AI Automation, Fractional QA Lead.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return res.status(500).json({ error: 'Chat not configured' });
  }

  const systemPrompt = `You are Gerald's AI assistant on his portfolio site. Context: ${PORTFOLIO_CONTEXT} Answer questions about Gerald's experience, services, projects (SQAC, Jamukot, Dococ), and consulting offerings. Be helpful, concise, and professional. If unsure, suggest booking a discovery call.`;

  const allMessages = [{ role: 'system', content: systemPrompt }, ...messages.slice(-10)];

  try {
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: allMessages, max_tokens: 512, temperature: 0.7 }),
      }
    );
    if (!cfRes.ok) {
      const text = await cfRes.text();
      return res.status(502).send(text || 'Upstream error');
    }
    const data = await cfRes.json() as any;
    const reply = data?.result?.choices?.[0]?.message?.content || data?.result?.response || 'Sorry, I could not generate a response.';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(reply);
  } catch (e) {
    return res.status(500).json({ error: 'Chat failed' });
  }
}
