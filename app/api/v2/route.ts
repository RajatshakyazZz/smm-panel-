import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    let key = '';
    let action = '';
    let bodyData: Record<string, string> = {};

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      formData.forEach((val, k) => {
        bodyData[k] = String(val);
      });
      key = bodyData.key || '';
      action = bodyData.action || '';
    } else {
      const json = await req.json().catch(() => ({}));
      bodyData = json;
      key = json.key || '';
      action = json.action || '';
    }

    // Action = services can be public or authenticated
    if (action === 'services') {
      const services = db.getServices().map((s) => ({
        service: s.id,
        name: s.name,
        category: s.category,
        type: s.type,
        rate: s.sellingRateINR.toFixed(2), // Rate in ₹
        min: s.minQuantity,
        max: s.maxQuantity,
        refill: s.refillSupported,
        cancel: s.cancelSupported,
        currency: 'INR (\u20B9)',
      }));
      return NextResponse.json(services);
    }

    // Authenticate user by API key
    if (!key) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    const user = db.getUsers().find((u) => u.apiKey === key && u.status === 'active');
    if (!user) {
      return NextResponse.json({ error: 'Invalid API key or account suspended' }, { status: 401 });
    }

    if (action === 'balance') {
      return NextResponse.json({
        balance: user.balanceINR.toFixed(2),
        currency: 'INR',
      });
    }

    if (action === 'add') {
      const serviceId = bodyData.service;
      const link = bodyData.link;
      const quantity = parseInt(bodyData.quantity, 10);

      if (!serviceId || !link || !quantity) {
        return NextResponse.json({ error: 'Missing required parameters: service, link, quantity' });
      }

      const res = await db.createOrder(user.id, serviceId, link, quantity);
      if (res.error) {
        return NextResponse.json({ error: res.error });
      }

      return NextResponse.json({
        order: res.order?.id,
      });
    }

    if (action === 'status') {
      const orderId = bodyData.order;
      const ordersParam = bodyData.orders;

      if (orderId) {
        const order = db.getOrders().find((o) => o.id === orderId && o.userId === user.id);
        if (!order) {
          return NextResponse.json({ error: 'Order not found' });
        }

        return NextResponse.json({
          charge: order.chargeINR.toFixed(2),
          start_count: String(order.startCount),
          status: order.status,
          remains: String(order.remains),
          currency: 'INR',
        });
      }

      if (ordersParam) {
        const ids = ordersParam.split(',').map((id) => id.trim());
        const result: Record<string, unknown> = {};

        for (const id of ids) {
          const order = db.getOrders().find((o) => o.id === id && o.userId === user.id);
          if (order) {
            result[id] = {
              charge: order.chargeINR.toFixed(2),
              start_count: String(order.startCount),
              status: order.status,
              remains: String(order.remains),
              currency: 'INR',
            };
          } else {
            result[id] = { error: 'Incorrect order ID' };
          }
        }
        return NextResponse.json(result);
      }

      return NextResponse.json({ error: 'order or orders parameter required' });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (err) {
    console.error('API v2 Error:', err);
    return NextResponse.json({ error: 'API server error' }, { status: 500 });
  }
}
