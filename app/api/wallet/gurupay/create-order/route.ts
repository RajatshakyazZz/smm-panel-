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

    // Get GuruPay Gateway config from DB or fallback
    const gateways = db.getGateways();
    const gurupayGw = gateways.find((g) => g.code === 'gurupay');
    const dbKey = gurupayGw?.apiKey?.trim();
    const apiKey = dbKey && dbKey.length > 5 ? dbKey : 'guruf6ab4e18c70cfd67938117c816b1b2';

    if (gurupayGw && gurupayGw.enabled === false) {
      return NextResponse.json({ error: 'GuruPay Payment Gateway is currently disabled by Admin.' }, { status: 400 });
    }

    const minAmount = gurupayGw?.minAmountINR || 10;
    const maxAmount = gurupayGw?.maxAmountINR || 100000;
    if (numAmount < minAmount || numAmount > maxAmount) {
      return NextResponse.json({ error: `Amount must be between ₹${minAmount} and ₹${maxAmount}` }, { status: 400 });
    }

    // Generate clean order ID per spec (e.g., ORD_20260809_9512)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD_${dateStr}_${randomNum}`;

    // Create pending transaction in local database ledger
    const pendingTx = db.createPendingGuruPayOrder(userId, numAmount, orderId);
    if ('error' in pendingTx) {
      return NextResponse.json({ error: pendingTx.error }, { status: 400 });
    }

    // Determine public origin for callback_url
    const origin = req.headers.get('origin') || req.nextUrl.origin || 'https://smm-panel.com';
    const callbackUrl = `${origin}/api/wallet/gurupay/callback?order_id=${orderId}`;

    // Call GuruPay Create Order API strictly matching official spec
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
        description: 'SMM Wallet Recharge',
        callback_url: callbackUrl,
      }),
    });

    const gurupayData = await gurupayRes.json().catch(() => null);
    console.log('GuruPay Create Order Response:', gurupayRes.status, gurupayData);

    // According to official schema: { status: "success", data: { payment_url: "https://gurupaygateway.com/pay/LRd7jTFOV..." } }
    const paymentUrl =
      gurupayData?.data?.payment_url ||
      gurupayData?.payment_url ||
      gurupayData?.payment_link ||
      (gurupayData?.data?.token ? `https://gurupaygateway.com/pay/${gurupayData.data.token}` : null);

    if ((gurupayData?.status === 'success' || gurupayRes.ok) && paymentUrl) {
      return NextResponse.json({
        success: true,
        order_id: orderId,
        payment_url: paymentUrl,
        amount: numAmount,
      });
    }

    // If API returned an error, report the EXACT error from GuruPay
    const errorMessage =
      gurupayData?.message ||
      gurupayData?.error ||
      `GuruPay API returned error status (${gurupayRes.status}). Please verify X-Guru-Key: ${apiKey}`;

    return NextResponse.json(
      {
        error: errorMessage,
        raw: gurupayData,
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('GuruPay Create Order Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
