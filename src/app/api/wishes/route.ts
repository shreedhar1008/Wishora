import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDataAdapter } from '@/lib/db';
import { sanitizeHtml } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseServerClient } from '@/lib/supabase-server';

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

    const db = getDataAdapter();
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

    let userId: string | undefined = undefined;
    let authSupabaseClient;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await getSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          userId = user.id;
          authSupabaseClient = supabase;

          // Ensure profile exists in profiles table
          try {
            await supabase.from('profiles').upsert({
              id: user.id,
              email: user.email,
              display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          } catch (profileErr) {
            console.warn('Profile auto-create notice:', profileErr);
          }
        }
      } catch (authErr) {
        console.warn('Auth check skipped, proceeding with guest wish:', authErr);
      }
    }

    const db = getDataAdapter(authSupabaseClient);

    // Sanitize user input
    const sanitizedRecipient = sanitizeHtml(validatedBody.recipientName);
    const sanitizedMessage = sanitizeHtml(validatedBody.message);
    const sanitizedSender = validatedBody.senderName ? sanitizeHtml(validatedBody.senderName) : undefined;
    const sanitizedTitle = validatedBody.title ? sanitizeHtml(validatedBody.title) : undefined;

    const isPublished = validatedBody.isPublished !== false;
    const isPublic = validatedBody.isPublic ?? true;

    const wishToCreate = {
      ...validatedBody,
      recipientName: sanitizedRecipient,
      message: sanitizedMessage,
      senderName: sanitizedSender,
      title: sanitizedTitle,
      ownerId: userId,
      isPublished,
      isPublic,
      status: isPublished ? ('published' as const) : ('draft' as const),
      visibility: isPublic ? ('public' as const) : ('private' as const),
    };

    const wish = await db.createWish(wishToCreate);

    return NextResponse.json(wish, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating wish:', error);
    const message = error instanceof Error ? error.message : 'Failed to create wish';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
