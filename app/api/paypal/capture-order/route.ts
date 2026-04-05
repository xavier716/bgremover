import { NextRequest, NextResponse } from 'next/server';
import { addCredits, updateOrderStatus } from '@/db';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const PayerID = searchParams.get('PayerID');

    if (!token) {
      return NextResponse.redirect(
        new URL('/pricing?error=no_token', request.url)
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture payment
    const captureResponse = await fetch(
      `https://api-m.${PAYPAL_MODE}.paypal.com/v2/checkout/orders/${token}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      console.error('PayPal capture error:', errorText);
      return NextResponse.redirect(
        new URL('/pricing?error=capture_failed', request.url)
      );
    }

    const captureData = await captureResponse.json();

    // Extract custom_id to get user info
    const customId = captureData.purchase_units[0]?.payments?.captures[0]?.custom_id;
    if (customId) {
      const [userId, plan, credits] = customId.split(':');

      try {
        // Add credits to user
        await addCredits(userId, parseInt(credits), plan);

        // Update order status
        await updateOrderStatus(token, 'completed');
      } catch (dbError) {
        // Log database error but don't fail the payment
        console.error('Failed to update database:', dbError);
      }
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/payment/success', request.url)
    );

  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.redirect(
      new URL('/pricing?error=server_error', request.url)
    );
  }
}
