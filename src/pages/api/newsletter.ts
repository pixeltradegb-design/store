import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Here you can push to an email provider (Resend, Mailchimp, ConvertKit, etc.)
    console.log(`New subscriber for Sole Archive GB: ${email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "You're on the drop list! Use code WELCOME10 for 10% off.",
        code: 'WELCOME10',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error processing signup.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};