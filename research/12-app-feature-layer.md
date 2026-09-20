# 12 — Product layer of photo/video skill-teaching apps (verified deep research, 2026-09-19)

**Read the verdict first: this run answered about one quarter of what was asked.**
5 angles → 21 sources → 104 claims → top 25 put to a 3-vote adversarial check →
**6 survived, 19 refuted, 0 unverified.** 103 agent calls.

"Refuted" means *failed the vote*, not *disproven*. Several killed claims are probably
true. They just cannot be cited as evidence, and should not be re-asserted from memory.

## What this does NOT answer

| Question section | Status |
|---|---|
| 1. Table-stakes feature checklist | Partial — only via one product's capture protocol |
| 2. UX teardown (overlays, side-by-side, keyframes, confidence states) | **Nothing survived** |
| 3. Retention & habit mechanics (streaks, digests, abandonment) | **Nothing survived** |
| 4. Photo-only / still-image pipelines | **Nothing survived** |

Zero claims survived on tennis/padel, ski, lifting, running gait, gymnastics, dance,
swimming, martial arts, PT, posture, skincare-progress or music practice. Four of the six
survivors describe a single product (Sportsbox 3DGolf); the other two are subscription
benchmark vendors. **This is a deep probe of one golf app plus category subscription math —
not the cross-sport survey requested.**

## Finding 1 — Leaders buy accuracy by constraining capture (HIGH, 3-0)

Sportsbox 3DGolf does not accept arbitrary footage. Its own help docs, verbatim:

- "The video must be taken from Face-On or Down-the-Line"
- "The entire body and club must be in the frame throughout the entire golf swing"
- "The video must be in SLOW MOTION, NOT regular speed" (120–240fps; Android min 120fps)
- "if any part of the swing is NOT in slow motion, our AI models will not detect it"

Normal-speed video is a **hard fail**, not a degraded result. These are statements against
vendor interest, which is why they verified 3-0. Down-the-Line is itself a degraded mode
(fewer metrics), so the real constraint is stricter than "two angles".

**Two boundaries that must travel with this finding:**
1. The fps gate is specific to *monocular 3D reconstruction of a fast rotational motion*.
   2D skeleton overlay on slower movement is routinely fine at 30–60fps — that is the regime
   RinkBuddy would actually occupy. Do **not** copy 120fps as a law. (This partly softens
   `research/07`'s framing: the gate is method-specific, not universal.)
2. The gate bites hardest on **camera-roll import** — iOS users report edited slo-mo failing
   import. That is exactly RinkBuddy's slo-mo import path.

The exact numerics in those docs (tripod ≤3.5ft, camera ≤12ft) were themselves refuted 0-3.
Treat "hard framing constraints exist" as solid; treat the specific numbers as unreliable.

## Finding 2 — The five pillars a leader sells (MEDIUM, 2-1, vendor marketing)

App Store listing, verbatim headings: **measure body metrics** ("Go beyond slow-motion
video"), **compare against elite reference ranges**, **measurable practice goals**,
**progress over time**, **coach/lesson continuity**. 4.9★ / ~3.6K ratings.

Pillar 5 maps directly onto the adult-learners-between-lessons beachhead in `research/05`.
This is evidence of *what the marketing says*, not that the metrics are accurate.

Counter-signal worth keeping: an independent reviewer (coursereviewandjournal.com,
2024-07-26) warns that for less experienced players "incorrect readings could cause them to
chase issues that do not exist." RinkBuddy's users are unsupervised adult learners — this is
a direct argument for **keeping the confirm/correct interaction** rather than presenting AI
output as authoritative.

## Finding 3 — Price anchor, with a large caveat (MEDIUM, 2-1)

Sportsbox, US App Store, accessed 2026-09-19: free install; consumer **$15.99/mo or
$109.99/yr** (~43% annual discount); coach **$79.99/mo or $799.99/yr**. Free tier is real —
5 sessions/month, 1 goal, 2D/3D comparison, **drawing tools** — so the paywall gates volume
and depth, not first value.

Caveat: this is a premium markerless-3D, coach-sold outlier and a **poor comp** for a
self-serve adult-learner app. The claims that would have given the realistic consumer band
(OnForm's $9.99–$14.99 individual tier; SwingVision's ladder) **both failed verification**.
The consumer price band for this category is currently unevidenced.

Most transferable detail: a leader gives **comparison and annotation away free**. Weak
evidence that these are table stakes, not premium.

## Finding 4 — Conversion math (MEDIUM, 2-1, vendor SDK data)

Adapty (2026-03-27, 16,000+ apps): Health & Fitness **weekly-with-trial** funnel =
9.5% install→trial, 42.2% trial→paid, 67.7% first renewal ≈ **4% of installs pay via that
path**. RevenueCat (75,000 apps) independently puts H&F trial→paid median at **39.9%**.
Two unaffiliated platforms converging on ~40% is meaningful.

**Do not model an annual paywall with these numbers** — no comparable annual funnel is
published, and annual is 61% of H&F revenue and growing.

## Finding 5 — Plan duration is the biggest retention lever (MEDIUM, 2-1)

RevenueCat, State of Subscription Apps 2025: median 12-month retention **44.1% annual /
17.0% monthly / 3.4% weekly**. Both headline figures fell YoY. Monthly retention drops as
price rises (22.5% low → 12.2% high). **~30% of annual subscriptions are cancelled in the
first month.**

Interpretive trap: annual survives *one* renewal decision, monthly survives *twelve* — the
2.6× gap partly measures decision points plus self-selection, not loyalty. Migrating users
to annual does not multiply retention 2.6×. The month-one cliff is the corrective, and it is
the strongest argument that **the first 30 days, not the feature list, is what you sell.**

## Finding 6 — INFERENCE, not sourced (LOW)

Cheap / high perceived value: capture guidance (alignment box, angle prompt, countdown,
auto-trim), a metered free tier that still gives comparison + annotation away, annual-first
pricing with a first-30-days experience built to survive the month-one cliff.
Expensive / optional: markerless 3D and elite reference ranges — whose real price is a rigid
capture protocol plus accuracy-trust liability.

**The untested assumption underneath all of it:** Sportsbox's users stand on a driving range
with a tripod. Nothing here tests whether an adult learner filming alone on shared public ice
will tolerate *any* prescribed capture protocol. That is the load-bearing unknown.

## Open questions (all would need a fresh pass)

1. What screen-level UX reads as credible — and how do apps show WRONG/low-confidence AI
   output without losing trust? Target apps shipping **2D overlays**, not 3D reconstruction.
2. Does anything teach from **stills**? Zero evidence found. This is the most actionable
   unknown for avoiding a high-fps dependency.
3. Realistic consumer price band and paywall placement for a no-coach-in-the-loop app.
4. What empirically causes abandonment after the first few uploads.
5. Will unassisted adult learners at a public rink accept a capture protocol at all?

## Refuted — do not re-assert these without new sources

OnForm coach ladder ($19.99/$39.99/$59.99) 1-2 · OnForm free-learner model 0-3 · OnForm
individual $9.99–$14.99 0-3 · OnForm entry-tier table-stakes list 1-2 · Sportsbox v2.52.0
user-triggered AI highlights 0-3 · Sportsbox numeric framing constraints 0-3 · SwingVision
three-tier ladder 0-3 · all four PoseForge/arXiv UX + accuracy claims (ghost/onion-skin
rationale; 77% LLM coaching correctness; joint-ID 88–94% vs magnitude 74%; raw metric graphs
counterproductive) 1-2 / 0-3 · "insufficient usage" as #1 cancellation reason 0-3 · 82% of
trials start on install day 0-3 · hard paywall 12.11% vs freemium 2.18% 0-3 · trial length
17–32d converting 42.5% vs 25.5% 0-3 · 2026 annual-churn figures 1-2.

## Sources (21 fetched)

help.sportsbox.ai (6 pages) · apps.apple.com Sportsbox 3D Golf · apps.apple.com SwingVision ·
onform.com/pricing · onform.com skeleton-tracking blog · arxiv.org/html/2608.05971v1 ·
adapty.io H&F subscription benchmarks · revenuecat.com State of Subscription Apps 2025 ·
revenuecat.com 2026 trends · rocketshiphq.com RC summary · getcarv.com ski-iq-wasatch ·
sahha.ai health app churn · sensai.fit form-check apps 2026 · golftrainingdaily.com ·
visualeyesapp.com · usnews.com fitness apps motivation (2025-10-24) ·
nature.com s41598-025-32708-1 · pmc.ncbi.nlm.nih.gov PMC10818695 · PMC8437936 ·
apps.apple.com Body Tracker Photo Journey · fastpitchlane.softballsuccess.com
