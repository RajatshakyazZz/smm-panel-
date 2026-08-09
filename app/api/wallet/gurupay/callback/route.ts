import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');
    const utr = searchParams.get('utr') || undefined;

    const origin = req.nextUrl.origin || 'https://smm-panel.com';

    if (!orderId) {
      return NextResponse.redirect(`${origin}/dashboard/wallet?error=missing_order`);
    }

    // Verify on backend using GuruPay Check Status API
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
        order_id: orderId,
      }),
    });

    const gurupayData = await gurupayRes.json().catch(() => null);

    const isPaid =
      gurupayData?.status === 'success' &&
      (gurupayData?.data?.payment_status === 'success' || status === 'success');

    if (isPaid) {
      const capturedUtr = gurupayData?.data?.utr || utr;
      const result = db.completeGuruPayOrder(orderId, capturedUtr);

      if (result.success && result.tx) {
        return NextResponse.redirect(
          `${origin}/dashboard/wallet?payment=success&amount=${result.tx.amountINR}&order=${orderId}`
        );
      }
    }

    return NextResponse.redirect(`${origin}/dashboard/wallet?payment=pending&order=${orderId}`);
  } catch (err) {
    console.error('GuruPay Callback Redirect Error:', err);
    return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/wallet?error=verification_failed`);
  }
}
