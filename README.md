# Ghost Rate

**Know before you apply.**

Ghost Rate is a community-powered platform that rates company hiring processes — not jobs, not culture, specifically the candidate experience. Did they acknowledge your application? Did they ghost you? Did the rejection include real feedback? Now you can know before you apply.

## What it does

- Search any company and see its hiring process score
- Leave structured reviews based on your real hiring experience
- Scores unlock after 5 approved reviews to prevent sparse or manipulated data
- Reviews are automatically moderated by Claude AI before going public
- LinkedIn sign-in required — no anonymous spam

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| State | Redux Toolkit, RTK Query |
| UI | Material UI v5 |
| Backend | Supabase (Postgres, Auth, RLS, Edge Functions) |
| Auth | LinkedIn OAuth via Supabase OIDC |
| Moderation | Claude Haiku (Anthropic API) via Supabase Edge Function |

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [LinkedIn Developer App](https://developer.linkedin.com) with OAuth 2.0 enabled
- An [Anthropic API key](https://console.anthropic.com)

### 1. Clone and install

```bash
git clone https://github.com/sbullocks/ghost-rate.git
cd ghost-rate
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database setup

Run the schema in your Supabase SQL editor:

```
supabase/schema.sql
```

### 4. Supabase secrets

Set the following in your Supabase project (Dashboard → Edge Functions → Secrets):

```
ANTHROPIC_API_KEY=your-anthropic-key
```

### 5. Deploy the Edge Function

```bash
npx supabase functions deploy moderate-review
```

In the Supabase dashboard go to **Edge Functions → moderate-review → Settings** and disable **Enforce JWT Verification** — the function handles auth manually.

### 6. LinkedIn OAuth

In your Supabase project go to **Authentication → Providers → LinkedIn (OIDC)** and add your LinkedIn app's Client ID and Secret. Add the following redirect URL in your LinkedIn app:

```
https://your-project.supabase.co/auth/v1/callback
```

### 7. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## How Reviews Work

1. Sign in with LinkedIn
2. Search for a company (or add one if it doesn't exist)
3. Complete the 3-step review form
4. Your review is automatically moderated by Claude AI
5. Approved reviews appear on the company profile immediately
6. Score summary (ghost rate, acknowledgment rate, etc.) unlocks after 5 approved reviews

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
