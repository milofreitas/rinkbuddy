# 05: Demand and obtainable market for a self-serve skating analyzer (2026-09-19)

Builds on `00-first-scan.md` (US participation and competitor list) and `02-adjacent-sports.md` (the analog apps). Figures from those files are not repeated here.

**Bottom line:** The demand is real, but people are asking for "feedback between lessons because a coach costs too much." Almost nobody searches for "a skating app." The largest and most vocal unserved group is **adult learners** (figure and hockey). They already film themselves and post the clips to Reddit for free critique. A realistic indie outcome is **roughly 300–800 paying subscribers in year 1 and 2,500–6,000 by year 3**, which is about **$20k–50k ARR in year 1 and $160k–390k ARR in year 3**. Lifestyle business or acquisition target, not venture-scale.

---

## 1. Voice of customer

**Method.** I pulled posts from the Arctic-Shift Reddit archive in two ways. The first was a keyword search of r/FigureSkating, r/iceskating, r/hockeyplayers and r/hockey, which returned 688 unique posts from 2018–2026. The second was a **full census of every post from 2026-03-18 to 2026-09-18**: 1,853 posts in r/iceskating, 8,607 in r/FigureSkating and 4,300 in r/hockeyplayers. r/AdultFigureSkating and r/hockeyparents returned no results. I read and hand-coded about 70 posts that talked about cost or coaching.

**Scale of "film myself and ask for critique" behavior (6-month census):**
- r/iceskating: 227 of 1,853 posts (12%) have native video. In a spot-check, about half of those were technique-critique requests, which works out to **about 4–5 self-filmed critique requests per week in one small subreddit**. The sub's AutoModerator even asks posters to attach video of the move they are troubleshooting ([example thread](https://www.reddit.com/r/FigureSkating/comments/1uztz4j/)).
- r/FigureSkating: 1,980 of 8,607 posts have video, mostly elite and fan content. It is a poor recruiting channel.
- r/hockeyplayers: 349 video posts, mostly about gear. Posts like "Looking for stride feedback" exist but are rare ([1uwb65b](https://www.reddit.com/r/hockeyplayers/comments/1uwb65b/)).

**Jobs-to-be-done (hand-coded, n≈70 cost/coaching posts):**

| # | Job / pain | ~Count | Representative snippet (<15 words) |
|---|---|---|---|
| 1 | Self-teaching because coaching is unaffordable or unavailable, and afraid of bad habits | ~25 | "private lessons are too expensive" ([r/FigureSkating](https://www.reddit.com/r/FigureSkating/comments/1uzxvjg/)); "i'm nervous about picking up bad habits" ([r/iceskating](https://www.reddit.com/r/iceskating/comments/1s9fgvz/)) |
| 2 | Budget math: how much is normal, is it worth it | ~18 | "$4672 for the first year" as an adult hobbyist, 49 comments ([r/FigureSkating](https://www.reddit.com/r/FigureSkating/comments/15nnsg5/)); "a little more than $1200... per month" at the doubles level ([r/FigureSkating](https://www.reddit.com/r/FigureSkating/comments/1qhfk14/)) |
| 3 | Rationing coaching: one lesson a month plus solo practice | ~10 | "I can probably afford one private lesson per month" (36 comments) ([r/FigureSkating](https://www.reddit.com/r/FigureSkating/comments/1vdvos9/)) |
| 4 | Feedback on one skill between lessons | ~9 (plus hundreds of video posts) | Crossover critique thread with 53 comments and a weekly follow-up progress post ([1vhdy3h](https://www.reddit.com/r/iceskating/comments/1vhdy3h/), [1vj9bxb](https://www.reddit.com/r/iceskating/comments/1vj9bxb/)) |
| 5 | Adult hockey learners with no coach | ~8 | "have no coach or experienced player on the team" (a 40s beginner) ([r/hockeyplayers](https://www.reddit.com/r/hockeyplayers/comments/1wg84vo/)) |
| 6 | Group-lesson frustration: crowded, little 1:1 time | ~6 | "too crowded class leading to very little actual 1on1" ([r/iceskating](https://www.reddit.com/r/iceskating/comments/1ubb93t/)) |
| 7 | Explicitly asking for an app to track or log progress | ~4 | "Not sure if such a thing exists though." ([r/iceskating](https://www.reddit.com/r/iceskating/comments/1u7hvx9/)); logging a coach's homework: "Is there an app?" ([r/iceskating](https://www.reddit.com/r/iceskating/comments/14yuhre/)) |

**Negative signals to design around:**
- **Anti-AI sentiment among figure skaters.** On a post recruiting testers for an AI training app, the top comment was "No AI. That's my input anyway." (13 points). Another commenter suggested simply tracking progress by uploading footage instead ([1uztz4j](https://www.reddit.com/r/FigureSkating/comments/1uztz4j/)). Golden Skate users call jump AI "rather a digital toy" at first ([Golden Skate](https://www.goldenskate.com/forum/threads/ai-powered-app-for-measuring-tracking-jump-metrics.102368/)).
- **Hockey builder fatigue.** At least 5 indie AI video-analysis tools were promoted in r/hockeyplayers in 6 months, including a hockey-dad AI coach ([1t1oz12](https://www.reddit.com/r/hockeyplayers/comments/1t1oz12/)) and an "OVR rating" app ([1sijezf](https://www.reddit.com/r/hockeyplayers/comments/1sijezf/)). Replies include "Can we ban these posts?" ([1t842xr](https://www.reddit.com/r/hockeyplayers/comments/1t842xr/)).
- **LiveBarn clips have many players in frame.** Users asked the tool to "isolate to a specific individual" ([1t1oz12](https://www.reddit.com/r/hockeyplayers/comments/1t1oz12/)). Player selection is a must-have for hockey.
- **App-store proof points.** Learn to Skate USA reviewers complain mostly of broken login, and one says "Great for what they have, unfortunately it's not a lot." Hockey AI-Analyzer mixes 5★ "pocket coach" reviews with 1★ "Not paying for this" and "still charges after you cancel" ([Apple RSS, LTS USA](https://itunes.apple.com/us/rss/customerreviews/id=1493922042/sortBy=mostRecent/json), [Hockey AI-Analyzer](https://itunes.apple.com/us/rss/customerreviews/id=6756755012/sortBy=mostRecent/json)).

## 2. Search demand (Ahrefs, US, monthly)

| Keyword | Avg/mo | Notes |
|---|---|---|
| how to ice skate | 62,000 | Peak 191k in Dec-2025 vs 16k in Aug-2025 (12×). Summer 2026 is about 36k vs 17k in summer 2025, a **~2× lasting post-Olympic lift** |
| learn to skate usa | 500 | Feb-2026 817 vs Feb-2025 236. Jun–Aug 2026 is 600–744, still elevated |
| ice skating lessons | 350 | Dec 882–972, May 105 (8× seasonal swing) |
| adult ice skating lessons near me | 250 | CPC $0.40 |
| hockey app | 150 | CPC $1.30 |
| ice skating lessons for adults | 100 | Jan peak 394 |
| power skating / hockey skating drills | 90 / 90 | Hockey drill searches are **down** in 2026 (summer 46–60 vs 75–97 in 2025) |
| how to do a waltz jump | 30 | ~2/mo pre-Olympics, then 76 in Feb-2026, still 19–51 |
| how to do a salchow | 10 | 0–3 to 20–38/mo after the Olympics |
| figure skating app / ice skating app / skating app | 0 / 0 / 10 | **Essentially no category search** |
| oofskate | 10 | One spike of 79 in Dec-2025, when the USFS partnership was announced |

The pattern matches U.S. Figure Skating's report of **20–30% learn-to-skate sign-up increases** in the four weeks after Milan, against about 10% in past Olympic years ([Sportico](https://www.sportico.com/personalities/athletes/2026/alysa-liu-popularity-figure-skating-signups-olympics-1234888100/)). **Implication:** acquisition must ride learning intent ("how to…", "adult lessons") through content, SEO and communities. Nobody types "skating app." Plan launches for **October–January**; demand is weakest from April to August.

## 3. Global participation

| Market | Size | Local app landscape |
|---|---|---|
| Canada | Hockey Canada: 603k+ players in 2024-25, growing for the 4th straight year, then a 5th ([Hockey Canada](https://www.hockeycanada.ca/en-ca/news/player-registration-grows-2025-corp), [2026](https://www.hockeycanada.ca/en-ca/news/player-registration-grows-2026-corp)). Skate Canada: 200k+ members, 1,000+ clubs, 7,000 coaches ([Skate Canada](https://skatecanada.ca/about/who-we-are/)) | No Skate Canada or CanSkate AI app found. English-speaking and same season as the US, so **include from day 1** |
| IIHF registered hockey (2024 survey) | US 566k · Canada 588k · Russia 90k · Sweden 80k · Finland 66k · Switzerland 31k · Czechia 27k · Germany 27k · Japan 12.5k · Norway 12.4k · Korea 3.6k · China "N/A" ([IIHF PDF](https://blob.iihf.com/iihf-media/iihfmvc/media/2025/survey/2024_iihf_annual_sop_iihf_com.pdf)) | Nordics are high-income with high English use: a year-2 expansion |
| China | 346M people "engaged" in winter sport by Jan-2022 per the NBS ([CPPCC](http://en.cppcc.gov.cn/2022-01/20/c_700282.htm)), and 313M since 2022 ([gov.cn](https://english.www.gov.cn/archive/statistics/202412/25/content_WS676c0c1dc6d0868f4e8ee459.html)). This counts one-off leisure, so it is not an addressable skater count. Figure training is modernizing with off-ice tech studios ([CGTN 2026](https://news.cgtn.com/news/2026-02-19/From-ice-to-innovation-The-shift-in-China-s-figure-skating-training-1KTopcNylSo/share_amp.html)) | Separate ecosystem. Out of scope |
| Japan / Korea | Figure-skater registration counts are not published in English. The Korea figures circulating online (e.g. "30,000 by 2014") come from low-quality sources ([Wikipedia: Impact of Yuna Kim](https://en.wikipedia.org/wiki/Impact_of_Yuna_Kim)) and are **unverified** | Strong fandom, but localization is costly. Later |

## 4. TAM / SAM / SOM (US + Canada; all assumptions labeled)

**Unit = paying household or individual. WTP = my annual price assumption,** anchored on: LTS 8-week sessions at about $150–250 ([Center Ice](https://www.centericearena.org/learn-to-skate/), [Anaheim ICE](https://anaheimice.therinks.com/skating-classes/learn-to-skate/)); a 30-min private lesson at $20–40 in MA ([r/FigureSkating](https://www.reddit.com/r/FigureSkating/comments/1j6mhg3/)) or $70–80/hr elsewhere ([r/FigureSkating](https://www.reddit.com/r/FigureSkating/comments/1roi4gn/)); HomeCourt at $69.99/yr and Sportsbox at about $110/yr (see `02`).

| Segment | Count basis | Units | WTP/yr | TAM | SAM share (why) | SAM $ |
|---|---|---|---|---|---|---|
| LTS families | US 185,581 LTS (file 00) + **assumed** 120k CanSkate, ÷1.3 skaters/household | 235k | $50 | $11.8M | 30% practice outside class | $3.5M |
| Competitive figure families | US 246k − 185k ≈ 60k + **assumed** 50k Canada | 110k | $150 | $16.5M | 25% (OOFSkate holds jumps) | $4.1M |
| Adult figure skaters | **Assumed** 50k NA (proxy: Adults Skate Too FB group at 16k+ ([source](https://adultsskatetoo.com/blogs/guides/how-to-start-figure-skating-as-an-adult))) | 50k | $80 | $4.0M | 60% (self-teaching is common) | $2.4M |
| Adult rec hockey | USA Hockey 183k adults (file 00) + IIHF Canada male senior 93k | 276k | $60 | $16.6M | 30% adult-onset or improvers | $5.0M |
| Youth hockey families | ≈403k US + ≈510k Canada youth, ÷1.2 | 760k | $100 | $76.0M | 15% (crowded; skating-only focus) | $11.4M |
| Coaches | USA Hockey 68.8k + Hockey Canada ≈93.6k (IIHF) + Skate Canada 7k | 170k | $120 | $20.4M | 10% | $2.0M |
| **Total** | | **~1.6M** | | **~$145M** | | **~$28M (~340k units)** |

A global TAM (Europe, Nordics, Asia) is roughly 1.7–2× this, at **about $250M**. That number is loose.

**SOM for a small indie app:**
- **Year 1:** 8k–20k downloads (Reddit, FB groups, coach seeding, SEO) × 2.5% download-to-paid, which is the North America median ([RevenueCat 2025](https://www.revenuecat.com/state-of-subscription-apps-2025)), up to about 4% with a trial paywall. That gives **300–800 subscribers × ~$60 blended ≈ $18k–48k ARR**.
- **Year 3:** 1–2% of SAM units, or **2,500–6,000 subscribers ≈ $160k–390k ARR**.
- **Sanity check:** SwingVision reports 20k+ paying subscribers and more than $4M ARR after years in tennis, a far bigger sport ([Wefunder](https://wefunder.com/swingvisioncf2025), [Tracxn](https://tracxn.com/d/companies/swingvision/__mtjZ2VObNzXqkMo6dqLL9Cod9rbXNENVpAULBpYUGHk)). OOFSkate has 12 ratings and Hockey AI-Analyzer has 73 ([iTunes API](https://itunes.apple.com/search?term=hockey+ai+analyzer&entity=software&country=us)). Reaching 5k subscribers on ice would be a top-of-niche result.

## 5. Investment context 2023–2026

- **Hudl is the consolidator.** It had made 18 acquisitions by Oct-2025 ([Wikipedia](https://en.wikipedia.org/wiki/Hudl)). These include the AI volleyball app Balltime in Feb-2025 ([BusinessWire](https://www.businesswire.com/news/home/20250206384625/en/Hudl-Expands-Volleyball-Focus-Through-Game-Changing-Acquisition-of-Balltime)), Titan Sports in Jun-2025 ([BusinessWire](https://www.businesswire.com/news/home/20250603230805/en/Hudl-Completes-Acquisition-of-Titan-Sports-Expanding-Performance-Tracking-Ecosystem)), **SportContract (hockey, its 3rd hockey deal) on 2025-08-06** ([Hudl](https://www.hudl.com/blog/hudl-acquires-sportcontract)) and ADI in Oct-2025 ([Hudl](https://www.hudl.com/blog/hudl-acquires-adi-multidirectional-metrics)).
- **SwingVision:** a $6M Series A in Oct-2023 ([SportsPro](https://www.sportspro.com/news/swingvision-ai-tennis-app-pickleball-padel/)) and a 2025 community round of about $1.58M ([Wefunder](https://wefunder.com/swingvision-cf-2025)).
- **Sportsbox AI:** a $5.5M seed ([SportsPro](https://www.sportspro.com/news/sportsbox-ai-seed-round-golf/)), then an "eight-figure" acquisition by a Bryson DeChambeau group in Apr-2026 (see `02`).
- **Carv:** about $20.8M raised, with a Series A in Apr-2024 (see `02`).
- **NurivaTech:** a $7.5M+ seed for smartphone 3D biomechanics in Mar-2026 ([PR Newswire](https://www.prnewswire.com/news-releases/pioneering-the-future-of-athletic-performance-nurivatech-ai-inc-unveils-sportfx-where-advanced-computer-vision-science-meets-human-motion-intelligence-302721574.html)).

**Read-through:** Capital goes to sports with large participation (tennis, golf, skiing) and to platforms buying niche AI. Consumer ice-sport AI has no disclosed venture rounds; OOFSkate's financing is not public. Realistic exits for RinkBuddy are a strategic sale (Hudl, LiveBarn, OOFSkate, or a governing-body partner) or a profitable niche business.

## 6. Recommendation: beachhead = adult learners (adult figure + adult-onset hockey), with coaches as the channel

**Why this group:**
1. Adults pay for themselves, so there is no COPPA problem.
2. They make the most visible cost-and-feedback complaints (jobs 1, 3, 5 and 6 above).
3. They already film and post clips, so the behavior exists.
4. OOFSkate targets competitive jumpers, and the hockey AI apps target youth players and shooting.
5. They are reachable for free in concentrated places: r/iceskating, r/hockeyplayers, and the Adults Skate Too group of 16k+.

**Position the product as a "progress journal + feedback between lessons," not an "AI coach."** That avoids the anti-AI backlash. Make player selection mandatory for LiveBarn clips.

**Three two-week experiments (no posting by the owner until approved):**

| # | Experiment | Cost | Success threshold |
|---|---|---|---|
| 1 | **Landing page + paid social** aimed at adults 25–55 interested in ice skating or hockey. Two headlines: "Feedback between lessons" vs "AI skating coach". Waitlist plus a "$59/yr founding member" pre-order button (pre-authorization only) | $400–600 | ≥8% visitor→waitlist, ≥1.5% click "pre-order", CPL ≤ $4. Pick the headline with the better CPL |
| 2 | **Concierge critique test:** offer free AI-plus-human reviews of skater-submitted clips via an approved r/iceskating or r/hockeyplayers post (mods OK'd first), then ask "would you pay $5/mo?" | $0 | ≥40 clips submitted, ≥30% of submitters come back with a second clip within 14 days, ≥25% say yes to paying |
| 3 | **Coach outreach:** 30 adult-program and LTS coaches get free Pro seats to assign homework and review student clips | $0 | ≥10 activate, ≥5 invite ≥3 students each, ≥1 coach asks about paid pricing |

**Kill or pivot signal:** if all three miss by more than 50%, the adult niche is too small. Pivot to a coach-first B2B tool at $15–30/mo, which is the OnForm model.
