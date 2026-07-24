import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const gateways = db.getGateways();
    const transactions = db.getTransactions(userId || undefined);

    return NextResponse.json({
      gateways,
      transactions,
    });
  } catch (err) {
    console.error('Wallet GET API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch wallet info' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, gatewayCode, amountINR, transactionRef, utr } = body;

    if (!userId || !gatewayCode || !amountINR) {
      return NextResponse.json({ error: 'Missing payment parameters' }, { status: 400 });
    }

    const ref = utr || transactionRef;
    const res = db.processWalletDeposit(userId, gatewayCode, Number(amountINR), ref);
    if ('error' in res) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      transaction: res,
      user: db.getUserById(userId),
    });
  } catch (err) {
    console.error('Wallet POST API Error:', err);
    return NextResponse.json({ error: 'Deposit processing error' }, { status: 500 });
  }
}
