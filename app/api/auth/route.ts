import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, email, role } = body;

    if (action === 'login') {
      if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
      }

      let user = db.getUserByUsername(username);

      // Auto-create demo user or admin if doesn't exist
      if (!user) {
        if (username.toLowerCase() === 'admin') {
          user = db.getUserById('usr_admin_001') || db.createUser('admin', 'admin@fameprovider.com');
        } else {
          user = db.createUser(username, email || `${username}@example.com`);
        }
      }

      return NextResponse.json({
        success: true,
        user,
      });
    }

    if (action === 'signup') {
      if (!username || !email) {
        return NextResponse.json({ error: 'Username and Email are required' }, { status: 400 });
      }

      const existing = db.getUserByUsername(username);
      if (existing) {
        return NextResponse.json({ error: 'Username already registered. Please login.' }, { status: 400 });
      }

      const user = db.createUser(username, email);
      return NextResponse.json({
        success: true,
        user,
      });
    }

    if (action === 'demo_login') {
      const targetRole = role === 'admin' ? 'super_admin' : 'customer';
      let user = db.getUsers().find((u) => u.role === targetRole);

      if (!user) {
        user = targetRole === 'super_admin' ? db.getUserById('usr_admin_001') : db.getUserById('usr_demo_002');
      }

      return NextResponse.json({
        success: true,
        user,
      });
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch (err) {
    console.error('Auth API Error:', err);
    return NextResponse.json({ error: 'Server auth error' }, { status: 500 });
  }
}
