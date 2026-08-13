# Wishora ✨

> Turn a simple wish into a magical moment.

**Wishora** is a web application where users create personalized, animated, interactive wish pages for birthdays, anniversaries, weddings, festivals, and every special occasion. Each wish becomes a beautiful, mobile-friendly page with a private shareable link.

## 🎯 Features

- **30+ Templates** — Birthday, Anniversary, Wedding, Love, Festivals, and more
- **Interactive Elements** — Balloon popping, candle blowing, gift opening, confetti, scratch cards, quizzes, polls
- **No Signup Required** — Create and share wishes instantly
- **Mobile-First** — Beautiful on every screen size
- **Shareable Links** — Share via WhatsApp, Instagram, SMS, email, QR code
- **Reactions & Replies** — Recipients can react and send messages back
- **Demo Mode** — Works without any backend configuration
- **Privacy Controls** — Private links, password protection, expiry options

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wishora.git
cd wishora

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Demo Mode

Wishora works out of the box in **demo mode** without any backend configuration. Demo mode uses an in-memory data store with seed data (5 sample wishes).

Demo wish URLs you can try:
- `/w/demo_emma_birthday` — Birthday wish
- `/w/demo_aarav_anniversary` — Anniversary wish
- `/w/demo_daniel_congrats` — Congratulations wish

## 🏗 Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── templates/          # Template gallery
│   ├── create/             # Wish creation flow
│   ├── w/[token]/          # Public wish experience
│   ├── dashboard/          # User dashboard
│   ├── api/                # API routes
│   └── ...                 # Marketing pages
├── components/
│   ├── ui/                 # Base UI components
│   ├── marketing/          # Navbar, Footer
│   ├── interactions/       # Animation modules
│   └── ...
├── lib/
│   ├── db/                 # Data access layer
│   ├── demo/               # Demo mode adapter
│   ├── templates/          # Template definitions
│   └── utils.ts            # Utilities
├── types/                  # TypeScript definitions
└── styles/                 # Global CSS
```

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion + CSS |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Database | Supabase (optional) |
| Testing | Vitest |

## 🗃 Supabase Setup (Optional)

To use a real database instead of demo mode:

1. Create a [Supabase](https://supabase.com) project
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Copy your Supabase URL and anon key to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Restart the dev server

## 📁 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key |
| `NEXT_PUBLIC_APP_URL` | No | App URL (default: localhost:3000) |
| `ADMIN_EMAIL` | No | Admin user email |
| `AI_API_KEY` | No | AI API key for message suggestions |

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Production build
npm run build
```

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 Documentation

- [Architecture](docs/architecture.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source under the [MIT License](LICENSE).

---

**Made with ❤️ by Wishora** — *Turn a simple wish into a magical moment.*
