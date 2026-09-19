# 03: How to make RinkBuddy's skill recognition work (technical research)

*Researched 2026-09-19. The pipeline audited is `serve.js` `/api/analyze-video` (model `claude-opus-5`, frames at 1 fps, max 60, 960 px, batches of 10 with a 2-frame overlap, and a 5–6 KB visual guide per discipline).*

---

## 1. Bottom line

1. **The current design can't see jumps.** The limit is sampling, not the model. A jump is in the air for about 0.4–0.65 s. In broadcast data the average takeoff-to-landing is 16.25 frames at 25 fps, or 0.65 s ([Tanaka et al. 2024](https://arxiv.org/abs/2408.16638)). At 1 fps, a given jump has roughly a 40–65% chance of getting *any* airborne frame. The takeoff, which is the only thing that tells flip from lutz or toe loop from salchow, is almost never captured together with its lead-in. Prompt engineering can't recover frames that were never sent.
2. **Frontier vision LLMs used alone are the wrong tool for fine-grained movement.** Gemini 3.1 Pro scores 69.9% on multiple-choice domain-specific action recognition ([VideoNet, 2026](https://arxiv.org/abs/2605.02834)). On action *quality* assessment, which included figure skating, frontier VLMs perform "only marginally above random chance" and tend to say the execution was correct no matter what the video shows ([Can VLMs Judge Action Quality?, 2026](https://arxiv.org/abs/2604.08294)). LLMs are good at explaining a result and at coarse labels. They are poor at counting rotations or judging edges.
3. **The state of the art is pose first, then a temporal model.** Research systems detect and track the skater, estimate a 2D skeleton on every frame at 25–60 fps, and run temporal action segmentation on the skeleton sequence. They reach 84–89% F1@50 for jump/spin/step at set level, 79–92% F1@50 for jump type plus rotation count, and 92–96% top-1 on trimmed-clip classification (numbers in §4).
4. **Recommended path:** (v1, this month) keep Claude, but pick *where* to look with a cheap motion scan, send high-fps crops of the tracked skater, and start logging corrections as labels. (v2, 1–3 months) add a server pose pipeline that finds events and measures airtime and rotations; the LLM then classifies and explains. (v3, 3–9 months) train RinkBuddy's own segmentation model on its own labeled data, with on-device capture guidance.

---

## 2. Public datasets

| Dataset | Size and labels | Access / license | Useful for RinkBuddy? |
|---|---|---|---|
| **FSD-10** ([arXiv 2002.03312](https://arxiv.org/abs/2002.03312)) | 1,484 broadcast clips, 10 jump/spin classes, 30 fps | **No longer available** (per YourSkatingCoach authors) | No |
| **MCFS** | Skeleton-only segmentation of full programs | Public skeletons. Takeoff labels are off by about 57 frames on average, per the [YSC audit](https://arxiv.org/abs/2410.20427) | Weak |
| **MMFS** ([GitHub](https://github.com/dingyn-Reno/MMFS)) | 11,671 clips, 256 categories, RGB + HRNet skeleton + BV/GOE scores | Skeletons on Google Drive under **MIT**. RGB only by emailing the authors (copyright) | **Yes, for skeleton pretraining** (the license permits it) |
| **FineFS** ([GitHub](https://github.com/yanliji/FineFS-dataset)) | 1,167 programs (729 short, 438 free). Coarse-to-fine element labels, start/end times, scores. RGB (46 GB) + 2D/3D skeletons | Open download (Google/Baidu). **No license stated**, so commercial use is unclear | Research and benchmark use. Ask the authors before shipping |
| **SkatingVerse** ([challenge](https://arxiv.org/abs/2405.17188)) | 1,687 competition videos, 19,993 train / 8,586 test clips. 11 set-level classes (6 jumps, 4 spins, none), 28 fine classes by rotation | Site "under construction". Access by email | Benchmark only |
| **FS-Jump3D** ([GitHub](https://github.com/ryota-skating/FS-Jump3D)) | 253 jumps (4 skaters × 6 jump types × ~10 trials), 12 synced cameras, markerless mocap, 83 joints | Public (about 9.6 GB) under **CC BY-NC-SA 4.0**, so non-commercial only | Research only. Good for prototyping rotation and airtime measurement |
| **YourSkatingCoach** ([arXiv 2410.20427](https://arxiv.org/abs/2410.20427)) | 454 practice videos (Axel, loop, flip, lutz) of *one* 9-year-old skater, 1080p30, frame-level takeoff and landing labels | No public repo or license found | Closest match to RinkBuddy's footage (practice, phone-style), but not obtainable |
| **Fis-V / FS1000** ([Fis-V](https://arxiv.org/abs/1802.02774), [FSBench](https://arxiv.org/abs/2504.19514)) | 500 / ~1,250 full programs with TES/PCS scores, 25 fps | Research | No. Program-level scores, not skills |
| **Hockey: HARPET** ([arXiv 1812.09533](https://arxiv.org/abs/1812.09533)) | About 1,200 frames, 4 classes (skate forward, skate backward, pass, shoot) | Public | Proof of concept only |
| **Hockey: broadcast tracking** (VIP-HTD, [HockeyAI](https://dl.acm.org/doi/10.1145/3712676.3718335), HockeyOrient) | Player boxes, identity and orientation | Various | For detection and tracking. **No public dataset labels crossovers, stops or stride quality** |

**What this means:** almost all labeled figure skating data is **elite competition broadcast**, which differs from RinkBuddy's footage in skater level, camera and licensing. Nothing public covers learn-to-skate skills (swizzles, snowplow stops, one-foot glides) or hockey skating skills. Collecting its own labels is RinkBuddy's only durable path, and a moat once it has them.

---

## 3. Methods: what works and what it costs to run

**Detection and tracking (locking onto one skater).** Use a person detector (RTMDet, YOLO) plus ByteTrack or BoT-SORT. The skater is chosen once, either by a user tap on the first frame or automatically as the track with the most motion. The SkatingVerse winner also cropped a region of interest first (DINO) before classifying ([1st place, 95.73%](https://arxiv.org/abs/2404.14032)). Cropping to the skater is standard practice and matters most for RinkBuddy's wide shots, where the skater is 10–15% of the frame height. **License trap:** Ultralytics YOLO is AGPL-3.0, so a closed SaaS needs a paid license. The MMPose, RTMDet and RTMPose stack is Apache-2.0 and ByteTrack is MIT.

**2D pose.** RTMPose-m reaches 75.8 COCO AP at 35+ fps and RTMPose-s 72.2 AP at 70+ fps, both on a Snapdragon 865 phone ([RTMPose](https://arxiv.org/abs/2303.07399)). RTMO (one-stage) is faster when more than 4 people are in the frame, which suits public sessions ([RTMO](https://arxiv.org/abs/2312.07526)). ViTPose is more accurate but heavier. MediaPipe Pose (33 landmarks, runs on iPhone 12-class phones) tracks only one person and struggles with small, distant subjects, so it is only useful after cropping. In published skating work, a *2D* pose sequence has matched or beaten 3D lifted pose.

**3D pose and mesh recovery (4DHumans, WHAM, GVHMR).** These are attractive for world-space trajectories and blade angles, but they fail exactly where skating is hard. Tanaka et al. found that "rotations were smoothed out" when 2D pose was lifted to 3D. For jump type plus rotation count, 2D pose (78.8 F1@50) beat 3D pose (76.6) ([2408.16638](https://arxiv.org/abs/2408.16638)). Use 3D later, for edge and lean features only.

**Temporal action segmentation (TAS).** Label every frame as none / entry / takeoff / air / landing / spin / step. The FS-Jump3D paper used FACT on DWPose skeletons. Annotating entry and landing phases, not just "jump", raised set-level F1@50 from 72.8 to 86.6 with 3D pose input. VIFSS (2025) adds view-invariant contrastive pretraining and passes **92% F1@50 at element level (jump type + rotations)**, and it helps most "when fine-tuning data is limited" ([2508.10281](https://arxiv.org/abs/2508.10281)). That is exactly RinkBuddy's situation.

**Skeleton action recognition on trimmed clips (ST-GCN, InfoGCN, PoseC3D).** InfoGCN on ViTPose skeletons scored 92.0% alone on SkatingVerse, and an ensemble with RGB video transformers reached 95.7%. Use this for "what is this clip?" once TAS has cut the clip out.

**Rotation counting and airtime (physics, not ML).**
- **Airtime** = (landing frame − takeoff frame) / fps. Height ≈ g·t²/8, so 0.5 s of air ≈ 0.31 m.
- At 30 fps, ±1 frame is about ±7% airtime and ±13% height. At 60 fps it is about ±3.5% and ±7%.
- The best learned airtime detector (YSC, 30 fps pose + transformer-CRF) still has **25% mean error**, so high frame rate plus a simple ankle and hip trajectory rule is a competitive baseline.
- **Rotations:** unwrap the torso orientation angle (shoulder and hip vectors, plus the left/right keypoint swap) across the air phase. My estimate (not from a paper): beginner singles turn about 2–3 rev/s and elite triples about 5 rev/s. Hip width oscillates twice per revolution, so reliable counting needs about 20+ fps, and **60 fps is recommended**.

**Edge (inside/outside) detection, i.e. flip vs lutz.** This is feasible but hard. A monocular iPhone 13 at 240 fps with StridedTransformer 3D pose reached **83.6% ± 13.4%** on flutz/lip errors, from 232 lutz jumps by 6 skaters. It beat IMUs (74.6%) ([2310.17193](https://arxiv.org/abs/2310.17193)). A cheaper proxy that is enough for coaching: detect *a three-turn or mohawk just before takeoff* (flip) versus *a long backward glide on a curve* (lutz) from the pre-takeoff trajectory and torso rotation. This is the same rule the current prompt gives, measured instead of guessed.

**Hockey skills.** Hockey skills are cyclical and slower than jumps, which suits pose plus signal processing:
- **Stride** = ankle-separation cycles.
- **Crossover** = one ankle's lateral path crossing the other along a curved centroid path.
- **Stop** = sharp centroid deceleration plus sideways body lean.
- **Transition** = a flip in torso orientation relative to travel direction.

Published baselines are thin: HARPET reached 85–90% on 4 coarse classes, and IMU stride-time error is about 3% ([Sci Rep 2022](https://www.nature.com/articles/s41598-022-26777-9)).

---

## 4. Accuracy you can realistically expect

| Task | Best published | Conditions | Realistic for RinkBuddy |
|---|---|---|---|
| Jump vs spin vs step (segmentation) | 84–89% F1@50 (2D pose / VPD + FACT) | Broadcast, 25 fps | 80–90% after v2, with capture guidance |
| Trimmed-clip element class (6 jumps + 4 spins) | 95.7% ensemble, 92.0% skeleton-only | Broadcast, competition | 85–90% on phone footage (estimate) |
| Jump type **and** rotation count | 78.8% (2D, 2024) → >92% F1@50 (VIFSS, 2025) | Broadcast / FS-Jump3D | 75–85% in v2; 90% needs v3 own data |
| Airtime / takeoff-landing frames | 96% frame accuracy, 25% mean duration error | 30 fps practice video | ±1 frame at 60 fps with a rule-based detector |
| Edge error (flutz/lip) | 83.6% ± 13.4% | 240 fps iPhone, 6 skaters | Don't claim it. Show "check your edge" hints only |
| Hockey forward/backward skating | 85–90% | 4 classes | >90% for stride/crossover/stop with v2 rules (estimate); validate |
| Frontier VLM, domain-specific actions | 69.9% (Gemini 3.1 Pro, multiple choice) | 1,000 actions, 37 domains | Current system is likely below this for jumps because of 1 fps |
| Frontier VLM, action *quality* | ≈ chance | Includes figure skating | Never let the LLM grade quality without measured inputs |

Caveat: every number above comes from elite or lab footage. Phone footage from a public session is harder (small skater, occlusion, crowds). Beginner elements are slower and simpler, though, and most learn-to-skate skills are static poses and glides that pose estimation handles well.

---

## 5. LLM vs specialized model: cost per analyzed minute

Pricing checked 2026-09-19 (Anthropic skill table; [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)). A Claude image costs about w×h/750 tokens, so a 960×540 frame is about 700 tokens.

| Pipeline | Input tokens / min | Est. cost / min |
|---|---|---|
| **Current**: Opus 5, 60 frames @ 960 px, about 7–8 batches each resending a ~2–3k-token guide, adaptive thinking on | ~75k in + 15–40k out (thinking) | **≈ $0.75–1.30** |
| Same frames on Sonnet 5 ($2/$10) | same | ≈ $0.30–0.55 |
| Gemini 3.7/3.8 Flash native video, 10 fps, high-res (258 tok/frame), full minute | ~155k | ≈ $0.12 (promo $0.75/M until 2026-12-31) |
| **v1**: motion-peak bursts only (≈6 events × 12 skater crops at 512 px) on Opus 5 | ~25–35k | ≈ $0.25–0.45 |
| **v2**: GPU pose on every frame (RTMDet + RTMPose-m, 30–60 fps) + LLM on events only | GPU ~20–40 s/min on an L4-class card + ~15k tokens | ≈ $0.01–0.03 GPU + $0.10–0.25 LLM |
| **v3**: own TAS model; LLM only writes the coaching text | a few k tokens | ≈ $0.03–0.08 |

Gemini's native-video mode is worth an A/B test because it accepts a custom `fps` and `start/end_offset` clipping ([docs](https://ai.google.dev/gemini-api/docs/video-understanding)). Google's own docs still warn that fast action loses detail at default settings. It fixes the sampling problem but not the fine-grained judgment problem.

---

## 6. On-device feasibility

- **Apple Vision.** 2D body pose tracks multiple people. `VNDetectHumanBodyPose3DRequest` (iOS 17+) returns 17 joints in meters but handles **one person only (the nearest)**, which is wrong for public sessions unless the video is cropped first. Free, and needs no model shipping.
- **MediaPipe Pose Landmarker.** About 30 fps on an iPhone 12 (lite model) and Apache-2.0. Single person, so run it on a crop.
- **RTMPose to ONNX to Core ML.** Real-time on 2020+ phones per the RTMPose paper. The best on-device choice once v2 is settled.
- **Use on-device first for *capture quality*, not scoring.** Live prompts such as "skater too small, zoom in", "switch to 60 fps", "hold landscape", and "skater left frame" are the cheapest accuracy gain available. Doing the pose pass locally also cuts upload size and helps with minors' privacy (COPPA), because only skeletons and a few crops leave the phone. Capacitor wraps the PWA, so this needs a native plugin (Swift / Kotlin).

---

## 7. Recommended architecture

### v1: "Look in the right place" (this month, ~1.5–2 engineer-weeks, keeps Claude)
1. **Capture guidance.** Default to recording at 1080p60, landscape, filmed from the boards side-on, with the skater at least 1/3 of frame height. Upload the native frame rate, not 1 fps.
2. **Client-side motion scan.** Decode at 10–15 fps and 160 px in the browser (canvas). Compute frame-difference energy inside the skater's region and find peaks: rotation or airborne bursts and hard decelerations.
3. **Skater lock.** The user taps the skater on the first frame. A lightweight blob/template tracker then keeps a bounding box, and the video is cropped to 2× skater height and upscaled to 512 px. (Optional: TF.js MoveNet MultiPose in the browser.)
4. **Burst sampling.** For each peak, send 12–16 crops covering −1.2 s to +0.8 s at 12–15 fps, tiled as **one contact-sheet image with timestamps**. The model then sees takeoff, air and landing together at a fraction of the tokens.
5. **Two-step prompt with structured output.** Step A: jump / spin / stop / crossover / other, with an explicit "unsure". Step B, jumps only: a fixed decision tree (forward takeoff → Axel; toe pick? → toe loop / flip / lutz; turn right before takeoff → flip, long back glide → lutz). Use `output_config.format` JSON, prompt-cache the guide, run effort `low`/`medium`, and test Sonnet 5.
6. **Correction logging.** Store every accepted or corrected detection with its crops as a labeled example, and let coaches label for free. This becomes v3's training set.
7. **Eval set now.** Use 100–150 clips (Milo's 16 4K/120 fps videos + Pexels + tester uploads), hand-labeled. Measure precision and recall per skill before and after every change.

### v2: Pose-first hybrid (1–3 months, ~4–6 engineer-weeks + ~$50–150/mo GPU)
- A Python GPU worker (Modal / RunPod / an ECS GPU task) running RTMDet + ByteTrack + RTMPose-m (or RTMO for crowds) on every frame at native 30–60 fps.
- **Deterministic event finders** on the skeleton signal:
  - airborne = both ankles rising + hip parabola
  - jump vs spin = rotation with vs without centroid displacement
  - rotations = unwrapped torso angle
  - airtime = frame count
  - hockey: stride cycles, crossover leg-crossing, stop deceleration
- Optionally pretrain a skeleton classifier (InfoGCN / PoseC3D) on **MMFS skeletons (MIT)**. Treat FS-Jump3D and FineFS as non-commercial / unclear, for research only.
- The LLM receives each event's crops **plus the measured facts** ("airborne 0.46 s, 1.1 rev, forward takeoff detected, no three-turn in the 1 s before") and returns the label, confidence and coaching language. The LLM never counts rotations itself.

### v3: RinkBuddy's own model (3–9 months, ~2–4 months of ML work + a labeling program)
- A TAS model (FACT / ASFormer / MS-TCN) over 2D pose + VIFSS-style view-invariant pretraining, with fine-grained entry / takeoff / air / landing labels.
- Target ~300–500 labeled examples per high-volume skill, collected from v1/v2 corrections and coach review.
- Port pose (and later TAS) to Core ML / TFLite for on-device pre-analysis and live capture guidance. The server LLM then only writes the feedback.
- Add edge and lean features (3D lifting at 60–240 fps) only after the rest is solid, and ship them as "likely edge issue, ask your coach", not as a verdict.

---

## 8. Risks

- **Licensing.** Most skating datasets are competition broadcast footage (copyright) or CC BY-NC. Don't train commercial weights on them without permission. Avoid Ultralytics AGPL unless paying for it.
- **Minors' video.** On-device pose plus crop-only uploads reduce COPPA exposure.
- **Overclaiming.** OOFSkate owns elite jump metrics with a USFS endorsement ([USFS release](https://usfigureskating.org/news/2025/12/2/press-releases-us-figure-skating-partners-with-oofskate-to-bring-ai-powered-jump-metrics-to-athletes-nationwide.aspx)). RinkBuddy's technical edge should be *reliable detection of learn-to-skate and hockey fundamentals across a whole session* plus progress tracking, not GOE-grade jump judging.

## Sources
[Tanaka 2024 FS-Jump3D/TAS](https://arxiv.org/abs/2408.16638) · [VIFSS 2025](https://arxiv.org/abs/2508.10281) · [YourSkatingCoach](https://arxiv.org/abs/2410.20427) · [FineFS](https://github.com/yanliji/FineFS-dataset) · [MMFS](https://github.com/dingyn-Reno/MMFS) · [FS-Jump3D](https://github.com/ryota-skating/FS-Jump3D) · [SkatingVerse challenge](https://arxiv.org/abs/2405.17188) · [SkatingVerse 1st place](https://arxiv.org/abs/2404.14032) · [FSD-10](https://arxiv.org/abs/2002.03312) · [FSBench](https://arxiv.org/abs/2504.19514) · [Fis-V](https://arxiv.org/abs/1802.02774) · [Edge error, monocular + IMU](https://arxiv.org/abs/2310.17193) · [RTMPose](https://arxiv.org/abs/2303.07399) · [RTMO](https://arxiv.org/abs/2312.07526) · [GVHMR](https://github.com/zju3dv/GVHMR) · [HARPET hockey](https://arxiv.org/abs/1812.09533) · [Hockey IMU skating](https://www.nature.com/articles/s41598-022-26777-9) · [VideoNet](https://arxiv.org/abs/2605.02834) · [VLM AQA evaluation](https://arxiv.org/abs/2604.08294) · [Gemini video docs](https://ai.google.dev/gemini-api/docs/video-understanding) · [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Apple Vision 3D pose](https://developer.apple.com/documentation/vision/vnhumanbodypose3dobservation) · [MediaPipe iOS](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/ios) · [OOFSkate / USFS](https://usfigureskating.org/news/2025/12/2/press-releases-us-figure-skating-partners-with-oofskate-to-bring-ai-powered-jump-metrics-to-athletes-nationwide.aspx)
