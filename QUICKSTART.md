# FunnelIQ - Quick Start Guide

Get the FunnelIQ MVP running locally in under 10 minutes.

---

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL access (Docker, local, or Supabase)
- [ ] Clerk account (free tier: [clerk.com](https://clerk.com))

---

## 5-Step Quick Start

### Step 1: Install Dependencies (2 min)

```bash
cd /Users/timothyshea/Projects/reportingtool
npm install
```

Wait for all packages to install (~315 packages).

### Step 2: Start PostgreSQL (1 min)

**Choose ONE option:**

**Option A - Docker (Easiest)**
```bash
docker run --name funneliq-db \
  -e POSTGRES_USER=funneliq \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=funneliq \
  -p 5432:5432 \
  -d postgres:16
```

**Option B - Supabase (Free Cloud)**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name it "funneliq" and set password
4. Wait ~2 minutes for provisioning
5. Go to Settings → Database → Copy connection string

**Option C - Local PostgreSQL**
```bash
createdb funneliq
psql -d funneliq -c "SELECT version();"
```

### Step 3: Configure Clerk (3 min)

1. Go to [clerk.com/sign-up](https://clerk.com/sign-up)
2. Create account (free tier is fine)
3. Click "Add Application"
4. Name: "FunnelIQ Dev"
5. Click "Create Application"
6. Copy your keys:
   - Publishable Key (starts with `pk_test_`)
   - Secret Key (starts with `sk_test_`)

### Step 4: Set Environment Variables (1 min)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# REQUIRED: Database
DATABASE_URL="postgresql://funneliq:password@localhost:5432/funneliq"

# REQUIRED: Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# OPTIONAL: OpenAI (app works without this)
# OPENAI_API_KEY=sk-xxxxx

# REQUIRED: App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Don't have Clerk keys yet?** The app won't work without them. Follow Step 3 above.

### Step 5: Initialize Database & Run (3 min)

```bash
# Push database schema
npm run db:push

# Seed benchmark data
npm run db:seed

# Start development server
npm run dev
```

You should see:
```
✔ Generated Prisma Client
Seeding benchmark data...
Benchmark data seeded successfully!
▲ Next.js 15.5.6
- Local:        http://localhost:3000
```

**Open http://localhost:3000** in your browser.

---

## Testing the Application

### Flow to Test

1. **Landing Page** (`/`)
   - You should see "Welcome to FunnelIQ"
   - Click "Get Started"

2. **Sign Up** (`/sign-up`)
   - Clerk sign-up form appears
   - Create account with email/password
   - Or use "Continue with Google"

3. **Onboarding** (`/onboarding`)
   - **Step 1**: Select industry, business model, goal
   - Click "Continue"
   - **Step 2**: Enter AOV (try $100) and margin (try 30%)
   - Watch live calculation appear
   - Click "Continue"
   - **Step 3**: Skip Meta connection
   - Click "Skip for now"

4. **Dashboard** (`/dashboard`)
   - See funnel health visualization
   - Sample data shows 5-stage funnel
   - Primary concern highlighted (Checkout → Purchase)
   - 5 metric cards displayed
   - Report cards visible

### Expected Results

✅ Funnel shows conversion rates at each stage
✅ Red warning on "Checkout → Purchase" stage
✅ ROAS shows 0.24x vs target 4.0x (red)
✅ CPA shows $301.47 vs target <$30 (red)
✅ "Coming Soon" badge on Creative Analysis

---

## Troubleshooting

### "Error: P1001: Can't reach database server"

**Problem**: Database not running or wrong connection string

**Solution**:
```bash
# Check if Docker container is running
docker ps | grep funneliq

# Restart if needed
docker start funneliq-db

# Or check your DATABASE_URL in .env.local
```

### "Clerk: Invalid publishable key"

**Problem**: Missing or incorrect Clerk keys

**Solution**:
- Go to [dashboard.clerk.com](https://dashboard.clerk.com)
- Select your application
- Copy keys from "API Keys" section
- Paste into `.env.local`
- Restart dev server

### "Module not found" errors

**Problem**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma errors

**Problem**: Schema out of sync

**Solution**:
```bash
# Re-push schema
npm run db:push

# Regenerate client
npx prisma generate

# Re-seed
npm run db:seed
```

### Port 3000 already in use

**Problem**: Another process using port 3000

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 npm run dev
```

---

## What Works vs What Doesn't

### ✅ Currently Working

- Landing page
- Clerk authentication (sign up/sign in)
- Onboarding flow (all 3 steps)
- Live profit calculator
- Dashboard UI with sample data
- Funnel visualization
- Metrics cards
- Color-coded health indicators
- Database storage of onboarding data
- Profitability calculations

### ⚠️ Placeholder / Not Yet Implemented

- Meta Ads OAuth (shows "TODO" alert)
- Report generation (button exists, no backend)
- PDF export
- Scheduled reports
- Email delivery
- Stripe billing
- Settings page
- Actual Meta Ads data (using sample data)

**These features are architected and ready to build** - see PROJECT_SUMMARY.md for implementation plan.

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Push schema changes
npm run db:seed          # Seed benchmarks
npx prisma studio        # Open database GUI

# Prisma
npx prisma generate      # Generate Prisma Client
npx prisma db pull       # Pull schema from database
npx prisma format        # Format schema file

# Debugging
npx prisma db push --force-reset  # Reset database (DANGER!)
```

---

## Database Access

### View Data with Prisma Studio

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555)

You can view/edit:
- Users (after you sign up)
- Benchmarks (pre-seeded)
- Other tables (empty until features are built)

### Direct SQL Access

```bash
# Docker
docker exec -it funneliq-db psql -U funneliq -d funneliq

# Local
psql -d funneliq

# Then run queries
SELECT * FROM "User";
SELECT * FROM "Benchmark";
```

---

## Next Steps After Running Locally

1. **Explore the Code**
   - Read `PROJECT_SUMMARY.md` for architecture overview
   - Check `IMPLEMENTATION_STATUS.md` for what's next
   - Review `README.md` for full documentation

2. **Add OpenAI** (Optional but Recommended)
   - Get API key from [platform.openai.com](https://platform.openai.com)
   - Add to `.env.local`: `OPENAI_API_KEY=sk-xxxxx`
   - Restart server
   - AI insights will replace rule-based insights

3. **Build Next Feature**
   - Start with report generation (see PROJECT_SUMMARY.md)
   - Or implement Meta Ads OAuth
   - Or build scheduled reports

4. **Deploy to Vercel** (When Ready)
   - Push to GitHub
   - Connect to Vercel
   - Add environment variables
   - Use Supabase for production database

---

## Getting Help

### Resources
- **Product Spec**: `PRODUCT_SPEC.md`
- **Implementation Guide**: `IMPLEMENTATION_STATUS.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **This Guide**: `QUICKSTART.md`

### Common Questions

**Q: Can I use this without Meta Ads?**
A: Yes! Dashboard works with sample data. Real integration comes later.

**Q: Do I need OpenAI?**
A: No. App falls back to rule-based insights without API key.

**Q: Can I use Supabase instead of local PostgreSQL?**
A: Yes! Just use Supabase connection string as DATABASE_URL.

**Q: Why can't I generate reports?**
A: Backend not built yet. See PROJECT_SUMMARY.md "What Still Needs to Be Built".

**Q: How do I add team members?**
A: Feature not built yet. Database schema is ready, UI needed.

---

## Success Checklist

After completing Quick Start, you should have:

- [x] Application running at http://localhost:3000
- [x] Clerk authentication working (can sign up)
- [x] Database connected and seeded
- [x] Onboarding flow functional
- [x] Dashboard displaying sample data
- [x] No console errors in browser
- [x] Can see your user in Prisma Studio

**If all checked, you're ready to continue development!**

---

**Last Updated**: October 20, 2025
**Estimated Setup Time**: 10 minutes
**Difficulty**: Beginner-Friendly

---

## Visual Guide

### Expected Screens

**1. Landing Page**
```
┌────────────────────────────────┐
│   Welcome to FunnelIQ          │
│   Paid media reporting that    │
│   gives you answers, not data  │
│                                │
│   [Get Started]                │
│                                │
│   7-day free trial             │
│   No credit card required      │
└────────────────────────────────┘
```

**2. Onboarding**
```
Progress: ███████─────────── Step 1 of 3

Tell us about your business

Industry: [E-commerce - Food & Beverage ▼]
Business Model: ○ B2C ○ B2B ○ D2C
Primary Goal:
  ○ Online Purchases
  ○ Lead Generation
  ○ App Installs
  ○ Brand Awareness

[Continue]
```

**3. Dashboard**
```
FunnelIQ Dashboard                    [Last 7 days ▼] [👤]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Funnel Health

Impressions     →  Clicks      →  Page Views  →  ATCs  →  Purchases
45,234          →  1,307       →  1,106       →  55    →  5
            2.89% CTR ✓    84.6% ✓    4.99% ⚠️   ...

⚠️ Primary Concern: Checkout → Purchase (17.9%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Metrics:
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Spend   │ │ Revenue │ │ ROAS    │ │ CPA     │ │Purchase │
│ $1,507  │ │ $358    │ │ 0.24x 🔴│ │ $301 🔴 │ │ 5       │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**That's it! You're ready to build. Happy coding!**
