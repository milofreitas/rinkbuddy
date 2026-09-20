# RinkBuddy — START HERE (updated 2026-09-19)

Read this, then `research/README.md` (8 research reports + converging plan).

## Live state (verified 2026-09-19)
- Site www.rinkbuddy.com (GitHub Pages, repo milofreitas/rinkbuddy, deploys from `main`)
- Backend rinkbuddy-production.up.railway.app (Railway, `railway` CLI logged in + linked in this folder)
- Accounts on Railway volume `/app/accounts` (survive redeploys). Stripe LIVE, $9.99/mo price + webhook OK. 0 subscribers.
- Never push without Milo's OK.

## App (as of commit 95f137d)
- Nav reduced to **Home / Skills / Video**. Training, Sessions, Compete, Coach hidden (code kept).
- Video hub: "What are you practicing?" pre-tag → record/upload → `+ Tag Skill` (manual) or AI Scan → suggestions "Was this a X?" ✓/✎/✕.
  Tags = `video.annotations[]` {time, element, quality, source manual|ai, status confirmed|suggested, aiSkillId (AI's original label when corrected), logId}.
  Confirmed tags count toward skill progress once (countTag/uncountTag). Rejected AI suggestions → `video.aiRejections`. These are future training labels.
- Fake Math.random "auto-analysis" removed. Fabricated landing testimonials removed.
- Capture: camera requests 60 fps; imported MP4/MOV true fps read from container (`readVideoFps`), Slo-mo clips play at 0.25x, frame-step uses real fps.
- AI: `/api/analyze-video` requires login token; model `claude-opus-5` via @anthropic-ai/sdk. STILL samples 1 fps (known weakness — see research/03).

## Footage & in-chat scanning (added 2026-09-19)
- `tools/clips.py` turns footage into numbered timestamped contact sheets Claude reads IN CHAT — no API, no per-scan cost. `list` / `sheets <clip>` / `burst <clip> <t>`.
- `bash tools/ingest.sh` moves clips from Downloads/Desktop into `footage/` and probes them.
- `labels/*.json` = hand-built ground truth (schema in labels/README.md). Batch 1 = 8 clips labeled.
- `FILMING-GUIDE.md` = what batch 1 taught us (framing, clothing, shot list). Keep it updated after every batch.
- Batch 1 yield: ~3 s of labelable skill from ~8 min of footage. Two clean forward-swizzle sequences in IMG_1791.

## Decisions
- 2026-09-19: target BOTH kids (parents pay) and teens. The demand-test page gets a parent variant and a teen variant, same product, same $59/yr founding pre-order. Adults stay a secondary audience. Rationale in research/08 (video self-modelling works best ~ages 9-17; under-13 needs COPPA consent; parents spend ~$1,016/child/yr).
- 2026-09-19: clips of Milo in clips/ are committed to the PUBLIC repo (he approved). sessions/ is gitignored.

## Next up (from research)
1. Phone checks by Milo: camera shows 60 fps? Imported iPhone Slo-Mo shows "Slo-mo 240 fps" (if 30 → Photos picker is transcoding).
2. AI v1: motion-peak bursts at 12–15 fps + skater crop + cached guide + "unsure" output (research/03 §v1). Cuts cost ~$0.75–1.30 → ~$0.25–0.45/min.
3. Milo's own rink footage (2026-09-19 onward) → locked eval set + first labels (research/04 shot list).
4. Demand tests: landing page repositioned "feedback between lessons" for adult learners; $59/yr founding pre-order (research/05).
5. Native 120 fps capture module (research/07), later.

## Known loose ends
- Railway service `function-bun` looks unused.
- APPSTORE_LISTING.md has an unverified "designed with input from…" claim — reword before submitting.
- Custom timeline label can show previous video's time until playback starts (minor).

---

## Older notes (March 2026)
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
