import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amountINR } = body;

    if (!userId || !amountINR || Number(amountINR) <= 0) {
      return NextResponse.json({ error: 'Valid userId and amountINR are required' }, { status: 400 });
    }

    const numAmount = Number(amountINR);
    const user = db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get GuruPay Gateway config from DB
    const gateways = db.getGateways();
    const gurupayGw = gateways.find((g) => g.code === 'gurupay');
    const apiKey = gurupayGw?.apiKey || 'guruf6ab4e18c70cfd67938117c816b1b2';

    if (gurupayGw && gurupayGw.enabled === false) {
      return NextResponse.json({ error: 'GuruPay Payment Gateway is currently disabled by Admin.' }, { status: 400 });
    }

    const minAmount = gurupayGw?.minAmountINR || 10;
    const maxAmount = gurupayGw?.maxAmountINR || 100000;
    if (numAmount < minAmount || numAmount > maxAmount) {
      return NextResponse.json({ error: `Amount must be between ₹${minAmount} and ₹${maxAmount}` }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = `ORD_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Create pending transaction in local database
    const pendingTx = db.createPendingGuruPayOrder(userId, numAmount, orderId);
    if ('error' in pendingTx) {
      return NextResponse.json({ error: pendingTx.error }, { status: 400 });
    }

    // Determine public origin for callback_url
    const origin = req.headers.get('origin') || req.nextUrl.origin || 'https://smm-panel.com';
    const callbackUrl = `${origin}/api/wallet/gurupay/callback?order_id=${orderId}`;

    let gurupayData: any = null;
    try {
      // Call GuruPay Create Order API matching official spec
      const gurupayRes = await fetch('https://gurupaygateway.com/api/create-order', {
        method: 'POST',
        headers: {
          'X-Guru-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numAmount.toFixed(2),
          order_id: orderId,
          customer_name: user.username || user.email || 'SMM Customer',
          description: 'SMM Panel Wallet Balance Recharge',
          callback_url: callbackUrl,
        }),
      });

      gurupayData = await gurupayRes.json().catch(() => null);
      console.log('GuruPay Create Order Raw Response:', gurupayData);
    } catch (fetchErr) {
      console.warn('GuruPay API Endpoint unreachable or error:', fetchErr);
    }

    // Extract payment_url from GuruPay response
    const apiPaymentUrl =
      gurupayData?.data?.payment_url ||
      gurupayData?.payment_url ||
      gurupayData?.payment_link ||
      (gurupayData?.data?.token ? `https://gurupaygateway.com/pay/${gurupayData.data.token}` : null);

    // Fallback payment URL if API response didn't contain explicit payment_url
    const fallbackPaymentUrl = `https://gurupaygateway.com/pay/${orderId}`;
    const finalPaymentUrl = apiPaymentUrl || fallbackPaymentUrl;

    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_url: finalPaymentUrl,
      amount: numAmount,
      raw: gurupayData,
    });
  } catch (err: any) {
    console.error('GuruPay Create Order Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
