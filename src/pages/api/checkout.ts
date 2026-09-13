import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import products from '../../data/products.json';

export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY' }), { status: 500 });
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = await request.json();
    const cartItems = body.items;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), { status: 400 });
    }

    const line_items = cartItems.map((cartItem: any) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) throw new Error(`Product not found: ${cartItem.id}`);

      const hasValidImage = product.image && product.image.startsWith('https://');

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${product.name} (${cartItem.size})`,
            ...(hasValidImage ? { images: [product.image] } : {}),
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: Number(cartItem.quantity) || 1,
      };
    });

    const siteUrl = import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};