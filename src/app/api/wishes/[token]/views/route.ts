import { NextRequest, NextResponse } from 'next/server';
import { getDataAdapter } from '@/lib/db';

export async function POST(
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
    
    await db.addView(wish.id);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(`Error tracking view:`, error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
