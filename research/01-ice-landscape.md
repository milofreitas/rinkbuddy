# Ice-sports analysis landscape: deep dive (2026-09-19)

Scope: figure skating, hockey, speed skating and ringette. Covers AI and computer-vision products, wearables and coach video tools, with a focus on **self-serve phone-video skater analysis** (RinkBuddy's lane). This builds on `00-first-scan.md`. Every claim has a source URL. Where the App Store and a third-party tracker disagree, I note both.

---

## 1. Headline verdict

**Nobody holds meaningful share of self-serve skater analysis.** Every consumer AI skating app I found has fewer than about 125 ratings. The best-known one, OOFSkate, is estimated at **under 1,000 App Store downloads** and ranks outside the top 30 in US Free Sports ([MWM](https://mwm.ai/apps/oofskate/6747049922)). The largest by ratings is a solo-developer hockey app with about 124 ratings and "1,000+" downloads ([MWM](https://mwm.ai/apps/hockey-ai-analyzer/6756755012)).

The real money and scale sit in **B2B/team and hardware**:
- Hudl/Instat (teams)
- Sportlogiq, now Teamworks (31 of 32 NHL teams)
- LiveBarn (rink cameras)
- HELIOS (a $249/yr wearable)
- Drive Hockey (rink sensors)

None of these is a phone-video tool for an individual skater or a learn-to-skate (LTS) family.

The lane is **fragmented, new (most apps launched in 2025–26) and thin**. It is not locked up.

---

## 2. Figure skating

### 2a. Consumer AI apps

| Product | What it does / tech | Model and price | Traction | Status |
|---|---|---|---|---|
| **OOFSkate** (OOF Inc., MIT spinout) | Phone-video computer vision. Measures jump height, rotation speed, airtime and landing quality ([USFS](https://usfigureskating.org/news/2025/12/2/press-releases-us-figure-skating-partners-with-oofskate-to-bring-ai-powered-jump-metrics-to-athletes-nationwide.aspx)). Has added automatic jump classification (Mar 2026), spin tracking (Feb 2026) and GOE prediction in beta (Jul 2026) ([App Store](https://apps.apple.com/us/app/oofskate/id6747049922)). | Self-serve and coach. Pro $19.99/mo or $199.99/yr ([App Store](https://apps.apple.com/us/app/oofskate/id6747049922)). Monthly and "Club" tiers ([USFS](https://usfigureskating.org/news/2025/12/2/press-releases-us-figure-skating-partners-with-oofskate-to-bring-ai-powered-jump-metrics-to-athletes-nationwide.aspx)). | 4.7★ from 12 ratings ([App Store](https://apps.apple.com/us/app/oofskate/id6747049922)). Under 1k downloads, released Jul 1 2025 ([MWM](https://mwm.ai/apps/oofskate/6747049922)). Official USFS partner since Dec 2025. Founder Jerry Lu worked with NBC Sports on the 2026 Olympics ([MIT News](https://news.mit.edu/2026/3-questions-using-ai-help-olympic-skaters-land-quint-0210)). | **Alive, fast shipping.** Updated days ago. No funding disclosed in any source I found. |
| **Athlitix RinkUp** (NYU startup) | Jump height, time of flight, distance, launch angle, RPM and landing stability. Frame-picking angle tool, social feed, coach linking ([athlitix.com](https://www.athlitix.com/), [App Store](https://apps.apple.com/us/app/athlitix-rinkup/id6751922852)). | Premium $20/mo or $200/yr ([App Store](https://apps.apple.com/us/app/athlitix-rinkup/id6751922852)). | 4.5★ from 6 ratings. v3.0.1 released Jul 31 ([App Store](https://apps.apple.com/us/app/athlitix-rinkup/id6751922852)). Won the $75k grand prize at the NYU Entrepreneurs Challenge 2024–25 ([NYU](https://entrepreneur.nyu.edu/blog/2025/05/12/from-sidelines-to-center-stage-how-athlitix-is-transforming-sports-analytics-and-winning-big-at-nyu/)). | Alive. **A direct OOFSkate clone at the same price.** Swimming is next on its roadmap. |
| **Skate Score: AI Coach & Judge** (Shakesbeard Labs "CheckForm" family) | 33-point pose on Google ML Kit, running on-device. Claims IJS scoring with TES, GOE, PCS and levels, plus live voice cues ([Google Play](https://play.google.com/store/apps/details?id=com.checkform.figskating&hl=en)). | Self-serve, Android. | Download count not retrievable. It is a template app: sister versions exist for gymnastics and juggling ([search](https://apps.apple.com/us/app/checkform-ai-gymnastics-coach/id6757922269)). | Alive, but an **"AI app factory" product**. Its claim to judge PCS from a single phone video is implausible. |
| **Fujitsu × Japan Skating Federation** | Skeletal-recognition AI with **4 cameras** that turns jumps into 3D so rotation can be quantified. Installed at Kansai Airport Ice Arena ([Fujitsu PR, Jul 2025](https://global.fujitsu/ja-jp/pr/news/2025/07/05-01), [Nikkei xTech](https://xtech.nikkei.com/atcl/nxt/column/18/03446/012600002/?ST=singleview)). | Elite and federation only. | n/a | Not consumer. |
| **China: CFSA "AI-assisted scoring system 1.0"; HoloMotion** | Federation scoring aid. HoloMotion vision is used for national-team conditioning and rehab ([Baidu Cloud](https://cloud.baidu.com/article/3344554), [CSGF](https://cn.csgf.org.cn/xhzx/hydt/6872.html)). | Elite only. | n/a | Not consumer. |

### 2b. Governing-body and broadcast technology (not competitors, but they set expectations)

- **Omega / Swiss Timing.** Used 6 cameras at Beijing 2022 ([Axios](https://www.axios.com/2022/02/17/measuring-jumps-beijing-olympics-omega)). Used 14 8K cameras at Milano Cortina 2026, with a 3D model producing jump height, airtime and landing speed in under 0.1 s ([IEEE Spectrum](https://spectrum.ieee.org/winter-olympics-2026-tech)).
- **ISU.** Says it will first use the camera data to *support* the technical panel and only later fold it into scoring. Singles first, then pairs and dance ([CGTN](https://news.cgtn.com/news/2026-02-11/International-Skating-Union-weighs-AI-s-role-in-judging--1KFKl1sSgLK/p.html)). At the 2026 ISU Congress, Swiss Timing showed an 8-camera biomechanics tool for rotation angle ([Rocker Skating](https://live.rockerskating.com/blog/isu-congress-2026-live-updates)).
- **Implication for RinkBuddy.** "Jump height from TV" has become a mainstream expectation, so skaters will ask for jump numbers. But the elite/official lane belongs to Omega, the ISU and OOF.

### 2c. Non-AI progress, education and coach tools

| Product | Notes |
|---|---|
| **Learn To Skate USA app** (official) | 2.7★ from 29 ratings. Last update Jan 12 2025 ([App Store](https://apps.apple.com/us/app/learn-to-skate-usa/id1493922042)). **The weakest incumbent**; complaints are in section 5. |
| **Skate Canada Programs app** | Official CanSkate and PowerSkate progress tracker with coach feedback, attendance and schedules ([App Store CA](https://apps.apple.com/ca/app/skate-canada-programs/id6462375852)). This is the Canadian equivalent, and it is **tied to the club**. |
| **Figure It Out: Learn to Skate** | 18 tiers, 130+ skills, video tagging. Free tier limited to 30 s videos and 3 tags. Pro subscription. No AI ([App Store](https://apps.apple.com/us/app/figure-it-out-learn-to-skate/id6756882134)). |
| **Skating Skills** (Dana Tang) | Pattern and test-reference library. 4.6★ from 41 ratings. IAPs $7.99–$89.99. **Last updated Jul 2023** ([App Store](https://apps.apple.com/us/app/skating-skills/id1482659435)). A reference app that looks semi-dormant. |
| **Figure Skating Score** | Manual IJS calculator. 1.0★ from 1 rating ([App Store](https://apps.apple.com/us/app/figure-skating-score/id6748489645)). |
| **Coach video tools** | Coach's Eye was discontinued, so coaches moved to OnForm, Hudl Technique, CoachNow, Dartfish, Kinovea or V1 ([Dartfish](https://www.dartfish.com/blog/looking-for-an-alternative-to-coachs-eye/), [Coachway](https://coachway.io/articles/coachs-eye-alternatives/)). All are generic drawing and slow-motion tools with no skating intelligence. |

---

## 3. Hockey

### 3a. B2C self-serve phone-video AI (RinkBuddy's closest hockey rivals)

| Product | What / tech | Price | Traction | Status |
|---|---|---|---|---|
| **Hockey AI-Analyzer** (solo developer Harris Zimmerman) | Upload a clip and get AI feedback on skating, shooting and puck control, plus a score history ([App Store](https://apps.apple.com/us/app/hockey-ai-analyzer/id6756755012)). | $5/mo or $39.99/yr ([App Store](https://apps.apple.com/us/app/hockey-ai-analyzer/id6756755012)). | 4.5★ from 73 ratings on the App Store; MWM reports 124 ratings and 1,000+ downloads ([MWM](https://mwm.ai/apps/hockey-ai-analyzer/6756755012)). | Alive, updated 2 days ago. **The most-reviewed consumer AI skating app I found.** |
| **HLH Hockey Skating Analysis** (power-skating coach Henrik Loehman) | Phone video to 15 biomechanical metrics (knee bend, lean, hip extension, symmetry, "power leaks"), a PDF report card and drills. Says it is based on Calgary and McGill research ([hlhskateanalysis.com](https://hlhskateanalysis.com/)). | **$79–99/mo** ($949/yr). First analysis free ([site](https://hlhskateanalysis.com/)). | Not disclosed. | Alive. Premium price proves some parents will pay for **skating-only** analysis. |
| **GameRun** (Brendan Shaw) | Upload full game video and get 1–10 skill ratings, key moments and drills. Also markets to Junior Bruins-type organizations ([gamerun.ai](https://gamerun.ai/ice-hockey)). | Free (3 videos), Core $29/mo, Complete $59/mo (4 videos/mo) ([plans](https://gamerun.ai/plans-videos)). | Not disclosed. | Alive. |
| **Skate Stride Pro** | AI analysis of knee bend, stride length, balance and edges. Claims "thousands of players" ([search result](https://skatestridepro.com/)). | Unknown (site did not load). | Unverified. | Unclear. |
| **HockeyTutor** | AI skill scores for shooting, stickhandling and skating. Built for Canadian youth hockey **and ringette** ([hockey-skills.com](https://hockey-skills.com/)). | Unknown. | Unknown. | Only ringette-aware tool found. |
| **Hockey AI** (49ing AG) | Game-video event tagging, xG and an LLM coach ([App Store](https://apps.apple.com/us/app/hockey-ai/id6477876742)). | Free. | 5.0★ from 2 ratings. | Alive. Team and stats focused. |
| **HeadsUpHockeyAI** | Off-ice puck tracking via a mirror ([App Store](https://apps.apple.com/us/app/headsuphockeyai/id6736772179)). | Free. | 3.6★ from 28 ratings. **Last update Apr 2025.** | Stagnant. Not a skating tool. |

### 3b. Hardware, wearables and B2B (these hold the real share and dollars)

| Product | Model | Price / funding | Notes |
|---|---|---|---|
| **HELIOS** | Shoulder-pad sensor tracking speed, explosiveness, agility, balance and a "hustle score". Auto shift detection and a LiveBarn video link ([membership](https://helioshockey.com/products/helios-membership)). | $29/mo (7-month minimum), $249/yr or $399 for 2 yrs ([membership](https://helioshockey.com/products/helios-membership)). Raised **$2.2M** including from Ron Francis ([HELIOS press](https://helioshockey.com/blogs/press/helios-raises-2-2m-to-scale-hockey-wearable)). | Sold at Pure Hockey and Pro Hockey Life. App is **3.9★ from 50 ratings**, with freezing and lost-session complaints ([App Store](https://apps.apple.com/us/app/helios-app/id1517234886)). **The closest thing to a youth skating-metrics brand.** |
| **Drive Hockey Analytics** (Vancouver, founded 2018) | Portable rink sensors plus a player tag. Tracks 30 players on ice ([Drive](https://drivehockey.com/player-tracking-system/)). | Sale or rental, quote only. | USHL and NAHL combines ([USHL](https://ushl.com/news/2025/7/15/mens-ice-hockey-league-partners-with-drive-hockey-analytics-for-combine.aspx), [NAHL](https://nahl.com/news/story.cfm?id=39774)). B2B events. |
| **Sportlogiq, acquired by Teamworks** (Jan 18 2026) | Broadcast-video computer vision. 31 of 32 NHL teams and 42 D-I programs ([YSBR](https://youthsportsbusinessreport.com/teamworks-acquires-sportlogiq-to-expand-ai-powered-hockey-analytics-platform/)). | Teamworks is valued at over $1B ([YSBR](https://youthsportsbusinessreport.com/teamworks-acquires-sportlogiq-to-expand-ai-powered-hockey-analytics-platform/)). | Powers **LiveBarn Player Analysis: $14.95 per game** for a highlight reel, time on ice and a heat map ([LiveBarn](https://www.livebarn.com/player-analysis)). |
| **LiveBarn** | Fixed rink cameras and streaming. "Over 1,200 venues" ([LiveBarn](https://www.livebarn.com/player-analysis)), or 4,000+ surfaces (search snippet from [livebarn.com](https://www.livebarn.com/)). | Subscription. | **The distribution giant.** It already has video of most youth games. Its analytics are game and positional, **not skating technique**. |
| **Hudl / Hudl Instat** | Team video and data. | Bronze $400, Silver $1,000, Gold $1,600 per team per year ([Hudl](https://www.hudl.com/pricing/club/ice-hockey)). The OMHA requires it for U16 and U18 AAA teams ([OMHA](https://www.omha.net/news_article/show/1340943)). | Acquired SportContract in Aug 2025 ([Hudl](https://www.hudl.com/blog/hudl-acquires-sportcontract)). Team-owned, not skater-owned. |
| **Catapult One** | Wearable for skating load and intensity ([Catapult](https://www.catapult.com/sports/ice-hockey)). | Pro and college focus. | |
| **NHL Sense Arena** | VR training. Raised $3M (last round 2022) and has 10k+ registered users ([Tracxn](https://tracxn.com/d/companies/sense-arena/__nfooU-hAy1Fnjgg55npJ6dhzF0Vpz9R85dxULQ8dKSg)). Partnered with the NHLPA in Nov 2025 ([NHLPA](https://www.nhlpa.com/news/sense-arena-and-nhlpa-partner-to-bring-nhl-stars-to-virtual-reality/)). | Subscription. | Complaints about the "high cost annual subscription" and region pricing ([goaliecoaches](https://goaliecoaches.com/sense-arena/)). Not a skating tool. |
| **Skating treadmills** (Woodway Blade, Glice Skatemill, HDTS) | Facility equipment. Quote-only pricing ([Glice guide](https://www.glicerink.com/blog-ice-skating-treadmill-guide/), [Woodway](https://www.woodway.com/treadmills/blade/)). | Programs run about $285 for 6 weeks ([Hockey Hut](https://myhockeyhut.com/programs/skating-treadmill/)). | Some facilities now add "live video delay and AI-powered skating analysis" ([Barnburner](https://www.barnburneracademy.com/products/skating-treadmill)). These are **B2B partner candidates, not rivals.** |

---

## 4. Speed skating, synchronized skating, ringette

- **Speed skating.** Only a results and data site, ShortTrack Analytics ([shorttrack.ai](https://shorttrack.ai/)), plus academic work on IMU stroke detection ([Sports Biomechanics](https://www.tandfonline.com/doi/abs/10.1080/14763141.2024.2331174)). **No consumer technique app.**
- **Synchronized skating.** Nothing found.
- **Ringette.** Only HockeyTutor claims support ([hockey-skills.com](https://hockey-skills.com/)).
- These are all empty, but also small. They are adjacency options later, not a wedge.

---

## 5. Poorly developed tools: specific user complaints

| Tool | Complaint (source) |
|---|---|
| **Learn To Skate USA** | "Way too basic." Adding one skill to the practice calendar takes about 7 taps. It does not remember the skater's curriculum level. Login fails even after a password reset while the website works. Badges are not awarded after passing a level. No update since Jan 2025 ([App Store](https://apps.apple.com/us/app/learn-to-skate-usa/id1493922042)). |
| **HELIOS app** | "Now it freezes all the time." A session recorded only 1 minute of an hour-long practice. Session times and activity type cannot be edited after the fact ([App Store](https://apps.apple.com/us/app/helios-app/id1517234886)). |
| **Athlitix RinkUp** | Onboarding confuses skaters; one reviewer said they "don't understand nothing" and asked the company to talk to skaters about how to use it ([App Store](https://apps.apple.com/us/app/athlitix-rinkup/id6751922852)). |
| **HeadsUpHockeyAI** | "Terrible and non user friendly." No easy switching between multiple kids' profiles. Inconsistent target detection. Stale since Apr 2025 ([App Store](https://apps.apple.com/us/app/headsuphockeyai/id6736772179)). |
| **Sense Arena** | Most content sits behind a high annual subscription, and the goalie season was removed ([goaliecoaches](https://goaliecoaches.com/sense-arena/)). |
| **Skating Skills** | An in-app purchase button fails. No update since 2023 ([App Store](https://apps.apple.com/us/app/skating-skills/id1482659435)). |
| **OOFSkate** (skepticism, not reviews) | Forum skaters doubt jump height can be measured "consistently with only an iPhone camera," question whether data logging needs AI at all, and warn against forcing one "correct" jump technique ([Golden Skate](https://www.goldenskate.com/forum/threads/ai-powered-app-for-measuring-tracking-jump-metrics.102368/)). |
| **Figure Skating Score** | 1★. The user could not work out how to sign in ([App Store](https://apps.apple.com/us/app/figure-skating-score/id6748489645)). |

**Recurring themes:**
1. Multi-child and family profiles are missing.
2. Logging is slow and takes too many taps.
3. Sessions are lost or can't be edited.
4. Official progress (badges and levels) doesn't sync.
5. Metrics come without plain-language "what do I do next."
6. Pricing is $20–99/mo for what is effectively jump numbers.

---

## 6. Who has "share," and where the gap is

**Estimated reach of self-serve skater analysis apps today** (rough, from ratings and download proxies):

| Player | Signal |
|---|---|
| Hockey AI-Analyzer | Largest: about 124 ratings, 1k+ downloads |
| OOFSkate | Under 1k downloads, but carries USFS endorsement |
| RinkUp, HLH, GameRun, Skate Score, Figure It Out | Each probably in the hundreds of users or fewer |

Set against 586k USA Hockey players and about 185k Learn to Skate USA members (`00-first-scan.md`), the combined penetration is very likely **well under 1%**. **No one dominates.**

**Where incumbents are strong (avoid):**
- Elite jump metrics: OOF + USFS, Omega + ISU, Fujitsu + JSF
- Team game video: Hudl, LiveBarn + Sportlogiq/Teamworks
- Wearable speed data: HELIOS

**Open lane for RinkBuddy:**
1. A **family-friendly, cross-discipline progress tracker** for LTS and beginner-to-intermediate skaters (figure and hockey). It should cover:
   - basic-skill checks (edges, crossovers, stops, glides, spins)
   - multi-kid profiles
   - fast logging
   - LTS / CanSkate level mapping that actually works
2. **Priced under the $20/mo AI apps**, since the $5/mo Hockey AI-Analyzer is winning on volume.
3. **Coach-sharing** as a light feature to replace dead Coach's Eye workflows, not a Hudl-style team suite.
4. **Partnership targets:**
   - skating-treadmill facilities that lack analysis software
   - LTS programs underserved by the 2.7★ official app
   - possibly LiveBarn, for video ingest

**Threats to watch:**
- OOFSkate expanding down-market into LTS (the USFS press release already mentions "Learn to Skate USA® to world champions")
- USFS rebuilding its LTS app
- LiveBarn/Teamworks adding individual skating-technique AI to video it already owns
