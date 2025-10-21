# Paid Media Reporting Tool - Product Specification

## Table of Contents
1. [Product Overview](#product-overview)
2. [Target Market & Personas](#target-market--personas)
3. [Core Features](#core-features)
4. [Onboarding Flow](#onboarding-flow)
5. [Dashboard](#dashboard)
6. [Account Overview Report](#account-overview-report)
7. [Scheduled Reports](#scheduled-reports)
8. [Technical Architecture](#technical-architecture)
9. [Database Schema](#database-schema)
10. [API Integrations](#api-integrations)
11. [Intelligence Layer](#intelligence-layer)
12. [Pricing Structure](#pricing-structure)
13. [Design System](#design-system)
14. [Development Checklist](#development-checklist)

---

## Product Overview

### Vision
Build a reporting tool that provides **actionable insights over data dumps** - helping brands and small agencies understand not just what's happening, but why it matters and what to do about it.

### Core Problem
Existing reporting tools (Supermetrics, DashThis, Whatagraph, Triple Whale) suffer from:
1. **Information overload** - too many metrics, overwhelming dashboards
2. **No context** - data without meaning, no actionable guidance
3. **Result:** Tools collect dust, users don't engage

### Solution
A streamlined reporting platform that:
- Shows only what matters (HIPPO principle: Highest Priority metrics Only)
- Provides contextual intelligence (industry benchmarks, personalized targets)
- Identifies funnel breakpoints (where customers drop off, not just that they're dropping off)
- Educates users (what metrics mean, why they matter, what to do)

### Key Insight: The "Chasing Tails" Problem
**Scenario:** Operator sees bad ROAS → blames ads → wastes time testing new creatives
**Reality:** Ads performing well (good CTR, decent CPCs) → problem is checkout friction
**Our Tool:** Shows exactly where the funnel breaks with contextual explanation

### Differentiation
- **vs. Supermetrics/DashThis:** They give data. We give answers.
- **vs. Triple Whale:** They have AI but it's too broad. We're focused and actionable.
- **Our Edge:** Funnel health monitoring + personalized profitability targets + restrained, strategic insights

---

## Target Market & Personas

### Primary Segments (All viable - build marketing for each)

#### 1. Small Agency Owners (3-15 employees)
- **Pain:** Need to show value to clients, limited analytical resources
- **Budget:** $200-1000/month
- **Decision maker:** Agency owner/director
- **Current solution:** Manual reporting in Sheets/Slides
- **Our message:** "Your clients don't want more data. They want to know: 'Are my ads working?' Our reports answer that in 60 seconds."

#### 2. Small-Medium Brand Marketing Directors
- **Pain:** Internal marketing team needs to report to leadership
- **Budget:** $500-2000/month
- **Decision maker:** Marketing director/CMO
- **Current solution:** Scattered dashboards + manual analysis
- **Our message:** "Stop blaming your ads when the problem is your checkout flow. Our funnel analysis shows you exactly where customers drop off."

#### 3. Freelance Media Buyers
- **Pain:** Need professional reporting to compete with agencies
- **Budget:** $50-200/month
- **Decision maker:** Solo operator
- **Current solution:** Manual/spreadsheets
- **Our message:** "Professional reporting in minutes, not hours. Impress clients with insights, not just spreadsheets."

---

## Core Features

### MVP Feature Set

#### 1. User Onboarding
- Account creation (email/password or social auth)
- Contextual business questions (industry, AOV, margin, repeat purchase)
- Meta Ads account connection (OAuth)
- Automated benchmark calculation based on inputs

#### 2. Main Dashboard
- Account selector (dropdown)
- Date range selector (Last 7, 14, 30 days, This Month, This Quarter, This Year, Custom)
- **Hero: Funnel Health Visualization**
  - Visual funnel: Impressions → Clicks → Page Views → Add to Carts → Checkouts → Purchases
  - Conversion rates at each stage
  - Color-coded health indicators vs benchmarks
  - Automated identification of weakest link
- Quick metrics cards (Spend, Revenue, ROAS, CPA, Purchases) - Last 7 days
- Report cards (Account Overview + Creative Analysis placeholder)
- Recent reports list

#### 3. Account Overview Report
- Generated report based on date range selection
- Sections:
  - Overall Metrics (with profitability status)
  - Funnel Health Analysis (visual + insights)
  - Ad Set Performance
  - Creative Performance by Audience (Top 10)
  - Conversion Benchmarks
- Contextual insights throughout
- In-app view (HTML) + PDF export

#### 4. Scheduled Reports
- Schedule any report for recurring delivery
- Frequency options: Weekly, Bi-weekly, Monthly, Quarterly
- Day/time selection
- Email recipients (multiple)
- PDF attachment or link to view online

#### 5. Settings
- Update business info (AOV, margin, etc.)
- Manage connected ad accounts
- Team members (higher tiers)
- Billing

### Post-MVP (Placeholders for Dashboard)
- **Creative Analysis Report** - Coming soon card on dashboard
- Google Ads integration
- TikTok Ads integration
- White-label reporting (Agency tier)

---

## Onboarding Flow

### Step 1: Account Creation
**Screen: Sign Up**
- Email + password or Google/social auth
- "Create your account" CTA
- Link to login for existing users

### Step 2: Business Context
**Screen: Tell us about your business**

**Question 1: Industry**
- Dropdown selection:
  - E-commerce - Fashion & Apparel
  - E-commerce - Food & Beverage
  - E-commerce - Beauty & Cosmetics
  - E-commerce - Home & Garden
  - E-commerce - Other
  - B2B SaaS
  - Local Services
  - Education/Courses
  - Other

**Question 2: Business Model**
- Radio buttons: B2C | B2B | D2C

**Question 3: Primary Advertising Goal**
- Radio buttons: Online Purchases | Lead Generation | App Installs | Brand Awareness

**Header text:** "We'll use this to provide personalized benchmarks and insights"

### Step 3: Product Economics
**Screen: Let's understand your unit economics**

**Intro text:** "This helps us show you exactly what CPA and ROAS you need to be profitable. Your data is private and never shared."

**Question 1: Average Order Value (AOV)**
- Input field: $___
- Placeholder: e.g., $95
- Helper text: "The typical amount customers spend per purchase"

**Question 2: Average Profit Margin**
- Dropdown + custom option:
  - Less than 20%
  - 20-35%
  - 35-50%
  - 50% or more
  - Enter custom percentage
- Helper text: "Revenue minus all costs (product, shipping, fulfillment). Estimate if unsure—you can update later."

**Question 3 (Collapsible/Optional): Repeat Purchase Pattern**
- Checkbox: "My customers typically purchase more than once"
- If checked, show:
  - "Approximately how many times in the first 12 months?"
  - Dropdown: 1-2 times | 3-4 times | 5+ times | Not sure
- Helper text: "This helps us factor customer lifetime value into your profitability targets"

**Real-time Calculation Preview:**
As user inputs data, show live preview:
```
"Based on your inputs:
• Break-even CPA: $30
• Target ROAS: 4.0x+
We'll track these in every report."
```

**Privacy Note:**
"🔒 Your business data is encrypted and private. We never share or sell your information."

### Step 4: Connect Ad Account
**Screen: Connect your Meta Ads account**

- "Connect Meta Ads" button → OAuth flow
- After connection: Display connected account name
- "Add another account" option (if on higher tier)
- Skip option: "I'll connect later" (but limits functionality)

### Step 5: Dashboard Redirect
- "You're all set!" confirmation
- Auto-redirect to dashboard
- First-time user tooltip/walkthrough (optional)

---

## Dashboard

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]              [Account Dropdown ▼]   [User Menu]         │
└─────────────────────────────────────────────────────────────────┘
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ SIDEBAR (Left, Dark)                                     │    │
│  │ ━━━━━━━━━━━━━━━━━                                       │    │
│  │ 📊 Dashboard                                             │    │
│  │ 📈 Analytics                                             │    │
│  │    • Overview (active)                                   │    │
│  │    • Creative Analysis (coming soon badge)              │    │
│  │ 📅 Scheduled Reports                                     │    │
│  │ ⚙️  Settings                                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  MAIN CONTENT AREA                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Header: Grove and Vine Ad Account      [Last 7 days ▼]   │  │
│  │                                        [Custom range...]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ FUNNEL HEALTH (Hero Section)                             │  │
│  │                                                           │  │
│  │  Impressions → Clicks → Views → ATC → Checkout → Purchase │  │
│  │    45,000      1,300    1,100   55      28         5      │  │
│  │            2.89%     84.6%   5.0%   50.9%    17.9%        │  │
│  │            [green]   [green] [red]  [yellow]  [red]       │  │
│  │                                                           │  │
│  │  ⚠️ Primary Concern: Checkout → Purchase (17.9%)         │  │
│  │     Benchmark: 60-75% | Your Target: 40%+                │  │
│  │     → Review payment options, trust signals, shipping     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐       │
│  │ Spend    │ Revenue  │ ROAS     │ CPA      │ Purchases│       │
│  │ $1,507   │ $358     │ 0.24x    │ $301.47  │ 5        │       │
│  │ [chart]  │ [chart]  │ [chart]  │ [chart]  │ [chart]  │       │
│  │ ━━━━━    │ ━━━━━    │ ━━━━━    │ ━━━━━    │ ━━━━━    │       │
│  │          │          │ 🔴 Below │ 🔴 Above │          │       │
│  │          │          │ Target   │ Target   │          │       │
│  │          │          │ 4.0x     │ <$30     │          │       │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ REPORTS                                                   │   │
│  │ ┌─────────────────────┐  ┌─────────────────────┐         │   │
│  │ │ Account Overview    │  │ Creative Analysis   │         │   │
│  │ │ [Generate Report ▼] │  │ [Coming Soon]       │         │   │
│  │ │ Last: Oct 20, 9am   │  │                     │         │   │
│  │ └─────────────────────┘  └─────────────────────┘         │   │
│  │                                                           │   │
│  │ Recent Reports:                                           │   │
│  │ • Account Overview - Oct 13-19 (generated 2h ago) [View]  │   │
│  │ • Account Overview - Oct 6-12 (generated 3d ago) [View]   │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### Dashboard Components

#### 1. Funnel Health Visualization
**Design:**
- Large funnel graphic (horizontal flow)
- Each stage shows:
  - Stage name
  - Absolute count
  - Conversion rate to next stage (with color indicator)
- Color coding:
  - Green: Above benchmark
  - Yellow: Within acceptable range (90-100% of benchmark)
  - Red: Below benchmark
- Automated "Primary Concern" callout box below funnel
  - Identifies weakest link
  - Shows benchmark comparison
  - Provides 1-2 actionable recommendations

**Example:**
```
Impressions: 45,234
     ↓ 2.89% CTR [GREEN] (Benchmark: 1.8%)
Clicks: 1,307
     ↓ 84.6% View Rate [GREEN] (Benchmark: 75%+)
Landing Page Views: 1,106
     ↓ 4.99% ATC Rate [RED] (Benchmark: 8-12%)
Add to Carts: 55
     ↓ 50.9% Checkout Rate [YELLOW] (Benchmark: 45-60%)
Checkouts Initiated: 28
     ↓ 17.9% Purchase Rate [RED] (Benchmark: 60-75%, Your Target: 40%+)
Purchases: 5
```

**Primary Concern Box:**
```
⚠️ Biggest Opportunity: Checkout → Purchase (17.9%)
Your current rate is below both industry benchmark (60-75%) and
your business target (40%+ needed for profitable CPA).

Recommended actions:
1. Review checkout process for friction points
2. Test trust badges and guarantees
3. Analyze abandoned cart data in your e-commerce platform
```

#### 2. Quick Metrics Cards
**Each card shows:**
- Metric name + info icon (hover for explanation)
- Current value (large, bold)
- Sparkline chart (last 7 days trend)
- Change indicator (percentage up/down from previous period)
- Status indicator (for ROAS, CPA):
  - ROAS: Show target (e.g., "Target: 4.0x+") with color
  - CPA: Show target (e.g., "Target: <$30") with color

#### 3. Report Generation Cards
**Account Overview Card:**
- Title: "Account Overview"
- Dropdown: Date range selector
  - Last 7 days
  - Last 14 days
  - Last 30 days
  - This month
  - This quarter
  - This year
  - Custom range...
- "Generate Report" button (primary CTA)
- "Schedule Report" link (secondary)
- Last generated timestamp

**Creative Analysis Card:**
- Title: "Creative Analysis"
- Badge: "Coming Soon"
- Gray overlay
- No interaction

#### 4. Recent Reports List
- Shows last 5 generated reports
- Each row:
  - Report type
  - Date range
  - Generated timestamp
  - [View] button → Opens report in-app
  - [...] menu → Download PDF, Regenerate, Delete

---

## Account Overview Report

### Report Header
```
┌─────────────────────────────────────────────────────────┐
│ ACCOUNT PERFORMANCE | [Date Range]                      │
│ [Account Name]                                           │
│                                                          │
│ [Export PDF] [Schedule Report] [Back to Dashboard]      │
└─────────────────────────────────────────────────────────┘
```

### Section 1: Overall Metrics

**Table:**
| Metric | Value |
|--------|-------|
| Total Spend | $1,507.33 |
| Revenue | $358.10 |
| Purchases | 5 |
| ROAS | 0.24x |
| CPA | $301.47 |

**Profitability Status Card:**
```
┌────────────────────────────────────────────────────┐
│ 🔴 PROFITABILITY ALERT                             │
│                                                    │
│ Based on your 30% margin and $100 AOV:            │
│ • Your break-even CPA: $30                         │
│ • Your current CPA: $301.47                        │
│ • Loss per customer: ~$271                         │
│                                                    │
│ Your funnel data shows the issue isn't ad          │
│ performance (CTR is strong at 2.89% vs 1.8%        │
│ benchmark) but conversion efficiency post-click.   │
│ See Funnel Health Analysis below.                  │
└────────────────────────────────────────────────────┘
```

**Note below table:**
*LTV Projections: N/A* (or calculated value if repeat purchase data provided)

### Section 2: Funnel Health Analysis ⭐ (New - Core Differentiator)

**Visual Funnel** (same as dashboard)

**Stage-by-Stage Breakdown:**

| Stage | Count | Conversion Rate | Benchmark | Status | Insight |
|-------|-------|-----------------|-----------|--------|---------|
| Impressions → Clicks | 45,234 → 1,307 | 2.89% | 1.8% | ✓ Performing well | Your CTR is 61% above industry average, indicating strong creative resonance |
| Clicks → Page Views | 1,307 → 1,106 | 84.6% | 75%+ | ✓ Performing well | Good ad-to-landing page continuity |
| Page Views → ATC | 1,106 → 55 | 4.99% | 8-12% | ⚠️ Below target | Slightly below benchmark. Consider: product-page optimization, pricing clarity, or offer strength |
| ATC → Checkout | 55 → 28 | 50.9% | 45-60% | ✓ Within range | Acceptable performance |
| Checkout → Purchase | 28 → 5 | 17.9% | 60-75% (Industry) / 40%+ (Your Target) | 🔴 Primary concern | Major drop-off. This is where you're losing revenue. |

**Priority Actions:**
```
1. 🔴 Critical: Fix checkout conversion
   - Review payment options (is checkout process smooth?)
   - Add trust signals (security badges, return policy)
   - Check mobile checkout experience
   - Test different shipping cost presentations

2. 🟡 Opportunity: Improve ATC rate
   - A/B test product descriptions
   - Add customer reviews/social proof
   - Test urgency/scarcity messaging
```

### Section 3: Ad Set Performance Metrics

**Subheader:** Campaign: CBO - Purchase - Best Creatives Oct 9 - Shop LP

**Table:**
| Ad Set | Spend | CTR | CPM | Link Click CPC | ATCs | Purchases |
|--------|-------|-----|-----|----------------|------|-----------|
| US - All - 18-65 - Top 10% Income + Olive oil | $567.34 | 2.30% | $33.24 | $1.44 | 7 | 1 |
| Cooking_Gear_35+ | $410.61 | 2.47% | $30.68 | $1.24 | 12 | 2 |
| Cooking_Foodie_Magazines_35+ | $260.82 | 3.67% | $19.51 | $0.53 | 5 | 1 |
| US - All - 18-65 - Olive oil | $183.34 | 3.61% | $37.02 | $1.02 | 2 | 0 |
| Gourmet Food - General | $85.22 | 3.07% | $28.78 | $0.94 | 1 | 1 |

**Contextual Insight:**
```
💡 Insight: "Cooking_Foodie_Magazines_35+" has the lowest CPC ($0.53)
and highest CTR (3.67%), but only 1 purchase. This audience is engaging
but not converting—consider testing different offers or landing pages
specifically for this segment.
```

### Section 4: Creative Performance by Audience

**Subheader:** Top 10 Creative + Audience Combinations

**Table:**
| Creative | Audience | Spend | CTR | CPM | Link Click CPC | ATCs | Purchases |
|----------|----------|-------|-----|-----|----------------|------|-----------|
| Video SplitScreen - Science Health | Top 10% Income + Olive oil | $316.87 | 2.97% | $45.54 | $1.53 | 6 | 0 |
| Video SplitScreen - Science Health | Cooking_Gear_35+ | $227.41 | 2.98% | $39.36 | $1.32 | 3 | 1 |
| Banner Olive Oil Close Up | Cooking_Foodie_Magazines_35+ | $214.60 | 3.95% | $18.24 | $0.46 | 3 | 1 |
| ... (continue with all 10) |

**Performance Tiers:** (Color-coded rows)
- Green background: Top performers (purchases + efficient metrics)
- No highlight: Testing/neutral
- Red background: Poor performers (high spend, no conversions)

**Contextual Insight:**
```
🎯 Recommendation: "Banner Olive Oil Close Up" is your most efficient
creative across multiple audiences (low CPC, consistent conversions).
Consider: Increasing budget allocation to this creative by 30% and
testing similar static image formats.

⚠️ Consider pausing: "Video SplitScreen - Science Health" + "Top 10%
Income" combination has spent $316 with 0 conversions. Test a different
creative with this audience before increasing spend.
```

### Section 5: Conversion Rates vs. E-commerce Benchmarks

**Table:**
| Metric | Current (7D) | Historical | E-com Target | Status |
|--------|--------------|------------|--------------|---------|
| Click → Add to Cart | 4.99% | 11.83% | 8-12% | Current: Below / Historical: Within target ✓ |
| ATC → Checkout | 51.85% | 63.64% | 45-60% | Current: Within target ✓ / Historical: Above target |
| Checkout → Purchase | 35.71% | 28.57% | 60-75% | Both below target |
| Overall ATC → Purchase | 18.52% | 18.18% | 25-35% | Both below target |

**Educational Elements:**
Each metric has an (i) icon that shows explanation on hover/click:

*Example for "Click → Add to Cart":*
```
ℹ️ Why this matters:
This measures how well your ads align with your product offering.
Low rates suggest:
• Wrong audience targeting
• Misleading ad creative
• Poor product-market fit
• Slow landing page load times
• Pricing disconnect (ad implies different price)
```

---

## Scheduled Reports

### Setup Flow

**From Report View:**
1. User clicks "Schedule Report" button
2. Modal opens

**Modal: Schedule Report**

**Form Fields:**
- **Report Type:** Account Overview (pre-selected, disabled for now)
- **Date Range:** Dropdown
  - Last 7 days
  - Last 14 days
  - Last 30 days
  - This month (calendar month)
  - This quarter
- **Frequency:** Dropdown
  - Weekly
  - Bi-weekly (every 2 weeks)
  - Monthly
  - Quarterly
- **Delivery Day/Time:**
  - If Weekly: Dropdown for day (Monday-Sunday)
  - If Bi-weekly: Dropdown for day
  - If Monthly: Dropdown for day (1st-28th of month)
  - If Quarterly: Dropdown for month + day
  - Time: Dropdown (12am, 1am, ... 11pm in user's timezone)
- **Recipients:** Text input (comma-separated emails)
  - Placeholder: "you@company.com, client@company.com"
- **Delivery Format:**
  - Radio buttons: PDF attachment | Link to view online | Both
- **Active Campaigns Only:** Toggle (Yes/No)
  - Helper text: "Only include campaigns that are currently active"

**Buttons:**
- [Cancel] [Save Schedule]

**After Saving:**
- Confirmation message: "Report scheduled! First delivery: [Date/Time]"
- Redirect to Scheduled Reports page

### Scheduled Reports Management Page

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Scheduled Reports                      [+ New Schedule] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Account Overview - Weekly                          │  │
│ │ ─────────────────────────────────────────────────  │  │
│ │ Account: Grove and Vine                            │  │
│ │ Frequency: Every Monday at 9:00 AM                 │  │
│ │ Recipients: you@company.com, client@company.com    │  │
│ │ Next delivery: Oct 23, 2025 at 9:00 AM             │  │
│ │ Last sent: Oct 16, 2025 (delivered)                │  │
│ │                                                     │  │
│ │ [Edit] [Pause] [Delete]                            │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ (Additional scheduled reports...)                        │
└─────────────────────────────────────────────────────────┘
```

### Email Delivery

**Email Template:**

**Subject Line:**
`[{Account Name}] Account Performance Report - {Date Range}`

**Email Body (HTML):**
```
Hi there,

Your scheduled performance report for {Account Name} is ready.

📊 Quick Summary ({Date Range}):
• Spend: ${spend}
• Revenue: ${revenue}
• ROAS: {roas}x
• CPA: ${cpa}

{Biggest Finding}:
{1-2 sentence insight from Intelligence Layer}

[View Full Report] (button - if link option selected)

{PDF attachment - if PDF option selected}

─────────────────
This is an automated report from [Your Product Name].
Manage your scheduled reports: [Link to dashboard]
```

**Example:**
```
Subject: [Grove and Vine] Account Performance Report - Oct 13-19, 2025

Hi there,

Your scheduled performance report for Grove and Vine Ad Account is ready.

📊 Quick Summary (Oct 13-19, 2025):
• Spend: $1,507.33
• Revenue: $358.10
• ROAS: 0.24x
• CPA: $301.47

⚠️ Key Finding:
Your ads are performing well (CTR up 38% vs benchmark), but checkout
conversion dropped to 17.9% (target: 60-75%). The issue isn't your
creative—review your checkout process for friction points.

[View Full Report]

(PDF attached)

─────────────────
This is an automated report from FunnelIQ.
Manage your scheduled reports: https://app.funneliq.com/scheduled-reports
```

---

## Technical Architecture

### Recommended Tech Stack

#### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui or Radix UI
- **Charts:** Recharts or Chart.js
- **PDF Generation:** react-pdf or Puppeteer

#### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma or Drizzle
- **Auth:** Clerk or Supabase Auth
- **Background Jobs:** Inngest or BullMQ
- **Cron Jobs:** Vercel Cron or node-cron

#### External Services
- **Meta Ads API:** Official Marketing API SDK
- **LLM:** OpenAI API (GPT-4o or GPT-4o-mini)
- **Email:** Resend or SendGrid
- **File Storage:** AWS S3 or Vercel Blob
- **Hosting:** Vercel

#### Infrastructure
- **Deployment:** Vercel
- **Database Hosting:** Supabase, Railway, or Neon
- **Environment:** Serverless

### System Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│  Next.js Frontend (React)           │
│  • Dashboard UI                     │
│  • Report Generation UI             │
│  • Settings/Account Management      │
└──────┬──────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────┐
│  Next.js API Routes (Backend)       │
│  • /api/auth/*                      │
│  • /api/ad-accounts/*               │
│  • /api/reports/*                   │
│  • /api/scheduled-reports/*         │
│  • /api/meta/* (proxy to Meta API)  │
│  • /api/insights/* (LLM calls)      │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────┬──────────────┬──────────────┐
│              │              │              │
│  PostgreSQL  │   Meta API   │  OpenAI API  │
│  Database    │              │              │
│              │              │              │
└──────────────┴──────────────┴──────────────┘

Background Jobs (Cron):
┌─────────────────────────────────────┐
│  Scheduled Report Generator         │
│  • Runs every hour                  │
│  • Checks for due reports           │
│  • Generates + sends emails         │
└─────────────────────────────────────┘
```

---

## Database Schema

### Tables

#### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- null if using OAuth
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Onboarding data
  industry VARCHAR(100),
  business_model VARCHAR(50), -- B2C, B2B, D2C
  primary_goal VARCHAR(50), -- purchases, leads, app_installs
  average_order_value DECIMAL(10,2),
  profit_margin DECIMAL(5,2), -- stored as percentage (e.g., 30.00)
  has_repeat_purchases BOOLEAN DEFAULT false,
  repeat_purchase_frequency VARCHAR(50), -- 1-2, 3-4, 5+, not_sure

  -- Calculated fields
  break_even_cpa DECIMAL(10,2),
  target_cpa DECIMAL(10,2),
  minimum_roas DECIMAL(10,2),
  target_roas DECIMAL(10,2),
  ltv_multiplier DECIMAL(5,2),

  -- Subscription
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, starter, growth, agency
  subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, cancelled, past_due
  trial_ends_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255)
);
```

#### 2. ad_accounts
```sql
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- meta, google, tiktok
  account_id VARCHAR(255) NOT NULL, -- external platform account ID
  account_name VARCHAR(255),
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  token_expires_at TIMESTAMP,
  connected_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,

  UNIQUE(user_id, platform, account_id)
);
```

#### 3. reports
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- account_overview, creative_analysis
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW(),

  -- Stored data snapshot
  data_snapshot JSONB, -- raw metrics from platform
  calculated_metrics JSONB, -- our calculations (conversion rates, etc.)
  insights JSONB, -- generated insights from Intelligence Layer

  -- File storage
  pdf_url TEXT,

  -- Metadata
  generation_time_ms INTEGER, -- how long it took to generate

  INDEX(user_id, generated_at),
  INDEX(ad_account_id, date_range_start)
);
```

#### 4. scheduled_reports
```sql
CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL,

  -- Schedule configuration
  frequency VARCHAR(50) NOT NULL, -- weekly, biweekly, monthly, quarterly
  day_of_week INTEGER, -- 0-6 (Sunday-Saturday) for weekly/biweekly
  day_of_month INTEGER, -- 1-28 for monthly
  time_of_day TIME, -- HH:MM in user's timezone
  timezone VARCHAR(100) DEFAULT 'America/New_York',

  -- Date range for report
  date_range_type VARCHAR(50), -- last_7, last_14, last_30, this_month, this_quarter

  -- Delivery settings
  recipients TEXT[], -- array of email addresses
  delivery_format VARCHAR(50), -- pdf, link, both
  active_campaigns_only BOOLEAN DEFAULT false,

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP,
  next_run_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX(next_run_at, is_active)
);
```

#### 5. report_deliveries
```sql
CREATE TABLE report_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_report_id UUID REFERENCES scheduled_reports(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,

  delivered_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50), -- success, failed
  error_message TEXT,

  recipients TEXT[], -- who it was sent to

  INDEX(scheduled_report_id, delivered_at)
);
```

#### 6. benchmarks
```sql
CREATE TABLE benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry VARCHAR(100) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,

  -- Statistical values
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  avg_value DECIMAL(10,2),
  median_value DECIMAL(10,2),
  percentile_25 DECIMAL(10,2),
  percentile_75 DECIMAL(10,2),

  -- Metadata
  source VARCHAR(255), -- where data came from
  data_date DATE, -- when benchmark was calculated
  sample_size INTEGER,

  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(industry, metric_name)
);
```

#### 7. team_members (for higher tiers)
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- account owner
  member_user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- team member
  role VARCHAR(50), -- admin, member, viewer
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP,

  UNIQUE(user_id, member_user_id)
);
```

### Initial Benchmark Data

Seed the `benchmarks` table with industry averages:

```sql
-- E-commerce - Food & Beverage
INSERT INTO benchmarks (industry, metric_name, min_value, max_value, avg_value, source) VALUES
('ecommerce_food', 'ctr', 1.5, 3.0, 1.8, 'Industry aggregate 2024'),
('ecommerce_food', 'cpc', 0.80, 2.50, 1.20, 'Industry aggregate 2024'),
('ecommerce_food', 'cpm', 20.00, 50.00, 32.00, 'Industry aggregate 2024'),
('ecommerce_food', 'click_to_atc', 8.0, 12.0, 10.0, 'Industry aggregate 2024'),
('ecommerce_food', 'atc_to_checkout', 45.0, 60.0, 52.0, 'Industry aggregate 2024'),
('ecommerce_food', 'checkout_to_purchase', 60.0, 75.0, 67.0, 'Industry aggregate 2024'),
('ecommerce_food', 'atc_to_purchase', 25.0, 35.0, 30.0, 'Industry aggregate 2024');

-- Repeat for other industries...
```

---

## API Integrations

### Meta Ads Marketing API

#### Required Permissions
- `ads_read`
- `ads_management` (if allowing campaign creation in future)

#### OAuth Flow
1. User clicks "Connect Meta Ads"
2. Redirect to Meta OAuth endpoint with scopes
3. Meta redirects back with authorization code
4. Exchange code for access token + refresh token
5. Store tokens (encrypted) in `ad_accounts` table
6. Fetch account details and store

#### Key API Endpoints to Use

**1. Get Ad Accounts:**
```
GET /{user_id}/adaccounts
```

**2. Get Campaign Insights:**
```
GET /{ad_account_id}/insights
?level=campaign
&time_range={'since':'2025-10-13','until':'2025-10-19'}
&fields=campaign_name,spend,impressions,reach,clicks,ctr,cpm,cpc,actions,action_values
```

**3. Get Ad Set Insights:**
```
GET /{ad_account_id}/insights
?level=adset
&time_range={'since':'2025-10-13','until':'2025-10-19'}
&fields=adset_name,spend,impressions,clicks,ctr,cpm,cpc,actions
```

**4. Get Ad-Level Insights (for Creative Analysis):**
```
GET /{ad_account_id}/insights
?level=ad
&time_range={'since':'2025-10-13','until':'2025-10-19'}
&fields=ad_name,creative_name,spend,impressions,clicks,ctr,cpm,cpc,actions,action_values
&breakdowns=age,gender
```

**Actions to Track:**
- `link_click`
- `view_content` (landing page views)
- `add_to_cart`
- `initiate_checkout`
- `purchase`

#### Token Refresh Strategy
- Tokens expire after 60 days
- Implement automatic refresh before expiration
- Store `token_expires_at` in database
- Background job checks and refreshes tokens 7 days before expiry

### OpenAI API Integration

#### Use Cases
1. Generate contextual insights from data
2. Synthesize multiple metrics into narrative
3. Create actionable recommendations

#### Example API Call

**Endpoint:** `POST https://api.openai.com/v1/chat/completions`

**Payload:**
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert paid media analyst specializing in e-commerce advertising. Your job is to analyze performance data and provide specific, actionable insights. Be concise and focus on what matters most. Always prioritize funnel breakpoints over surface-level metrics."
    },
    {
      "role": "user",
      "content": "Analyze this data for a food & beverage e-commerce brand:\n\n- Industry: E-commerce - Food & Beverage\n- AOV: $100\n- Margin: 30%\n- Date range: Oct 13-19, 2025\n- Spend: $1,507.33\n- Revenue: $358.10\n- Purchases: 5\n- ROAS: 0.24x\n- CPA: $301.47\n\nFunnel:\n- Impressions: 45,234\n- Clicks: 1,307 (CTR: 2.89%)\n- Page Views: 1,106\n- Add to Carts: 55 (Click→ATC: 4.99%)\n- Checkouts: 28 (ATC→Checkout: 50.9%)\n- Purchases: 5 (Checkout→Purchase: 17.9%)\n\nBenchmarks:\n- CTR benchmark: 1.8%\n- Click→ATC benchmark: 8-12%\n- ATC→Checkout benchmark: 45-60%\n- Checkout→Purchase benchmark: 60-75%\n\nProvide:\n1. Primary concern (1 sentence)\n2. Why this is happening (1-2 sentences)\n3. Top 3 recommended actions (concise bullet points)"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 400
}
```

**Expected Response:**
```
1. Primary Concern: Your checkout-to-purchase conversion rate (17.9%) is critically below the 60-75% benchmark, causing your CPA to be 10x higher than your break-even target of $30.

2. Why: Your ads are performing exceptionally well (CTR 61% above benchmark), proving strong creative-market fit. The problem emerges late in the funnel, suggesting technical friction, payment issues, or unexpected costs (shipping/fees) appearing at checkout.

3. Recommended Actions:
   - Audit mobile checkout flow for technical errors or loading issues
   - Review shipping costs and timing—test free shipping threshold
   - Add trust signals at checkout (security badges, easy returns policy)
```

#### Cost Management
- Use `gpt-4o-mini` for most insights (cheaper)
- Use `gpt-4o` only for complex analysis (future feature)
- Cache insights at report generation (don't regenerate on view)
- Set max_tokens to limit costs
- Monitor usage and set monthly budget alerts

---

## Intelligence Layer

### Hybrid Approach: Rule-Based + LLM

#### Rule-Based Logic (Fast, Reliable, Deterministic)

**1. Benchmark Comparisons**
```typescript
function compareTooBenchmark(
  value: number,
  benchmarkMin: number,
  benchmarkMax: number
): 'above' | 'within' | 'below' {
  if (value > benchmarkMax) return 'above';
  if (value < benchmarkMin) return 'below';
  return 'within';
}

function getStatusColor(status: string): string {
  if (status === 'above') return 'green'; // good for CTR, bad for CPC
  if (status === 'below') return 'red'; // bad for CTR, good for CPC
  return 'yellow';
}
```

**2. Profitability Calculation**
```typescript
function calculateProfitability(userData: User, metrics: Metrics) {
  const { average_order_value, profit_margin } = userData;
  const profitPerSale = average_order_value * (profit_margin / 100);

  return {
    breakEvenCPA: profitPerSale,
    targetCPA: profitPerSale * 0.8, // 20% buffer
    minimumROAS: 1 / (profit_margin / 100),
    targetROAS: (1 / (profit_margin / 100)) * 1.2,
    isProfileable: metrics.cpa < profitPerSale,
    lossPerCustomer: Math.max(0, metrics.cpa - profitPerSale)
  };
}
```

**3. Funnel Breakpoint Detection**
```typescript
function identifyWeakestFunnelStage(funnelData: FunnelStage[], benchmarks: Benchmarks) {
  const stagesWithGap = funnelData.map(stage => {
    const benchmark = benchmarks[stage.name];
    const gap = benchmark.avg - stage.conversionRate;
    const percentageGap = (gap / benchmark.avg) * 100;

    return {
      stage: stage.name,
      gap: percentageGap,
      severity: percentageGap > 30 ? 'critical' : percentageGap > 15 ? 'warning' : 'ok'
    };
  });

  // Sort by largest gap
  stagesWithGap.sort((a, b) => b.gap - a.gap);

  return stagesWithGap[0]; // Weakest stage
}
```

**4. Performance Tier Classification**
```typescript
function classifyCreativePerformance(creatives: Creative[]) {
  // Sort by efficiency score (purchases / spend)
  const sorted = creatives
    .map(c => ({
      ...c,
      efficiency: c.purchases > 0 ? c.purchases / c.spend : 0
    }))
    .sort((a, b) => b.efficiency - a.efficiency);

  const topThird = Math.ceil(sorted.length / 3);

  return sorted.map((creative, index) => ({
    ...creative,
    tier: index < topThird ? 'top' : index < topThird * 2 ? 'middle' : 'bottom'
  }));
}
```

**5. Anomaly Detection**
```typescript
function detectAnomalies(currentMetrics: Metrics, historicalMetrics: Metrics) {
  const threshold = 0.20; // 20% change
  const anomalies = [];

  if (Math.abs(currentMetrics.ctr - historicalMetrics.ctr) / historicalMetrics.ctr > threshold) {
    anomalies.push({
      metric: 'CTR',
      change: ((currentMetrics.ctr - historicalMetrics.ctr) / historicalMetrics.ctr) * 100,
      direction: currentMetrics.ctr > historicalMetrics.ctr ? 'increase' : 'decrease'
    });
  }

  // Repeat for other key metrics

  return anomalies;
}
```

#### LLM-Powered Logic (Contextual, Narrative, Actionable)

**When to use LLM:**
1. Synthesizing multiple data points into coherent narrative
2. Explaining "why" behind the numbers
3. Generating specific, contextual action items
4. Adapting language to industry/business model

**LLM Prompt Structure:**

```typescript
function generateLLMInsights(data: ReportData, user: User) {
  const prompt = `
Analyze this paid advertising data for a ${user.industry} business:

BUSINESS CONTEXT:
- Industry: ${user.industry}
- AOV: $${user.average_order_value}
- Profit Margin: ${user.profit_margin}%
- Break-even CPA: $${data.breakEvenCPA}
- Target ROAS: ${data.targetROAS}x

PERFORMANCE DATA (${data.dateRange}):
- Spend: $${data.spend}
- Revenue: $${data.revenue}
- ROAS: ${data.roas}x
- CPA: $${data.cpa}
- Purchases: ${data.purchases}

FUNNEL:
${data.funnelStages.map(stage => `- ${stage.name}: ${stage.count} (${stage.conversionRate}% conversion)`).join('\n')}

BENCHMARKS:
${data.benchmarks.map(b => `- ${b.name}: ${b.target}`).join('\n')}

RULE-BASED FINDINGS:
- Weakest funnel stage: ${data.weakestStage}
- Profitability status: ${data.isProfitable ? 'Profitable' : 'Unprofitable'}
- Anomalies: ${data.anomalies.join(', ')}

Provide:
1. Primary insight (1-2 sentences focusing on what matters most)
2. Root cause analysis (why is this happening - 1-2 sentences)
3. Top 3 specific, actionable recommendations

Be concise. Focus on the funnel breakpoint. Don't just describe the data - explain what to DO about it.
`;

  return callOpenAI(prompt);
}
```

**Example LLM Response:**
```
Primary Insight: Your advertising is effectively reaching and engaging the right audience (CTR 61% above benchmark), but you're losing 82% of potential customers at checkout, resulting in a CPA 10x higher than your $30 break-even target.

Root Cause: The dramatic drop-off specifically at checkout (17.9% vs 60-75% benchmark) while earlier funnel stages perform well indicates a technical, trust, or cost-related friction point appearing only at the final purchase step—not an issue with your product-market fit or advertising targeting.

Recommendations:
1. Immediately audit your mobile checkout experience for errors, slow loading, or confusing UI—most users abandon here first
2. Test transparent shipping costs earlier in the funnel or offer free shipping threshold to reduce checkout surprise
3. Add trust signals at checkout: security badges, prominent return policy, customer service contact info to reduce purchase anxiety
```

#### Combining Rule-Based + LLM

**Workflow:**
```
1. Fetch data from Meta API
2. Run rule-based calculations:
   - Calculate profitability metrics
   - Compare to benchmarks
   - Identify funnel weakest stage
   - Classify creative performance
   - Detect anomalies
3. Package findings + raw data
4. Send to LLM for synthesis + narrative
5. Combine into final report:
   - Tables/charts: Raw data + rule-based classifications
   - Insight cards: LLM-generated narratives
   - Recommendations: LLM-generated actions
6. Cache results in database
```

---

## Pricing Structure

### Tiers

#### Free Tier (7-Day Trial)
- **Price:** $0
- **Duration:** 7 days from signup
- **Features:**
  - 1 ad account
  - Generate up to 3 reports
  - Access to dashboard
  - No credit card required
- **Limitations:**
  - Cannot schedule reports
  - No PDF export
  - No team members

#### Starter Tier
- **Price:** $79/month or $69/month (annual - save $120/year)
- **Features:**
  - 1 ad account
  - Unlimited Account Overview reports
  - PDF export
  - Weekly scheduled reports
  - Email support
- **Target:** Freelancers, small brands

#### Growth Tier ⭐ (Most Popular)
- **Price:** $149/month or $129/month (annual - save $240/year)
- **Features:**
  - Up to 5 ad accounts
  - Unlimited Account Overview + Creative Analysis reports (when available)
  - PDF export
  - Daily scheduled reports
  - Up to 3 team members
  - Priority email support
- **Target:** Small agencies, growing brands

#### Agency Tier
- **Price:** $299/month or $249/month (annual - save $600/year)
- **Features:**
  - Up to 15 ad accounts
  - All report types
  - Unlimited report generation
  - Hourly scheduled reports
  - White-label reports (custom branding)
  - Unlimited team members
  - Slack/priority support
  - Dedicated onboarding call
- **Target:** Agencies managing multiple clients

### Payment Implementation
- **Provider:** Stripe
- **Billing:** Monthly or annual (annual shows "Save $XX" badge)
- **Trial:** 7 days, no credit card required for free tier
- **Upgrade flow:** Prompt to upgrade when hitting limits
- **Downgrade:** Allowed, takes effect at end of current billing period

---

## Design System

### Design Principles (Based on Atria Reference)

1. **Clean & Minimal**
   - Generous white space
   - Card-based layouts
   - Clear visual hierarchy

2. **Data-Forward**
   - Charts and visualizations prominent
   - Color-coded status indicators
   - Trend lines (sparklines) for quick insights

3. **Modular**
   - Each section is self-contained
   - Scannable layout
   - Progressive disclosure (expand/collapse)

4. **Actionable**
   - Clear CTAs
   - Contextual help (tooltips, info icons)
   - Next steps always visible

### Color Palette

**Primary:**
- Brand: `#FF6B35` (Orange - for CTAs, active states)
- Dark: `#1A1A1A` (Sidebar, headers)

**Status Colors:**
- Success/Good: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Danger/Bad: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

**Neutrals:**
- Gray 50: `#F9FAFB`
- Gray 100: `#F3F4F6`
- Gray 200: `#E5E7EB`
- Gray 300: `#D1D5DB`
- Gray 600: `#4B5563`
- Gray 900: `#111827`

**Chart Colors:**
- Line 1: `#3B82F6` (Blue)
- Line 2: `#10B981` (Green)
- Bar 1: `#8B5CF6` (Purple)
- Bar 2: `#06B6D4` (Cyan)

### Typography

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Scale:**
- H1: 28px, 600 weight
- H2: 20px, 600 weight
- H3: 16px, 600 weight
- Body: 14px, 400 weight
- Small: 12px, 400 weight

### Components

#### Metric Card
```
┌────────────────────────┐
│ Spend (i)              │
│ $1,507.33              │
│ [sparkline chart]      │
│ ↓ -34.36%              │
└────────────────────────┘
```
- Title with info icon (hover for explanation)
- Large value
- Trend visualization
- Change indicator with color

#### Status Badge
```
✓ Within target (green)
⚠️ Below target (yellow/amber)
🔴 Critical (red)
```

#### Funnel Visualization
- Horizontal flow (left to right)
- Each stage: Icon/label, count, conversion %
- Connecting arrows with conversion rate
- Color-coded based on benchmark comparison

#### Insight Card
```
┌────────────────────────────────────┐
│ 💡 Insight                         │
│ ─────────────────────────────────  │
│ [Insight text with context]        │
│                                    │
│ Recommended actions:               │
│ • Action 1                         │
│ • Action 2                         │
└────────────────────────────────────┘
```
- Light background (gray-50)
- Border accent (left side)
- Icon for type (💡, ⚠️, 🎯)

### Responsive Design
- Desktop-first (primary use case)
- Tablet: 2-column layout
- Mobile: Single column, stacked cards
- Dashboard sidebar collapses to hamburger on mobile

---

## Development Checklist

### Phase 1: Setup & Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure Prisma with PostgreSQL
- [ ] Set up authentication (Clerk or Supabase)
- [ ] Create database schema and run migrations
- [ ] Seed benchmark data
- [ ] Set up environment variables (.env.local)
- [ ] Configure ESLint and Prettier

### Phase 2: Authentication & Onboarding
- [ ] Build sign-up/login pages
- [ ] Implement OAuth flow (social auth)
- [ ] Create onboarding flow UI:
  - [ ] Step 1: Business context form
  - [ ] Step 2: Product economics form
  - [ ] Step 3: Meta Ads OAuth connection
- [ ] Save onboarding data to database
- [ ] Calculate profitability metrics (break-even CPA, target ROAS)
- [ ] Redirect to dashboard after completion

### Phase 3: Meta Ads API Integration
- [ ] Set up Meta App in Meta Developer Portal
- [ ] Implement OAuth flow for Meta Ads
- [ ] Store access tokens (encrypted)
- [ ] Build API proxy endpoints:
  - [ ] GET /api/meta/accounts
  - [ ] GET /api/meta/insights
  - [ ] POST /api/meta/refresh-token
- [ ] Test data fetching from Meta API
- [ ] Implement token refresh logic
- [ ] Create background job for token refresh (runs weekly)

### Phase 4: Dashboard
- [ ] Build dashboard layout (sidebar + main content)
- [ ] Implement account selector dropdown
- [ ] Implement date range selector
- [ ] Build Funnel Health Visualization:
  - [ ] Fetch funnel data from Meta API
  - [ ] Calculate conversion rates
  - [ ] Compare to benchmarks
  - [ ] Identify weakest stage (rule-based)
  - [ ] Render visual funnel with colors
  - [ ] Display "Primary Concern" card
- [ ] Build Quick Metrics Cards:
  - [ ] Spend, Revenue, ROAS, CPA, Purchases
  - [ ] Sparkline charts (last 7 days)
  - [ ] Status indicators for ROAS/CPA
- [ ] Build Report Cards section
- [ ] Build Recent Reports list

### Phase 5: Account Overview Report
- [ ] Create report generation API endpoint:
  - [ ] POST /api/reports/generate
  - [ ] Fetch data from Meta API based on date range
  - [ ] Run rule-based calculations
  - [ ] Call OpenAI API for insights
  - [ ] Store report in database (with data snapshot)
- [ ] Build report UI:
  - [ ] Section 1: Overall Metrics + Profitability Status
  - [ ] Section 2: Funnel Health Analysis
  - [ ] Section 3: Ad Set Performance
  - [ ] Section 4: Creative Performance
  - [ ] Section 5: Conversion Benchmarks
- [ ] Add educational tooltips (info icons)
- [ ] Implement PDF export (react-pdf or Puppeteer)
- [ ] Add "Back to Dashboard" navigation

### Phase 6: Scheduled Reports
- [ ] Build scheduled reports UI:
  - [ ] Modal for creating schedule
  - [ ] Form fields (frequency, day/time, recipients, format)
  - [ ] Scheduled reports management page
- [ ] Create API endpoints:
  - [ ] POST /api/scheduled-reports (create)
  - [ ] GET /api/scheduled-reports (list)
  - [ ] PUT /api/scheduled-reports/:id (edit)
  - [ ] DELETE /api/scheduled-reports/:id (delete)
- [ ] Implement email delivery:
  - [ ] Set up Resend or SendGrid
  - [ ] Create email template
  - [ ] Build email sending function
- [ ] Set up cron job (Vercel Cron or Inngest):
  - [ ] Runs every hour
  - [ ] Checks for due reports
  - [ ] Generates reports
  - [ ] Sends emails
  - [ ] Logs deliveries
- [ ] Test scheduled report flow end-to-end

### Phase 7: Settings & Account Management
- [ ] Build Settings page:
  - [ ] Update business info form
  - [ ] Recalculate profitability targets on save
  - [ ] Manage connected ad accounts (add, remove)
  - [ ] Team members (for Growth/Agency tiers)
  - [ ] Billing (Stripe integration)
- [ ] Implement Stripe:
  - [ ] Create Stripe products/prices for each tier
  - [ ] Build checkout flow
  - [ ] Implement webhooks (subscription.created, updated, deleted)
  - [ ] Show current plan + usage
  - [ ] Upgrade/downgrade flows
  - [ ] Cancel subscription flow

### Phase 8: Intelligence Layer
- [ ] Implement rule-based functions:
  - [ ] Benchmark comparison
  - [ ] Profitability calculation
  - [ ] Funnel breakpoint detection
  - [ ] Creative performance classification
  - [ ] Anomaly detection
- [ ] Implement LLM integration:
  - [ ] OpenAI API setup
  - [ ] Prompt engineering (system + user prompts)
  - [ ] Response parsing
  - [ ] Error handling
  - [ ] Cost tracking/monitoring
- [ ] Combine rule-based + LLM outputs
- [ ] Cache insights (don't regenerate on each view)

### Phase 9: Polish & Testing
- [ ] Add loading states (skeletons)
- [ ] Add error states (error boundaries, fallbacks)
- [ ] Implement toast notifications (success, error)
- [ ] Add first-time user onboarding tooltips
- [ ] Test all flows:
  - [ ] Sign up → Onboarding → Dashboard
  - [ ] Generate report (multiple date ranges)
  - [ ] Schedule report
  - [ ] Receive scheduled email
  - [ ] Export PDF
  - [ ] Upgrade/downgrade subscription
- [ ] Mobile responsive testing
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] SEO optimization (meta tags, sitemap)

### Phase 10: Deployment
- [ ] Set up production database (Supabase/Railway/Neon)
- [ ] Configure production environment variables
- [ ] Deploy to Vercel
- [ ] Set up custom domain (if applicable)
- [ ] Configure DNS
- [ ] Test production deployment
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (Plausible or Posthog)

### Phase 11: Beta Launch
- [ ] Create landing page (optional for MVP)
- [ ] Invite 5-10 beta users
- [ ] Collect feedback
- [ ] Iterate on issues
- [ ] Monitor performance and errors
- [ ] Track key metrics:
  - [ ] User signups
  - [ ] Reports generated
  - [ ] Scheduled reports sent
  - [ ] Upgrade rate (free → paid)

### Post-MVP Features
- [ ] Creative Analysis report (placeholder → functional)
- [ ] Google Ads integration
- [ ] TikTok Ads integration
- [ ] White-label reports (Agency tier)
- [ ] Custom benchmark uploads
- [ ] API access for enterprise
- [ ] Slack integration for alerts
- [ ] Team collaboration features (comments, annotations)

---

## Success Metrics

### Product Metrics
- **Activation Rate:** % of signups who complete onboarding
- **Report Generation Rate:** % of users who generate at least 1 report
- **Engagement:** Reports generated per user per week
- **Retention:** % of users who return weekly
- **Scheduled Reports:** % of users who set up at least 1 schedule

### Business Metrics
- **Trial → Paid Conversion:** % of free tier users who upgrade
- **MRR Growth:** Month-over-month recurring revenue
- **Churn Rate:** % of subscriptions cancelled per month
- **Customer LTV:** Average lifetime value of paid users
- **CAC Payback Period:** Months to recover acquisition cost

### Technical Metrics
- **Report Generation Time:** < 5 seconds average
- **API Uptime:** > 99.5%
- **Error Rate:** < 1% of API calls
- **Email Delivery Rate:** > 98%

---

## Additional Notes

### Future Considerations

1. **Multi-Currency Support:** If targeting international markets
2. **Custom Reporting:** Let users build custom reports (drag-and-drop)
3. **Alerting System:** Notify users when metrics drop below thresholds
4. **Competitive Benchmarking:** Compare against anonymized peer data
5. **Integrations:** Shopify, GA4, Klaviyo for deeper e-commerce insights
6. **Mobile App:** Native iOS/Android apps for on-the-go reporting

### Security Considerations
- Encrypt all access tokens at rest
- Use HTTPS everywhere
- Implement rate limiting on API endpoints
- Regular security audits
- GDPR/CCPA compliance (data deletion, export)
- PCI compliance for payment handling (via Stripe)

### Performance Optimizations
- Cache Meta API responses (15-minute TTL)
- Use Redis for session storage
- Implement CDN for static assets
- Lazy load heavy components
- Optimize database queries (indexes, query planning)
- Use Vercel Edge Functions for critical paths

---

## Contact & Branding

### Product Name
**Recommendation:** FunnelIQ, AdPulse, ConversionScope, MetricMind, or similar
- Should convey: Intelligence, Clarity, Action-oriented
- Check domain availability (.com, .io)

### Support
- Email: support@[domain].com
- Documentation: docs.[domain].com
- Status page: status.[domain].com (via Statuspage.io)

---

## Files & Structure

### Recommended Project Structure
```
/reportingtool
├── /src
│   ├── /app
│   │   ├── /api
│   │   │   ├── /auth
│   │   │   ├── /meta
│   │   │   ├── /reports
│   │   │   ├── /scheduled-reports
│   │   │   └── /webhooks
│   │   ├── /dashboard
│   │   ├── /onboarding
│   │   ├── /reports
│   │   ├── /settings
│   │   └── layout.tsx
│   ├── /components
│   │   ├── /ui (shadcn components)
│   │   ├── /dashboard
│   │   ├── /reports
│   │   └── /shared
│   ├── /lib
│   │   ├── /meta-api
│   │   ├── /openai
│   │   ├── /intelligence
│   │   ├── /db (Prisma client)
│   │   └── /utils
│   └── /types
├── /prisma
│   ├── schema.prisma
│   └── /migrations
├── /public
├── .env.local
├── next.config.js
├── package.json
└── README.md
```

---

## Reference Files

### HTML Report Template
Use the existing HTML structure from `grove_vine_report.html` and `gv102025.html` as the foundation for report styling. The clean, table-based layout with color-coded status indicators is already proven effective.

### Design Reference
Atria dashboard screenshot shows:
- Left sidebar navigation (dark background)
- Metric cards with sparklines
- Bar chart breakdowns
- Creative thumbnails in grid
- Orange accent color for CTAs
- Clean, spacious layout

Adopt similar visual patterns for consistency and professional feel.

---

**END OF SPECIFICATION**

This document contains everything needed to build the MVP. Hand this off to a development agent or use it as a comprehensive guide for implementation. Adjust as needed based on technical constraints or user feedback during beta.
