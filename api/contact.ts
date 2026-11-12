import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, service, message, _gotcha } = req.body;

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

  // In production, send email via Resend/SendGrid/nodemailer
  // For now, log and return success
  console.log('Contact form submission:', { name, email, company, service, message });

  return res.status(200).json({ success: true });
}
