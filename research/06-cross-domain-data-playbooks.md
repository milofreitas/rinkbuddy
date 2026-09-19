# 06: How analyzer apps in other fields got their first training data, and what carries over to skating

*Researched 2026-09-19. Builds on [03-ai-technical.md](03-ai-technical.md) (pose first, then a temporal model; frontier vision LLMs are weak at fine-grained movement) and [04-reference-data.md](04-reference-data.md) (no public skating data RinkBuddy can use commercially; stock and YouTube footage are off-limits; film our own footage with coaches).*

**The founder's question:** "People keep building apps that analyze whatever you upload. Others must have solved the data problem. How?"

**Short answer:** almost none of them started with a dataset. Each had one of three things:
1. **A community that was already labeling for its own reasons.** Birders, naturalists and astronomers had been doing it for years.
2. **A paid human service whose normal work produced labels.** Stylists, body-shop estimators, human analysts and physical therapists.
3. **A way to measure the truth with an instrument instead of a person.** Weighed food, pressure insoles, 3D renders.

Several of them launched a *non-AI or partly-AI product first* and switched to AI once enough data had built up. RinkBuddy can do all three, and skating has an unusually good version of each.

---

## 1. Case studies

| # | Product (domain) | How they got data | Time until the AI was good | Evidence |
|---|---|---|---|---|
| 1 | **Merlin Bird ID** (birds) | Shipped in **2014 as a 5-question guide with no computer vision**. Photo ID arrived about 2016–17, trained on roughly 1M photos that birders had shared with eBird and the Macaulay Library. Sound ID followed: expert and eBird volunteers drew **800k spectrogram boxes on 130k recordings**, with a minimum of **150 recordings per species**. Data prep started in 2020 and it shipped in 2021. | About 3 years from launch to vision. Sound ID took about 1.5 years once labeling started. | [Merlin story](https://merlin.allaboutbirds.org/the-story/), [Cornell 2016](https://news.cornell.edu/stories/2016/12/merlin-bird-photo-id-mobile-app-launches), [Sound ID behind the scenes](https://www.macaulaylibrary.org/2021/06/22/behind-the-scenes-of-sound-id-in-merlin/) |
| 2 | **iNaturalist / Seek** (species) | **Citizen science.** Users post observations, and the community agrees on an ID ("Research Grade"). A species enters the model at **100 photos from 60 observations**, with at most 5 photos taken per observation. The model has grown to about 106k taxa trained on about 30M photos. | The community existed about 9 years before the first vision model (2017). The model is retrained every 1–2 months. | [iNat CV blog](https://www.inaturalist.org/blog/69193-new-computer-vision-model), [taxa included](https://help.inaturalist.org/en/support/solutions/articles/151000170368-which-taxa-are-included-in-the-computer-vision-suggestions-) |
| 3 | **Galaxy Zoo / Zooniverse** (astronomy) | About **100M volunteer labels on about 1M galaxies**. The model ("Zoobot") now handles the easy cases and **sends only uncertain ones to humans** (active learning). | More than 10 years. The hybrid system came later. | [TF blog](https://blog.tensorflow.org/2020/05/galaxy-zoo-classifying-galaxies-with-crowdsourcing-and-active-learning.html), [Twelve Years of Galaxy Zoo](https://arxiv.org/pdf/1910.08177) |
| 4 | **ESP Game → reCAPTCHA → Duolingo** (images, language) | **Games with a purpose.** Two strangers get points when they type the same word for an image. That produced **36M labels in 2003–08**, and Google licensed it. | Labels arrived immediately, because the game itself was the product. | [von Ahn & Dabbish](https://www.cs.cmu.edu/~biglou/ESP.pdf), [ESP game](https://en.wikipedia.org/wiki/ESP_game) |
| 5 | **Stitch Fix** (fashion) | **Human stylists stayed in the loop.** Algorithms narrow the options, stylists pick, and every pick, keep and return becomes a label. **Style Shuffle**, a thumbs-up/down game started in 2018, has logged **10B+ ratings**. | Revenue from day one. The AI gradually took over more of the work. | [Stitch Fix newsroom](https://newsroom.stitchfix.com/blog/10-billion-interactions-and-counting-on-style-shuffle-the-data-powering-your-personalized-shopping-experience/), [Algorithms Tour](https://algorithms-tour.stitchfix.com/) |
| 6 | **Tractable** (car damage) | **Partnerships.** Insurers and body shops supplied roughly 10M photos, and each photo already came with a professional repair estimate. The industry's existing paperwork was the label. | About 4–5 years from 2014 to production with insurers. | [Seattle Times](https://www.seattletimes.com/business/technology/artificial-intelligence-drives-car-insurance-claims-estimates-before-the-tow-truck-is-called/), [InsTech](https://www.instech.co/knowledge-centre/adrien-cohen-co-founder-president-tractable-damage-assessment-with-ai-fast-scalable-global/) |
| 7 | **Google derm research / SCIN** (skin) | Early models used **16k de-identified teledermatology cases** with 40+ dermatologists' diagnoses. SCIN then **recruited people through search ads** to donate photos of their own condition with consent (IRB-approved). That brought **10k+ images in 8 months**, each labeled by 1–3 dermatologists. | 8 months to a representative dataset. | [Google SCIN](https://research.google/blog/scin-a-new-resource-for-representative-dermatology-images/), [DermAssist paper](https://arxiv.org/pdf/2007.06666) |
| 8 | **SnapCalorie / Nutrition5k** (food) | **Instrumented ground truth.** 5,000 dishes were **weighed ingredient by ingredient** and filmed on a robotic rig from many angles, so nobody had to guess calories. Human reviewers check the app's output. | A lab-built dataset, then the product. | [TechCrunch](https://techcrunch.com/2023/06/26/snapcalorie-computer-vision-health-app-raises-3m/), [Roboflow](https://blog.roboflow.com/count-calories-from-photos-computer-vision/) |
| 9 | **Cal AI** (food) | **No dataset of its own.** It uses frontier models from OpenAI and Anthropic plus retrieval over open nutrition databases, at about 90% on common foods. It reached **$30M+ ARR** and was acquired by MyFitnessPal. | Weeks. The weakness is accuracy on hard cases. | [TechCrunch 2025](https://techcrunch.com/2025/03/16/photo-calorie-app-cal-ai-downloaded-over-a-million-times-was-built-by-two-teenagers/), [TechCrunch 2026](https://techcrunch.com/2026/03/02/myfitnesspal-has-acquired-cal-ai-the-viral-calorie-app-built-by-teens/) |
| 10 | **Zenia** (yoga form) | Built its **own set of 200k images, including deliberately wrong poses**, with a custom labeling tool. **Certified yoga teachers** defined what counts as correct. Runs on-device. | About 1–2 years to launch. | [VentureBeat](https://venturebeat.com/ai/zenia-is-using-computer-vision-to-build-an-ai-driven-fitness-trainer), [Startup Jedi](https://medium.com/startup-jedi/zenia-ai-powered-yoga-assistant-f9ccd18136e0) |
| 11 | **Peloton Guide** (strength form) | **"A heavy dose of synthetic data"** plus a small amount of custom real data and open-source sets, each tagged by body type and setting so fairness could be checked. | Iterative. | [VentureBeat](https://venturebeat.com/technology/how-peloton-is-using-computer-vision-to-strengthen-workouts) |
| 12 | **Sword Health / Hinge Health** (physical therapy) | **A licensed PT supervises every patient.** The AI ("Phoenix", launched 2024) coaches within limits the PT sets, and PT approvals and adjustments feed the model. Hinge bought its computer vision (TrueMotion) in 2021 and shipped it in 2023. | About 4–6 years, fully paid by PT-led care the whole time. | [Sword](https://swordhealth.com/articles/virtual-pt-what-works), [Hinge acquisition](https://www.businesswire.com/news/home/20210917005073/en/Hinge-Health-Acquires-the-Most-Advanced-Computer-Vision-Technology-for-Tracking-Human-Motion), [TrueMotion](https://www.hingehealth.com/resources/articles/truemotion-turning-a-phone-camera-into-a-3d-motion-lab/) |
| 13 | **ELSA Speak** (pronunciation) | **Users' own recordings.** It has collected 100M+ voice samples of accented English from its users. Public speech datasets were native speakers only, so this data is the moat. | Years. Started from a small seed. | [Conversation.ai](https://www.conversation.ai/research/product-spotlight/elsa-teaches-english) |
| 14 | **PopSign ASL** (sign language) | Google and Georgia Tech **paid 47 Deaf adult signers to record 250 signs on phones**: 210k clips, all reviewed by hand, about 700 per sign. They then **released it as a Kaggle competition** and got the models built by outside teams. | Months of collection, then a 3-month competition. | [NeurIPS paper](https://proceedings.neurips.cc/paper_files/paper/2023/file/00dada608b8db212ea7d9d92b24c68de-Paper-Datasets_and_Benchmarks.pdf), [Kaggle](https://www.kaggle.com/competitions/asl-signs) |
| 15 | **Expensify SmartScan / x.ai "Amy"** (receipts, scheduling) | **"Wizard of Oz": humans secretly did the work.** Expensify used Mechanical Turk from 2009, later its own staff, at about 2¢ per receipt. x.ai used human trainers on hard emails. Expensify was **exposed in 2017 and hurt by the privacy backlash**. | Years. | [Quartz](https://qz.com/1141695/startup-expensifys-smart-scanning-technology-used-humans-hired-on-amazon-mechanical-turk), [Bloomberg](https://www.bloomberg.com/news/articles/2016-04-18/the-humans-hiding-behind-the-chatbots) |
| 16 | **Hudl Assist** (team sports, including hockey) | **Human analysts tag every stat within 24 hours as a paid product.** Computer vision (Balltime) is now added for volleyball, with humans refining the output. | Human-first for years, then gradually automated. | [Hudl Assist FAQ](https://www.hudl.com/products/assist/faq), [Hockey](https://www.hudl.com/products/assist/ice-hockey) |
| 17 | **Tesla data engine** (driving) | **"Shadow mode"**: the model predicts silently, and **mismatches with the human driver trigger clip uploads**. It ran **221 manual triggers**. Loop: deploy, find errors, collect similar cases, retrain. | Continuous. | [Karpathy CVPR'21 summary](https://dynamicallytyped.com/stories/2021/karpathy-autopilot-cvpr/), [IEEE Spectrum](https://spectrum.ieee.org/tesla-autopilot-data-deluge) |
| 18 | **Carv** (skiing, the closest analog) | **Ski instructors scored a labeled set of 4,000 videos from 500+ skiers**. Those scores anchor a model later fed by **580M+ turns** of user sensor data. | A few seasons. | [Carv Ski:IQ](https://getcarv.com/blog/how-carv-turns-your-skiing-into-data), [Carv 2](https://getcarv.com/blog/introducing-carv-2) |
| 19 | **BEDLAM / SURREAL** (body pose research) | **Fully synthetic**: motion capture rendered in a game engine. With BEDLAM, models trained *only* on synthetic data reached state-of-the-art 3D body pose on real images. SURREAL, built earlier with simpler rendering, still needed real-data fine-tuning. | Research. | [BEDLAM](https://arxiv.org/abs/2306.16940), [SURREAL](https://openaccess.thecvf.com/content_cvpr_2017/papers/Varol_Learning_From_Synthetic_CVPR_2017_paper.pdf) |

Supporting methods:
- **Scale AI**: model pre-labels, humans fix, layered quality checks ([Contrary](https://research.contrary.com/company/scale)).
- **Snorkel weak supervision**: noisy rules written as code ("labeling functions") are combined into training labels ([Snorkel](https://snorkel.ai/data-centric-ai/weak-supervision/)).
- **VideoMAE**: self-supervised pretraining on only 3.5k unlabeled videos raised HMDB51 accuracy from **18.0% to 62.6%** ([arXiv](https://arxiv.org/abs/2203.12602)).
- **Yousician**: the app tells the user what to play, so it only has to *verify* against a known target rather than recognize from scratch ([Wikipedia](https://en.wikipedia.org/wiki/Yousician)).

**Patterns:**
1. **The first product was rarely the AI.** Merlin was a questionnaire, and Stitch Fix, Hudl, Sword and Expensify were human services.
2. **Labels came as a byproduct of work already paid for**, such as repair estimates, stylist picks, PT sign-offs and teledermatology diagnoses.
3. **Experts set the standard; crowds or users provide volume.** Carv, Zenia, SCIN and Merlin all worked this way.
4. **A few hundred examples per class was the point where things started to work**: Merlin's floor was 150, iNaturalist's 100, PopSign had about 700, and Carv used 4,000 videos in total.

---

## 2. Nine ways to get the first data

| # | Approach | Examples | Pros | Cons | Cost (RinkBuddy scale) |
|---|---|---|---|---|---|
| A | **Humans do the analysis, openly, as the paid product ("concierge")** | Hudl Assist, Stitch Fix, Sword, (Expensify) | Revenue before the model works. Gold-quality labels. Shows what customers actually value. | Doesn't scale. Margin is capped by coach cost. **Hiding it is a trust and privacy risk** (Expensify). | Coach pay $5–15 per reviewed clip, passed on to the customer |
| B | **Experts set the standard, then score a seed set** | Carv (4k videos), Zenia, Google derm | Defines "correct" and gives the eval set. | Slow and expensive per label. | $1.5–3 per raw clip plus $0.50–1 per label (per doc 04) |
| C | **Users confirm or correct the AI's output** | ELSA, SwingVision, iNat suggestions | Scales for free and covers real-world conditions. | Noisy. Users accept wrong answers. Needs trusted spot-checks. | About $0 per label, plus quality checks |
| D | **Community agreement / citizen science** | iNaturalist, Galaxy Zoo, eBird | Huge volume and loyalty. Labels have a vote count, so their reliability is known. | Needs an enthusiast community and an agreement rule. Slow to start. | Community management time |
| E | **Games with a purpose / swipe loops** | ESP Game, Style Shuffle | Labels fun enough to collect on their own. | Only simple judgments ("same skill?", "clean landing?"). | Build cost only |
| F | **Paid recording of a planned shot list** | PopSign (47 signers), Nutrition5k | Clean consent, balanced classes, known ground truth. | Staged footage differs from real sessions. | $6–9k for about 4k clips (doc 04) |
| G | **Ground truth from an instrument** | Nutrition5k scales, Carv insoles, research IMUs | Labels without human judgment. Exact values (airtime, rotations). | Needs hardware. Differs from how users will actually film. | Watch or phone sensor: $0 extra if users own one |
| H | **Synthetic or simulated data** | BEDLAM, Peloton, Waymo sim | Unlimited, perfectly labeled, no minors. | Gap between synthetic and real. Needs good motion data. Commercial mocap licenses are scarce (AMASS is non-commercial; [CMU mocap](https://huggingface.co/datasets/gbionics/cmu-fbx) allows commercial use). | Engineer time, $0–2k |
| I | **Pretraining on unlabeled footage, rule-based auto-labels, or foundation models used as-is** | VideoMAE, Snorkel, Cal AI | Uses every upload, even unlabeled ones. Ships in weeks. | A ceiling on hard cases. LLMs are near chance on judging skating quality (doc 03). | GPU time, API cost |

Tesla's shadow mode and Galaxy Zoo's active learning aren't a separate source. They are the **routing layer** on top of A–D: they decide *which* clips go to humans.

---

## 3. Ranking for RinkBuddy

Constraints: solo founder, small budget, a niche sport, phone video, many users are minors (COPPA), and the pipeline is pose first (doc 03).

| Rank | Approach | Fit | Why |
|---|---|---|---|
| 1 | **A. Open, paid coach review** ("Coach Check": a human coach reviews your clip within 48 h) | ★★★★★ | Parents already pay coaches $50–120/h. A 3-minute async review for $10–15 is a bargain, and coaches earn money during downtime. **The coach works inside a RinkBuddy tool that tags the start/end frame, skill name and a pass/needs-work mark**, so every review becomes a gold label. This is Hudl Assist plus Stitch Fix: be open that coaches review, then let the AI take over more of the work over time. |
| 2 | **Declare-then-verify inside C** (Yousician style) | ★★★★★ | Before recording, the skater picks the skill they are practicing from their Learn to Skate or USA Hockey checklist. Every upload then **arrives already labeled by intent**, and the model only has to say *"yes, that's a 3-turn"* or *"no clean edge found"*, which is much easier than recognizing a skill from scratch. |
| 3 | **B + F. Coach-led shot-list filming** (already planned in doc 04) | ★★★★☆ | Needed for the eval set and for the "incorrect" examples (Zenia's lesson: deliberately film wrong versions). Aim for ≥150 examples per skill (Merlin's floor). |
| 4 | **I. Rule-based auto-labels on pose, plus self-supervised pretraining on all consented uploads** | ★★★★☆ | Cheap and compounding. Rules such as "both ankles rise + hip parabola = airborne" (doc 03 v2) auto-label thousands of clips. Pretraining on unlabeled skeletons cuts how many hand labels are needed. VIFSS showed exactly this for skating ([doc 03](03-ai-technical.md)). |
| 5 | **G. Watch gyroscope as ground truth** | ★★★☆☆ | See idea 1 below. |
| 6 | **H. Synthetic skeletons** (not rendered pixels) | ★★★☆☆ | The classifier runs on skeletons, so no ice or lighting has to be rendered. Parametric jump skeletons (spin rate, airtime, entry curve) are cheap to generate. Most useful for rotation counting and rare classes. |
| 7 | **D + E. Community labeling and a swipe game** | ★★☆☆☆ now, ★★★★☆ later | Needs thousands of engaged users first. Adult skaters on r/FigureSkating are keen, but start after about 1k MAU. |
| 8 | Hidden Wizard of Oz | ✗ | Parents of minors plus undisclosed human viewers is the Expensify scandal with children. Always disclose. |
| 9 | Big labeling vendors (Scale and similar) | ✗ | Their labelers can't tell a flip from a lutz. The expert judgment has to come from coaches. |

### Recommended order

**Months 0–2: "Coach-first, AI-assisted."**
- Launch Coach Check as the premium tier, with 5–10 recruited PSA- or USA Hockey-credentialed coaches paid per review, and every review producing labels.
- The free tier keeps the current LLM analysis, plus declare-then-verify and the "Was this a ___? ✓/✗" correction step.
- Run the doc 04 shot-list sessions (adults first) to build a **150-clip eval set that is never trained on**.
- Consent screen: "Clips may be used to improve RinkBuddy; coaches may review." Under-13s go through parental consent.

**Months 2–5: "Shadow mode."**
- Ship the v2 pose pipeline (doc 03).
- Run it *silently* on every coach-reviewed clip. **When the model and the coach disagree, flag the clip** (Tesla-style triggers: low confidence, a rare skill, airtime too long for the declared skill).
- Pretrain on all consented skeletons.
- Write 10–20 rule-based labeling functions and combine them Snorkel-style.
- Start the watch-gyro and synthetic-skeleton experiments.

**Months 5–12: "The AI does the first pass; coaches check what's uncertain."**
- The model answers the easy cases instantly, and only uncertain ones go to coaches (Zoobot routing). Coach cost per clip falls, and the premium tier becomes "AI + coach verified".
- Open a Galaxy Zoo-style labeling area for engaged adult skaters on *skeleton replays only* (no faces, no minors).
- Target: ≥300 gold labels per high-volume skill (doc 03 v3).

**Budget:** coach review is paid for by customers. Shot-list filming is $6–9k (doc 04). GPU is $50–150/month. Everything else is engineering time.

---

## 4. Ideas no skating product seems to be using

1. **Watch gyroscope as automatic ground truth.** Apple Watch on watchOS 10+ exposes **800 Hz accelerometer and 200 Hz device-motion** data ([Apple WWDC23 Core Motion](https://wwdcnotes.com/documentation/wwdc23-10179-whats-new-in-core-motion/)). A wrist gyro measures spin rate, rotation count and takeoff/landing impacts directly (research IMUs already do this for skating edges and hockey strides; see doc 03). Ask adult skaters and coaches to wear a watch while a friend films: **every synced clip labels its own airtime and rotations**, with no human involved. This is SnapCalorie's weighed-food idea applied to skating. Carv did the same with insoles, then later removed the sensor once the model had learned from it.

2. **Film Learn to Skate test days.** Rinks already run badge assessments where a certified coach marks each skill pass or fail. With program-level consent (the Merlin/Macaulay-style institutional route), filming a test day produces **hundreds of expert-graded pass/fail clips of exactly RinkBuddy's core skills in one morning**, and the grading is labor the program already pays for. Offer the program free progress reports in return.

3. **A privacy-safe skeleton dataset plus a Kaggle-style challenge.** Copy PopSign: publish *skeleton-only* data (no pixels, no faces, which solves the minors problem) with a license that keeps RinkBuddy's commercial rights, and run a prize challenge on learn-to-skate and hockey skills. Outside ML teams build the models for a $5–25k prize, and RinkBuddy becomes the go-to source for this data, the role OOFSkate has taken for elite jumps.

4. **"Same skill?" pairwise game for coaches and adult skaters.** Borrow the ESP Game's agreement rule: two coaches independently tag the same clip, and the label is accepted when they agree. Add a Style Shuffle-style swipe feed ("clean landing? 👍/👎") for adults. Pairwise judgments are also how action-quality scoring is taught, and that is exactly the kind of data frontier LLMs are missing (doc 03).

5. **Synthetic jumps from a physics model, used as skeletons only.** Generate skeleton sequences from a few parameters (takeoff edge curve, airtime from g·t²/8, spin rate 2–5 rev/s) and retarget [CMU mocap](https://huggingface.co/datasets/gbionics/cmu-fbx) (commercial use allowed) for the upper body. Because RinkBuddy's classifier sees skeletons, not pixels, the realism problem that held back SURREAL mostly disappears. This works best for **counting rotations and under-rotation cases**, which are rare and dangerous to film on purpose.

---

## 5. Caveats

- "Time until the AI was good" estimates come from public timelines, not the companies' own statements. Tractable's and ELSA's dataset sizes are self-reported.
- Carv's sensors (pressure plus IMU) are not video. The transferable part is the *expert-scored seed set plus user data at scale*, not the modality.
- Any clips involving minors need verifiable parental consent before they are used as training data. Keep coach-review clips of under-13s out of training unless consent explicitly covers it.
