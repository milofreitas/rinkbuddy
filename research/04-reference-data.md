# 04 — Building RinkBuddy's labeled reference library

*Research date: 2026-09-19. Question: how do we get a high-quality, legally clean, labeled library of skating skills — fast and cheap — when today the AI has no labeled reference data and "searching for a couple of videos" didn't work?*

## Bottom line

1. **There is no public dataset we can legally ship a commercial product on.** Every good figure-skating dataset is either research-only (FS-Jump3D, AMASS), has no license (FineFS, MCFS, FSD-10, SkatingVerse, which legally means "all rights reserved"), or is built from ISU broadcast footage we don't hold rights to. **No public dataset covers Learn to Skate basics or hockey skating skills at all.** Use these datasets only for internal benchmarking and architecture choices, and email the authors for commercial terms.
2. **Stock footage is close to useless.** Pexels and Pixabay both ban scraping and bulk copying for ML, Pixabay's license bans ML training outright, and the clips are cinematic "people skating" b-roll, not labeled skills.
3. **YouTube and broadcast footage is a legal liability,** both as training data and as few-shot references sent to an LLM. Don't do it.
4. **The fastest clean path is to film it ourselves:** paid shot-list sessions with coaches and adult skaters on freestyle ice, plus a consent-first correction flywheel inside the app. About **$6–9k over 90 days** gets roughly 4,000 labeled clips.
5. **Don't expect "few-shot clips in the prompt" to carry accuracy.** A 2026 benchmark (VideoNet) that includes 40 figure-skating actions found VLMs barely learn from in-context video examples: Gemini 3.1 Pro got **4.8 points worse** with 1–3 examples. Humans improved 13.6 points. Use the library mainly for **(a) an evaluation set, (b) written rubrics, and (c) a pose-based classifier or retrieval layer.** That is where labeled clips pay off.

---

## 1. Existing labeled datasets

| Dataset | What it is | Labels | License / commercial? | Where |
|---|---|---|---|---|
| **FS-Jump3D** (2024) | 4 skaters × 6 jumps × ~10 attempts + combos = **253 clips**, 12 synced cameras, 60 fps, 86-keypoint markerless 3D mocap | Fine-grained temporal segments (entry / takeoff / air / landing), jump type + rotations | **CC BY-NC-SA 4.0: NO commercial use** | github.com/ryota-skating/FS-Jump3D (Google Drive: C3D 0.3 GB, JSON 0.5 GB, video 8.8 GB) |
| **FineFS** | **1,167** competition programs, RGB + skeleton | Scores, coarse→fine element categories, start/end times | **No license file = all rights reserved.** Broadcast-derived | github.com/yanliji/FineFS-dataset (46 GB, Baidu/Google Drive) |
| **MCFS-130** | 271 clips, 17.3 h, **130 fine-grained classes**, OpenPose 25-joint skeletons | Frame-level temporal segmentation | **No license stated.** Broadcast-derived | shenglanliu.github.io/mcfs-dataset (Baidu) |
| **FSD-10** | 1,484 clips, 10 jump/spin classes, from 2017–18 championships | Clip-level class; skeletons | No dataset license (the blog text is CC BY 4.0 CN; that is not a data grant) | shenglanliu.github.io/fsd10 |
| **SkatingVerse** | 1,687 competition videos, 184 h, 28.6k sequences, 11 classes | Recognition / segmentation / AQA | No license found; broadcast-derived | via the IET CV paper and challenge |
| **YourSkatingCoach** | **454** practice clips of **one 9-year-old skater**, 6 jumps | Takeoff/landing frames (BIOES), AlphaPose skeletons | The *paper* is CC BY 4.0; data availability is unclear. A single minor skater = consent risk | arXiv 2410.20427 |
| **VIP-HARPET** (hockey) | ~424 three-frame sequences | forward / backward / pass / shoot only | Unclear | uwaterloo VIP lab |
| **HockeyAI, hockey MOT sets** | Broadcast object detection / tracking | Players, puck, boxes | Varies | — |

**Verdict:** none of these is "download and ship." They are still worth using:
- **FS-Jump3D** is the best research asset for jump phase timing. Use it internally to prototype takeoff/landing detection, and **email the Nagoya authors for a commercial license**. Academic groups often grant one for a fee or a collaboration.
- **MCFS and FineFS** show the right label taxonomy and frame-level format to copy.
- **Gap:** zero datasets cover Basic 1–6 skills (swizzles, snowplow, edges, three-turns) or hockey skating (hockey stops, tight turns, crossovers). Those are RinkBuddy's core users, so **RinkBuddy's own data is the moat, not a stopgap.**

## 2. Stock footage (Pexels, Pixabay, Videezy, Vecteezy)

- **Pixabay:** the license prohibits using content "to train machine learning models" and prohibits scraping for ML. **Excluded.**
- **Pexels:** automated collection is "strictly prohibited for all unauthorised purposes," and "bulk, large-scale or systematic copying" needs explicit permission. The API terms bar using it to build ML datasets. Using a handful of manually downloaded clips is a grey zone. Recognizable-person restrictions also apply.
- **Videezy / Vecteezy:** mixed free and "pro" licenses with attribution requirements. Neither grants ML training rights explicitly. Treat as excluded unless you get written permission.
- **Practical yield:** the "11,000+ Pexels results" are mostly slow-motion public-session and lifestyle b-roll. Clips showing a complete, identifiable test skill, with feet visible, from a usable angle, will be a small fraction. That is an estimate; verify it with a one-hour audit before relying on it. Useful at most as **negative / "no skill" background examples** in an internal eval, never as training data.

## 3. YouTube and competition broadcast footage

- **YouTube ToS** prohibits downloading except through YouTube's own features, and prohibits scraping. Active 2025–26 class actions (Nvidia, Apple, Amazon) are testing AI training on scraped YouTube video. Fair use for commercial model training is unsettled, and a startup can't afford to be the test case.
- **ISU / Olympic / NHL broadcasts:** media rights are sold exclusively. The ISU's media accreditation terms restrict non-rights-holders, and NHL and IOC footage is tightly licensed. There is **no cheap licensing path.**
- **Few-shot references carry the same risk.** Storing a copyrighted clip and sending it to Gemini or Claude with every request is reproduction and distribution. It is not safer than training.
- **What is safe:** watching public footage to **write text descriptions** of cues (facts and technique aren't copyrightable), and **licensing directly from creators.** Many coaches run YouTube tutorial channels. A $200–500 written license per coach, for their existing element demos, is cheap and clean.
- **How peers did it:** OOFSkate built its reference data through elite-athlete relationships and a formal **U.S. Figure Skating partnership** (Dec 2025, including a National Team benchmark library), not scraping. Its privacy policy says it trains on "anonymized video and skeletal data" from users. Hudl, SwingVision and Carv all train on **their own users' footage** under ToS/privacy consent. **That is the industry pattern.**

## 4. Partnership and paid-capture routes (cheapest, highest quality)

| Route | Cost | Notes |
|---|---|---|
| **Coach-led shot-list sessions** on freestyle ice | Ice $10–25/h per skater (some rinks $16/h); coach $50–120/h; adult skater stipend $30–50/session | **Best route.** One coach runs 3–5 skaters through a shot list. That's roughly 60–120 usable clips per hour, or **~$1.50–3 per raw clip.** |
| **Adult skater groups** (adult FB groups, r/FigureSkating, adult hockey leagues) | $20–40 per contributor + a free Pro year | Adults 18+ avoid COPPA entirely. **Start here.** |
| **Learn to Skate USA program directors** | Free Pro for the program + revenue share | One director reaches 50–300 families. Needs parental releases (see §5). Good for kid-body-size diversity in months 2–3. |
| **College club teams** (figure and club hockey) | Donation to the club, $300–500/session | Strong skaters, adults, consent is easy, and they cover doubles and hockey skills. |
| **Coach labeling bounties** | $0.50–1.00 per verified label, or $25–40/h | PSA- or USA Hockey-credentialed coaches verify skill ID and quality. Two coaches per contested label. |
| **Prolific / Upwork / Fiverr** | Prolific $12/h recommended + 42.8% corporate fee | Poor fit: skaters are too rare in the panels. Use them only for "record your public-session skating" at low tiers, or for non-expert QA. |
| **USFS / USA Hockey data partnership** | Negotiated | OOFSkate already holds the USFS AI partnership. **USA Hockey's ADM skill progressions have no AI partner that we found.** Pitch USA Hockey once the prototype works (month 3). |

## 5. Product-led data flywheel, consent and COPPA

**Flywheel:** every detection shows "Was this a **Lutz**? ✓ / ✗ → pick the right skill." Coach accounts get a "verify" queue: a coach-verified label counts as gold, and a user-only label counts as silver. Track disagreement by class, and route low-confidence clips to coaches for bounties. This mirrors how SwingVision and Hudl turn usage into training data.

**Legal checklist:**
- **COPPA (amended rule; compliance deadline 22 Apr 2026, already in force):** disclosing a child's data to third parties "to train or otherwise develop AI" is *not integral* to the service and needs **separate verifiable parental consent.** "Gait patterns" and faceprints are now personal information. **A written data-retention policy is mandatory, and indefinite retention of children's data is banned.** Penalties are up to $53,088 per violation. The FTC didn't clearly exempt first-party training, so **treat it as requiring separate consent.**
- **Under-13 accounts:** training use **off by default.** A separate opt-in checkbox for the parent, distinct from the ToS acceptance. Never send minors' raw video to a third-party model provider for training. Check that the vendor's API terms don't retain or train on it.
- **13–17:** parental consent (OOFSkate's model: under 13 not allowed, 13–17 need parental consent).
- **Everyone:** a training opt-in toggle, deletion on request, and a path to **store skeletons plus face-blurred video** for training. Keep raw video on a short retention window.
- **State biometric laws** (Illinois BIPA, Texas CUBI, Washington): avoid face templates entirely and document that pose keypoints are not used for identification.
- **In-person shoots:** a signed release per skater (a parent for minors) granting "use of video and derived pose data to train and evaluate RinkBuddy's AI, perpetual, commercial." Follow **SafeSport/MAAPP** and rink photography rules for minors: a parent or coach present, no one-on-one filming.
- **Privacy-policy language to adapt:** Hudl says it "may use User Content… to train, tune, evaluate, and improve" its AI "subject to any privacy choices… or opt-out mechanisms." OOFSkate says "We use anonymized video and skeletal data to train and refine our… models," and "Anonymized data may be stored indefinitely."

## 6. Labeling tooling and schema

- **Tools:** **CVAT** (MIT, self-host, strong video and keypoint tracks) or **Label Studio** (Apache-2.0, has a video timeline-segmentation template and is the easiest to customize). **Start with Label Studio.** V7 and Roboflow are paid and oriented to object detection, and they add little for temporal action labels. Pre-annotate with RTMPose/MediaPipe skeletons and auto-proposed segments so labelers only adjust the boundaries.
- **Schema, one row per skill segment:**
```json
{ "clip_id": "...", "skater_id": "anon-042", "age_band": "18+", "discipline": "figure|hockey|lts",
  "skill_id": "FS.JUMP.LZ", "rotations": 1, "direction": "CCW", "foot": "L",
  "t_start": 3.21, "t_takeoff": 4.02, "t_landing": 4.48, "t_end": 5.10,
  "outcome": "clean|two_foot|fall|underrotated|wrong_edge|popped",
  "quality": 1-5, "test_level_pass": true,
  "camera": {"angle": "side|diag45|end", "height_m": 1.2, "dist_m": 8, "fps": 60, "orientation": "landscape"},
  "labeler": "coach-017", "verified_by": "coach-022", "consent_ref": "REL-2026-0113" }
```
  Spins use `t_entry`/`t_centered`/`t_exit` plus revolutions and position. Each skill ID mirrors SKILL_RESEARCH.md (for example `LTS.B4.FWD_XOVER_CCW`, `HKY.STOP.2FOOT`).
- **How many examples:**
  - **(a) Vision-LLM prompting:** 1–3 gold clips per skill *may* help, and may hurt: Gemini dropped 4.8 points with in-context video in VideoNet. Better: **20–30 labeled clips per skill as a held-out eval set**, plus a written cue rubric per skill (the takeoff-first rules already in SKATING_AI_RESEARCH.md). Measure prompt changes against the eval set.
  - **(b) Skeleton classifier:** one-shot metric learning reaches ~87% on distinct exercises, but fine-grained pairs need more. FS-Jump3D's 253 clips gave F1@50 ≈ 89 for jump type and 78 once rotation count was added. FSD-10's ~1,500 clips yield 80–90%. **Plan for 50 per class minimum and 150+ for confusable pairs** (flip/Lutz, loop/toe loop, three-turn/Mohawk, T-stop/hockey stop), across **≥10 different skaters.** Skater diversity matters more than repetitions.

## 7. Synthetic data

- **FS-Jump3D** is the only skating mocap set, and it is NC-licensed; ask for a commercial license. **AMASS** is non-commercial and explicitly bars training commercial networks (commercial license via ps-licensing@tue.mpg.de). **SMPL** bodies can be licensed commercially through Meshcapade.
- **Worth doing (cheap):** skeleton augmentation. Mirror left↔right (a CCW Lutz becomes a CW Lutz, which doubles clockwise skaters), apply time-warp ±20%, add 2D rotation and viewpoint projection from 3D lifts, add joint jitter and dropout, and simulate partial occlusion by the boards.
- **Not worth it before month 3:** rendered synthetic skaters. The domain gap in blade/ice contact, which is exactly the signal that separates edges, is too large.

---

## 30/60/90-day data plan

### Shot list and capture protocol
- **Phone at 60 fps landscape, tripod at the boards ~1.2 m high.** Three angles per skill: **side-on (perpendicular to travel), 45° diagonal, end-on.** Plus a fixed 20% of **handheld parent-style** clips, because that's what real users upload.
- Distances of 5–15 m. Mix public-session crowds with empty freestyle ice.
- Capture **fails deliberately:** two-foot landings, falls, wrong edge, under-rotation, and swizzles that aren't quite swizzles. Negatives are as valuable as positives.

| Phase | Skills | Target |
|---|---|---|
| **Days 0–30** (adults only) | 20 highest-volume skills: Basic 1–6 core (fwd/bwd swizzles, 1-foot glides, snowplow, fwd/bwd crossovers both directions, FO/FI/BO/BI edges, FO three-turn, 2-foot spin, 1-foot upright spin, T-stop, hockey stop both sides, bunny hop, spiral) + hockey stops/crossovers | 3 angles × ≥8 skaters → **~40 clips/skill ≈ 800 clips**. Gold eval set of 20/skill locked. Label Studio live. |
| **Days 31–60** | + waltz jump, 6 single jumps, sit/camel/scratch spins, backspin, Mohawk, FI three-turn, backward stroking; hockey tight turns, transitions, backward C-cuts | **~1,500 more clips**, incl. 150+ for flip/Lutz/loop/toe loop. Coach bounty verification. Train the first skeleton classifier; in-app ✓/✗ corrections ship with consent UI. |
| **Days 61–90** | Minors via 2–3 LTS programs (signed parental releases), doubles from college clubs, hockey via an adult league | **~1,500–2,000 clips** + flywheel data. Retrain; publish per-skill accuracy; pitch USA Hockey and the FS-Jump3D authors. |

### Budget (estimate)
| Item | 90-day cost |
|---|---|
| Ice time (≈24 sessions × 4–5 skaters × $15–25) | $1,500–2,500 |
| Coach session fees (24 × ~$90) | ~$2,200 |
| Skater stipends (adults / club donations) | $1,200–2,000 |
| Coach label verification (~4,000 labels × $0.50) | ~$2,000 |
| Creator footage licenses (3–4 coaches) | $800–1,500 |
| Tooling (Label Studio/CVAT self-hosted) + storage | ~$100 |
| Privacy-counsel review of release + COPPA flow | $1,000–2,500 (one-time) |
| **Total** | **≈ $6–9k (+ legal)** → **~4,000 labeled clips at ~$1.50–2.25 each** |

### Consent and legal checklist (before the first shoot)
- [ ] Written release (adult / parent-for-minor): video + derived pose data, AI training and eval, commercial, perpetual, revocable for future use
- [ ] Rink permission + club photography / SafeSport (MAAPP) compliance; parent or coach present for minors
- [ ] Privacy policy: explicit AI-training clause + opt-out; separate VPC for under-13s; no third-party training disclosure of kids' data
- [ ] Written data-retention schedule (COPPA); raw video TTL; skeleton + face-blur pipeline
- [ ] Vendor check: the LLM API doesn't retain or train on uploaded clips (zero-retention settings)
- [ ] No Pixabay / Pexels-bulk / YouTube / broadcast footage in any training or prompt set; log provenance (`consent_ref`) per clip
- [ ] Commercial-license emails to FS-Jump3D (Nagoya), FineFS, and MCFS authors

## Sources
- FS-Jump3D repo (CC BY-NC-SA 4.0): https://github.com/ryota-skating/FS-Jump3D · paper: https://arxiv.org/html/2408.16638v1
- FineFS: https://github.com/yanliji/FineFS-dataset · MMFS: https://arxiv.org/pdf/2307.02730
- MCFS: https://shenglanliu.github.io/mcfs-dataset/ · FSD-10: https://shenglanliu.github.io/fsd10/index.html, https://arxiv.org/abs/2002.03312
- SkatingVerse: https://digital-library.theiet.org/doi/full/10.1049/cvi2.12287 · https://arxiv.org/pdf/2405.17188
- YourSkatingCoach: https://arxiv.org/html/2410.20427v2
- VIP-HARPET: https://vip.uwaterloo.ca/vip-harpet-dataset/ · HockeyAI: https://dl.acm.org/doi/10.1145/3712676.3718335
- VideoNet (VLM few-shot results): https://arxiv.org/html/2605.02834
- One-shot skeleton AR: https://openaccess.thecvf.com/content/CVPR2023W/CVSports/papers/Deyzel_One-Shot_Skeleton-Based_Action_Recognition_on_Strength_and_Conditioning_Exercises_CVPRW_2023_paper.pdf
- Pexels terms: https://www.pexels.com/terms-of-service/ · Pixabay license: https://pixabay.com/service/license-summary/, https://pixabay.com/service/terms/
- YouTube scraping suits: https://news.bloomberglaw.com/ip-law/nvidia-faces-class-action-over-scraping-youtube-to-train-ai · https://appleinsider.com/articles/26/04/06/apple-may-have-scraped-youtube-videos-without-permission-for-ai-training
- ISU media accreditation: https://www.isu.org/media-accreditation
- USFS × OOFSkate: https://usfigureskating.org/news/2025/12/2/press-releases-us-figure-skating-partners-with-oofskate-to-bring-ai-powered-jump-metrics-to-athletes-nationwide.aspx · OOFSkate privacy: https://oofskate.com/privacy
- Hudl privacy: https://www.hudl.com/privacy · SwingVision: https://swing.vision/privacy-policy · Carv: https://getcarv.com/legal/privacy
- COPPA amendments: https://www.dataprotectionreport.com/2025/06/ftcs-coppa-rule-changes-include-ai-training-consent-requirement/ · https://www.loeb.com/en/insights/publications/2025/05/childrens-online-privacy-in-2025-the-amended-coppa-rule
- AMASS license: https://amass.is.tue.mpg.de/license.html · SMPL: https://smpl.is.tue.mpg.de/modellicense.html
- Prolific pricing: https://www.prolific.com/pricing · https://researcher-help.prolific.com/en/articles/445266-how-much-should-i-pay-participants
- Freestyle ice pricing: https://www.kcicecenter.com/page/show/290364-figure-skating · https://adultsskatetoo.com/blogs/adults-skate-too/the-real-cost-of-adult-figure-skating-what-youll-actually-spend-and-how-to-skate-smart
