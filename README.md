# SecureChat AI 🔐✦

A production-oriented AI chatbot built with **Next.js 15 App Router**, **Auth0**, **Gemini**, optional **Auth0 FGA**, and optional **Supabase + Resend**.

## What is included

- Beautiful responsive landing page
- Auth0 login/logout
- Secure AI chat using Gemini
- RAG over authorized documents
- Public/private documents
- Optional Auth0 FGA for fine-grained sharing
- Local JSON document storage for easy development
- Supabase REST storage for persistent production data
- Contact form + Resend email API
- `/api/health` deployment health check
- SEO metadata, robots and sitemap
- Vercel-ready configuration
- `.env.local.example`
- GitHub-ready `.gitignore`

> **Important:** Never commit `.env.local`, API keys, Auth0 secrets, Gemini keys, Supabase service-role keys, or Resend keys.

---

# 1. Requirements

Install:

- Node.js 20+ (Node 22 is also fine)
- npm
- Git
- A Google Gemini API key
- An Auth0 account

Optional for production:

- Supabase account
- Resend account
- Auth0 FGA account

---

# 2. Run locally

Open PowerShell/Terminal inside this project:

```bash
npm install
```

Create the environment file:

```powershell
Copy-Item .env.local.example .env.local
```

Then edit `.env.local`.

At minimum:

```env
APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

AUTH0_SECRET=YOUR_LONG_RANDOM_SECRET
AUTH0_DOMAIN=YOUR_TENANT.us.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET

GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GEMINI_KEY
GEMINI_MODEL=gemini-2.5-flash
```

Generate a secret if OpenSSL is available:

```bash
openssl rand -hex 32
```

Then start:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful pages:

- `/` — landing page
- `/auth/login` — Auth0 login
- `/chat` — AI chat
- `/documents` — knowledge base
- `/contact` — contact form
- `/api/health` — health check

---

# 3. Auth0 setup

In Auth0 create a **Regular Web Application**.

Use these URLs for local development:

### Allowed Callback URLs

```text
http://localhost:3000/auth/callback
```

### Allowed Logout URLs

```text
http://localhost:3000
```

### Allowed Web Origins

```text
http://localhost:3000
```

Copy the Auth0 domain, client ID and client secret into `.env.local`.

---

# 4. Gemini setup

Create a Gemini API key and put it in:

```env
GOOGLE_GENERATIVE_AI_API_KEY=...
```

The default model is:

```env
GEMINI_MODEL=gemini-2.5-flash
```

You can change the model through the environment variable without changing application code.

---

# 5. Documents: local development

If Supabase variables are empty, the project automatically uses:

```text
data/documents.json
```

The file is ignored by Git.

This is convenient for local testing.

**Do not use local JSON storage as your production database on Vercel**, because serverless deployments do not provide durable writable local storage.

---

# 6. Production document storage with Supabase

Create a Supabase project and run this SQL in the SQL Editor:

```sql
create table if not exists public.documents (
  id text primary key,
  name text not null,
  content text not null,
  "ownerId" text not null,
  "isPublic" boolean not null default false,
  "createdAt" timestamptz not null default now()
);

alter table public.documents enable row level security;
```

The application uses the Supabase **service role** from the server only. Never expose this key as a `NEXT_PUBLIC_` variable.

Set:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

The server will automatically use Supabase when both variables exist.

---

# 7. Auth0 FGA (optional)

The project works without FGA.

Without FGA:

- public documents are visible
- your own private documents are visible
- other users' private documents are not visible

With FGA configured, shared document permissions can be checked before RAG context is created.

Add:

```env
FGA_STORE_ID=...
FGA_CLIENT_ID=...
FGA_CLIENT_SECRET=...
FGA_API_URL=https://api.us1.fga.dev
FGA_API_AUDIENCE=https://api.us1.fga.dev/
```

Your FGA authorization model must define the `owner`, `viewer`, and `can_view` relationships used by the application.

---

# 8. Contact email

The contact form sends email through Resend.

Create a Resend API key and configure:

```env
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=SecureChat AI <onboarding@resend.dev>
```

For a custom domain, verify the domain in Resend and use a sender such as:

```env
CONTACT_FROM_EMAIL=SecureChat AI <hello@yourdomain.com>
```

The API route is:

```text
POST /api/contact
```

It validates the name, email and message server-side.

---

# 9. Test before deployment

Run:

```bash
npm run typecheck
npm run build
npm run start
```

Then open:

```text
http://localhost:3000
```

Check:

1. Landing page opens without login.
2. Login works.
3. `/chat` is protected.
4. Gemini sends a response.
5. `/documents` allows a document to be saved.
6. A public document appears for the logged-in user.
7. `/api/health` returns JSON.
8. `/contact` validates and sends an email after Resend is configured.
9. Logout returns to the home page.

---

# 10. Push to GitHub

Inside the project folder:

```bash
git init
git add .
git commit -m "Initial SecureChat AI project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/securechat-ai.git
git push -u origin main
```

Before pushing, make sure:

```text
.env.local
```

is not staged.

Check:

```bash
git status
```

---

# 11. Deploy to Vercel

1. Open Vercel.
2. Sign in with GitHub.
3. Click **Add New → Project**.
4. Select your `securechat-ai` repository.
5. Framework should be detected as **Next.js**.
6. Add all production environment variables.
7. Deploy.

For the first deployment use your Vercel URL:

```text
https://your-project.vercel.app
```

Then update Auth0:

### Allowed Callback URLs

```text
https://your-project.vercel.app/auth/callback
```

### Allowed Logout URLs

```text
https://your-project.vercel.app
```

### Allowed Web Origins

```text
https://your-project.vercel.app
```

Also set:

```env
APP_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Redeploy after changing environment variables.

---

# 12. Production checklist

Use:

- Auth0 secrets only in Vercel Environment Variables
- Gemini key only server-side
- Supabase service-role key only server-side
- Resend key only server-side
- HTTPS production URL
- Supabase for persistent documents
- FGA if you need document sharing
- Resend with a verified sending domain for real email delivery

Never put secret values in:

- React client components
- `NEXT_PUBLIC_*` variables
- GitHub
- screenshots
- README files

---

## Architecture

```text
Browser
   │
   ▼
Next.js 15
   │
   ├── Auth0 ──────────── Login / Session
   │
   ├── /api/chat
   │       ├── Authorized RAG
   │       └── Gemini
   │
   ├── /api/documents
   │       ├── Supabase (production)
   │       └── JSON (local fallback)
   │
   ├── Auth0 FGA (optional)
   │
   └── /api/contact
           └── Resend
```

## Project structure

```text
src/
  app/
    api/
      chat/
      contact/
      documents/
      health/
    auth/[auth0]/
    chat/
    contact/
    documents/
    globals.css
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    Navbar.tsx
  lib/
    auth0.ts
    db.ts
    fga.ts
    rag.ts
    site.ts
  middleware.ts

data/
  documents.json   # created automatically for local storage
```

## Notes

Auth0 v4 mounts `/auth/login`, `/auth/callback` and `/auth/logout` through the SDK middleware, so this project does not create a duplicate `/auth/[auth0]` route.

The project is intentionally designed so that optional services fail clearly instead of silently breaking:

- no Gemini key → chat returns a configuration error
- no Resend configuration → contact form explains what is missing
- no Supabase → local JSON is used for development
- no FGA → owner/public authorization still works
