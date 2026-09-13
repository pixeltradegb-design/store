import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import products from '../../data/products.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const productId = data.get('productId')?.toString();

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return new Response('Product not found', { status: 404 });
  }

  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://pixeltradegb.co.uk';
  const fullImageUrl = product.image.startsWith('http')
    ? product.image
    : `${siteUrl}${product.image}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: `${product.name} (${product.size})`,
            description: `${product.condition} - ${product.description}`,
            images: [fullImageUrl],
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    allow_promotion_codes: true, // Enables customer discount code box
    shipping_address_collection: {
      allowed_countries: ['GB'],
    },
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/`,
  });

  return Response.redirect(session.url as string, 303);
};