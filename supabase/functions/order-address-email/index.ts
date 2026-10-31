// Emails the checkout address after every shipping address change, so a customer hears about a change they didn't make.
// Called by a Database Webhook on inserts into order_address_edits. Secrets: RESEND_API_KEY, EMAIL_FROM, WEBHOOK_SECRET.
const line = (a: Record<string, string>) => [a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`].filter(Boolean).join('\n');

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) return new Response('Unauthorized', { status: 401 });
  const { record } = await req.json();
  if (!record?.checkout_email) return new Response('Nothing to send', { status: 400 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('EMAIL_FROM'),
      to: [record.checkout_email],
      subject: `Shipping address changed on order ${record.order_number}`,
      text: `The shipping address on order ${record.order_number} was changed.\n\nIt now ships to:\n${record.new_values.name}\n${line(record.new_values.address)}\n\nIf you didn't make this change, reply to this email right away.`,
    }),
  });
  if (!res.ok) {
    console.error('Resend refused the email', res.status, await res.text());
    return new Response('Email failed', { status: 502 });
  }
  return new Response('Sent');
});
