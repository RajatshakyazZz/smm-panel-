import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => null);

    if (!payload) {
      return NextResponse.json({ status: 'error', message: 'Invalid payload' }, { status: 400 });
    }

    const { order_id, status, event, utr, amount } = payload;

    if (!order_id) {
      return NextResponse.json({ status: 'error', message: 'Missing order_id' }, { status: 400 });
    }

    if (status === 'success' || event === 'payment.success') {
      const result = db.completeGuruPayOrder(order_id, utr);
      if (result.success) {
        console.log(`[GuruPay Webhook] Successfully processed payment for order ${order_id}, UTR: ${utr}`);
        return NextResponse.json({ status: 'ok', message: 'Payment recorded and balance credited' }, { status: 200 });
      } else {
        console.log(`[GuruPay Webhook] Order ${order_id} note: ${result.error || result.message}`);
        return NextResponse.json({ status: 'ok', message: result.message || 'Already processed' }, { status: 200 });
      }
    }

    return NextResponse.json({ status: 'ok', message: 'Webhook received for non-success event' }, { status: 200 });
  } catch (err: any) {
    console.error('GuruPay Webhook Error:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

// Allow GET check to confirm endpoint is active
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    gateway: 'GuruPay Payment Gateway Webhook Endpoint',
    version: '1.0.0',
    active: true,
  });
}
