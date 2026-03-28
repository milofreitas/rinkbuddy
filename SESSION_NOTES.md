# RinkBuddy Session Notes — March 28, 2026

## Architecture

- **Frontend:** GitHub Pages at `www.rinkbuddy.com` — serves static `index.html` (single-file PWA)
- **Backend:** Railway at `rinkbuddy-production.up.railway.app` — runs `serve.js` (auth, sync, AI analysis, Stripe)
- **DNS:** GoDaddy manages `rinkbuddy.com` domain, A records + CNAME point to GitHub Pages
- **Repo:** `github.com/milofreitas/rinkbuddy` (public) — both GitHub Pages and Railway deploy from `main`

## Key Files

- `index.html` — entire frontend app (HTML, CSS, JS in one file, ~4800 lines)
- `serve.js` — Node.js backend (~737 lines): auth, Google OAuth, Stripe, AI video analysis via Anthropic API, cloud sync
- `package.json` — has `start` script for Railway, `stripe` dependency added
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
Implemented via `ALLOWED_ORIGINS` array, `getCorsOrigin(req)` helper, and `res._corsOrigin` set at top of `handleAPI()`.

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

## What Was Done This Session

### 1. Fixed mobile stacking on landing page
- "Built for Every Skater" section: removed inline `grid-template-columns:repeat(3,1fr)` so `.lp-features` responsive CSS handles it
- "Core Skills Every Skater Needs" section: replaced inline grid with `.lp-skills-grid` class
- Both sections now stack to single column on mobile

### 2. Connected frontend to Railway backend
- Added `CloudAccount.apiBase` for environment-aware API routing
- Updated all 10+ `fetch('/api/...')` calls to use the base URL
- Added CORS whitelist in `serve.js` for rinkbuddy.com origins
- Added `"start": "node serve.js"` to package.json for Railway
- Added `stripe` as a dependency in package.json

### 3. Verified everything works
- Login and signup tested on local dev server — both succeed
- `CloudAccount.apiBase` returns empty string on localhost, Railway URL on production
- Mobile layout verified via preview — both grid sections stack correctly

## Pending / TODO

1. **Google Cloud Console** — add `https://www.rinkbuddy.com` as authorized JS origin for Google Sign-In to work on production
2. **Railway env vars** — ensure `ANTHROPIC_API_KEY` is set in Railway Variables tab
3. **Enforce HTTPS on GitHub Pages** — check the box in GitHub Pages settings once cert is provisioned
4. **Railway custom domains cleanup** — `rinkbuddy.com` and `www.rinkbuddy.com` are added to Railway but show "Waiting for DNS update". These aren't needed since frontend uses the `.up.railway.app` URL directly. Consider removing them.
5. **AI feedback loop** — planned improvement: store user corrections to AI detections and use them to improve future prompts
6. **Manual annotation toolbar** — was removed from video section; only AI Scan button + speed control remain

## Recent Commits (latest first)

- `029b7d1` — Add session notes and update launch config
- `d63417b` — Connect frontend to Railway backend for auth and API
- `3783f20` — Fix mobile stacking for landing page grid sections
- Earlier: radar chart responsive fix, frame extraction improvements, visual guides, domain setup, etc.

## How to Continue

To pick up where this left off:
- **On desktop:** `cd ~/Documents/Claude/ice-skate && claude` — read this file for context
- **On phone/web:** Go to claude.ai/code, clone `milofreitas/rinkbuddy`, reference `SESSION_NOTES.md`
- **Remote control:** Run `claude /remote-control` on desktop, scan QR with Claude app on phone
