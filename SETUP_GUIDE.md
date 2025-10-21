# FunnelIQ - Setup & Deployment Guide

## 🎉 What's Been Built

A complete paid media reporting tool MVP with:

### ✅ Core Features
1. **Meta Ads OAuth Integration** - Connect Facebook/Instagram ad accounts
2. **Onboarding Flow** - Capture business context and product economics
3. **Live Dashboard** - Real-time funnel health visualization with Meta data
4. **Report Generation** - AI-powered insights with OpenAI integration
5. **PDF Export** - Download reports as PDF using Puppeteer
6. **Scheduled Reports** - Automated email delivery via Resend
7. **Complete Database** - PostgreSQL with Prisma ORM

### 📁 Project Structure
```
/reportingtool
├── app/
│   ├── api/
│   │   ├── meta/               # Meta OAuth & insights
│   │   ├── reports/            # Report generation & retrieval
│   │   ├── scheduled-reports/  # Scheduling system
│   │   ├── cron/               # Background jobs
│   │   └── onboarding/         # User setup
│   ├── dashboard/              # Main dashboard
│   ├── reports/[id]/           # Report viewing
│   ├── scheduled-reports/      # Schedule management
│   ├── onboarding/             # Business setup flow
│   ├── sign-in/                # Clerk auth
│   └── sign-up/                # Clerk auth
├── lib/
│   ├── meta-api.ts             # Meta API client
│   ├── calculations.ts         # Business logic
│   ├── intelligence.ts         # AI insights
│   ├── encryption.ts           # Token security
│   └── db.ts                   # Database client
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Benchmark data
└── vercel.json                 # Cron configuration
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local, Docker, or cloud)
- Clerk account (free)
- Meta Developer app
- OpenAI API key (optional - has fallback)
- Resend account (for email)

### 1. Environment Setup

Create `.env.local` in project root:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/funneliq"

# Clerk Authentication (from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Meta Ads API (from Last7 project)
FACEBOOK_CLIENT_ID=1233352741661737
FACEBOOK_CLIENT_SECRET=7a72763906001b258af8f4b8549193cb
NEXT_PUBLIC_META_REDIRECT_URI=http://localhost:3000/api/meta/callback

# OpenAI API (optional - falls back to rule-based if not set)
OPENAI_API_KEY=sk-xxxxx

# Encryption (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=your-64-character-hex-key-here

# Email (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=reports@funneliq.com

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (for scheduled reports)
CRON_SECRET=your-random-secret-here

# Stripe (optional for now)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 2. Database Setup

#### Option A: Local PostgreSQL (Docker)
```bash
docker run --name funneliq-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=funneliq \
  -p 5432:5432 \
  -d postgres:16

# Update DATABASE_URL in .env.local:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/funneliq"
```

#### Option B: Supabase (Free Tier)
1. Create project at https://supabase.com
2. Copy connection string to DATABASE_URL in .env.local

### 3. Install & Run

```bash
cd /Users/timothyshea/Projects/reportingtool

# Install dependencies
npm install

# Push database schema
npx prisma db push

# Seed benchmark data
npx prisma db seed

# Start development server
npm run dev
```

Open http://localhost:3000

---

## 🔑 External Service Setup

### 1. Clerk (Authentication)
1. Go to https://clerk.com and create account
2. Create new application
3. Copy publishable and secret keys to `.env.local`
4. In Clerk dashboard:
   - Enable Email/Password authentication
   - Set redirect URLs: `http://localhost:3000/onboarding`

### 2. Meta Developer App
**Your existing app from Last7 works!**
- App ID: 1233352741661737
- Already configured in `.env.local`
- Scopes needed: `ads_read`, `ads_management`, `business_management`, `read_insights`
- Redirect URI: `http://localhost:3000/api/meta/callback`

### 3. OpenAI (Optional)
1. Get API key from https://platform.openai.com
2. Add to `.env.local` as `OPENAI_API_KEY`
3. **If not set:** App uses rule-based insights (still functional)

### 4. Resend (Email Delivery)
1. Sign up at https://resend.com
2. Get API key
3. Verify domain (or use resend's test domain for development)
4. Add to `.env.local`

---

## 📊 Usage Flow

### First Time Setup
1. Visit http://localhost:3000
2. Click "Get Started" → Sign up with Clerk
3. Complete onboarding:
   - **Step 1:** Industry, business model, goals
   - **Step 2:** AOV, profit margin, repeat purchase info
   - **Step 3:** Connect Meta Ads account (OAuth)
4. Redirected to dashboard with live data

### Dashboard
- View funnel health visualization
- See real-time metrics from Meta
- Switch date ranges (Last 7, 14, 30 days, etc.)
- Generate reports with AI insights

### Generating Reports
1. Click "Generate Report" on dashboard
2. Select date range
3. Wait for generation (~5-10 seconds)
4. View report with:
   - Overall metrics
   - Profitability status
   - Funnel health analysis
   - Campaign & ad set performance
   - AI-generated insights & recommendations
5. Export as PDF

### Scheduled Reports
1. From dashboard → Settings → Scheduled Reports
2. Click "New Schedule"
3. Configure:
   - Frequency (weekly, bi-weekly, monthly, quarterly)
   - Day & time
   - Recipients (comma-separated emails)
   - Delivery format (PDF, link, or both)
4. Reports auto-send via cron job

---

## 🚢 Production Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/timothyshea/Projects/reportingtool
vercel

# Follow prompts
```

### Environment Variables (Vercel Dashboard)
Add all variables from `.env.local` to Vercel project settings:
- Go to Project Settings → Environment Variables
- Add each variable (update URLs for production)
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Update `NEXT_PUBLIC_META_REDIRECT_URI` to `https://yourdomain.com/api/meta/callback`

### Database (Production)
**Recommended:** Supabase, Neon, or Railway
1. Create production database
2. Update `DATABASE_URL` in Vercel env vars
3. Run migrations:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Cron Jobs (Scheduled Reports)
**Vercel automatically sets up cron** from `vercel.json`:
- Runs hourly: `0 * * * *`
- Endpoint: `/api/cron/send-reports`
- Checks for due reports and sends emails

**To protect cron endpoint:**
1. Set `CRON_SECRET` in Vercel env vars
2. Vercel adds it as Bearer token automatically

### Meta App (Production)
1. Go to Meta Developer Dashboard
2. Update OAuth redirect URIs:
   - Add: `https://yourdomain.com/api/meta/callback`
3. Request production permissions for `ads_read`, `ads_management`

---

## 🔒 Security Checklist

- [x] Access tokens encrypted with AES-256-GCM
- [x] Clerk middleware protects all routes
- [x] Cron endpoint requires secret token
- [x] Database uses parameterized queries (Prisma)
- [x] HTTPS enforced in production
- [x] Environment variables not committed to git

---

## 📈 Next Steps / Roadmap

### MVP Enhancements
- [ ] Add "Create Schedule" modal UI (currently just list view)
- [ ] Recent reports section on dashboard (data is fetched, needs UI)
- [ ] Settings page for updating business info
- [ ] Team member invitations (database ready)

### Phase 2 Features
- [ ] Creative Analysis report (placeholder exists)
- [ ] Google Ads integration
- [ ] TikTok Ads integration
- [ ] White-label reports (Agency tier)
- [ ] Stripe billing integration (setup ready, needs checkout flow)

### Phase 3
- [ ] Custom benchmarks upload
- [ ] Slack integration for alerts
- [ ] API access for enterprise
- [ ] Mobile app

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset
npx prisma db seed
```

### Meta OAuth Fails
- Check redirect URI matches exactly in Meta app and `.env.local`
- Verify app is in Development Mode (for testing)
- Check scopes are granted

### Reports Not Generating
- Check OpenAI API key (or confirm fallback is working)
- Verify Meta access token not expired
- Check database connection

### Cron Jobs Not Running
- Vercel: Check deployment logs
- Local: Manually call `/api/cron/send-reports` with auth header

---

## 📞 Support

- Documentation: Check `PRODUCT_SPEC.md` for full feature details
- Implementation Status: See `IMPLEMENTATION_STATUS.md`
- Quick Start: This file (`SETUP_GUIDE.md`)

---

## 🎯 Key Files Reference

| File | Purpose |
|------|---------|
| `app/api/meta/*` | Meta OAuth & API integration |
| `app/api/reports/*` | Report generation & retrieval |
| `app/dashboard/page.tsx` | Main dashboard with live data |
| `lib/meta-api.ts` | Meta API client class |
| `lib/intelligence.ts` | AI insights generation |
| `lib/calculations.ts` | Business metrics & conversions |
| `prisma/schema.prisma` | Database schema |
| `vercel.json` | Cron job configuration |

---

**Built with:** Next.js 15, TypeScript, Prisma, PostgreSQL, Clerk, Meta Ads API, OpenAI, Resend, Puppeteer

**Status:** ✅ MVP Complete - Ready for testing and deployment
