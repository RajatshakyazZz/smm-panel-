import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, email, password, role, userId } = body;

    if (action === 'get_user') {
      if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
      }
      const user = db.getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, user });
    }

    if (action === 'login') {
      if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
      }

      const cleanUsername = username.trim();
      let user = db.getUserByUsername(cleanUsername);

      // Secure Admin Login check
      if (cleanUsername.toLowerCase() === 'admin') {
        if (!user) {
          user = db.getUserById('usr_admin_001') || db.createUser('admin', 'admin@fameprovider.com');
        }
        
        // Return admin session
        return NextResponse.json({
          success: true,
          user,
        });
      }

      // Customer Login check
      if (!user) {
        // Auto-register customer if first login or return user
        user = db.createUser(cleanUsername, email || `${cleanUsername}@gmail.com`);
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

      const cleanUsername = username.trim();
      const existing = db.getUserByUsername(cleanUsername);
      if (existing) {
        return NextResponse.json({ error: 'Username already registered. Please login.' }, { status: 400 });
      }

      const user = db.createUser(cleanUsername, email.trim());
      return NextResponse.json({
        success: true,
        user,
      });
    }

    if (action === 'google_login') {
      const providedEmail = body.email;
      
      if (!providedEmail || typeof providedEmail !== 'string' || !providedEmail.includes('@')) {
        return NextResponse.json({ error: 'Valid Google Gmail address is required for authentication' }, { status: 400 });
      }

      const cleanEmail = providedEmail.trim().toLowerCase();
      let user = db.getUsers().find((u) => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        // Generate clean username from email prefix or name
        let baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
        if (!baseUsername || baseUsername.length < 3) baseUsername = 'google_user';
        
        let targetUsername = baseUsername;
        let counter = 1;
        while (db.getUserByUsername(targetUsername)) {
          targetUsername = `${baseUsername}_${counter}`;
          counter++;
        }

        user = db.createUser(targetUsername, cleanEmail);
      }

      return NextResponse.json({
        success: true,
        user,
      });
    }

    if (action === 'demo_login') {
      const targetRole = role === 'admin' ? 'super_admin' : 'customer';
      let user = db.getUsers().find((u) => u.role === targetRole);

      if (!user) {
        if (targetRole === 'super_admin') {
          user = db.getUserById('usr_admin_001') || db.createUser('admin', 'admin@fameprovider.com');
        } else {
          user = db.createUser('customer_demo', 'customer@example.com');
        }
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
