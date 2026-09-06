# পাশাপাশি

React + Vite shop with an admin panel. Products and orders live in Supabase so every customer and the admin see the same data. The frontend deploys to Vercel.

## Local setup

```bash
npm install
cp .env.example .env
```

Fill `.env` with your Supabase project URL and anon key, then:

```bash
npm run dev
```

## Supabase

Follow [supabase/README.md](supabase/README.md): create a project, run `supabase/schema.sql`, add one confirmed admin user, then copy the API keys.

## Vercel

1. Push this repo to GitHub.
2. Import the repo on [vercel.com](https://vercel.com). Framework: Vite. Build command: `npm run build`. Output: `dist`.
3. Add the same env vars as `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. `vercel.json` rewrites unknown paths to `index.html` so `/admin` and `/cart` work.

Admin login uses the email/password you created in Supabase Auth — not a hardcoded frontend password.
