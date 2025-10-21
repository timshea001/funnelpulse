# Environment Variables Setup - Quick Guide

Your `.env.local` file has been created! Here's what you need to fill in:

---

## ✅ Already Configured (From Last7)

These are already set and ready to use:

- ✅ `FACEBOOK_CLIENT_ID` - Meta app ID
- ✅ `FACEBOOK_CLIENT_SECRET` - Meta app secret
- ✅ `ENCRYPTION_KEY` - Auto-generated
- ✅ `CRON_SECRET` - Auto-generated
- ✅ All redirect URLs for local development

---

## 🔧 You Need to Add (3 Required, 1 Optional)

### 1. Clerk (Authentication) - REQUIRED ⚠️

**Where to get:**
1. Go to https://clerk.com
2. Sign up (free)
3. Create new application
4. Copy the keys from dashboard

**What to add to `.env.local`:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx  # ← Replace xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx                    # ← Replace xxxxx
```

**Look for these lines in your `.env.local` and replace the placeholder values.**

---

### 2. Database (PostgreSQL) - REQUIRED ⚠️

**Option A: Supabase (Recommended - Free)**

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (choose **Connection pooler** tab)
5. It looks like:
   ```
   postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

**Option B: Local Docker (For Testing)**

```bash
docker run --name funneliq-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=funneliq \
  -p 5432:5432 \
  -d postgres:16
```

Then use:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/funneliq"
```

**What to add to `.env.local`:**
```bash
DATABASE_URL="postgresql://..."  # ← Replace with your connection string
```

---

### 3. Resend (Email Delivery) - REQUIRED ⚠️

**Where to get:**
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Go to API Keys
4. Create new API key
5. Copy it (starts with `re_`)

**What to add to `.env.local`:**
```bash
RESEND_API_KEY=re_xxxxx  # ← Replace with your key
```

**Optional:** Verify your domain in Resend to send from your own email address

---

### 4. OpenAI (AI Insights) - OPTIONAL ℹ️

**Where to get:**
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy it (starts with `sk-`)

**What to add to `.env.local`:**
```bash
OPENAI_API_KEY=sk-xxxxx  # ← Replace with your key
```

**If you skip this:**
- App will use rule-based insights instead
- Everything still works!
- You just won't get AI-generated narratives

---

## 📝 Summary

### Must Have (Can't Run Without)
1. ✅ Meta credentials (already set from Last7)
2. ⚠️ Clerk keys (authentication)
3. ⚠️ Database URL (PostgreSQL)
4. ⚠️ Resend API key (email)

### Nice to Have
5. ℹ️ OpenAI API key (optional - has fallback)

---

## 🚀 After Setting Up .env.local

Run these commands:

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

Visit: http://localhost:3000

---

## ✅ How to Verify It's Working

### 1. Database Connection
```bash
npx prisma studio
```
Should open database browser at http://localhost:5555

### 2. App Starts
```bash
npm run dev
```
Should show:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

### 3. No Auth Errors
Visit http://localhost:3000
- Should see landing page (not errors)
- Click "Get Started"
- Should see Clerk sign-up form

### 4. Database Working
After signing up:
- Should redirect to onboarding
- No database errors in terminal

---

## 🐛 Troubleshooting

### "CLERK_SECRET_KEY is not set"
→ Add Clerk keys to `.env.local`

### "Error: connect ECONNREFUSED"
→ Check DATABASE_URL is correct

### "Error: P1001 Can't reach database"
→ Database not running or URL wrong

### Authentication loops
→ Restart dev server: `Ctrl+C` then `npm run dev`

---

## 📞 Need Help?

1. Check `.env.local` has all values filled in
2. Restart dev server after changing .env
3. Run `npx prisma db push` after DATABASE_URL changes
4. Check terminal for specific error messages

---

**Your .env.local location:**
`/Users/timothyshea/Projects/reportingtool/.env.local`

**Already configured:**
- Meta OAuth ✅
- Encryption ✅
- Cron Secret ✅
- Local URLs ✅

**Need to add:**
- Clerk keys
- Database URL
- Resend API key
- (Optional) OpenAI key

---

**Once setup is complete, follow:** `DEPLOYMENT_CHECKLIST.md` for Vercel deployment
