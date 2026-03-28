# RinkBuddy Session Notes — March 28, 2026

## Architecture

- **Frontend:** GitHub Pages at `www.rinkbuddy.com` — serves static `index.html` (single-file PWA)
- **Backend:** Railway at `rinkbuddy-production.up.railway.app` — runs `serve.js` (auth, sync, AI analysis, Stripe)
- **DNS:** GoDaddy manages `rinkbuddy.com` domain, A records + CNAME point to GitHub Pages
- **Repo:** `github.com/milofreitas/rinkbuddy` (public) — both GitHub Pages and Railway deploy from `main`

## Key Files

- `index.html` — entire frontend app (HTML, CSS, JS in one file, ~4800 lines)
- `serve.js` — Node.js backend (~737 lines): auth, Google OAuth, Stripe, AI video analysis via Anthropic API, cloud sync
- `package.json` — has `start` script for Railway
- `CNAME` — contains `www.rinkbuddy.com` for GitHub Pages custom domain
- `accounts/` — user account JSON files (server-side, on Railway volume)

## How API Routing Works

`CloudAccount.apiBase` in `index.html` auto-detects the environment:
- On `localhost` / `127.0.0.1` → empty string (relative URLs hit local `serve.js`)
- On production → `https://rinkbuddy-production.up.railway.app`

All `fetch('/api/...')` calls use `CloudAccount.apiBase + '/api/...'`. There are ~10 endpoints:
- `/api/login`, `/api/signup`, `/api/google-auth` — auth
- `/api/sync` (POST=push, PUT=pull) — cloud data sync
- `/api/analyze-video` — AI video analysis (Anthropic Claude Vision)
- `/api/create-checkout-session`, `/api/create-portal-session`, `/api/cancel`, `/api/check-subscription` — Stripe
- `/api/feedback` — user feedback

## CORS

`serve.js` allows origins: `https://www.rinkbuddy.com`, `https://rinkbuddy.com`, `http://localhost:8080`, `https://localhost:8443`

## AI Video Analysis

- Extracts frames at 1fps (max 60), 960px width, JPEG 0.85 quality
- Sends frames in batches of 10 with 2-frame overlap for motion continuity
- Three discipline-specific visual guides in `serve.js`: `FOUNDATIONS_VISUAL_GUIDE`, `FIGURE_VISUAL_GUIDE`, `HOCKEY_VISUAL_GUIDE`
- Guide selected based on user's discipline setting
- `max_tokens: 8192`, timeout 180s
- Deduplication keeps highest-confidence detection per skill

## Google Sign-In

- Client ID: `1057539314090-ajkmj1mrhgnf90qchqb5cshddq3689q0.apps.googleusercontent.com`
- Backend decodes Google JWT, creates/logs-in account using email as username
- Needs `https://www.rinkbuddy.com` added as authorized JavaScript origin in Google Cloud Console for production

## Landing Page Structure (in index.html)

Sections in order: Hero, Stats row, "Built for Every Skater" (3 persona cards), "Core Skills Every Skater Needs" (6 skill cards), "How It Works", "What Makes RinkBuddy Different", Testimonials, Pricing, Feedback form, Signup/Login form, Download CTA, Footer.

- `.lp-features` class uses `repeat(auto-fit, minmax(240px, 1fr))` for responsive grids
- `.lp-skills-grid` class uses `repeat(auto-fit, minmax(200px, 1fr))`

## Pending / TODO

1. **Google Cloud Console** — add `https://www.rinkbuddy.com` as authorized JS origin for Google Sign-In to work on production
2. **Railway env vars** — ensure `ANTHROPIC_API_KEY` is set in Railway Variables tab
3. **Enforce HTTPS on GitHub Pages** — check the box in GitHub Pages settings once cert is provisioned
4. **Railway custom domains cleanup** — `rinkbuddy.com` and `www.rinkbuddy.com` are added to Railway but show "Waiting for DNS update". These aren't needed since frontend uses the `.up.railway.app` URL. Consider removing them to avoid confusion.
5. **AI feedback loop** — planned improvement: store user corrections to AI detections and use them to improve future prompts (roadmap item from previous session)
6. **Manual annotation toolbar** — was removed from video section; only AI Scan button + speed control remain

## Recent Commits (latest first)

- `d63417b` — Connect frontend to Railway backend for auth and API
- `3783f20` — Fix mobile stacking for landing page grid sections
- Earlier commits: radar chart responsive fix, frame extraction improvements, visual guides, domain setup, etc.
