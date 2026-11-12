import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const PORTFOLIO_CONTEXT = `Gerald B. Aton — Trust & Safety consultant, 8 years content moderation/QA/US support. Built SQAC (portable LLM memory), Jamukot (web music player), Dococ (paper-first autonomous trading system). Available for consulting: T&S foundations, Support Ops & QA, AI Automation, Fractional QA Lead.`;

const MAX_MSG_LEN = 300;
const MAX_MESSAGES = 6;
const PER_IP_PER_MIN = 8;
const GLOBAL_PER_DAY = 150;

async function checkLimits(ip: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const now = Date.now();
    const minuteKey = `chat:ip:${ip}:m:${Math.floor(now / 60000)}`;
    const dayKey = `chat:global:d:${new Date().toISOString().slice(0, 10)}`;

    const [minCount, dayCount] = await Promise.all([
      kv.incr(minuteKey),
      kv.incr(dayKey),
    ]);

    if (minCount === 1) await kv.expire(minuteKey, 90);
    if (dayCount === 1) await kv.expire(dayKey, 60 * 60 * 26);

    if (minCount > PER_IP_PER_MIN) {
      return { ok: false, message: 'Too many messages. Please wait a minute and try again.' };
    }
    if (dayCount > GLOBAL_PER_DAY) {
      return { ok: false, message: 'Daily chat limit reached. Please try again tomorrow or use the contact form.' };
    }
  } catch (e) {
    // Fail open if KV is unavailable
    console.error('KV rate limit error:', e);
  }
  return { ok: true };
}

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

  // Basic abuse protection
  const sanitized = messages
    .slice(-MAX_MESSAGES)
    .map((m: any) => ({
      role: m?.role === 'user' ? 'user' : 'assistant',
      content: typeof m?.content === 'string' ? m.content.slice(0, MAX_MSG_LEN) : '',
    }))
    .filter((m: any) => m.content.trim().length > 0);

  if (sanitized.length === 0) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  // Global rate limit / daily quota via Vercel KV
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const limit = await checkLimits(ip);
  if (!limit.ok) {
    return res.status(429).send(limit.message || 'Too many requests.');
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return res.status(500).json({ error: 'Chat not configured' });
  }

  const systemPrompt = `You are Gerald's AI assistant on his portfolio site. Context: ${PORTFOLIO_CONTEXT} Answer questions about Gerald's experience, services, projects (SQAC, Jamukot, Dococ), and consulting offerings. Be helpful, concise, and professional. If unsure, suggest booking a discovery call.`;

  const allMessages = [{ role: 'system', content: systemPrompt }, ...sanitized.slice(-6)];

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
