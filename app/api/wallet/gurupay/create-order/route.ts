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

    // Get GuruPay Gateway config from DB or fallback to default
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
    const orderId = `ORD_GP_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Create pending transaction in local database
    const pendingTx = db.createPendingGuruPayOrder(userId, numAmount, orderId);
    if ('error' in pendingTx) {
      return NextResponse.json({ error: pendingTx.error }, { status: 400 });
    }

    // Determine public origin for callback_url
    const origin = req.headers.get('origin') || req.nextUrl.origin || 'https://smm-panel.com';
    const callbackUrl = `${origin}/api/wallet/gurupay/webhook`;

    // Call GuruPay Create Order API
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
        callback_url: callbackUrl,
      }),
    });

    const gurupayData = await gurupayRes.json().catch(() => null);

    if (gurupayData && gurupayData.status === 'success' && gurupayData.payment_url) {
      return NextResponse.json({
        success: true,
        order_id: orderId,
        payment_url: gurupayData.payment_url,
        amount: numAmount,
      });
    }

    // Fallback: If external API fails, provide direct payment page link format or error
    console.error('GuruPay API Response:', gurupayData);
    return NextResponse.json(
      {
        error: gurupayData?.message || 'Failed to generate GuruPay payment link. Please check your API key.',
        raw: gurupayData,
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('GuruPay Create Order Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
