# FunnelPulse - Paid Media Reporting Tool MVP

A Next.js-based reporting tool that provides **actionable insights over data dumps** for paid media campaigns.

## Features

- User authentication with Clerk
- Onboarding flow for business context and product economics
- Meta Ads integration (OAuth ready)
- Dashboard with funnel health visualization
- Account Overview report generation
- AI-powered insights using OpenAI
- Scheduled reports with email delivery
- PDF export functionality
- Stripe integration for billing (3 tiers)

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **AI:** OpenAI API
- **Payments:** Stripe
- **Email:** Resend
- **PDF Generation:** react-pdf / Puppeteer
- **Charts:** Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local, Docker, or cloud)
- Clerk account (free tier available)
- Meta Developer account credentials (already configured from Last7)
- Resend account (for email delivery)
- OpenAI API key (optional - has rule-based fallback)

### Quick Start

**📖 For complete setup instructions, see:**
- **`ENV_SETUP_INSTRUCTIONS.md`** - Quick guide for required credentials
- **`SETUP_GUIDE.md`** - Comprehensive technical documentation
- **`DEPLOYMENT_CHECKLIST.md`** - Step-by-step deployment tasks
- **`VERCEL_DEPLOYMENT.md`** - Production deployment guide

### Installation

1. Install dependencies:

```bash
cd /Users/timothyshea/Projects/reportingtool
npm install
```

2. Configure environment variables:

The `.env.local` file has been created with Meta credentials already configured. You need to add:

**Required:**
- Clerk keys (authentication) - Get from https://clerk.com
- Database URL (PostgreSQL) - Use Supabase, Neon, or Docker
- Resend API key (email) - Get from https://resend.com

**Optional:**
- OpenAI API key (AI insights) - Falls back to rule-based if not set

See `ENV_SETUP_INSTRUCTIONS.md` for detailed setup steps.

3. Set up the database:

```bash
# Push the Prisma schema to your database
npx prisma db push

# Seed benchmark data
npx prisma db seed
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/reportingtool
├── /app
│   ├── /api                    # API routes
│   │   ├── /auth              # Authentication endpoints
│   │   ├── /meta              # Meta Ads API proxy
│   │   ├── /reports           # Report generation
│   │   ├── /scheduled-reports # Scheduled report management
│   │   └── /webhooks          # Stripe webhooks
│   ├── /dashboard             # Main dashboard
│   ├── /onboarding            # Onboarding flow
│   ├── /reports               # Report viewing
│   ├── /settings              # User settings
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── /components
│   ├── /ui                    # Reusable UI components
│   ├── /dashboard             # Dashboard-specific components
│   ├── /reports               # Report components
│   └── /shared                # Shared components
├── /lib
│   ├── calculations.ts        # Metric calculations
│   ├── intelligence.ts        # AI insights generation
│   ├── db.ts                  # Prisma client
│   └── /utils                 # Utility functions
├── /prisma
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── /types
│   └── index.ts               # TypeScript type definitions
└── /public                    # Static assets
```

## Environment Setup

### 1. Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy the publishable key and secret key to your `.env.local`
4. Configure redirect URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/onboarding`
   - After sign-up URL: `/onboarding`

### 2. Meta Ads API

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app (Business type)
3. Add "Marketing API" product
4. Get App ID and App Secret
5. Configure OAuth redirect URI: `http://localhost:3000/api/meta/callback`
6. Request permissions: `ads_read`, `ads_management`

### 3. OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `.env.local`
4. Set usage limits to control costs

### 4. Stripe

1. Go to [stripe.com](https://stripe.com) and create account
2. Get test API keys from dashboard
3. Create products for each pricing tier:
   - Starter: $79/month
   - Growth: $149/month
   - Agency: $299/month
4. Set up webhook endpoint: `http://localhost:3000/api/webhooks/stripe`

### 5. Resend

1. Go to [resend.com](https://resend.com)
2. Create account and get API key
3. Verify your domain for sending emails

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key tables:

- `users` - User accounts and business context
- `ad_accounts` - Connected Meta Ads accounts
- `reports` - Generated reports with data snapshots
- `scheduled_reports` - Automated report schedules
- `report_deliveries` - Delivery tracking
- `benchmarks` - Industry benchmark data
- `team_members` - Team collaboration (for higher tiers)

Run `npx prisma studio` to view and edit data with Prisma Studio.

## Implementation Status

### ✅ MVP Complete - All Core Features Implemented

**Phase 1: Setup & Foundation**
- ✅ Next.js 15 project initialization
- ✅ Tailwind CSS configuration
- ✅ Prisma ORM setup
- ✅ Complete database schema (7 tables)
- ✅ Industry benchmark data seeding

**Phase 2: Authentication & Onboarding**
- ✅ Clerk authentication with middleware
- ✅ 3-step onboarding flow UI
- ✅ Business context capture (industry, model, goals)
- ✅ Product economics calculator (AOV, margin, repeat purchases)
- ✅ Meta Ads OAuth integration

**Phase 3: Meta Ads Integration**
- ✅ Complete OAuth 2.0 flow implementation
- ✅ Meta API client (`lib/meta-api.ts`)
- ✅ API proxy endpoints for insights
- ✅ AES-256-GCM token encryption
- ✅ Automatic token refresh logic
- ✅ Multi-account support

**Phase 4: Dashboard**
- ✅ Dashboard layout with real Meta data
- ✅ Funnel health visualization (5 stages)
- ✅ Live metric cards
- ✅ Ad account selector
- ✅ Date range picker (7/14/30/60/90 days)
- ✅ Recent reports section

**Phase 5: Reports**
- ✅ Report generation engine
- ✅ Rule-based metric calculations
- ✅ OpenAI GPT-4o-mini integration with fallback
- ✅ Complete report UI with all sections
- ✅ Puppeteer-based PDF export
- ✅ Campaign & ad set performance breakdown

**Phase 6: Scheduled Reports**
- ✅ Schedule CRUD operations
- ✅ Frequency options (weekly/bi-weekly/monthly/quarterly)
- ✅ Vercel cron job configuration (hourly)
- ✅ HTML email templates with Resend
- ✅ Delivery tracking and logging
- ✅ Schedule management UI

**Phase 7: Deployment Ready**
- ✅ Environment configuration (.env.local created)
- ✅ Comprehensive deployment documentation
- ✅ Vercel deployment guide
- ✅ Security best practices (encryption, auth middleware)

### 🔄 Future Enhancements (Post-MVP)

**Settings & Billing**
- [ ] User settings page
- [ ] Stripe checkout integration
- [ ] Subscription management UI
- [ ] Plan upgrade/downgrade flows

**Additional Features**
- [ ] Creative Analysis report type
- [ ] Google Ads integration
- [ ] TikTok Ads integration
- [ ] Team member invitations
- [ ] White-label reports (Agency tier)
- [ ] Custom benchmark uploads
- [ ] Slack integration
- [ ] API access for enterprise

## Known Issues & TODOs

### Current Limitations

1. **Meta Ads Integration**: Requires Meta App credentials and approval
   - Placeholder OAuth flow implemented
   - Need to complete Meta Developer app review process
   - TODO: Implement full OAuth callback handling

2. **Stripe Integration**: Requires Stripe account setup
   - Products need to be created in Stripe dashboard
   - Webhook endpoint needs to be configured
   - TODO: Complete subscription upgrade/downgrade flows

3. **Email Delivery**: Requires Resend API key and domain verification
   - TODO: Design and test email templates
   - TODO: Implement cron job for scheduled reports

4. **Database**: Needs PostgreSQL instance
   - For local development, use Docker or local PostgreSQL
   - For production, recommend Supabase, Railway, or Neon

### Security Considerations

- [ ] Implement token encryption for Meta Ads tokens
- [ ] Add rate limiting to API endpoints
- [ ] Set up CORS properly
- [ ] Implement CSRF protection
- [ ] Add input validation with Zod
- [ ] Sanitize user inputs

## Deployment

### Recommended Stack

- **Hosting:** Vercel (optimized for Next.js)
- **Database:** Supabase, Railway, or Neon
- **File Storage:** Vercel Blob or AWS S3 (for PDFs)

### Deployment Steps

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Set up production database
5. Run migrations: `npx prisma migrate deploy`
6. Configure custom domain (optional)
7. Set up error monitoring (Sentry recommended)

## Development Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Push schema changes
npm run db:seed          # Seed benchmark data
npx prisma studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma Client

# Build & Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## API Routes

### Authentication
- `POST /api/auth/user` - Get or create user from Clerk

### Meta Ads
- `GET /api/meta/authorize` - Initiate OAuth flow
- `GET /api/meta/callback` - OAuth callback handler
- `GET /api/meta/accounts` - List connected ad accounts
- `GET /api/meta/insights` - Fetch campaign insights
- `POST /api/meta/refresh-token` - Refresh access token

### Reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports` - List user's reports
- `GET /api/reports/:id/pdf` - Download PDF

### Scheduled Reports
- `GET /api/scheduled-reports` - List schedules
- `POST /api/scheduled-reports` - Create schedule
- `PUT /api/scheduled-reports/:id` - Update schedule
- `DELETE /api/scheduled-reports/:id` - Delete schedule

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `GET /api/cron/scheduled-reports` - Cron job trigger

## Support

For issues or questions, please contact support@funneliq.com

## License

Proprietary - All rights reserved

---

**Built with Next.js 15, TypeScript, and Tailwind CSS**
