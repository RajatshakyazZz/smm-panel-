import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const tickets = db.getTickets(userId || undefined);
    return NextResponse.json({ tickets });
  } catch (err) {
    console.error('Tickets GET API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, ticketId, subject, message, orderId, senderId } = body;

    if (action === 'create') {
      if (!userId || !subject || !message) {
        return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
      }

      const res = db.createTicket(userId, subject, message, orderId);
      if ('error' in res) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, ticket: res });
    }

    if (action === 'reply') {
      if (!ticketId || !senderId || !message) {
        return NextResponse.json({ error: 'Missing reply details' }, { status: 400 });
      }

      const res = db.addTicketMessage(ticketId, senderId, message);
      if ('error' in res) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, ticket: res });
    }

    return NextResponse.json({ error: 'Invalid ticket action' }, { status: 400 });
  } catch (err) {
    console.error('Tickets POST API Error:', err);
    return NextResponse.json({ error: 'Failed to process ticket' }, { status: 500 });
  }
}
