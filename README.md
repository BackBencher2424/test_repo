# Tableau Dashboard Site

A static website that embeds one or more Tableau dashboards. It has no build step, so it deploys to Vercel as-is.

## 1. Add your dashboard

Open `config.js` and replace the `url` with your dashboard's share link:

- **Tableau Public:** open the viz → Share → copy the link (`https://public.tableau.com/views/...`)
- **Tableau Cloud / Server:** open the view → Share → copy the link

To show several dashboards as tabs, add more `{ name, url }` entries.

> Tableau Cloud/Server dashboards ask viewers to sign in to Tableau unless you set up Connected Apps or the dashboard is public. Tableau Public dashboards work for everyone.

## 2. Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## 3. Deploy to Vercel

**Option A: GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new, import the repo, and keep the defaults (Framework: *Other*, no build command).
3. Click **Deploy**. Each push to the repo redeploys the site.

**Option B: Vercel CLI**
```sh
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```
