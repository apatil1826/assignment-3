# NexMap — Networking Tracker (Assignment 3: Full Stack)

Extending Assignment 2's NexMap with: Clerk auth, Supabase database, and Abstract API for company enrichment. Anyone can sign up and use the app. Data persists across sessions.

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Clerk** — authentication (sign up, log in, sign out)
- **Supabase** — persistent database, scoped to logged-in user
- **Abstract API (Company Enrichment)** — returns company name, industry, country, description, logo given a domain

## What's New in Assignment 3
- All data now persists in Supabase (replaces in-memory React Context)
- Users must be signed in to use the app (Clerk)
- When a contact is added with a company domain, Abstract API enriches it with industry, country, description, and logo
- Each user only sees their own contacts and interactions

---

## Pages & Routes (unchanged from A2, now with real data)

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Stats, recent interactions, follow-up nudges |
| `/contacts` | Contacts List | All contacts with company logo, last interaction |
| `/contacts/[id]` | Contact Profile | Details, enriched company info, interaction timeline |
| `/log` | Log Interaction | Quick-entry form: contact, date, type, notes, next steps |
| `/network` | Network Map | SVG node graph of connections |

---

## Data Model (Supabase Tables)

```sql
-- contacts table
create table contacts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,           -- Clerk user ID
  name text not null,
  email text,
  linkedin text,
  company text,
  company_domain text,             -- e.g. "stripe.com" — used for Abstract API enrichment
  role text,
  tags text[],
  -- Abstract API enriched fields (populated on save)
  company_industry text,
  company_country text,
  company_description text,
  company_logo_url text,
  created_at timestamptz default now()
);

-- interactions table
create table interactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,           -- Clerk user ID
  contact_id uuid references contacts(id) on delete cascade,
  date date not null,
  type text not null,              -- coffee | email | linkedin | event | call | other
  notes text,
  next_steps text,
  created_at timestamptz default now()
);
```

### Row Level Security (RLS)
Enable RLS on both tables. Users can only read/write their own rows:
```sql
-- Enable RLS
alter table contacts enable row level security;
alter table interactions enable row level security;

-- Contacts policy
create policy "Users can manage their own contacts"
on contacts for all
using (user_id = requesting_user_id());

-- Interactions policy
create policy "Users can manage their own interactions"
on interactions for all
using (user_id = requesting_user_id());
```

---

## External API

### Abstract API — Company Enrichment
- Endpoint: `GET https://companyenrichment.abstractapi.com/v1/?api_key={KEY}&domain={domain}`
- Example: `?api_key=YOUR_KEY&domain=stripe.com`
- Returns: `{ name, domain, country, industry, description, logo }`
- API key from abstractapi.com (free, 100 requests/month)
- Call this from a **Next.js API route** (`/api/enrich-company`) — never from the browser (hides the API key)
- Store all returned fields in Supabase when a contact is created — don't re-fetch on every page load
- Display on the contact profile: logo, industry pill, country, description

---

## Environment Variables (.env.local)

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Abstract API
ABSTRACT_API_KEY=
```

All of these must also be added to Vercel environment variables before deploying.

---

## Auth Flow
- Wrap the app in Clerk's `<ClerkProvider>`
- Add `authMiddleware` to protect all routes except `/sign-in` and `/sign-up`
- Use `auth()` from Clerk in server components to get `userId`
- Pass `userId` as `user_id` when inserting into Supabase
- All Supabase queries filter by `user_id` to scope data per user

---

## Component Structure

```
app/
  layout.tsx                  # ClerkProvider + Sidebar
  page.tsx                    # Dashboard
  contacts/
    page.tsx                  # Contacts list
    [id]/page.tsx             # Contact profile
  log/page.tsx                # Log interaction form
  network/page.tsx            # Network map
  sign-in/[[...sign-in]]/page.tsx
  sign-up/[[...sign-up]]/page.tsx

components/
  Sidebar.tsx
  ContactCard.tsx             # Shows Clearbit logo
  InteractionItem.tsx
  StatCard.tsx
  NetworkGraph.tsx
  CompanyLogo.tsx             # Clearbit <img> with initials fallback

lib/
  supabase.ts                 # Supabase client
```

---

## Build Order
1. Set up Clerk (auth middleware, sign-in/sign-up pages, protect routes)
2. Set up Supabase (create tables with RLS, connect client)
3. Connect Clerk + Supabase (Clerk dashboard → Supabase integration)
4. Replace AppContext with Supabase queries (contacts + interactions)
5. Build Apollo API route + wire into contact creation form
6. Add Clearbit logos to ContactCard and Contact Profile
7. Deploy to Vercel with all env vars

## Style
Clean & minimal — white backgrounds, light gray cards, slate typography, indigo accent. Unchanged from Assignment 2.

## Supabase MCP
Configure with: `claude mcp add --transport http supabase https://mcp.supabase.com/mcp`
Use MCP to create tables, enable RLS, and verify data after interactions are saved.