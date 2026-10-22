import { Resend } from 'resend';

// Vercel serverless function behind the contact form. The Resend key never reaches the browser:
// set RESEND_API_KEY in .env for local dev and in the Vercel project's Environment Variables.

const PLACEHOLDER_KEY = 're_your_api_key_here';
const DEFAULT_TO = 'ujjwalarote69@gmail.com';
// Resend's shared test sender. It only delivers to the Resend account's own address
// until a domain is verified; then set CONTACT_FROM_EMAIL to an address on that domain.
const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>';

const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) => Response.json(body, { status });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object') throw new Error('Body is not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const field = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '');
  const name = field('name');
  const email = field('email');
  const message = field('message');

  // Honeypot: the "company" input is hidden from people, so only bots fill it in.
  // Pretend it worked so they don't retry.
  if (field('company')) return json({ ok: true });

  if (!name || !email || !message) {
    return json({ error: 'Please fill in your name, email and message.' }, 400);
  }
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: "That email address doesn't look right." }, 400);
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return json({ error: 'That message is too long. Please shorten it and try again.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    console.error('Contact form: RESEND_API_KEY is missing or still the placeholder');
    return json({ error: "The contact form isn't set up yet." }, 503);
  }

  const safeName = name.replace(/\s+/g, ' ');
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
    to: process.env.CONTACT_TO_EMAIL || DEFAULT_TO,
    replyTo: email,
    subject: `Portfolio message from ${safeName}`,
    text: `${message}\n\n${safeName}\n${email}`,
    html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><p>${escapeHtml(safeName)}<br>${escapeHtml(email)}</p>`,
  });

  if (error) {
    console.error('Contact form: Resend rejected the email', error);
    return json({ error: "Your message couldn't be sent right now." }, 502);
  }
  return json({ ok: true });
}
