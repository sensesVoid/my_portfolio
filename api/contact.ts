import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, service, message, _gotcha } = req.body || {};

  // Honeypot spam check
  if (_gotcha) {
    return res.status(200).json({ success: true });
  }

  // Basic validation
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error('WEB3FORMS_ACCESS_KEY is not set');
    return res.status(500).json({ error: 'Contact form not configured' });
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New portfolio inquiry: ${service}`,
        from_name: name,
        name,
        email,
        company: company || '',
        service,
        message,
        replyto: email,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result?.success === false) {
      console.error('Web3Forms error:', result);
      return res.status(502).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Contact form error:', e);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
