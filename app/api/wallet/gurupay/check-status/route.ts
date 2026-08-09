import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, orderId } = body;
    const targetOrderId = order_id || orderId;

    if (!targetOrderId) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    // 1. Check local DB status first
    const tx = db.getGuruPayTransactionByOrderId(targetOrderId);
    if (!tx) {
      return NextResponse.json({ error: 'Order not found in transaction ledger' }, { status: 404 });
    }

    if (tx.status === 'SUCCESS') {
      const user = db.getUserById(tx.userId);
      return NextResponse.json({
        success: true,
        status: 'success',
        paid: true,
        amount: tx.amountINR,
        newBalance: user?.balanceINR,
        message: 'Payment verified and balance credited successfully!',
      });
    }

    // 2. Query GuruPay API check-status endpoint
    const gateways = db.getGateways();
    const gurupayGw = gateways.find((g) => g.code === 'gurupay');
    const apiKey = gurupayGw?.apiKey || 'guruf6ab4e18c70cfd67938117c816b1b2';

    const gurupayRes = await fetch('https://gurupaygateway.com/api/check-status', {
      method: 'POST',
      headers: {
        'X-Guru-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: targetOrderId,
      }),
    });

    const gurupayData = await gurupayRes.json().catch(() => null);
    console.log('GuruPay Check Status Raw Response:', gurupayData);

    // Schema: { status: "success", data: { payment_status: "success", utr: "...", amount: 100.00 } }
    const isPaid =
      gurupayData?.status === 'success' &&
      (gurupayData?.data?.payment_status === 'success' || gurupayData?.data?.status === 'success' || gurupayData?.data?.paid === true);

    const utr = gurupayData?.data?.utr || gurupayData?.utr || 'N/A';

    if (isPaid) {
      // Complete transaction and credit user balance instantly!
      const res = db.completeGuruPayOrder(targetOrderId, utr);
      const user = db.getUserById(tx.userId);

      return NextResponse.json({
        success: true,
        status: 'success',
        paid: true,
        utr: utr,
        amount: gurupayData?.data?.amount || tx.amountINR,
        newBalance: user?.balanceINR,
        message: '⚡ Payment successfully verified via GuruPay! Your wallet balance has been credited.',
      });
    }

    return NextResponse.json({
      success: true,
      status: gurupayData?.data?.payment_status || gurupayData?.status || 'pending',
      paid: false,
      message: 'Payment pending. Please complete payment on the GuruPay page.',
    });
  } catch (err: any) {
    console.error('GuruPay Check Status Error:', err);
    return NextResponse.json({ error: err.message || 'Error checking payment status' }, { status: 500 });
  }
}
