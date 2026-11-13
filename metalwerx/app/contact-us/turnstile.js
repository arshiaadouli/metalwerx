// Asks Cloudflare whether a token from the contact form's Turnstile widget is
// good (one use, five minutes). Without TURNSTILE_SECRET_KEY the check is off
// and every token passes, as the widget is off without
// NEXT_PUBLIC_TURNSTILE_SITE_KEY (see contact-with-globe.jsx).
export async function turnstilePasses(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, ...(remoteip && { remoteip }) }),
    signal: AbortSignal.timeout(10_000),
  });
  return (await response.json()).success === true;
}
