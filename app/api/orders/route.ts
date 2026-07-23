import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Trigger background sync with FameProvider for pending orders
    await db.syncOrdersStatusWithFameProvider();

    const orders = db.getOrders(userId || undefined);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Orders GET API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, serviceId, link, quantity, massOrders } = body;

    if (action === 'create') {
      if (!userId || !serviceId || !link || !quantity) {
        return NextResponse.json({ error: 'Missing required order fields (userId, serviceId, link, quantity)' }, { status: 400 });
      }

      const res = await db.createOrder(userId, serviceId, link, Number(quantity));
      if (res.error) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, order: res.order });
    }

    if (action === 'mass') {
      if (!userId || !massOrders || !Array.isArray(massOrders)) {
        return NextResponse.json({ error: 'Invalid mass orders payload' }, { status: 400 });
      }

      const results = [];
      let totalSpent = 0;

      for (const item of massOrders) {
        if (item.serviceId && item.link && item.quantity) {
          const res = await db.createOrder(userId, item.serviceId, item.link, Number(item.quantity));
          if (res.order) {
            totalSpent += res.order.chargeINR;
            results.push({ success: true, order: res.order });
          } else {
            results.push({ success: false, error: res.error, item });
          }
        }
      }

      return NextResponse.json({
        success: true,
        count: results.filter((r) => r.success).length,
        results,
        totalSpent,
      });
    }

    if (action === 'sync') {
      const updatedCount = await db.syncOrdersStatusWithFameProvider();
      return NextResponse.json({ success: true, updatedCount });
    }

    return NextResponse.json({ error: 'Invalid order action' }, { status: 400 });
  } catch (err) {
    console.error('Orders POST API Error:', err);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
