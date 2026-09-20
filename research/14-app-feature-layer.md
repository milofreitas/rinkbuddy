# 14 — Product layer of photo/video skill-teaching apps (verified deep research, 2026-09-19/20)

Three adversarially-verified passes. Every claim below survived a 3-vote refutation attempt;
votes are shown. **"Refuted" means failed the vote, not disproven** — several killed claims
are probably true but cannot be cited, and must not be re-asserted from memory.

| Pass | Claims verified | Survived | Killed |
|---|---|---|---|
| 1 — broad cross-sport scan | 25 of 104 | **6** | 19 |
| 2 — atomic claims, primary sources only | 25 of 115 | **17** → 14 merged findings | 8 |
| 3 — streaks only, academic indexes | 25 of 150 | **21** → 16 merged findings | 4 |

Pass 1 failed because claims were **compound** (a correct price table with an inference
bolted on died as one unit) and leaned on affiliate blogs. Pass 2 demanded one fact per
claim tied to one primary source, and tripled the survival rate. Pass 3 kept that rule and
aimed at PubMed/PMC, JMIR, NBER, ACM DL and OSF instead of the open web — **84% survival.**
**Use both rules again: atomic claims, and go where the evidence actually lives.**

## Answered / not answered

| Section | Status |
|---|---|
| A. Screen-level UX for showing performance | **Answered** |
| D. Consumer price band | **Answered** (2 of 3 target apps) |
| B. Still-image / photo-only pipelines | Barely — one tool, manual |
| C. Streaks specifically | **Answered** (pass 3) |
| C. Attrition, digests, notifications, human coach review | **Zero evidence, three passes** |

---

## A. The category's screen vocabulary

**Pose/skeleton overlay** — OnForm ships a 2D AI skeleton that tracks key points, moves with
the athlete, and shows a joint's angle on tap with an inside/outside toggle (3-0, KB art.116,
corroborated by the shipping App Store build v4.6.3). Works offline, no lag, per vendor.
No primary source states which tier gates it.

**Side-by-side** — documented on OnForm iOS *and* Android, and it is the *only* comparison
feature in myDartfish Express. It is the lowest-common-denominator comparison in the whole
category (3-0 ×3). OnForm's own Android launch post concedes advanced features were cut for
Android — **but side-by-side made the cut**. That is the tell.

**Superimposition** — exists as a feature distinct from side-by-side in three independent
products: OnForm Overlay, Kinovea Superposition, Dartfish Simulcam (3-0 ×3). Correction to
the brief's own vocabulary: **no vendor uses "ghost" or "onion skin"**, none ships an opacity
slider, and none ships a before/after slider. Kinovea's opacity is fixed at 50%.

### The constraint that decides this for RinkBuddy (3-0)

Kinovea conditions Superposition on both clips being *"filmed in the same environment with a
static camera."* Dartfish support: *"If the backgrounds can't be matched then Simulcam cannot
be used."* The counter-claim — that Dartfish auto-corrects pan/tilt/zoom and so removes the
tripod requirement — was **refuted 0-3**; the vendor publishes no accuracy figure or failure
condition for it.

> Your users film handheld on shared public ice. **No verified source supports shipping a
> ghost-overlay comparison for them. Side-by-side has no such documented precondition.**

**Telestration** — the complete kit (freehand, line/curve/polyline/rectangle/circle, angle
tool, goniometer, angle-to-horizontal/vertical, markers, seven arrow variants, stopwatch,
counter, grid, spotlight, magnifier, text, stickers) sits inside **Kinovea, which charges
nothing at all** — *"No licenses, no subscriptions, no limits."* (3-0). Strongest available
signal that **drawing and angle tools are table stakes, not premium.** Caveat: Kinovea is a
Windows desktop .exe, so it sets the expectation without proving what those tools cost on a
phone.

### Two failure modes from published reviews

- **Wrong AI output, quantified.** SwingVision, 2★, 2025-08-30: spin labelled *"flat"* for
  every shot, and 8 of 28 third-shot drops attributed to the reviewer were actually his
  partner's (~29% misattribution within that labelled set). Authoritative for that date only
  (3-0). **Important negative: the companion claim that users then demand a confirm/correct
  feature was refuted 0-3** — users hit wrong output, but demand for a correction step is
  *not* evidenced.
- **Scrub/draw mode collision — directly relevant to a control you already ship.** OnForm 2★,
  2022-03-24: *"if your finger lets off the flywheel for just a moment, the flywheel
  disengages, the drawing button engages... I keep having to 'recapture' the flywheel."*
  OnForm's developer response: *"That's good feedback. We'll look to improve that
  experience."* (3-0). Vendor-acknowledged. **Do not cite as OnForm's current UX** (2022,
  now v4.6.3); cite as proof the trap is real in frame-step + annotate controls.

## B. Still images — essentially unanswered

Only survivor: **Kinovea's Kinogram** — composites multiple frames of a clip into one still,
sampled at intervals *or at events such as maximum extension of a joint* (3-0, shipped 2023.1,
enhanced 2024.1). **But the docs never claim it DETECTS maximum extension** — alignment is
manual (ALT+scroll per cell). So this is *not* evidence that auto-keyframe selection is cheap
or solved. Its transferable value: **a montage can be derived from a clip you already have,
needing no new capture protocol.**

Nothing survived on progress-photo apps, posture assessment (PostureScreen/PostureCo),
still-image goniometry, dermatology analogues, or single-key-position sports stills. **No
published comparison of still-image vs video for teaching a movement correction was verified
in either pass.** The "stills are cheaper than high-fps video" hypothesis is untested.

## C. Streaks — answered by a third pass (PubMed/academic indexes)

The first two web passes returned nothing here. A third pass aimed at PubMed/PMC, JMIR,
NBER, ACM DL and OSF returned **21 of 25 claims surviving → 16 findings.** Web search simply
does not reach this literature.

### The decision-relevant result for a rink-dependent app

**Streaks deepen the already-engaged and are actively worse at activating the dormant.**
In the only large field RCT (N=60,000, Peru MoE maths platform, 6 weeks, *Economics of
Education Review* 109, Dec 2025; NBER WP 34173), streak-framed messaging moved the
*extensive* margin (getting a non-user to start at all) **+2.82pp vs +3.79pp for a plain
personalized reminder — significantly worse, p=0.00**, dose-matched at 2 messages/week.
Authors: streaks are *"most effective when the objective is to generate greater attachment
among individuals who are already engaged."* (3-0)

> RinkBuddy's problem right now is activation — 0 subscribers, users who upload a few clips
> and stop. **That is the exact job streaks are measurably worst at.**

**A daily cadence is structurally wrong for skating.** The single most transferable
observation in the corpus is one adult Duolingo interviewee whose real practice was
weekend-only: *"I can only use Duolingo on weekends, and the [daily] streak function is
completely unusable for me... The worst thing is when Duolingo wants to warn me on Monday
evenings that my [daily] streak will soon be lost... Maybe a weekly streak [would] be better."*
(Mogavi et al., ACM L@S 2022.) Adults skate 1–3×/week on shared rink ice. A daily streak
would **manufacture broken streaks** — and broken streaks are the harmful end:

- Surfacing a **broken** streak was worse than showing **no streak log at all** — 45.21% vs
  60.90% continued (χ²=7.46, p=.006, OR=0.53). *Medium confidence:* this exact contrast was
  run three times in the paper and reached significance once (Study 4 p=.178, Study 5 p=.055);
  direction was consistent, authors concede underpowered. (Silverman & Barasch, *J Consumer
  Research* 49(6):1095-1117, DOI 10.1093/jcr/ucac029, data at osf.io/kpjh9)
- In that paper's only **real-app field data** (980 adult employees, 30-day 7,000-steps
  challenge, synced tracker data), the **broken-streak penalty was ~4× the intact-streak
  bonus** — intact b=+0.25 vs broken b=−1.01. Correlational. (3-0)
- A **repair** mechanic recovers most but not all: 93.14% intact / 85.20% repairable-broken /
  68.66% plain broken (preregistered, N=601; a verifier re-downloaded the OSF data and
  reproduced every figure). **Mismatch to flag:** the tested repair was *free and retroactive*;
  Duolingo's purchasable pre-emptive freeze was never tested anywhere. (3-0)

### What the evidence does NOT say

**No study measured long-run retention in a shipping adult consumer habit app.** (3-0,
structural across all 21 claims.) Every outcome is a one-shot in-session choice in a mock
app, goal attainment inside a bounded 30-day challenge, six weeks of schoolchildren's
platform logins, or retrospective self-report. The only retention measure is an unpublished
preprint (N=799, abstract-only, no effect size).

**The "Duolingo streaks cause dropout" paper does not support that.** Mogavi et al. 2022 is
the most-cited source for streak harm; verifier greps for effect size, control group,
randomi\*, regression, p<0., t-test, ANOVA, chi-square, odds ratio and CI returned **zero**
body-text hits. Its entire streak-loss-to-churn content is one second-hand forum quote:
*"My brother lost his 110-day streak, and now [he] is an abandoned account."* Interviewees
were selected on having experienced gamification misuse. **Do not cite it as evidence.** (3-0)

**The one direct test of streak-loss harm is a null.** The Peru RCT explicitly measured runs
of consecutive weeks without connecting and found the streak arm *reduced* them at every
length; *"We do not observe a discouragement effect from highlighting streaks."* Caveats that
matter: exploratory appendix analysis, no preregistration, children not adults, **weekly not
daily** streaks, and deliberately **non-punitive** loss messaging — so it does not test the
punitive daily-loss UX the hypothesis is actually about. (3-0, medium)

**A harm mechanism independent of loss:** adult run-streakers reported training through pain
to keep streaks alive — *"it was like a month of painful one-milers"*, *"I literally hurt all
the time"* (PLoS One 2026;21(5):e0317254, PMID 42172224, n=17 qualitative, non-app). Not
quantified. Cuts both ways for skating — rink-dependent practice makes a daily cadence far
less available than daily running.

### Still unevidenced after three passes

Zero surviving claims on: self-determination theory / overjustification **in fitness apps**,
gamification meta-analyses with pooled effect sizes, mHealth attrition curves (week 2 / 4 /
month 3), what distinguishes persisters from early dropouts, progress photos as an adherence
device, notification timing/fatigue RCTs, weekly digests — and **whether periodic human coach
contact beats a fully automated app**, which is the question with the largest cost
implication for the paid "Coach Check" idea in `research/06`. That one has now come back
empty three times. Note this is absence of *pass output*, not proof the literature is absent —
Deci/Koestner/Ryan 1999 and the attrition literature plainly exist.

### If a streak is built anyway

On this evidence: **weekly cadence, not daily** · non-punitive loss messaging · a repair or
freeze · and aim it at users who are already practising, never as an activation device.
The prior wiring — a *daily* streak fed by a session-logging screen — was the worst
available configuration for a sport gated on rink access.

## D. Consumer price band — now evidenced

| Product | Monthly | Quarterly | Yearly |
|---|---|---|---|
| OnForm Individual Standard | $9.99 | $26.99 | $99.99 |
| OnForm Individual Premium | $14.99 | $40.99 | $149.99 |
| OnForm Individual Basic | $0 — **conditional on being coach-linked** | | |
| GolfFix Advanced (only paid SKU) | $14.99 | — | $99.99 |
| SwingVision | **unverified** — tier list refuted 1-2 | | |

USD excl. tax, fetched 2026-09-19 (3-0; GolfFix 2-1). OnForm's monthly figures have **two
independent primary sources** (pricing page + Apple IAP list). Period mapping cross-checked
by arithmetic against the page's own "Save up to 10% / 17%" badges.

**Band: $9.99–$14.99/mo, $99.99–$149.99/yr.** RinkBuddy's $9.99/mo sits at the exact floor —
and has **no annual option**, against pass 1's 44.1% annual vs 17.0% monthly 12-month
retention and ~30% of annual subs cancelled in month one.

**Where the paywall line falls elsewhere:**
- Dartfish gates advanced comparison: Simulcam is in Pro (EUR 120/mo) and Pro S (EUR 180/mo),
  explicitly **excluded** from Mobile (from EUR 7/mo), 360, Live, Live S. No permanent free
  tier, 15-day trial only (3-0).
- GolfFix paywalls **capture frame rate itself** — "60 FPS video support" sits in Premium
  Features (2-1). Also device- and carrier-constrained outside the vendor's control, so a
  paying subscriber may still not get 60fps. One small vendor's packaging, **not a norm**.
- OnForm 2021 review shows a **volume cap** (10 videos) used as the lever and read as
  punitive. Caps are now 1,000 / 5,000 videos; tiers restructured 2026-04-06.

## Build implications — INFERENCE, not a research result

Offered as aiming, flagged so it can be discarded (medium confidence, synthesis across
findings 2/4/5/6/7/11):

**Cheap, high perceived value:** side-by-side two-clip comparison · drawing + angle
telestration · reliable frame-step scrubbing *without the mode collision* · kinogram-style
still montage exported from an existing clip · **an annual plan**.

**Expensive and optional:** pose-skeleton overlay with joint angles · ghost superimposition
(and unusable handheld anyway) · high-frame-rate capture as a load-bearing requirement.

Explicit limit: no primary source states which OnForm tier gates Skeleton Tracking or
Overlay, so "pose overlay = expensive/optional" rests on Dartfish/GolfFix gating patterns
plus its absence from the cheapest tiers examined. Not directly evidenced.

## Refuted — do not re-assert without new sources

**Pass 2:** GolfFix "Duuuuj" review re 03/26/2024 0-3 · GolfFix "Oldthinker" false-positive
05/2024 0-3 · SwingVision six-SKU IAP list 1-2 · SwingVision "Terrible Scoring" review 0-3 ·
SwingVision free-vs-paid feature split 0-3 · Dartfish auto pan/tilt/zoom correction 0-3 ·
Kinovea lacks pose estimation 0-3 · OnForm self-serve workflow review 1-2.

**Pass 1:** OnForm coach ladder 1-2 · OnForm free-learner model 0-3 · OnForm individual
$9.99–$14.99 0-3 *(later CONFIRMED 3-0 in pass 2 from the pricing page — pass 1's version
died on bolted-on inference, not on the numbers)* · Sportsbox numeric framing constraints
0-3 · SwingVision ladder 0-3 · all four PoseForge/arXiv UX+accuracy claims · "insufficient
usage" as #1 cancellation reason 0-3 · 82% of trials start on install day 0-3 · hard paywall
12.11% vs freemium 2.18% 0-3 · trial length 17–32d 42.5% vs 25.5% 0-3.

That OnForm entry is the clearest proof of the method point: **the same fact died as a
compound claim and survived as an atomic one.**

## Carried forward from pass 1 (still standing)

- Leaders constrain capture rather than accept arbitrary footage. Sportsbox hard-fails
  non-slow-motion video (3-0). **But that 120–240fps gate is specific to monocular 3D
  reconstruction of a fast rotational motion — it is NOT a law for 2D skating feedback at
  30–60fps.** This softens how `research/07` reads.
- ~30% of annual subscriptions cancelled in month one; 44.1% / 17.0% / 3.4% 12-month
  retention for annual / monthly / weekly (RevenueCat 2025). The first 30 days, not the
  feature list, is what an annual-first app sells.
- Untested assumption under everything: Sportsbox users stand on a range with a tripod.
  Nothing tests whether an adult learner alone on public ice tolerates *any* capture protocol.

## Sources — passes 2 and 3

support.onform.com art.116 / art.153 / art.180 · onform.com/pricing · onform.com blog
(Android launch, skeleton tracking) · apps.apple.com OnForm id1490334045 (+reviews) ·
play.google.com com.app.OnForm · kinovea.readthedocs.io (comparison, annotation, kinogram,
glossary) · kinovea.org (+0.9.5 manual, 2023.1 release notes, forum) · dartfish.com
/features/simulcam, /plans, /plans-motion · support.dartfish.tv blended comparison ·
apps.apple.com myDartfish Express id1040982427 · apps.apple.com SwingVision id989461317 ·
apps.apple.com GolfFix id1586120680 · notice.golffix.io (Android high-fps devices)

**Pass 3 (30 fetched, academic):** Silverman & Barasch, *J Consumer Research* 49(6):1095-1117,
DOI 10.1093/jcr/ucac029 (+ OSF data osf.io/kpjh9) · Aulagnon, Cristia, Cueto & Malamud,
*Economics of Education Review* 109 (Dec 2025), DOI 10.1016/j.econedurev.2025.102721 /
NBER WP 34173 / IPR WP-26-05 · Ingalls et al., *PLoS One* 2026;21(5):e0317254, PMID 42172224,
PMCID PMC13196939 · Mogavi et al., ACM Learning@Scale 2022:175-188, DOI 10.1145/3491140.3528274
(arXiv 2203.16175) · Hillegass, Silverman et al., SSRN 5939795 (preprint, not peer-reviewed).
