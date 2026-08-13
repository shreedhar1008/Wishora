import { NextRequest, NextResponse } from 'next/server';
import { getDataAdapter } from '@/lib/db';
import { sanitizeHtml } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = await getDataAdapter();
    const wish = await db.getWishByToken(token);
    
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }
    
    const replies = await db.getReplies(wish.id);
    return NextResponse.json(replies);
  } catch (error) {
    console.error(`Error fetching replies:`, error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = await getDataAdapter();
    const wish = await db.getWishByToken(token);
    
    if (!wish) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }
    
    const requestBody = await request.json();
    const { displayName, body } = requestBody;
    
    if (!body) {
      return NextResponse.json({ error: 'Reply body is required' }, { status: 400 });
    }
    
    const sanitizedName = displayName ? sanitizeHtml(displayName) : 'Anonymous';
    const sanitizedBody = sanitizeHtml(body);
    
    const reply = await db.addReply(wish.id, sanitizedName, sanitizedBody);
    
    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error(`Error adding reply:`, error);
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}
