import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDataAdapter } from '@/lib/db';
import { sanitizeHtml } from '@/lib/utils';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase';

const wishSchema = z.object({
  templateId: z.string().optional(),
  templateSlug: z.string().optional(),
  occasion: z.string().optional(),
  title: z.string().optional(),
  recipientName: z.string().min(1, "Recipient name is required"),
  senderName: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  relationship: z.string().optional(),
  isPublic: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
});

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
    
    const parsed = wishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const validatedBody = parsed.data;

    let userId: string | undefined;
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    }

    const db = await getDataAdapter();

    // Sanitize message content
    if (validatedBody.message) {
      validatedBody.message = sanitizeHtml(validatedBody.message);
    }
    
    if (validatedBody.recipientName) {
      validatedBody.recipientName = sanitizeHtml(validatedBody.recipientName);
    }
    
    if (validatedBody.senderName) {
      validatedBody.senderName = sanitizeHtml(validatedBody.senderName);
    }
    
    if (validatedBody.title) {
      validatedBody.title = sanitizeHtml(validatedBody.title);
    }

    const wishToCreate = {
      ...validatedBody,
      ownerId: userId,
    };

    const wish = await db.createWish(wishToCreate);

    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error('Error creating wish:', error);
    return NextResponse.json({ error: 'Failed to create wish' }, { status: 500 });
  }
}
