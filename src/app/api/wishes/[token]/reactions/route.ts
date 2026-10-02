import { NextRequest, NextResponse } from 'next/server';
import { getDataAdapter } from '@/lib/db';
import { sanitizeHtml } from '@/lib/utils';
import { ReactionType } from '@/types';

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
    
    const reactions = await db.getReactions(wish.id);
    return NextResponse.json(reactions);
  } catch (error) {
    console.error(`Error fetching reactions:`, error);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}

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
    
    const body = await request.json();
    const { reactionType } = body;
    
    if (!reactionType) {
      return NextResponse.json({ error: 'reactionType is required' }, { status: 400 });
    }
    
    const sanitizedReaction = sanitizeHtml(reactionType);
    
    const reaction = await db.addReaction(wish.id, sanitizedReaction as ReactionType);
    
    return NextResponse.json(reaction, { status: 201 });
  } catch (error) {
    console.error(`Error adding reaction:`, error);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }
}
