# Vercel Deployment Guide - Step by Step

## 📋 Pre-Deployment Checklist

Before deploying, you need to set up these services (all have free tiers):

### 1. Clerk (Authentication) - REQUIRED
- [ ] Go to https://clerk.com
- [ ] Sign up (free tier available)
- [ ] Create new application
- [ ] Copy API keys (you'll add to Vercel later)

### 2. Database - REQUIRED
**Choose one:**

#### Option A: Supabase (Recommended - Free Tier)
- [ ] Go to https://supabase.com
- [ ] Create new project
- [ ] Copy connection string (Database → Settings → Database)
- [ ] Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

#### Option B: Neon (Alternative - Free Tier)
- [ ] Go to https://neon.tech
- [ ] Create project
- [ ] Copy connection string

#### Option C: Railway (Alternative)
- [ ] Go to https://railway.app
- [ ] Create PostgreSQL database
- [ ] Copy connection string

### 3. Resend (Email) - REQUIRED for Scheduled Reports
- [ ] Go to https://resend.com
- [ ] Sign up (free: 100 emails/day, 3,000/month)
- [ ] Get API key from dashboard
- [ ] Verify domain (or use their test domain for now)

### 4. OpenAI - OPTIONAL
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Create API key
- [ ] **Note:** If you skip this, app uses rule-based insights (still works!)

---

## 🚀 Step-by-Step Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Navigate to Project

```bash
cd /Users/timothyshea/Projects/reportingtool
```

### Step 4: Deploy

```bash
vercel
```

You'll see prompts like this:

```
? Set up and deploy "~/Projects/reportingtool"? [Y/n] y
? Which scope do you want to deploy to? [Your Name]
? Link to existing project? [y/N] n
? What's your project's name? funneliq
? In which directory is your code located? ./
```

**Answer:**
- Set up and deploy? → **Yes**
- Which scope? → **Your account/team**
- Link to existing? → **No** (first time)
- Project name? → **funneliq** (or your choice)
- Directory? → **./** (current directory)

Vercel will detect Next.js and build automatically.

### Step 5: Get Your Deployment URL

After deployment completes, you'll see:

```
✅ Production: https://funneliq-xxxxx.vercel.app [copied to clipboard]
```

**Save this URL!** You'll need it for environment variables.

---

## ⚙️ Step 6: Configure Environment Variables

### Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click on your project: **funneliq**
3. Go to **Settings** → **Environment Variables**

### Add Each Variable

Click "Add" and enter these one by one:

#### Database (REQUIRED)
```
Name: DATABASE_URL
Value: [Your PostgreSQL connection string from Supabase/Neon/Railway]
Environment: Production, Preview, Development (check all 3)
```

#### Clerk Authentication (REQUIRED)
```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_live_xxxxx (from Clerk dashboard)
Environment: Production, Preview, Development

Name: CLERK_SECRET_KEY
Value: sk_live_xxxxx (from Clerk dashboard)
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_CLERK_SIGN_IN_URL
Value: /sign-in
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_CLERK_SIGN_UP_URL
Value: /sign-up
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
Value: /onboarding
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
Value: /onboarding
Environment: Production, Preview, Development
```

#### Meta Ads (Already Have from Last7)
```
Name: FACEBOOK_CLIENT_ID
Value: 1233352741661737
Environment: Production, Preview, Development

Name: FACEBOOK_CLIENT_SECRET
Value: 7a72763906001b258af8f4b8549193cb
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_META_REDIRECT_URI
Value: https://your-app.vercel.app/api/meta/callback
       ⚠️ REPLACE with your actual Vercel URL!
Environment: Production, Preview, Development
```

#### Encryption (REQUIRED)
```
Name: ENCRYPTION_KEY
Value: 6ba6acf969437cf9bc68a9ab1a62b8fbbebafefc47cf32b73068b4c60ddd831f
Environment: Production, Preview, Development
```

#### Email Delivery (REQUIRED)
```
Name: RESEND_API_KEY
Value: re_xxxxx (from Resend dashboard)
Environment: Production, Preview, Development

Name: EMAIL_FROM
Value: reports@funneliq.com (or your verified domain)
Environment: Production, Preview, Development
```

#### App URL (REQUIRED)
```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-app.vercel.app
       ⚠️ REPLACE with your actual Vercel URL!
Environment: Production, Preview, Development
```

#### Cron Secret (REQUIRED)
```
Name: CRON_SECRET
Value: cmpeFG3f2OpUtrjErjM/cr4zeDbp9ilvqw/yw6QSJVg=
Environment: Production, Preview, Development
```

#### OpenAI (OPTIONAL)
```
Name: OPENAI_API_KEY
Value: sk-xxxxx (if you have one)
Environment: Production, Preview, Development

⚠️ If you skip this, app uses rule-based insights (still works!)
```

---

## 🔄 Step 7: Redeploy with Environment Variables

After adding all environment variables:

```bash
vercel --prod
```

This redeploys with your new environment variables.

---

## 🗄️ Step 8: Initialize Database

### Option A: Via Vercel CLI

```bash
# Set DATABASE_URL locally for this command
export DATABASE_URL="your-production-database-url"

# Push schema
npx prisma db push

# Seed benchmarks
npx prisma db seed
```

### Option B: Via Supabase Dashboard

If using Supabase:
1. Go to SQL Editor in Supabase dashboard
2. Run the schema creation manually (Prisma generates SQL)

---

## 🔧 Step 9: Update External Services

### Clerk - Update URLs

1. Go to Clerk dashboard
2. Navigate to **Configure** → **Paths**
3. Update URLs to use your Vercel domain:
   - Sign-in URL: `https://your-app.vercel.app/sign-in`
   - Sign-up URL: `https://your-app.vercel.app/sign-up`
   - After sign-in: `https://your-app.vercel.app/onboarding`

### Meta Developer App - Add Production Redirect

1. Go to https://developers.facebook.com
2. Select your app (1233352741661737)
3. **Settings** → **Basic**
4. Add to **Valid OAuth Redirect URIs**:
   ```
   https://your-app.vercel.app/api/meta/callback
   ```
5. Save changes

### Resend - Verify Domain (Optional but Recommended)

1. Go to Resend dashboard
2. **Domains** → **Add Domain**
3. Add your custom domain
4. Add DNS records they provide
5. Update `EMAIL_FROM` to use your domain

---

## ✅ Step 10: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Get Started"
3. Sign up with Clerk
4. Complete onboarding
5. Connect Meta Ads account
6. View dashboard with live data
7. Generate a report
8. Export as PDF

---

## 🕐 Step 11: Verify Cron Jobs

Vercel automatically sets up cron from `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reports",
      "schedule": "0 * * * *"
    }
  ]
}
```

**To verify:**
1. Go to Vercel Dashboard → **Deployments** → **Cron Jobs**
2. You should see `/api/cron/send-reports` scheduled to run hourly
3. Create a test scheduled report
4. Wait for next hour to verify email delivery

---

## 🎨 Step 12: Custom Domain (Optional)

### Add Your Domain

1. Vercel Dashboard → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `funneliq.com`)
4. Follow DNS configuration instructions
5. Update all URLs in environment variables to use custom domain

### Update Environment Variables

After adding custom domain, update these:

- `NEXT_PUBLIC_APP_URL` → `https://funneliq.com`
- `NEXT_PUBLIC_META_REDIRECT_URI` → `https://funneliq.com/api/meta/callback`

Then:
- Update Clerk URLs
- Update Meta OAuth redirect URI

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- All required environment variables are set
- DATABASE_URL is correct format
- No syntax errors in code

**View logs:**
```bash
vercel logs
```

### Database Connection Errors

**Supabase users:** Make sure you're using the **pooler connection string** (port 6543), not direct connection (port 5432)

**Test connection:**
```bash
npx prisma db pull
```

### Meta OAuth Not Working

**Check:**
- Redirect URI in Meta app includes your Vercel URL
- `NEXT_PUBLIC_META_REDIRECT_URI` matches exactly
- App is in Live Mode (not Development)

### Scheduled Reports Not Sending

**Check:**
- Cron job is visible in Vercel dashboard
- `CRON_SECRET` is set
- `RESEND_API_KEY` is valid
- Email FROM address is verified

**Manual test:**
```bash
curl -X GET https://your-app.vercel.app/api/cron/send-reports \
  -H "Authorization: Bearer cmpeFG3f2OpUtrjErjM/cr4zeDbp9ilvqw/yw6QSJVg="
```

---

## 📊 Monitoring

### Vercel Analytics (Free)

1. Go to your project dashboard
2. Click **Analytics** tab
3. Enable Web Analytics
4. View:
   - Page views
   - Performance metrics
   - Error rates

### Set Up Alerts

1. **Settings** → **Notifications**
2. Enable alerts for:
   - Deployment failures
   - Function errors
   - High error rates

---

## 🔄 Future Deployments

After initial setup, deploying updates is simple:

```bash
# Make your code changes
git add .
git commit -m "Your changes"

# Deploy to production
vercel --prod
```

Vercel automatically:
- Builds your app
- Runs database migrations (if configured)
- Deploys to production
- Runs cron jobs

---

## 📝 Quick Reference

### Key URLs
- Dashboard: `https://vercel.com/dashboard`
- Your App: `https://your-app.vercel.app`
- Logs: `https://vercel.com/your-project/logs`

### Commands
```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel list

# Remove deployment
vercel remove [deployment-url]
```

---

## ✅ Deployment Complete!

Your FunnelIQ app is now live! 🎉

**Next steps:**
1. Share the URL with beta users
2. Monitor analytics and errors
3. Gather feedback
4. Iterate and improve

**Need help?** Check:
- Vercel docs: https://vercel.com/docs
- Project logs: `vercel logs`
- GitHub issues: Create one for tracking

---

**Deployed to:** Vercel
**Database:** PostgreSQL (Supabase/Neon/Railway)
**Auth:** Clerk
**Email:** Resend
**Cron:** Vercel Cron (automatic)
**Status:** ✅ Production Ready
