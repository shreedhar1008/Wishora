-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wishes
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  public_token TEXT UNIQUE NOT NULL,
  creator_manage_token_hash TEXT,
  template_slug TEXT NOT NULL,
  occasion TEXT NOT NULL,
  title TEXT,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  message TEXT NOT NULL,
  relationship TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'expired')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('private', 'public')),
  password_hash TEXT,
  scheduled_for TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ DEFAULT now()
);

-- Wish Media
CREATE TABLE IF NOT EXISTS wish_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID NOT NULL REFERENCES wishes(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'document')),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wish Interactions / Reactions
CREATE TABLE IF NOT EXISTS wish_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID NOT NULL REFERENCES wishes(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(wish_id, reaction_type)
);

-- Wish Replies
CREATE TABLE IF NOT EXISTS wish_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID NOT NULL REFERENCES wishes(id) ON DELETE CASCADE,
  display_name TEXT DEFAULT 'Anonymous',
  body TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wish Views
CREATE TABLE IF NOT EXISTS wish_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID NOT NULL REFERENCES wishes(id) ON DELETE CASCADE,
  viewer_ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reports (for moderation)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES wishes(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wishes_public_token ON wishes(public_token);
CREATE INDEX IF NOT EXISTS idx_wishes_owner_id ON wishes(owner_id);
CREATE INDEX IF NOT EXISTS idx_wishes_status_visibility ON wishes(status, visibility);
CREATE INDEX IF NOT EXISTS idx_wish_media_wish_id ON wish_media(wish_id);
CREATE INDEX IF NOT EXISTS idx_wish_reactions_wish_id ON wish_reactions(wish_id);
CREATE INDEX IF NOT EXISTS idx_wish_replies_wish_id ON wish_replies(wish_id);
CREATE INDEX IF NOT EXISTS idx_wish_views_wish_id ON wish_views(wish_id);

-- Setup RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a wish (guests or authenticated users)
CREATE POLICY "Anyone can create wishes" ON wishes
  FOR INSERT WITH CHECK (true);

-- Allow public read access to published wishes or public wishes
CREATE POLICY "Public wishes are viewable by everyone" ON wishes
  FOR SELECT USING (true);

-- Allow creators to manage their own wishes
CREATE POLICY "Users can manage their own wishes" ON wishes
  FOR ALL USING (auth.uid() = owner_id);

-- Allow inserting reactions for everyone
CREATE POLICY "Anyone can add a reaction" ON wish_reactions
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Anyone can view reactions" ON wish_reactions
  FOR SELECT USING (true);

-- Allow inserting replies for everyone
CREATE POLICY "Anyone can add a reply" ON wish_replies
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Anyone can view approved replies" ON wish_replies
  FOR SELECT USING (is_approved = true);

-- Allow tracking views
CREATE POLICY "Anyone can track views" ON wish_views
  FOR INSERT WITH CHECK (true);
