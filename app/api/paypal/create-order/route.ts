import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createOrder } from '@/db';

const plans = {
  starter: { price: 4.99, credits: 100, name: 'Starter Plan' },
  pro: { price: 19.99, credits: 500, name: 'Pro Plan' },
};

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET_SANDBOX || '';
const PAYPAL_MODE = process.env.PAYPAL_MODE_SANDBOX || 'sandbox';

async function getPayPalAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64');

  const response = await fetch(
    `https://api-m.${PAYPAL_MODE}.paypal.com/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !plans[plan as keyof typeof plans]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const planDetails = plans[plan as keyof typeof plans];

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create order
    const orderResponse = await fetch(
      `https://api-m.${PAYPAL_MODE}.paypal.com/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: planDetails.price.toFixed(2),
              },
              description: planDetails.name,
              custom_id: `${user.id}:${plan}:${planDetails.credits}`,
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paypal/capture-order`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancelled`,
          },
        }),
      }
    );

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('PayPal order creation error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      );
    }

    const order = await orderResponse.json();

    // Get approval URL from links
    const approveLink = order.links.find((link: any) => link.rel === 'approve');

    if (!approveLink) {
      return NextResponse.json(
        { error: 'No approval URL in PayPal response' },
        { status: 500 }
      );
    }

    // Store order info in database
    await createOrder({
      user_id: user.id,
      order_id: order.id,
      plan_type: plan,
      credits: planDetails.credits,
      amount: planDetails.price,
      currency: 'USD',
      status: 'pending',
    });

    return NextResponse.json({
      orderId: order.id,
      approvalUrl: approveLink.href,
    });

  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
