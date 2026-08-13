import { NextRequest, NextResponse } from 'next/server';
import { getDataAdapter } from '@/lib/db';
import { sanitizeHtml } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const occasion = searchParams.get('occasion');

    const db = await getDataAdapter();
    const result = await db.getPublicWishes({ page, limit, occasion });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching public wishes:', error);
    return NextResponse.json({ error: 'Failed to fetch wishes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDataAdapter();

    // Sanitize message content
    if (body.message) {
      body.message = sanitizeHtml(body.message);
    }
    
    if (body.recipientName) {
      body.recipientName = sanitizeHtml(body.recipientName);
    }
    
    if (body.senderName) {
      body.senderName = sanitizeHtml(body.senderName);
    }
    
    if (body.title) {
      body.title = sanitizeHtml(body.title);
    }

    const wish = await db.createWish(body);

    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error('Error creating wish:', error);
    return NextResponse.json({ error: 'Failed to create wish' }, { status: 500 });
  }
}
