# Deployment Guide

## Vercel (Recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Wishora v1.0"
git remote add origin https://github.com/yourusername/wishora.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Set environment variables (see below)
6. Click **Deploy**

### 3. Environment Variables

Set these in Vercel > Project Settings > Environment Variables:

| Variable | Required | Value |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | For production | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For production | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For production | Service role key (never public) |
| `NEXT_PUBLIC_APP_URL` | Yes | Your deployed URL (e.g., https://wishora.vercel.app) |
| `ADMIN_EMAIL` | Optional | Admin email address |

### 4. Custom Domain

1. Go to Vercel > Project > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` env var

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Run Migration

Go to Supabase Dashboard > SQL Editor and run:

```bash
# Or using Supabase CLI:
supabase db push
```

Or paste the contents of `supabase/migrations/001_initial_schema.sql` into the SQL editor.

### 3. Configure Storage

1. Create a storage bucket named `wish-media`
2. Set the bucket to public (for image serving) or configure signed URLs
3. Add bucket policies for upload restrictions

### 4. Configure Authentication

1. Go to Authentication > Settings
2. Enable Email/Password auth
3. Optionally enable magic link auth
4. Set redirect URLs for your domain

## Docker (Alternative)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t wishora .
docker run -p 3000:3000 wishora
```

## Health Checks

- **Homepage**: `GET /` — should return 200
- **API**: `GET /api/wishes?limit=1` — should return 200

## Performance Checklist

- [ ] Enable Vercel Edge caching
- [ ] Configure CDN for static assets
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Enable Supabase connection pooling for high traffic
