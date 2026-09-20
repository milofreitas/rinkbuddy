# RinkBuddy — CHECKING and GOALIE node lists (sourced)

Written: 2026-09-20 · Follow-up to `research/11-audit-hockey.md` §4e and §7
Baseline: `index.html` → `SKILLS.hockey` as it stands today (**70 nodes**, post-audit corrections)

Every level claim below carries a URL. Where USA Hockey's own documents disagree with each other, the row says so and names which one I took.

---

## 0. Sources

| Key | Document | URL |
|---|---|---|
| **RB25** | USA Hockey, *Official Rules of Ice Hockey 2025-29* — Rule 604 (p.61) + Glossary (p.x, "Competitive Contact" / "Body Checking") | https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf |
| **RB604** | Same rule, web edition | https://www.usahockeyrulebook.com/page/7710/rule-604-body-checking-competitive-contact-categories- |
| **SP** | USA Hockey CEP, *Skill Progressions for Youth Hockey* — the age-banded master curriculum | https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf |
| **CHK** | USA Hockey, *Checking The Right Way For Youth Hockey* (2015) — the 4-step model, Steps 1-4 at pp. 27/43/53/69 | https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf |
| **BCH** | USA Hockey CEP, *Teaching Body Contact & Body Checking* handout (excerpted from CHK) | https://portal.usahockey.com/cx/hockey-development-coordinator/coaching-development/teaching_body_contact_handout.pdf |
| **8UM** | USA Hockey *8 & Under (Mite) Practice Plan Manual* — "Suggested Emphasis for 8 & Under" matrix, Checking + Goalkeeping columns | https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf |
| **OMHA** | OMHA, *Checking — the 4-Step Progression* | https://www.omha.net/page/show/885509-checking-4-step-progression |
| **ADMBC** | ADM Kids, *12U Q&A: Transition to Body-Checking* | https://www.admkids.com/news_article/show/345756-12u-qanda-transition-to-body-checking |
| **GPP** | USA Hockey Goaltending, *Goaltender Practice Plans* — the 4-stage, 32-week goalie curriculum and its age bands | https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans |
| **G10** | USA Hockey, *Goaltender Practice Plans 10U* | https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf |
| **G14** | USA Hockey, *Goaltender Practice Plans 13U & 14U* | https://cdn1.sportngin.com/attachments/document/fce4-1635241/14U_Goalie_Practice_plans.pdf |
| **G18** | USA Hockey, *Goaltender Practice Plans 18U & HS* | https://cdn3.sportngin.com/attachments/document/5b82-2977724/18U_Goalie_Practice_Plan.pdf |
| **ADMG6** | ADM Kids, *Goaltending at 6U/8U: Smiles, Stickers and Shared Responsibility* | https://www.admkids.com/news_article/show/1345429 |
| **ADMG10** | ADM Kids, *10U: The Budding Goalie* | https://www.admkids.com/news_article/show/1345430 |
| **ADMG12** | ADM Kids, *12U: Goalies Getting Dialed In* | https://www.admkids.com/news_article/show/1345434 |
| **ADMG13** | ADM Kids, *10U Q&A: When is the time for full-time?* | https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time |
| **AGE** | USA Hockey, *Age Classifications* | https://www.usahockey.com/ageclassifications |
| **HIP** | Bakken et al., *The Perceived Demands of Ice Hockey Goaltending Movements on the Hip and Groin Region* (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC8647250/ |

Level mapping, unchanged from the audit: `beginner`≈8U · `intermediate`≈10U · `advanced`≈12U · `expert`≈14U+ ([AGE](https://www.usahockey.com/ageclassifications)).

---

## 1. THE BODY-CHECKING AGE — verified, not from memory

**Body checking is legal from 14U (Bantam) upward. It is prohibited in the 12 & under classification and below — and in *all* Girls'/Women's classifications at *every* age.**

Verbatim from the **current 2025-29 rulebook**, Rule 604(a), p.61:

> "Body checking is prohibited in the 12 & under youth age classifications and below, all Girls'/Women's age classifications and all non-check Adult classifications. These levels would be considered the Competitive Contact Category of play."
> — [RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf)

Five things this changes for the tree:

1. **It moved, and the audit's memory of "14U" is right but for a stale reason.** USA Hockey shifted legal body checking from 12U (Pee Wee) to 14U (Bantam) effective the **2011-12 season**. The OMHA page the audit cited describes the *Ontario* change (U13→U15, 2013-14 season, rep level) — same real ages, different governing body. Do not cite OMHA for the USA Hockey rule; cite Rule 604.
2. **The terminology also changed.** The 2013-17 rulebook called the non-checking tiers "**Body Contact**" categories. The 2025-29 rulebook renames them "**Competitive Contact**" categories and adds a glossary entry defining angling, physical engagement and collisions as legal at every age. Any user-facing copy in the app should say *competitive contact*, not *body contact*.
3. **Girls'/women's hockey never gets step 4.** A girls'/women's player at 14U, 16U, 19U or adult still plays competitive contact. If RinkBuddy ever asks for a division, the four step-4 nodes must be gated off for girls'/women's players rather than shown as locked-but-coming.
4. **The rulebook explicitly wants contact taught at every age.** Rule 604(a) Note: *"USA Hockey strongly encourages competitive contact to occur in all age classifications as part of the skill progression that teaches body checking."* ([RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf)) This is the sentence that justifies putting checking nodes at `beginner`.
5. **Non-obvious finding — USA Hockey's own curriculum teaches *delivering* a body check later than the rules allow it.** Diffing SP's Body Contact lists:
   - 14U adds **j. shoulder check** and **k. receiving a body check** — and nothing else.
   - **l. delivering a body check** and **m. hip check** first appear in the **16/18U** list.

   So the rules permit checking at 14U, but SP's first-appearance for *delivering* one is 16/18U; 14U is the year you learn to *see it coming and absorb it*. ([SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf)) The app's top tier is `expert` = 14U+, so both land at `expert`, but the tips and prereq order must reflect receive-before-deliver.

**What "contact but not checking" means in the app.** Everything in Steps 1, 2 and 3 below is *legal at every age, including 8U*. Only the five Step 4 nodes are age-gated. CHK is explicit that Steps 1-3 "build the players' base during their early levels of hockey, **8 & Under through 10 & Under**", and that Step 4's skills "are eased in throughout the **12 & Under** level" — i.e. taught in practice at 12U, played in games from 14U. ([CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) p.25)

**Body-contact education that is genuinely taught from 8U:**

| Taught at 8U | Source |
|---|---|
| **Stick on puck** and **stick lift** — SP's entire 8U Body Contact list is these two items | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf), 8U §5 |
| The 8U emphasis matrix's Checking column: **poke check, hook check, lift the stick check, covering** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| Incidental contact through the cross-ice / small-area game model — "players are first being introduced to incidental body contact through the close proximity of small-area station-based practices" at 8U | [ADMBC](https://www.admkids.com/news_article/show/345756-12u-qanda-transition-to-body-checking) |
| The rulebook's blanket encouragement of competitive contact "in all age classifications" | [RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf) Rule 604(a) Note |

Two conflicts worth recording: the 8U matrix puts **poke check** at 8U while SP first names it at **10U** — I took SP (`intermediate`), because SP is the curriculum and the matrix is a practice-planning aid. And the 8U matrix's **hook check** is deliberately *not* given a node: it is not in SP at any age and it is now essentially a hooking penalty.

**"Shoulder check" — reading SP correctly.** SP does not define the term. Its position in the list (j, between *receiving body contact* and *receiving a body check*, and **before** *delivering a body check* at l and *hip check* at m) means it is the over-the-shoulder **scan**, not a check thrown with the shoulder — the delivery variants cluster at l/m. CHK's Step 4 outline supports this, listing "awareness when approaching from behind" and "the respect zone" as taught alongside receiving. The app's current `h-shoulder-check` bundles "Shoulder Check / Receiving a Body Check" into one node; **split it**.

---

## 2. DELIVERABLE 1 — the CHECKING track (24 nodes: 10 already in the tree, 14 new)

Types stay inside the existing enum; every node is `type: "defensive"`.
`✅ EXISTS` = already in `SKILLS.hockey` today. `➕ ADD` = new.
**Gate** column: `any age` = legal competitive contact at every level; `14U+` = step 4, rules-gated.

### Step 1 — Positioning & Angling (no contact at all)

| id | name | level | prereqs | gate | status | tip | source |
|---|---|---|---|---|---|---|---|
| `h-gap-control` | Gap Control | intermediate | h-bwd-cross, h-lateral | any age | ✅ EXISTS | Keep just enough space that you can still reach the puck carrier, and close it as they slow down. | SP 10U Body Contact (d) — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-angling` | Angling | intermediate | h-lateral, h-hockey-stop | any age | ✅ EXISTS | Skate at the spot the puck carrier is heading for, not at the player, so they run out of ice instead of you running into them. | SP 10U Body Contact (e); RB25 glossary defines angling as legal at every age — [RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf) |
| `h-mirror-skating` | Defensive Side Position (Man-You-Net) | intermediate | h-gap-control, h-backwards-cross-full | any age | ✅ EXISTS | Stay on the net side of your opponent so you are always between them and your goal. | SP 10U Defensive Concepts (e); CHK Step 1 "Defensive Side" — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) p.27 |
| `h-steering` | Steering | intermediate | h-angling | any age | ➕ ADD | Use your body angle to herd the puck carrier toward the boards instead of letting them pick their own lane. | CHK Step 1, drill 38 "Steering" — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |
| `h-closeout` | Closing the Gap | advanced | h-angling, h-top-speed | any age | ✅ EXISTS | Once you have the angle, shut the space down fast so the opening is too small for the puck to get through. | CHK drills 40/41; RB25 glossary ("closes the gap and creates an opening that is too small for the puck carrier") — [RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf) |

### Step 2 — Stick Checks (still no body contact)

| id | name | level | prereqs | gate | status | tip | source |
|---|---|---|---|---|---|---|---|
| `h-stick-on-puck` | Stick on Puck | beginner | h-stick-grip | any age | ✅ EXISTS | Your stick blade lives on the ice near the puck — this is the very first checking skill USA Hockey teaches. | SP 8U Body Contact (a) — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-stick-lift` | Stick Lift | beginner | h-stick-on-puck | any age | ✅ EXISTS | Slide your blade under their shaft near the hands and lift, then take the puck — no pushing needed. | SP 8U Body Contact (b); 8UM Checking column "lift the stick check" — [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| `h-tap-check` | Tap Check | intermediate | h-stick-on-puck, h-angling | any age | ➕ ADD | From just behind their hip, give one short tap on the blade to knock the puck loose. | CHK Step 2, drill 49 "Tap Check" — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) p.43 |
| `h-poke-check` | Poke Check | intermediate | h-stick-on-puck, h-angling | any age | ✅ EXISTS | One quick jab at the puck with the top hand loose — poke at the puck, never at the player. | SP 10U Body Contact (c); 8UM lists it at 8U (took SP) — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-sweep-check` | Sweep Check | intermediate | h-poke-check | any age | ➕ ADD | Lay the stick flat and sweep a wide arc across the ice — it is big and slow, so time it rather than lunging. | CHK Step 2, drill 48 "Sweep Check" (p.49: "the large motion involved makes it difficult to use the sweep check as a surprise") — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |
| `h-stick-press` | Stick Press | advanced | h-stick-lift, h-steering | any age | ➕ ADD | Pin their blade to the ice with yours and hold it there until a teammate takes the puck. | SP 12U Body Contact (f); CHK drill 47 "Press Check" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-pry-check` | Pry Check | advanced | h-stick-lift | any age | ➕ ADD | Hook your blade under theirs and pry it up and away to free the puck in a battle. | CHK Step 2, drill 50 "Pry Check" (not named in SP at any age) — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |

### Step 3 — Body Contact / Competitive Contact (legal at every age, including 8U)

| id | name | level | prereqs | gate | status | tip | source |
|---|---|---|---|---|---|---|---|
| `h-board-protection` | Protecting Yourself on the Boards | intermediate | h-ready-stance, h-hockey-stop | any age | ➕ ADD | Inside foot, knee and hip tight to the boards, elbow up on the top board, head high — lean into the contact, never duck. | CHK Step 3 "Receiving by the Boards"; BCH "Board Protection" — [BCH](https://portal.usahockey.com/cx/hockey-development-coordinator/coaching-development/teaching_body_contact_handout.pdf) |
| `h-contact-confidence` | Receiving Body Contact (Contact Confidence) | advanced | h-angling, h-stick-lift | any age | ✅ EXISTS *(rename: drop "Delivering and")* | Knees bent, muscles tight, take the contact on your shoulder and hip — the more you practice it, the less it surprises you. | SP 12U Body Contact (i) — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-deliver-body-contact` | Delivering Body Contact | advanced | h-angling, h-steering | any age | ➕ ADD | Use your body to take away their lane while you play the puck — this is blocking a path, not hitting anyone. | SP 12U Body Contact (h); CHK Step 3 ("use the body to block the opponent's way or take away his skating lanes") — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) p.53 |
| `h-rubbing-out` | Rubbing Out | advanced | h-deliver-body-contact, h-angling | any age | ➕ ADD | Skate parallel to the puck carrier and gradually cut off their line of travel into the boards. | CHK Step 3, drill 63 "Rubbing Out" — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |
| `h-screen-out` | Screening Out | advanced | h-deliver-body-contact | any age | ➕ ADD | Hold your ground in front of your net so the opponent cannot get to the puck or the rebound. | CHK Step 3, drill 64 "Screening Out" — [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |
| `h-pinning` | Pinning | advanced | h-rubbing-out | any age | ➕ ADD | Control the opponent against the boards with your top hand and hips while a teammate comes for the puck. | CHK Step 3, drill 66 "Pinning"; BCH "Pinning / Hold the Pin Competition" — [BCH](https://portal.usahockey.com/cx/hockey-development-coordinator/coaching-development/teaching_body_contact_handout.pdf) |
| `h-box-out` | Box-Out Positioning | expert | h-lateral, h-angling | any age | ✅ EXISTS | Get your body between your opponent and the puck and move them out of the scoring area. | SP 14U Defensive Concepts (n) "boxing out and fronting an opponent"; CHK drill 65 — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |

### Step 4 — Body Checking (**14U+ only**; illegal in games at 12U and below and in all Girls'/Women's classifications)

| id | name | level | prereqs | gate | status | tip | source |
|---|---|---|---|---|---|---|---|
| `h-shoulder-check` | Shoulder Check (Scan) | expert | h-contact-confidence | any age | ✅ EXISTS *(split + rename)* | Look over your shoulder before you get the puck so you already know who is coming and from where. | SP 14U Body Contact (j) — first appearance is 14U; reading justified in §1 — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-receive-body-check` | Receiving a Body Check | expert | h-shoulder-check, h-board-protection | any age *(skill)* / 14U+ *(in games)* | ➕ ADD | Turn your shoulder and hip toward the checker, tighten up, and lean in — never turn your back or duck. | SP 14U Body Contact (k); BCH "Taking a Check — board protection, push free, offensive check, roll off" — [BCH](https://portal.usahockey.com/cx/hockey-development-coordinator/coaching-development/teaching_body_contact_handout.pdf) |
| `h-body-check` | Delivering a Body Check | expert | h-receive-body-check, h-deliver-body-contact | **14U+** | ➕ ADD | Legal only from 14U: trunk only, above the knees and at or below the shoulders, stick blade below the knees, and only on the puck carrier. | Rule legality: [RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf) Rule 604(a) + Glossary "Body Checking". Curriculum first-appearance: SP **16/18U** Body Contact (l) — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-hip-check` | Hip Check | expert | h-body-check | **14U+** | ➕ ADD | Drop low and turn your hip into the puck carrier along the boards — the hardest check to time, so learn it last. | SP 16/18U Body Contact (m); CHK drills 79/80 — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `h-contain-stall` | Containing / Stalling | expert | h-body-check, h-gap-control | **14U+** | ➕ ADD | Sometimes the right play is not to hit — hold your gap and stall the rush until help arrives. | SP 16/18U Body Contact (n) "containing/stalling"; Defensive Concepts (o) "stall/contain" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |

### 2a. Coverage check against SP's 11 Body Contact items

| SP item (first appearance) | Node |
|---|---|
| a. stick on puck (8U) | `h-stick-on-puck` |
| b. stick lift (8U) | `h-stick-lift` |
| c. poke check (10U) | `h-poke-check` |
| d. gap control concept (10U) | `h-gap-control` |
| e. body positioning and angling (10U) | `h-angling` |
| f. stick press (12U) | `h-stick-press` ➕ |
| g. angling (12U, re-listed as an applied skill) | `h-closeout` |
| h. delivering body contact (12U) | `h-deliver-body-contact` ➕ |
| i. receiving body contact / contact confidence (12U) | `h-contact-confidence` |
| j. shoulder check (14U) | `h-shoulder-check` |
| k. receiving a body check (14U) | `h-receive-body-check` ➕ |
| l. delivering a body check (16/18U) | `h-body-check` ➕ |
| m. hip check (16/18U) | `h-hip-check` ➕ |
| n. containing/stalling (16/18U) | `h-contain-stall` ➕ |

11 of 11 covered, plus the three 16/18U items. The remaining seven ADDs (`h-steering`, `h-tap-check`, `h-sweep-check`, `h-pry-check`, `h-board-protection`, `h-rubbing-out`, `h-screen-out`, `h-pinning`) come from CHK's own Step 1/2/3 skill lists and are not separately named in SP — each row says so.

### 2b. Edits to existing nodes (do these with the ADDs, or the graph double-counts)

```json
[
  {"id":"h-shoulder-check","change":"rename + narrow scope","from":{"name":"Shoulder Check / Receiving a Body Check","prereqs":["h-contact-confidence"]},"to":{"name":"Shoulder Check (Scan)","prereqs":["h-contact-confidence"]},"why":"SP lists shoulder check (j) and receiving a body check (k) as two separate 14U items. Bundling them hides the receiving skill, which is the safety-critical one. Split, keeping this id for the scan.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-contact-confidence","change":"rename","from":"Body Contact: Delivering and Receiving (Contact Confidence)","to":"Receiving Body Contact (Contact Confidence)","why":"SP 12U splits delivering (h) from receiving (i). 'Contact confidence' is SP's parenthetical for RECEIVING only. Delivering now has its own node, h-deliver-body-contact.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-angling","change":"tip","to":"Skate at the spot the puck carrier is heading for, not at the player, so they run out of ice instead of you running into them.","why":"The 2025-29 rulebook glossary now defines angling as an explicitly legal competitive-contact skill at every age; the tip should say what it is, not cite a manual.","source":"https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf"}
]
```

### 2c. Ready-to-paste JSON — the 14 NEW checking nodes

```json
[
  {"id":"h-steering","name":"Steering","type":"defensive","level":"intermediate","prereqs":["h-angling"],"bv":0,"tip":"Use your body angle to herd the puck carrier toward the boards instead of letting them pick their own lane.","source":"USA Hockey, Checking The Right Way, Step 1 (drill 38 'Steering') — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-tap-check","name":"Tap Check","type":"defensive","level":"intermediate","prereqs":["h-stick-on-puck","h-angling"],"bv":0,"tip":"From just behind their hip, give one short tap on the blade to knock the puck loose.","source":"USA Hockey, Checking The Right Way, Step 2 (drill 49 'Tap Check'), taught 8U-10U per p.25 — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-sweep-check","name":"Sweep Check","type":"defensive","level":"intermediate","prereqs":["h-poke-check"],"bv":0,"tip":"Lay the stick flat and sweep a wide arc across the ice - it is big and slow, so time it rather than lunging.","source":"USA Hockey, Checking The Right Way, Step 2 (drill 48 'Sweep Check', p.49) — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-stick-press","name":"Stick Press","type":"defensive","level":"advanced","prereqs":["h-stick-lift","h-steering"],"bv":0,"tip":"Pin their blade to the ice with yours and hold it there until a teammate takes the puck.","source":"USA Hockey Skill Progressions, 12U Body Contact (f) 'stick press'; Checking The Right Way drill 47 — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-pry-check","name":"Pry Check","type":"defensive","level":"advanced","prereqs":["h-stick-lift"],"bv":0,"tip":"Hook your blade under theirs and pry it up and away to free the puck in a battle.","source":"USA Hockey, Checking The Right Way, Step 2 (drill 50 'Pry Check'); not named in Skill Progressions at any age — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-board-protection","name":"Protecting Yourself on the Boards","type":"defensive","level":"intermediate","prereqs":["h-ready-stance","h-hockey-stop"],"bv":0,"tip":"Inside foot, knee and hip tight to the boards, elbow up on the top board, head high - lean into the contact, never duck.","source":"USA Hockey, Teaching Body Contact & Body Checking, 'Taking a Check - Board Protection'; Checking The Right Way Step 3 'Receiving by the Boards' (p.53) — https://portal.usahockey.com/cx/hockey-development-coordinator/coaching-development/teaching_body_contact_handout.pdf"},
  {"id":"h-deliver-body-contact","name":"Delivering Body Contact","type":"defensive","level":"advanced","prereqs":["h-angling","h-steering"],"bv":0,"tip":"Use your body to take away their lane while you play the puck - this is blocking a path, not hitting anyone.","source":"USA Hockey Skill Progressions, 12U Body Contact (h) 'delivering body contact' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-rubbing-out","name":"Rubbing Out","type":"defensive","level":"advanced","prereqs":["h-deliver-body-contact","h-angling"],"bv":0,"tip":"Skate parallel to the puck carrier and gradually cut off their line of travel into the boards.","source":"USA Hockey, Checking The Right Way, Step 3 (drill 63 'Rubbing Out', p.53) — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-screen-out","name":"Screening Out","type":"defensive","level":"advanced","prereqs":["h-deliver-body-contact"],"bv":0,"tip":"Hold your ground in front of your net so the opponent cannot get to the puck or the rebound.","source":"USA Hockey, Checking The Right Way, Step 3 (drill 64 'Screening Out', p.53) — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-pinning","name":"Pinning","type":"defensive","level":"advanced","prereqs":["h-rubbing-out"],"bv":0,"tip":"Control the opponent against the boards with your top hand and hips while a teammate comes for the puck.","source":"USA Hockey, Checking The Right Way, Step 3 (drill 66 'Pinning'); Teaching Body Contact handout 'Pinning' — https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-receive-body-check","name":"Receiving a Body Check","type":"defensive","level":"expert","prereqs":["h-shoulder-check","h-board-protection"],"bv":0,"tip":"Turn your shoulder and hip toward the checker, tighten up, and lean in - never turn your back or duck.","source":"USA Hockey Skill Progressions, 14U Body Contact (k) 'receiving a body check' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-body-check","name":"Delivering a Body Check","type":"defensive","level":"expert","prereqs":["h-receive-body-check","h-deliver-body-contact"],"bv":0,"tip":"Legal only from 14U: trunk only, above the knees and at or below the shoulders, stick blade below the knees, and only on the puck carrier - never legal in Girls'/Women's hockey at any age.","source":"Legality: USA Hockey Official Rules 2025-29, Rule 604(a) p.61 + Glossary 'Body Checking' — https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf ; curriculum first-appearance: Skill Progressions 16/18U Body Contact (l)"},
  {"id":"h-hip-check","name":"Hip Check","type":"defensive","level":"expert","prereqs":["h-body-check"],"bv":0,"tip":"Drop low and turn your hip into the puck carrier along the boards - the hardest check to time, so learn it last.","source":"USA Hockey Skill Progressions, 16/18U Body Contact (m) 'hip check'; Checking The Right Way drills 79/80 — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-contain-stall","name":"Containing / Stalling","type":"defensive","level":"expert","prereqs":["h-body-check","h-gap-control"],"bv":0,"tip":"Sometimes the right play is not to hit - hold your gap and stall the rush until help arrives.","source":"USA Hockey Skill Progressions, 16/18U Body Contact (n) 'containing/stalling' and Defensive Concepts (o) 'stall/contain' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"}
]
```

After this, `SKILLS.hockey` goes from **70 → 84** nodes, with a 24-node checking track covering all four official steps.

---

## 3. DELIVERABLE 2 — the GOALIE tree (24 nodes, **zero at beginner**)

### 3a. Why the tree starts at `intermediate` and has no beginner tier

This is not an omission — it is what the ADM instructs, and it is the reason the app should have a goalie tree at all rather than quietly having no goalies.

| Claim | Source |
|---|---|
| SP's 8U section, under Goaltending, in full: *"At this level, coaches should not designate full-time goaltenders so that players may begin the development of skills that will help improve their long-term skating and athleticism."* There is **no 8U goalie skill list** in SP. The full branch appears first at **10U**. | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| *"The perfect 6U and 8U experience is that you play all three positions every single time you go to the rink"* — Steve Thompson, USA Hockey Manager of Goaltending Development. QuickChange gear, rotation, no full-time goalies, no formal technique. | [ADMG6](https://www.admkids.com/news_article/show/1345429) |
| *"The optimal age for players to become full-time goaltenders is at 12 or 13 years old and above"*, and *"players should not go to the rink and be a backup goalie ever before the age of 13."* | [ADMG13](https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time) |
| USA Hockey's own **Goaltender Practice Plans start at 10U** — the age bands published are 10U, 11U&12U, 13U&14U, 15U&16U, 18U&HS. There is no 8U goalie plan. | [GPP](https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans) |

**The one caveat, recorded rather than acted on:** the older 8U practice-plan manual's emphasis matrix *does* carry a Goalkeeping column — basic stance, parallel shuffle, lateral T-guide, forward & backward movement, stick/body/glove/leg saves, stacking pads, "V" drop, rebounds ([8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf)). The ADM's rotation model superseded this for 8U. I have **not** created beginner nodes from it, because doing so would contradict the ADM and would invite exactly the early specialisation USA Hockey is trying to prevent.

**What the app should do at beginner instead of nodes:** show a single non-gating, non-scoring info card on the goalie tab for beginner-tier players — *"At 8U everyone takes a turn in net. USA Hockey says don't pick a full-time goalie until 12 or 13. Come back here when you're ready."* — with the [ADMG13](https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time) link. That turns the empty tier into the message, instead of a locked wall of grey nodes.

**Type mapping** (no schema change; every type below already exists in the enum): stance/recovery → `balance`, crease movement → `skating`, C-cuts → `edge`, saves → `defensive`, puck play → `stick`, positioning and game reads → `move`.

### 3b. Intermediate (10U) — 12 nodes

| id | name | type | prereqs | tip | source |
|---|---|---|---|---|---|
| `g-stance` | Goalie Stance | balance | f-dip | Knees bent, weight on the balls of your feet, glove and blocker out in front, chest up and eyes on the puck. | SP 10U Goaltending a.i "proper stance"; ADM 10U "basic goalie stance" — [ADMG10](https://www.admkids.com/news_article/show/1345430) |
| `g-fwd-bwd` | Forward & Backward Movement | skating | g-stance | Move out to challenge and back to your post without ever standing up out of your stance. | SP 10U Goaltending b.i/b.ii — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-shuffle` | Parallel Shuffle | skating | g-stance | Short side steps with your feet staying square to the puck — no crossing over. | SP 10U b.iii "lateral"; 8UM "Parallel shuffle"; ADM 10U "shuffles" — [ADMG10](https://www.admkids.com/news_article/show/1345430) |
| `g-t-push` | Lateral T-Push | skating | g-shuffle | Point the lead skate where you are going, make a T with the back skate, and push once — hard. | SP 10U b.iii; 8UM "Lateral T-guide"; ADM 10U "T-Pushes"; G10 drill "T-Push — one time around each way" — [G10](https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf) |
| `g-c-cuts` | Goalie C-Cuts | edge | g-stance | Carve a C with one skate to glide in or out of the crease while staying set and square. | ADM 10U, Steve Thompson: "shuffles, T-Pushes, C-cuts, butterflies, the basics" — [ADMG10](https://www.admkids.com/news_article/show/1345430) |
| `g-angles` | Angles & Squareness | move | g-stance, g-shuffle | Line your chest up with the puck so the shooter sees the same amount of net on both sides of you. | SP 10U Goaltending a.ii "angling"; ADM 12U "angles, squareness and depth" — [ADMG12](https://www.admkids.com/news_article/show/1345434) |
| `g-puck-tracking` | Puck Tracking (Eyes, Chin, Shoulders) | balance | g-stance | Lead every movement and every save with your eyes and chin, and watch the puck all the way into your body. | G10 key points: "Lead each movement with Eyes, Chin and Shoulders", "Focus on puck tracking"; GPP Skills Stage names "tracking" — [G10](https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf) |
| `g-stick-save` | Stick Saves | defensive | g-stance, g-puck-tracking | Angle the blade so low shots deflect into the corner instead of back into the slot — let the puck come to you. | SP 10U c.i "stick"; 8UM "Stick saves"; G10 "Break down stick saves" — [G10](https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf) |
| `g-glove-save` | Glove & Blocker Saves | defensive | g-stance, g-puck-tracking | Catch with the glove out in front of you; angle the blocker down and to the corner. | SP 10U c.ii "gloves"; 8UM "Glove saves"; G10 "fundamentals of a blocker save" and "fundamentals of glove saves" — [G10](https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf) |
| `g-body-save` | Body & Pad Saves | defensive | g-stance | Get your chest behind the puck and let it die in your body rather than bouncing off. | SP 10U c.iii "body and pads"; 8UM "Body saves" / "Leg saves" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-butterfly` | Butterfly | defensive | g-stance, g-c-cuts | Drop both knees together with the pads flat and the chest up — down to seal the ice, not down to sit. | SP 10U c.iv "butterfly"; ADM 10U "butterflies" — [ADMG10](https://www.admkids.com/news_article/show/1345430) |
| `g-recovery` | Butterfly Recovery | balance | g-butterfly | First leg up is the one furthest from the puck — get back to your stance before the next shot. | SP 10U d. "recovery"; G10 drills "Butterfly — Full Recovery" and "Butterfly — On-Ice Recovery" — [G10](https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf) |

### 3c. Advanced (12U) — 6 nodes

| id | name | type | prereqs | tip | source |
|---|---|---|---|---|---|
| `g-sliding-butterfly` | Sliding Butterfly | defensive | g-butterfly, g-t-push | Push, then drop — one strong push while you go down so you arrive square and sealed, not sliding past the post. | SP **12U** Goaltending c.v "sliding butterfly" (new at 12U) — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-rebound-control` | Rebound Control & Cradling | defensive | g-body-save, g-puck-tracking | Smother what you can and steer the rest to the corners — track the rebound and start recovering the instant the puck hits you. | SP **12U** f.i "cradling" + f.ii "rebound control"; GPP Skills Stage "controlling rebounds"; G10 "imagine perfect rebound control" — [GPP](https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans) |
| `g-depth` | Depth & Crease Movement | move | g-angles | Challenge out to take away net, then back in on a pass — how far out you play is as important as being square. | ADM 12U, Thompson: "angles, squareness and depth" — [ADMG12](https://www.admkids.com/news_article/show/1345434) |
| `g-behind-net` | Stopping the Puck Behind the Net | stick | g-stance | Get there first, stop the puck square for your defenceman, and get back to the post before the play turns. | SP **12U** Goaltending e. "stopping the puck behind net" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-screen-shots` | Tracking Through a Screen | defensive | g-puck-tracking, g-butterfly | Find a lane around the screen instead of over it, and get set before the shot rather than guessing. | SP **12U** Goaltending g.i "screen shots"; GPP Game Recognition Stage "handling traffic in front" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-walkout-wraparound` | Walkouts & Wraparounds (Post Integration) | move | g-t-push, g-sliding-butterfly | Seal the post with your skate and pad, then move with the puck around the net without leaving a gap behind you. | SP **12U** Goaltending g.ii "walkouts" + g.iii "wraparounds"; GPP Game Recognition Stage "post integration" — [GPP](https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans) |

### 3d. Expert (14U+) — 6 nodes

| id | name | type | prereqs | tip | source |
|---|---|---|---|---|---|
| `g-rvh` | Reverse-VH Post Play | defensive | g-walkout-wraparound, g-sliding-butterfly | Pad up the post, hands ready, and scan the ice in front of you before you transition out — use it for tight plays only, not as a default. | USA Hockey's **13U & 14U** goaltender practice plans teach moving into the post, transitioning into RVH, scanning, and transitioning out of RVH; RVH appears in no 10U plan — [G14](https://cdn1.sportngin.com/attachments/document/fce4-1635241/14U_Goalie_Practice_plans.pdf). Age caution: butterfly and RVH are the movements coaches rate most demanding on the hip and groin, and cam morphology forms between 13 and 16 — [HIP](https://pmc.ncbi.nlm.nih.gov/articles/PMC8647250/) |
| `g-puck-handling` | Passing & Clearing (Forehand and Backhand) | stick | g-behind-net | Know where your outlet is before the puck arrives, and make the simple pass up the wall rather than the fancy one. | SP **14U** Goaltending e.ii "passing the puck (forehand, backhand)" + e.iii "clearing the puck (forehand, backhand)" — new at 14U; GPP Skills Stage "puck handling" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-breakaways` | Breakaways | move | g-depth, g-rebound-control | Come out, match their speed backwards, and stay patient — make the shooter commit first. | SP **14U** Goaltending g.iv "breakaways" — new at 14U; GPP Game Recognition Stage "breakaways" — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-line-rushes` | Line Rushes (Odd and Even) | move | g-angles, g-depth | Read who has the puck and who is the real threat on a 2-on-1 or 3-on-2, and take away the shooter while your D takes the pass. | SP **14U** Goaltending g.v "line rushes (odd and even)" — new at 14U — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-dz-faceoffs` | Defensive-Zone Face-offs | move | g-angles | Set your depth and angle for the face-off dot before the puck drops, and be square for the quick shot off the draw. | SP **14U** Goaltending g.vi "face-offs in the defensive zone" — new at 14U — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| `g-communication` | Communication with Teammates | move | g-dz-faceoffs | You see the whole ice — call the puck, call the pressure, and tell your D who is coming. | SP **14U** Goaltending g.vii "communication with teammates" — new at 14U — [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |

**Why 24 and not the 17 sketched in the audit.** Six of SP's goaltending sub-items turned out to be separately named skills rather than facets of one node (`g-c-cuts`, `g-depth`, `g-line-rushes`, `g-dz-faceoffs` split from `g-communication`, `g-puck-tracking`, `g-screen-shots`), and USA Hockey's own published practice plans name tracking, post integration and RVH explicitly. Every one of the 24 has a first-appearance citation.

### 3e. Ready-to-paste JSON — `SKILLS.goalie`

```json
[
  {"id":"g-stance","name":"Goalie Stance","type":"balance","level":"intermediate","prereqs":["f-dip"],"bv":0,"tip":"Knees bent, weight on the balls of your feet, glove and blocker out in front, chest up and eyes on the puck.","source":"USA Hockey Skill Progressions, 10U Goaltending a.i 'proper stance'; ADM 10U 'basic goalie stance' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-fwd-bwd","name":"Forward & Backward Movement","type":"skating","level":"intermediate","prereqs":["g-stance"],"bv":0,"tip":"Move out to challenge and back to your post without ever standing up out of your stance.","source":"USA Hockey Skill Progressions, 10U Goaltending b.i/b.ii 'forward', 'backward' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-shuffle","name":"Parallel Shuffle","type":"skating","level":"intermediate","prereqs":["g-stance"],"bv":0,"tip":"Short side steps with your feet staying square to the puck - no crossing over.","source":"USA Hockey Skill Progressions 10U Goaltending b.iii 'lateral'; ADM 10U 'shuffles' — https://www.admkids.com/news_article/show/1345430"},
  {"id":"g-t-push","name":"Lateral T-Push","type":"skating","level":"intermediate","prereqs":["g-shuffle"],"bv":0,"tip":"Point the lead skate where you are going, make a T with the back skate, and push once - hard.","source":"USA Hockey 10U Goaltender Practice Plans, 'T-Push - one time around each way'; ADM 10U 'T-Pushes' — https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf"},
  {"id":"g-c-cuts","name":"Goalie C-Cuts","type":"edge","level":"intermediate","prereqs":["g-stance"],"bv":0,"tip":"Carve a C with one skate to glide in or out of the crease while staying set and square.","source":"ADM Kids, '10U: The Budding Goalie' - Steve Thompson, USA Hockey Manager of Goaltending Development: 'shuffles, T-Pushes, C-cuts, butterflies, the basics' — https://www.admkids.com/news_article/show/1345430"},
  {"id":"g-angles","name":"Angles & Squareness","type":"move","level":"intermediate","prereqs":["g-stance","g-shuffle"],"bv":0,"tip":"Line your chest up with the puck so the shooter sees the same amount of net on both sides of you.","source":"USA Hockey Skill Progressions, 10U Goaltending a.ii 'angling' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-puck-tracking","name":"Puck Tracking (Eyes, Chin, Shoulders)","type":"balance","level":"intermediate","prereqs":["g-stance"],"bv":0,"tip":"Lead every movement and every save with your eyes and chin, and watch the puck all the way into your body.","source":"USA Hockey 10U Goaltender Practice Plans key points ('Lead each movement with Eyes, Chin and Shoulders'; 'Focus on puck tracking') — https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf"},
  {"id":"g-stick-save","name":"Stick Saves","type":"defensive","level":"intermediate","prereqs":["g-stance","g-puck-tracking"],"bv":0,"tip":"Angle the blade so low shots deflect into the corner instead of back into the slot - let the puck come to you.","source":"USA Hockey Skill Progressions, 10U Goaltending c.i 'stick'; 10U Goaltender Practice Plans 'Break down stick saves' — https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf"},
  {"id":"g-glove-save","name":"Glove & Blocker Saves","type":"defensive","level":"intermediate","prereqs":["g-stance","g-puck-tracking"],"bv":0,"tip":"Catch with the glove out in front of you; angle the blocker down and to the corner.","source":"USA Hockey Skill Progressions, 10U Goaltending c.ii 'gloves'; 10U Goaltender Practice Plans 'fundamentals of a blocker save' / 'fundamentals of glove saves' — https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf"},
  {"id":"g-body-save","name":"Body & Pad Saves","type":"defensive","level":"intermediate","prereqs":["g-stance"],"bv":0,"tip":"Get your chest behind the puck and let it die in your body rather than bouncing off.","source":"USA Hockey Skill Progressions, 10U Goaltending c.iii 'body and pads' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-butterfly","name":"Butterfly","type":"defensive","level":"intermediate","prereqs":["g-stance","g-c-cuts"],"bv":0,"tip":"Drop both knees together with the pads flat and the chest up - down to seal the ice, not down to sit.","source":"USA Hockey Skill Progressions, 10U Goaltending c.iv 'butterfly'; ADM 10U 'butterflies' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-recovery","name":"Butterfly Recovery","type":"balance","level":"intermediate","prereqs":["g-butterfly"],"bv":0,"tip":"First leg up is the one furthest from the puck - get back to your stance before the next shot.","source":"USA Hockey Skill Progressions, 10U Goaltending d. 'recovery'; 10U Goaltender Practice Plans 'Butterfly - Full Recovery' / 'Butterfly - On-Ice Recovery' — https://cdn1.sportngin.com/attachments/document/8d1b-1635239/10U_Goalie_Practice_plans.pdf"},
  {"id":"g-sliding-butterfly","name":"Sliding Butterfly","type":"defensive","level":"advanced","prereqs":["g-butterfly","g-t-push"],"bv":0,"tip":"Push, then drop - one strong push while you go down so you arrive square and sealed, not sliding past the post.","source":"USA Hockey Skill Progressions, 12U Goaltending c.v 'sliding butterfly' (first appears at 12U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-rebound-control","name":"Rebound Control & Cradling","type":"defensive","level":"advanced","prereqs":["g-body-save","g-puck-tracking"],"bv":0,"tip":"Smother what you can and steer the rest to the corners - track the rebound and start recovering the instant the puck hits you.","source":"USA Hockey Skill Progressions, 12U Goaltending f.i 'cradling' + f.ii 'rebound control' (first appear at 12U); Goaltender Practice Plans Skills Stage 'controlling rebounds' — https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans"},
  {"id":"g-depth","name":"Depth & Crease Movement","type":"move","level":"advanced","prereqs":["g-angles"],"bv":0,"tip":"Challenge out to take away net, then back in on a pass - how far out you play is as important as being square.","source":"ADM Kids, '12U: Goalies Getting Dialed In' - Steve Thompson on 'angles, squareness and depth' — https://www.admkids.com/news_article/show/1345434"},
  {"id":"g-behind-net","name":"Stopping the Puck Behind the Net","type":"stick","level":"advanced","prereqs":["g-stance"],"bv":0,"tip":"Get there first, stop the puck square for your defenceman, and get back to the post before the play turns.","source":"USA Hockey Skill Progressions, 12U Goaltending e. 'stopping the puck behind net' (first appears at 12U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-screen-shots","name":"Tracking Through a Screen","type":"defensive","level":"advanced","prereqs":["g-puck-tracking","g-butterfly"],"bv":0,"tip":"Find a lane around the screen instead of over it, and get set before the shot rather than guessing.","source":"USA Hockey Skill Progressions, 12U Goaltending g.i 'screen shots' (first appears at 12U); Goaltender Practice Plans Game Recognition Stage 'handling traffic in front' — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-walkout-wraparound","name":"Walkouts & Wraparounds (Post Integration)","type":"move","level":"advanced","prereqs":["g-t-push","g-sliding-butterfly"],"bv":0,"tip":"Seal the post with your skate and pad, then move with the puck around the net without leaving a gap behind you.","source":"USA Hockey Skill Progressions, 12U Goaltending g.ii 'walkouts' + g.iii 'wraparounds' (first appear at 12U); Goaltender Practice Plans Game Recognition Stage 'post integration' — https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans"},
  {"id":"g-rvh","name":"Reverse-VH Post Play","type":"defensive","level":"expert","prereqs":["g-walkout-wraparound","g-sliding-butterfly"],"bv":0,"tip":"Pad up the post, hands ready, and scan the ice in front of you before you transition out - use it for tight plays only, not as a default.","source":"USA Hockey 13U & 14U Goaltender Practice Plans teach moving into the post, transitioning into RVH, scanning and transitioning out; RVH does not appear in the 10U plans — https://cdn1.sportngin.com/attachments/document/fce4-1635241/14U_Goalie_Practice_plans.pdf (hip/groin load caution: https://pmc.ncbi.nlm.nih.gov/articles/PMC8647250/)"},
  {"id":"g-puck-handling","name":"Passing & Clearing (Forehand and Backhand)","type":"stick","level":"expert","prereqs":["g-behind-net"],"bv":0,"tip":"Know where your outlet is before the puck arrives, and make the simple pass up the wall rather than the fancy one.","source":"USA Hockey Skill Progressions, 14U Goaltending e.ii 'passing the puck (forehand, backhand)' + e.iii 'clearing the puck (forehand, backhand)' (first appear at 14U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-breakaways","name":"Breakaways","type":"move","level":"expert","prereqs":["g-depth","g-rebound-control"],"bv":0,"tip":"Come out, match their speed backwards, and stay patient - make the shooter commit first.","source":"USA Hockey Skill Progressions, 14U Goaltending g.iv 'breakaways' (first appears at 14U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-line-rushes","name":"Line Rushes (Odd and Even)","type":"move","level":"expert","prereqs":["g-angles","g-depth"],"bv":0,"tip":"Read who has the puck and who is the real threat on a 2-on-1 or 3-on-2, and take away the shooter while your D takes the pass.","source":"USA Hockey Skill Progressions, 14U Goaltending g.v 'line rushes (odd and even)' (first appears at 14U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-dz-faceoffs","name":"Defensive-Zone Face-offs","type":"move","level":"expert","prereqs":["g-angles"],"bv":0,"tip":"Set your depth and angle for the face-off dot before the puck drops, and be square for the quick shot off the draw.","source":"USA Hockey Skill Progressions, 14U Goaltending g.vi 'face-offs in the defensive zone' (first appears at 14U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"g-communication","name":"Communication with Teammates","type":"move","level":"expert","prereqs":["g-dz-faceoffs"],"bv":0,"tip":"You see the whole ice - call the puck, call the pressure, and tell your D who is coming.","source":"USA Hockey Skill Progressions, 14U Goaltending g.vii 'communication with teammates' (first appears at 14U) — https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"}
]
```

---

## 4. HOW THIS SHOULD APPEAR IN THE APP

### Recommendation: **goalie is its own discipline, `SKILLS.goalie`, a fourth button.** Checking stays inside `SKILLS.hockey`.

**Why goalie gets its own tree**

1. **The app's progress math breaks otherwise.** `getSkills()` (index.html:2137) returns `SKILLS[APP.discipline]`, and level/progress are computed per discipline (index.html:3402, 5074, 5320). Drop 24 goalie nodes into `hockey` and every skater is permanently ~25% incomplete for skills they will never do; put a goalie in `hockey` and they carry 40+ shooting and stickhandling nodes — slap shot, one-timer, The Michigan — as unearned dead weight. A goalie would top out around 30% forever. That is the single strongest argument and it is a property of code that already exists.
2. **It matches how USA Hockey structures the curriculum.** Goaltending is one of the six individual-skill performance areas in SP, with its own branch at every age band, and USA Hockey publishes a **separate** goaltender practice-plan curriculum with its own four stages and its own age bands ([GPP](https://www.usahockeygoaltending.com/page/show/2872653-goaltending-practice-plans)).
3. **The ADM's rotate-don't-specialise rule needs somewhere to be said.** As a section inside hockey it is a paragraph nobody reads. As a discipline landing screen with no beginner tier, the empty tier *is* the message ([ADMG13](https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time)).
4. **Four buttons fit.** `.discipline-toggle` at index.html:282 is already `display:flex;width:100%` with `.disc-btn{flex:1}` under 600px, and the buttons are `white-space:nowrap;text-align:center`. "Foundations / Figure / Hockey / Goalie" divides evenly; "Goalie" is the shortest label of the four. Two markup sites to edit: index.html:885-887 and index.html:982-984.

**The one thing that must change with it.** Today, every non-foundations discipline is rendered as `SKILLS.foundations.concat(SKILLS[disc])` — index.html:3022, 3033-3034, 3402, 5320. A goalie is a skater first, so the goalie tree needs foundations underneath it (the JSON above does this: `g-stance` takes `f-dip`). Replace the hard-coded concat with a base map:

```js
const DISCIPLINE_BASE = { foundations: [], figure: ['foundations'], hockey: ['foundations'], goalie: ['foundations'] };
```

Add `'hockey'` to `goalie`'s base only if you later want cross-links such as `g-puck-handling ← h-forehand-pass`; the 24 nodes above are deliberately self-contained so the one-line map is enough. Also update the three places that flatten all trees for lookup — index.html:3025 already uses `Object.values(SKILLS).flat()` and needs nothing, but index.html:4756, 5178 and 5521 hard-code `SKILLS.foundations.concat(SKILLS.figure).concat(SKILLS.hockey)` and will silently drop goalie skill names from session records and exports. And index.html:4109 shows the stick-skills button only when `APP.discipline === 'hockey'`; decide whether goalie sees it.

**Why checking does NOT get its own tree.** Checking is not a position, it is a performance area every skater trains, its prereqs are hockey skating nodes (`h-angling`, `h-lateral`, `h-hockey-stop`, `h-top-speed`), and ten of its nodes are already in `SKILLS.hockey` with dependents. Splitting it would fork the graph for no gain. Group it visually instead: the node `type` is already `defensive` for all 24, so the existing type grouping in the skill grid renders the track as a block for free — optionally relabel that group "Checking (4-step progression)".

**Two gates the app needs regardless of tree shape.**

- **Step 4 must be rules-gated, not just level-gated.** `h-body-check`, `h-hip-check`, `h-contain-stall` and the in-game use of `h-receive-body-check` are illegal below 14U and in **all** Girls'/Women's classifications at every age ([RB25](https://cdn2.sportngin.com/attachments/document/945a-3442848/2025-29_USAH_Playing_Rules.pdf) Rule 604(a)). `expert` tier alone does not express "never, for this player".
- **Beginner goalie tier shows a card, not locked nodes.** See §3a.

---

## 5. Net effect

| Tree | Before | After |
|---|---|---|
| `hockey` | 70 | **84** (+14 checking) |
| `goalie` | — | **24** (0 beginner · 12 intermediate · 6 advanced · 6 expert) |
| Official performance areas covered | 4 of 6 | **6 of 6** |
