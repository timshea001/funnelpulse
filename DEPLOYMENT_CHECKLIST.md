# FunnelIQ Deployment Checklist

Use this checklist to deploy step-by-step. Check off each item as you complete it.

---

## 📋 Pre-Deployment Setup

### 1. Create External Accounts

- [ ] **Clerk** (https://clerk.com)
  - [ ] Sign up
  - [ ] Create application
  - [ ] Copy Publishable Key: `pk_live_xxxxx`
  - [ ] Copy Secret Key: `sk_live_xxxxx`

- [ ] **Database** - Choose one:
  - [ ] **Supabase** (https://supabase.com) - Recommended
    - [ ] Create project
    - [ ] Copy connection string (pooler URL, port 6543)
  - [ ] **Neon** (https://neon.tech)
    - [ ] Create project
    - [ ] Copy connection string
  - [ ] **Railway** (https://railway.app)
    - [ ] Create PostgreSQL database
    - [ ] Copy connection string

- [ ] **Resend** (https://resend.com)
  - [ ] Sign up (free tier: 100/day)
  - [ ] Get API key: `re_xxxxx`
  - [ ] (Optional) Verify domain

- [ ] **OpenAI** (https://platform.openai.com) - Optional
  - [ ] Create API key: `sk-xxxxx`
  - [ ] Or skip (app has fallback)

---

## 🚀 Deployment Steps

### 2. Install Vercel CLI

- [ ] Open terminal
- [ ] Run: `npm install -g vercel`
- [ ] Run: `vercel login`
- [ ] Authenticate

### 3. Initial Deployment

- [ ] Navigate to project: `cd /Users/timothyshea/Projects/reportingtool`
- [ ] Run: `vercel`
- [ ] Answer prompts:
  - [ ] Deploy? → **Y**
  - [ ] Scope? → **Your account**
  - [ ] Link existing? → **N**
  - [ ] Project name? → **funneliq** (or your choice)
  - [ ] Directory? → **./**
- [ ] Wait for build to complete
- [ ] Copy deployment URL: `https://funneliq-xxxxx.vercel.app`

### 4. Add Environment Variables

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Add these one by one (click "+ Add" for each):**

#### Database
- [ ] `DATABASE_URL` = `[Your PostgreSQL connection string]`
  - Check all 3 environments: Production, Preview, Development

#### Clerk
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_xxxxx`
- [ ] `CLERK_SECRET_KEY` = `sk_live_xxxxx`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/onboarding`
- [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/onboarding`

#### Meta Ads
- [ ] `FACEBOOK_CLIENT_ID` = `1233352741661737`
- [ ] `FACEBOOK_CLIENT_SECRET` = `7a72763906001b258af8f4b8549193cb`
- [ ] `NEXT_PUBLIC_META_REDIRECT_URI` = `https://[YOUR-VERCEL-URL]/api/meta/callback`
  - ⚠️ Replace `[YOUR-VERCEL-URL]` with actual URL!

#### Security
- [ ] `ENCRYPTION_KEY` = `6ba6acf969437cf9bc68a9ab1a62b8fbbebafefc47cf32b73068b4c60ddd831f`
- [ ] `CRON_SECRET` = `cmpeFG3f2OpUtrjErjM/cr4zeDbp9ilvqw/yw6QSJVg=`

#### Email
- [ ] `RESEND_API_KEY` = `re_xxxxx`
- [ ] `EMAIL_FROM` = `reports@funneliq.com`

#### App Config
- [ ] `NEXT_PUBLIC_APP_URL` = `https://[YOUR-VERCEL-URL]`
  - ⚠️ Replace `[YOUR-VERCEL-URL]` with actual URL!

#### OpenAI (Optional)
- [ ] `OPENAI_API_KEY` = `sk-xxxxx` (or skip)

### 5. Redeploy with Variables

- [ ] Run: `vercel --prod`
- [ ] Wait for deployment

### 6. Initialize Database

- [ ] Set DATABASE_URL locally: `export DATABASE_URL="your-url"`
- [ ] Run: `npx prisma db push`
- [ ] Run: `npx prisma db seed`
- [ ] Verify success (no errors)

### 7. Update External Services

#### Clerk
- [ ] Go to Clerk dashboard
- [ ] Navigate to Configure → Paths
- [ ] Update redirect URLs to use Vercel URL
- [ ] Save

#### Meta Developer
- [ ] Go to https://developers.facebook.com
- [ ] Your App → Settings → Basic
- [ ] Add to OAuth Redirect URIs: `https://[YOUR-VERCEL-URL]/api/meta/callback`
- [ ] Save changes

---

## ✅ Testing

### 8. Test Deployment

- [ ] Visit your Vercel URL
- [ ] Click "Get Started"
- [ ] Sign up with Clerk (test account)
- [ ] Complete onboarding:
  - [ ] Step 1: Business info
  - [ ] Step 2: Economics
  - [ ] Step 3: Connect Meta (or skip)
- [ ] View dashboard
- [ ] Generate a report
- [ ] Export PDF
- [ ] Create scheduled report (optional)

### 9. Verify Cron Jobs

- [ ] Go to Vercel Dashboard → Deployments → Cron Jobs
- [ ] Verify `/api/cron/send-reports` is listed
- [ ] Schedule: `0 * * * *` (hourly)

---

## 🎯 Post-Deployment

### 10. Optional Enhancements

- [ ] Add custom domain
  - [ ] Vercel Settings → Domains
  - [ ] Add domain
  - [ ] Configure DNS
  - [ ] Update all URLs in env vars
  - [ ] Update Clerk & Meta redirect URIs

- [ ] Set up monitoring
  - [ ] Enable Vercel Analytics
  - [ ] Configure deployment notifications
  - [ ] Set up error alerts

- [ ] Invite beta users
  - [ ] Share Vercel URL
  - [ ] Gather feedback
  - [ ] Monitor usage

---

## 📞 Support Checklist

If something doesn't work:

- [ ] Check Vercel logs: `vercel logs`
- [ ] Verify all env vars are set
- [ ] Test database connection: `npx prisma db pull`
- [ ] Check Meta OAuth redirect URI matches exactly
- [ ] Verify Clerk URLs are updated
- [ ] Test email delivery manually
- [ ] Review error logs in Vercel dashboard

---

## ✨ You're Done!

- [ ] App is live at: `https://___________________`
- [ ] All features working
- [ ] Cron jobs running
- [ ] Ready for users

**Next:** Start gathering feedback and iterate! 🚀

---

**Quick Reference:**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deploy Command:** `vercel --prod`
- **View Logs:** `vercel logs`
- **Deployment Guide:** See `VERCEL_DEPLOYMENT.md` for detailed help

---

**Status:** □ Not Started  |  ⏳ In Progress  |  ✅ Complete
