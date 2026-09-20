# 09 — Where the footage comes from, and how little of it we need

*Researched 2026-09-20, after Milo pushed back that we had settled too early on
"film it ourselves". Report 04 closed the question on licensing; this one reopens
it on supply, and adds the half nobody had looked at: how to need less.*

Four lines of enquiry ran in parallel — open-licensed footage, footage we can
buy, footage people will give us, and methods that work on 50–200 clips instead
of thousands. This page is the consolidated answer. Sections fill in as each
lands; the method section is complete.

---

## A. Needing less footage (complete)

The most useful result of the day: **our binding constraint was never the number
of minutes filmed.** It is framing, labelling scheme, and normalisation — all of
which are free.

### The four free wins, in order of size

| Change | Worth | Cost |
|---|---|---|
| **Sequence-level skeleton normalisation** — centre the whole sequence on the body centre of frame 1, then align to the shoulder/hip axes once per sequence | **+9.7 / +8.9** points (VA-NN, TPAMI 2019, [1804.07453](https://arxiv.org/abs/1804.07453), MIT) | ~1 day |
| **Label the phases, not just the skill** — entry / execution / exit on every attempt | **+7.8 F1@50** on 2D pose, **+13.8** on 3D (VIFSS annotation ablation, [2508.10281](https://arxiv.org/abs/2508.10281)) | ~1–2 days per 50 clips |
| **Fix framing** — skater ≥ 1/3 of frame height, side-on, landscape | Every number below degrades with skater size | already in FILMING-GUIDE |
| **Augmentation, chosen for our scale** | See below — worth ~25× more to us than to a benchmark | ~2–4 days |

**Per-frame rotation normalisation is a trap.** Per-sequence beats per-frame
(76.4 vs 75.0), and for skating it would be actively destructive: three-turns and
spins *are* body rotation. Normalise the sequence, never the frame. And if you
rotation-normalise, don't also rotation-augment — they cancel.

### Augmentation matters far more to us than to the papers

Same augmentation, same architecture, different dataset sizes (VA-NN Table II):

| Dataset | Train size | Gain from rotation augmentation |
|---|---|---|
| NTU-60 CS | ~40,000 | +0.4 |
| SBU | ~280 | +6.3 |
| UWA3D | ~900 | +9.8 |
| N-UCLA | ~1,000 | **+11.8** |

About **25× the gain at 1,000 samples than at 40,000**. We will sit below
N-UCLA. Corroborated by MAMP's curve: +27.2 at 1% of labels, +10.0 at 100%.
**At our scale, augmentation choices matter more than architecture choices.**

Ranked for us:

1. **Sequence centring + scale normalisation** — the +9.7 above.
2. **Trimmed-uniform temporal resampling** (+1.0–1.2, up to +3.7 when clip
   lengths vary — which describes our swizzle runs exactly).
3. **Mirroring**, with a proper left/right keypoint index swap, not a negated x.
   Roughly 90% of skaters rotate counter-clockwise, and FSD-10 names this as one
   of three reasons skating is hard to classify; mirroring is the only cheap way
   to cover clockwise skaters. Audit the taxonomy first: a label that says "left
   back outside edge" survives mirroring only if the skill, not the leg, is what
   the label names.
4. **Random joint masking, ~35%, legs preferentially.** Turns a 20-point
   collapse under occlusion into a 3.5-point dent (PSTL, AAAI 2023, MIT). About
   80% of the benefit comes from naive random masking — don't over-engineer it.
5. **Random scaling** — the one spatial augmentation PYSKL endorses for 2D.
6. **Small joint jitter (σ ≈ 1% of body extent)** — defensive only. PYSKL:
   *"random Gaussian noise does not work for any kinds of skeletons"*. It will
   not raise clean accuracy; it stops a 14-point collapse when 2% of joints are
   jittered at test time. Insurance, not a lever.

**Skip:** shear, axis masking, Gaussian blur, MixUp/CutMix on raw coordinates,
and diffusion-synthesised skeletons (the papers claiming +5–6 measure it against
a baseline 16 points below the published figure).

### How many labeled clips we actually need

**20 per class is the published break-even** (SkeletonX, [2504.11749](https://arxiv.org/abs/2504.11749)): at 20
samples/class a plain model beats a one-shot pretrained one. Ten skills × 20 =
**200 clips**, which is one or two good sessions — not a 90-day filming
programme.

Supporting numbers, all on 60–120-class benchmarks (so harder than our ~10–22
classes, but on Kinect skeletons rather than phone video, so easier in other
ways): MAMP semi-supervised reaches **88.0 with 10% of labels** versus **83.1
training from scratch on 100%** — a genuine 10× reduction *with* a gain.

### Rules need no training data at all

The strongest evidence in the whole review, and it fits learn-to-skate perfectly
because these skills are cyclic and geometric rather than ballistic:

- **Foot events from pose** agree with lab motion capture to **≤2 frames** for
  heel strike and toe-off; a MediaPipe pipeline detects them 95–99% of the time.
- **Flight time by counting frames** has 3.4 ms technical error at 120 fps and
  1.8 ms at 240 — and the authors conclude above 240 adds nothing. We already
  film at 120.
- **Turn detection by unwrapping torso angle** reaches 95% in the validated ski
  analogue — **but collapses to 0.54 detection on snowplow turns**, which is
  precisely the slow wedge shape most beginners produce. Budget for that.
- **Repetition counting**: plain autocorrelation on ankle separation will beat
  RepNet, because we control the signal.

So the first working recogniser needs a pose front-end and arithmetic — not a
trained model and not a large dataset.

### Licences: there is no commercially clean pretrained skeleton model

This changes the architecture, so it is worth stating bluntly. **NTU RGB+D /
120, AMASS, Human3.6M and COCO-WholeBody all forbid commercial use.** That
contaminates almost every published checkpoint — including MotionBERT's weights
(Apache-2.0 *code*, AMASS-pretrained *weights*) and DWPose (COCO-WholeBody).
Several popular GCN repos are CC BY-NC: 2s-AGCN, Shift-GCN, CTR-GCN, SkeletonX.

**The clean path:** RTMDet + RTMPose-**body** (COCO-17, Apache-2.0) + ByteTrack
(MIT) for pose; pretrain our own encoder on **CMU Mocap** (*"free for all uses…
you may include this data in commercially-sold products"*) plus **AIST++
annotations** (CC BY 4.0, 9 camera views, dance — full of spins and turns),
using VIFSS's Apache-2.0 recipe. Green repos: SkateFormer, MS-G3D, HD-GCN,
VA-NN, PSTL (MIT), BlockGCN, PYSKL, MMPose (Apache-2.0), ST-GCN (BSD-2).

### What not to bother with

**Self-supervised pretraining on our own footage.** Twenty minutes is ~1.1% of
NTU-60's unlabeled corpus, from one rink and a handful of skaters. Apple measured
the cost of exactly this narrowness at −6.6 points versus a diverse mix. At our
scale the encoder learns the rink and the skater, not skating.

### A second signal we already own: audio

Measured on IMG_1791, RMS per 100 ms, labeled attempts vs unlabeled controls in
the same clip: stroking and a two-foot turn sit **4.5 dB above** the clip's
above-3 kHz floor (−33.5 vs −38); swizzles barely register (−37.3). That matches
the physics — a push or a turn scrapes a blade edge, a swizzle glides on both.
Stops and hard edges should be louder still, though we have none labeled yet to
prove it. Audio doesn't care how far away the skater is, which is exactly where
the video signal fails. Worth a proper test once we have a labeled stop.

---

## B. Openly-licensed footage — about ten minutes of it exists

Someone enumerated it properly rather than guessing. Across every open source on
the internet there are roughly **10 minutes** of openly-licensed video showing
adult recreational ice skating, and **zero** clips of an isolated learn-to-skate
skill. Not "few". Zero.

**Wikimedia Commons** is the only source that is open, commercially clear,
AI-training clear and bulk-downloadable at once. Of 553 files gathered across six
searches, 268 are genuinely skating, totalling 18.7 real hours:

- **14.5 h of junior ice hockey games** (Czech and Slovenian leagues, CC BY 3.0,
  most at 720p or better) — wide-angle game play, small subjects, but the largest
  legitimate skating pool anywhere, and relevant to our hockey line.
- **25 elite element clips**, all CC BY 4.0, all 1080p, with the element named in
  the filename (`Amber Glenn 2025 Worlds Free Skate 3A`). The only precisely
  skill-labelled skating video in the open. Wrong difficulty band for us, but
  free and perfect for smoke-testing a pose pipeline.
- **~10 minutes of adult recreational skating** at public rinks. That's the lot.

A warning for anyone repeating this: Commons duration metadata lies. One file
claims 27 hours and contains 364 frames. Filter on implied bitrate.

**Everything else is worse than it looks.** Openverse indexes no video at all
(its video endpoint 404s). The Internet Archive has 5–8 genuine items out of
5,107 hits, and its licence fields are uploader-asserted and often wrong —
items marked public domain include Sesame Street and 1994 Olympic broadcast.
Vimeo's CC0 pool is flooded with spam and its terms plus a CAPTCHA block
collection anyway.

**Pexels and Pixabay are not the grey area we assumed.** Their terms ban
automated collection "including without limitation for machine learning
purposes", by name. Coverr bans AI training outright. And Getty's definition of
Training covers works used to "evaluate" a system — so where that drafting
spreads, **a held-out evaluation set is not a safer legal category than a
training set**. Worth checking for that word in anything we ever sign.

### YouTube Creative Commons: the analysis, because it looked like the loophole

The copyright half is genuinely clean — CC BY grants irrevocable commercial
rights to the work. The problem is everything else:

- **YouTube's terms forbid downloading any content**, with no Creative Commons
  carve-out, and ban automated access.
- **The real exposure is anti-circumvention, not copyright.** In *Cordova v.
  Huneault* (N.D. Cal., Feb 2026) a motion to dismiss DMCA §1201 claims over
  YouTube's rolling cipher was **denied**, and the court held it immaterial that
  the videos were publicly viewable. §1201 is not a copyright claim, so a licence
  to the work is not a defence, and the plaintiff was another creator — not
  Google. Statutory damages run $200–$2,500 per act.
- **CC BY 4.0 contains an express waiver** of the right to forbid circumventing
  technological measures. **CC BY 3.0 does not.** YouTube only switched its CC
  option to 4.0 on 1 August 2025, without applying it retroactively, so most CC
  BY videos there today are 3.0 — and the interface doesn't tell you which.
- **hiQ v. LinkedIn is the outcome to model**, and it's usually cited backwards:
  hiQ won the famous access ruling, then lost on contract and settled for
  **$500,000 plus destruction of all data, code and algorithms derived from the
  scraping**. The remedy was model destruction.

The realistic risk isn't a lawsuit, it's that we build an unwindable
contingency into our core asset: any acquirer's counsel asks for a per-asset
licence chain, and "YouTube CC BY via a downloader" produces a terms finding, a
§1201 flag and an unclosable provenance gap. And the volume doesn't justify it
anyway — likely well under 100 videos that are simultaneously CC BY 4.0,
plausibly owned by the uploader, and usable.

### Three legally clean assets worth taking

| Asset | What it gives us |
|---|---|
| **Ego4D** (3,670 h egocentric) | Licence expressly permits training, evaluating and improving models for **commercial** product development. No skating — pretraining value only. Ship weights, never frames. |
| **CMU Graphics Lab mocap** | *"free for all uses… you may include this data in commercially-sold products"*. 2,605 trials. Mocap, no video. |
| **Kinetics-400 `is_cc` subset** | ~196 skating clips — and Kinetics has a **"hockey stop" class** (318 clips in K400, 650 in K700), the only fine-grained skating skill class in the action-recognition literature. Re-verify each video's current licence; the flag is a 2017 snapshot and maps to CC BY 3.0. |

### What this settles

Our own footage isn't the fallback — it's the answer. It matches where the
product actually runs (phone, rink lighting, real adult beginners), it's the only
route to coach-authored labels, and it's the only version that survives
diligence. The highest-value external route is **licensing directly from
coaches**: it resolves the circumvention question completely (the only party with
standing has consented), gives a warranty of title that CC BY explicitly refuses,
and comes with authoritative labels attached.

### Two loose ends worth a look

- **`Mercity/Figure-Skating-Classification-Data`** on Hugging Face: 5,405
  skeleton sequences across 64 figure-skating element classes, in the same
  COCO 17-keypoint format we'd use, tagged MIT. It is the closest public thing to
  our task carrying a permissive tag. Treat the tag with suspicion — the
  provenance is undocumented and it looks derived from FSD-10 or MMFS skeletons,
  which an uploader cannot MIT-license. Evaluate it technically; don't rely on
  the label legally.
- A correction worth knowing because it is widely repeated: **FSD-10 is not CC BY
  4.0.** That string is its Jekyll blog theme's footer, covering the blog posts.
  The dataset carries no licence at all.

**Two questions for a lawyer before we scale:** whether skeletons derived from
copyrighted footage are themselves encumbered — load-bearing for every skating
dataset in existence — and whether ShareAlike attaches to model weights, which
Creative Commons itself declines to answer.

## C. Footage we can buy, and rink camera networks

*Pending.*

## D. Footage people will give us

*Pending.*
