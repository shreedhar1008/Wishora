import { NextRequest, NextResponse } from 'next/server';
import { getDataAdapter } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getDataAdapter();
    const wish = await db.getWishByToken(token);

    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    return NextResponse.json(wish);
  } catch (error) {
    console.error(`Error fetching wish:`, error);
    return NextResponse.json({ error: 'Failed to fetch wish' }, { status: 500 });
  }
}
