import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get('category');

    const categories = db.getCategories();
    let services = db.getServices();

    if (categoryName && categoryName !== 'all') {
      services = services.filter((s) => s.category === categoryName);
    }

    return NextResponse.json({
      categories,
      services,
      usdToInrRate: db.getSettings().usdToInrRate,
    });
  } catch (err) {
    console.error('Services API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
