# RinkBuddy HOCKEY tree — audit against USA Hockey's official development model

Audited: 2026-09-19 · Source data: `research/catalog-current.json` → `hockey[]` (49 skills)
Cross-referenced against `foundations[]` (32 skills), because 30 of the 49 hockey nodes take an `f-*` prereq.

---

## 0. Sources used (every claim below cites one)

| Key | Document | URL |
|---|---|---|
| **SP** | USA Hockey CEP, *Skill Progressions for Youth Hockey* (2018/19) — the age-banded master list | https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf |
| **SPL** | USA Hockey "Skill Progressions" landing page | https://www.usahockey.com/skillprogressions |
| **8UM** | USA Hockey *8 & Under (Mite) Practice Plan Manual* — skill teaching pages + "Suggested Emphasis for 8 & Under" matrix | https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf |
| **10UM** | USA Hockey *10 & Under (Squirt) Practice Plan Manual* — "Suggested Emphasis for 10 & Under" matrix | https://usahockey.cachefly.net/Coaching/Manuals/10UPracticePlan.pdf |
| **12UM** | USA Hockey *12 & Under (Pee Wee) Practice Plan Manual* — "Suggested Emphasis for 12 & Under" matrix | https://usahockey.cachefly.net/Coaching/Manuals/12UPracticePlan.pdf |
| **MITE** | USA Hockey ADM *Mite/8U Handbook* (cross-ice, goalie rotation) | https://assets.ngin.com/attachments/document/0115/3516/USA_Hockey_Mite_8U_Handbook.pdf |
| **CHK** | USA Hockey *Checking the Right Way for Youth Hockey* | https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf |
| **OMHA** | OMHA, *Checking — the 4-Step Progression* (USA Hockey / Hockey Canada shared model) | https://www.omha.net/page/show/885509-checking-4-step-progression |
| **HCU9** | Hockey Canada *U9 Core Skills* matrix (LTPD "Fundamentals 2") | https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf |
| **LTPD** | Hockey Canada *Long-Term Player Development* manual | https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Coaching/LTPD/Downloads/LTPD_manual_may_2013_e.pdf |
| **ADM10** | ADM Kids, "The path to excellent skating at 10U" | https://www.admkids.com/news_article/show/988140 |
| **ADM8E** | ADM Kids, "6U/8U: Finding Their Edges" | https://www.admkids.com/news_article/show/1323898 |
| **ADMG** | ADM Kids, "10U Q-and-A: When is the time for full-time?" (goaltending) | https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time |
| **PYHA** | Princeton Youth Hockey skills-progression checklist, "adapted from USA Hockey Guidelines" — useful as a club-level read of SP | https://cdn1.sportngin.com/attachments/document/711b-2956496/PYHA_Skills_Progression_Checklist.pdf |

**Note on SP's convention:** the manual states *"bold italicized text throughout the book indicates a new skill or concept to be introduced at that age level."* Every "introduced at X" claim below is that first-appearance, verified by diffing SP's 8U / 10U / 12U / 14U / 16-18U lists.

---

## 1. The mapping I use

| App tag | Official stage | USA Hockey band | Hockey Canada LTPD stage |
|---|---|---|---|
| `beginner` | first taught / "must learn and master" at 8U | 8U (Mite) — 85% individual skill, 0% systems | FUNdamentals (U7–U9) |
| `intermediate` | first *introduced* at 10U | 10U (Squirt) | Learn to Train (Atom) |
| `advanced` | first introduced at 12U | 12U (Pee Wee) | Learn to Train (Peewee) |
| `expert` | first introduced at 14U or later, or an elite qualifier of an earlier skill | 14U / 16-18U | Train to Train / Train to Compete |

Two clarifications that matter for the verdicts:

1. **SP's lists are cumulative.** 14U repeats every 8U skill. So "official stage" = *first appearance*, which is the only defensible anchor for a skill-tree tier.
2. **The 8U practice manual is a teaching reference, SP is the curriculum.** Where they disagree (hockey stop, backward crossover, snap shot) I say so in the row and take the earlier of the two, because a tree tier should reflect when a kid first *attempts* the skill, not when they're expected to own it.

**Reference totals.** SP's cumulative skater list reaches **73 individual skills by 14U** (23 skating, 16 puck control, 11 passing/receiving, 12 shooting, 11 body contact) plus a 7-branch goaltending track. RinkBuddy's hockey tree has 49 — with **0 checking nodes and 0 goalie nodes**. The gap is not random; it is two whole performance areas.

---

## 2. Full skill-by-skill table

| id | app level | official stage | verdict | source URL |
|---|---|---|---|---|
| h-ready-stance | beginner | **8U** — Skating (a) "ready position"; 8UM has a dedicated "The Ready Position" page | ✅ correct | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-fall-recovery | beginner | **6U/8U** — ADM says the 6U/8U priority is "balance and coordination… stability on ice" before locomotion | ✅ correct | [ADM8E](https://www.admkids.com/news_article/show/1323898) |
| h-v-start | beginner | **8U** — SP Skating (c) "forward start"; HCU9 lists "front v-start" explicitly | ✅ correct | [HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf) |
| h-hockey-stop | intermediate | **8U** — 8UM has a full teaching page "CONTROLLED HOCKEY STOP" (hips 90°, both skates, inside/outside edge); HCU9 lists "two-foot parallel stop" in U9 core skills | ❌ **one tier too high → beginner** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-bwd-cross | intermediate | **10U** — SP Skating (l) "backward crossover", new at 10U (8UM teaches it as an extension page) | ✅ correct — but conflicts with `f-bwd-crossover` tagged *beginner* | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-tight-turn | intermediate | **8U** — SP Skating (f) "controlled turn"; 8UM "CONTROL TURNS"; HCU9 "glide turns / tight turns" | ❌ **too high → beginner** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-1ft-stop | intermediate | **10U** — SP Skating (k) "one-foot stop", first new stop after the 8U snowplow/controlled stops | ✅ correct | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-power-start | intermediate | **8U** — SP Skating (c/d) forward start + stride "push to full extension of the thrusting leg" is the 8U teaching point | ❌ **too high → beginner** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-bwd-snowplow-stop | intermediate | **8U** — SP Skating (i) "backward stop"; 8UM "BACKWARD STOP — SNOWPLOW" page | ❌ **too high → beginner** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-crossover-start | intermediate | **8U** — HCU9 "crossover start"; PYHA 8U "crossover start (side start)" | ❌ **too high → beginner** | [HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf) |
| h-fwd-bwd-pivot | intermediate | **8U** — 8UM "FORWARD TO BACKWARD TURN" page; PYHA 8U "pivoting: forward to backward" | ❌ **too high → beginner** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-bwd-fwd-pivot | intermediate | **8U** — 8UM "BACKWARD TO FORWARD — STEP OUT" page; HCU9 "pivots — bwd to fwd & fwd to bwd" | ❌ **too high → beginner** | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-mohawk | advanced | **10U** — SP Skating (m) "mohawk turn", new at 10U; HCU9 "Heel to Heel (Mohawk)" at U9 | ❌ **too high → intermediate** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-power-stop | advanced | **8U–10U** — 8UM "ONE FOOT POWER STOP" page; SP calls it "one-foot stop" at 10U | ❌ **too high AND a duplicate of `h-1ft-stop`** → merge | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-edge-work | advanced | **8U** — SP Skating (b) "edge control" is the *second* item on the 8U list, taught before turns and crossovers | ❌ **worst error in the tree: 2 tiers too high AND graph-inverted** → beginner, and make it a prereq of turns/crossovers/stops | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-lateral | advanced | **12U** — SP Skating (n) "lateral skating", new at 12U | ✅ correct | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-quick-feet | advanced | **8U as "ABCs of skating (agility, balance, coordination, speed)"; 14U as trained "quickness / agility"** | ⚠️ split concept — demote to intermediate or rename to the 14U qualifier | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-spin-move | advanced | **14U** — SP Puck Control (p) "spin around", new at 14U | ❌ **too low → expert**, and it is a *puck control* skill, not `skating` | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-gap-control | advanced | **10U** — SP Body Contact (d) "gap control concept" AND Defensive Concepts (a) "gap control", both new at 10U | ❌ **too high → intermediate** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-angling | advanced | **10U** — SP Body Contact (e) "body positioning and angling"; angling is *step 1 of 4* in the checking progression, which "begins the first time a young player steps on the ice" | ❌ **too high → intermediate** | [OMHA](https://www.omha.net/page/show/885509-checking-4-step-progression) |
| h-top-speed | expert | **14U** — SP Skating (r) quickness, (s) speed, (t) agility, (u) power all new at 14U | ✅ correct | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-backwards-cross-full | expert | **10U skill + 12U/14U speed qualifier** — backward crossover 10U; "speed/power" qualifiers 14U | ⚠️ one tier high → advanced | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-1ft-edges | expert | **8U** — SP "edge control"; HCU9 U9 lists "balance on one foot", "gliding on one skate fwd/bwd", "figure 8s inside & outside edge", "1 leg weaving" | ❌ **3 tiers too high → intermediate** | [HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf) |
| h-euro-step | expert | **Not in any official progression.** The term is basketball; no USA Hockey or Hockey Canada document contains it | ❌ **remove or rename** (closest real skill: 12U "change of direction" / "fakes and deception while stickhandling") | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-mirror-skating | expert | **10U** — SP Defensive Concepts (e) "body position: man-you-net"; CHK calls it defensive side / steering | ❌ **too high + non-standard name → intermediate, rename** | [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |
| h-closeout | expert | **10U–12U** — CHK drills 40/41 "Closing the Gap" / "Closing the Gap Tight"; SP gap control 10U | ❌ **too high + name → advanced, rename "Closing the Gap"** | [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf) |
| h-box-out | expert | **12U body contact → 14U concept** — CHK "Boxing Out" sits in step 3 (body contact); SP names it at 14U, Defensive Concepts (n) "boxing out and fronting an opponent" | ✅ acceptable (defensible as advanced) | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-stick-grip | beginner | **8U** — 8UM "THE STICK, GRIP & STANCE" page (length, lie, V-grip, basic stance) | ✅ correct | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-stationary-puck | beginner | **8U** — SP Puck Control (a)(b)(c) lateral / front-to-back / diagonal stickhandling | ✅ correct | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-fwd-dribble | beginner | **8U** — same SP entries; 8UM "Basic Dribbling Skills" | ✅ correct tier, ⚠️ name is not USA Hockey's | [8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf) |
| h-wrist-shot | beginner | **8U** — SP Shooting (a) "wrist shot". Only two shots exist at 8U: wrist and backhand | ✅ correct | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-forehand-pass | intermediate | **8U** — SP Passing (a) "forehand pass" | ❌ **too high → beginner**; also prereq'd on a *shot*, which inverts teaching order | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-backhand-pass | intermediate | **8U** — SP Passing (b) "backhand pass" | ❌ **too high → beginner** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-receiving | intermediate | **8U** — SP Passing (c) "receiving a pass properly with the stick" | ❌ **too high → beginner** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-skating-dribble | intermediate | **8U** — the entire 8U cross-ice model exists to maximise puck-touches while moving; HCU9 "open ice carry — forehand & backhand" | ❌ **too high → beginner** | [MITE](https://assets.ngin.com/attachments/document/0115/3516/USA_Hockey_Mite_8U_Handbook.pdf) |
| h-snap-shot | intermediate | **10U (10UM matrix lists "Snap") / 12U (SP Shooting (g))** | ✅ correct | [10UM](https://usahockey.cachefly.net/Coaching/Manuals/10UPracticePlan.pdf) |
| h-slap-shot | intermediate | **12U** — SP Shooting (h), new at 12U. The 12U emphasis matrix lists "Slap"; the 8U and 10U matrices do **not** | ❌ **too low → advanced** (the exact error you suspected) | [12UM](https://usahockey.cachefly.net/Coaching/Manuals/12UPracticePlan.pdf) |
| h-toe-drag | advanced | **10U** — SP Puck Control (g) "toe drag", new at 10U; HCU9 has "toe drag – side/front" at U9 | ❌ **too high → intermediate** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-deke | advanced | **8U–10U** — HCU9 Individual Offensive Tactics: "body fakes, stick fakes, dekes"; PYHA 8U "dekes around cones and players" | ❌ **too high → intermediate** | [HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf) |
| h-one-timer | advanced | **14U** — SP Shooting (j) "one-timers", new at 14U | ❌ **too low → expert**; prereq on slap shot is also wrong | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-saucer-pass | advanced | **10U** — SP Passing (d) "saucer pass (forehand and backhand)", new at 10U | ❌ **too high → intermediate** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-protect-puck | advanced | **10U** — SP Puck Control (e) "puck protection", new at 10U | ❌ **too high → intermediate** | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-shooting-stride | advanced | **10U** — HCU9 "forehand/backhand shots in motion" at U9; SP treats shooting in motion as assumed by 10U | ❌ **too high → intermediate** | [HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf) |
| h-between-legs | expert | **Not in any official progression.** Absent from SP 8U→18U, from HCU9, and from CHK | ❌ **trick move — move out of the graded tree** | [SPL](https://www.usahockey.com/skillprogressions) |
| h-michigan | expert | **Not in any official progression.** Absent from every SP age band | ❌ **trick move — move out of the graded tree** | [SPL](https://www.usahockey.com/skillprogressions) |
| h-no-look-pass | expert | **No direct entry.** Closest: SP 12U "fakes and deception while stickhandling"; PYHA 8U passing sub-point "eye contact" | ⚠️ not a graded skill — fold into a deception node or move to the trick shelf | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-backhand-shelf | expert | **8U for the backhand shot itself; 14U for "shots in close (pull the puck in and get it up)"** | ⚠️ tier defensible, but the tree has **no plain backhand shot** beneath it — a hole under an expert node | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-quick-release | expert | **14U** — SP Shooting (k) "stick position in scoring areas", (l) "shots in close" | ✅ correct tier, ⚠️ name is coaching slang not curriculum | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |
| h-deflection | expert | **10U** — SP Shooting (e) "deflection", new at 10U alongside flip shot, screen shot and off-rebound | ❌ **2 tiers too high → intermediate.** Worst single-skill error | [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf) |

**Tally:** 13 correct · 4 borderline · **32 misplaced or non-official** (65%). The tree is systematically *deflated at the bottom* (8U skating and passing pushed to intermediate) and *inflated at the top* (10U skills pushed to advanced/expert).

---

## 3. Ranked MISPLACEMENTS

1. **`h-edge-work` — advanced, should be beginner, and the prereq arrow points the wrong way.**
   SP's 8U skating list is: ready position → **edge control** → forward start → forward stride → controlled stop → controlled turn → forward crossover. Edges are item (b), taught *before* turns. RinkBuddy has `h-edge-work.prereqs = ["h-tight-turn"]`, i.e. you must master tight turns before you're allowed to learn edges. This inverts the single most load-bearing relationship in skating instruction — a tight turn *is* an outside-edge/inside-edge hold. Because five other nodes hang off `h-edge-work`, this one arrow deforms the whole upper tree. ([SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf))

2. **`h-deflection` — expert, should be intermediate.** SP introduces "deflection" at **10U**, in the same block as flip shot and screen shot. RinkBuddy gates it behind `h-one-timer`, a 14U skill. A 9-year-old tipping pucks in front is doing a 10U drill, not an elite one. ([SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf))

3. **`h-1ft-edges` — expert, should be intermediate (arguably beginner).** Hockey Canada's U9 core-skills matrix lists "balance on one foot", "gliding on one skate — forward and backward", "figure 8's forward/backward inside & outside edge" and "1 leg weaving fwd/bwd". These are 8-year-old skills. ([HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf))

4. **`h-slap-shot` — intermediate, should be advanced (12U).** Verified three ways: SP introduces "slap shot" in the **12U** shooting list; the 12U practice-manual emphasis matrix lists "Slap" under Shooting; the **8U and 10U matrices do not contain it at all**. Tagging it intermediate puts a 12U skill next to 10U skills and, more importantly, in front of the 10U shots (flip, screen, deflection, off-rebound) the tree doesn't even have. ([12UM](https://usahockey.cachefly.net/Coaching/Manuals/12UPracticePlan.pdf), [SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf))

5. **`h-hockey-stop` — intermediate while `h-wrist-shot` is beginner: the wrist shot is right, the stop is wrong.**
   Both are 8U. SP's 8U shooting list is exactly two items — wrist shot and backhand — so `h-wrist-shot: beginner` is correct. For stops, SP's 8U item (e) is "controlled stop: two-foot and one-foot snowplow", and the USA Hockey **8U Practice Plan Manual carries a dedicated teaching page titled "CONTROLLED HOCKEY STOP"** (rotate hips 90°, stop on the inside edge of the lead skate and the outside edge of the trailing skate) plus a "ONE FOOT POWER STOP" page. Hockey Canada's U9 core skills list "two-foot parallel stop", "outside leg stop", and "one o'clock–eleven o'clock stops". So the two-foot hockey stop belongs in the **8U/beginner** band. What genuinely arrives at **10U** is SP's new item (k) **"one-foot stop"** — which the app already tags intermediate, correctly. The fix is therefore narrow: demote `h-hockey-stop` to beginner and leave `h-1ft-stop` at intermediate. ([8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf), [HCU9](https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf))

6. **The passing block (`h-forehand-pass`, `h-backhand-pass`, `h-receiving`) — all intermediate, all 8U.** SP's 8U passing list is exactly these three. Worse, `h-forehand-pass.prereqs = ["h-wrist-shot"]` makes a shot gate a pass. No progression teaches it that way; passing and shooting are parallel branches off puck control. ([SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf))

7. **The 8U skating cluster tagged intermediate:** `h-tight-turn`, `h-fwd-bwd-pivot`, `h-bwd-fwd-pivot`, `h-power-start`, `h-crossover-start`, `h-bwd-snowplow-stop`, `h-skating-dribble`. Every one has a named teaching page in the USA Hockey 8U manual or a line in the HC U9 matrix. Seven nodes that should be the beginner layer are sitting one tier up, which is why the app's "beginner" tier looks thin (5 skating nodes) versus SP's 10-item 8U skating list. ([8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf))

8. **The 10U puck/passing block tagged advanced:** `h-toe-drag`, `h-saucer-pass`, `h-protect-puck`, `h-mohawk`, `h-deke`, `h-shooting-stride`. All introduced at 10U in SP (mohawk, toe drag, puck protection, saucer pass) or at U9 in HCU9 (dekes, shots in motion). ([SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf))

9. **`h-gap-control` and `h-angling` — advanced, both 10U.** SP introduces "gap control concept" and "body positioning and angling" at 10U under Body Contact, and "gap control" at 10U under Defensive Concepts. Angling is explicitly **step 1 of the 4-step checking progression**, which OMHA/USA Hockey say "begins the first time a young player steps on the ice". ([OMHA](https://www.omha.net/page/show/885509-checking-4-step-progression))

10. **`h-one-timer` — advanced, should be expert (14U); `h-spin-move` — advanced, should be expert (14U "spin around").** Two nodes too *low*, both in the same direction: the app treats 14U shooting/puck skills as 12U. ([SP](https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf))

11. **`h-power-stop` duplicates `h-1ft-stop`.** USA Hockey has one skill here: "one-foot stop" (SP, 10U) = "One Foot Power Stop" (8UM teaching page). The app ships both, at different tiers, with `h-power-stop` gated behind `h-hockey-stop` and `h-1ft-stop` gated behind the same node — two parallel names for one skill. ([8UM](https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf))

12. **Cross-tree tier conflict (data bug, not a pedagogy call).**
    - `f-hockey-stop` and `h-hockey-stop` are the *same skill with identical prereqs* `["f-snowplow","f-fwd-stroke"]`, duplicated across trees.
    - `f-bwd-crossover` is **beginner** while `h-bwd-cross` is **intermediate** — the same skill, two different levels, and `h-bwd-cross` doesn't even take `f-bwd-crossover` as a prereq (it takes `f-fwd-crossover`).
    - `f-fwd-outside-edge` / `f-fwd-inside-edge` / `f-edge-control` are **intermediate** in foundations while `h-edge-work` is **advanced** in hockey.
    Pick one canonical node per skill or make the hockey node an explicit "hockey application of" alias.

---

## 4. MISSING core skills

Grouped by the age band at which USA Hockey first requires them. Everything here is in SP (or the matching practice-manual emphasis matrix) and absent from `hockey[]`.

### 4a. Missing 8U (should be beginner)
| Missing skill | Where it lives officially | Why it matters |
|---|---|---|
| **Backhand shot** | SP 8U Shooting (b) "backhand"; 8UM matrix "Backhand" | One of only **two** shots USA Hockey teaches at 8U. The tree has a backhand *pass* and a "Backhand Top Shelf" expert node — but no backhand shot. A hole directly under an expert node. |
| **Edge control (as a beginner node)** | SP 8U Skating (b) | Currently only exists as `h-edge-work` at advanced. See misplacement #1. |
| **C-cuts (forward and backward, single-foot)** | HCU9 "C-cuts — left / right / alternating" (fwd and bwd); PYHA 8U "c-starts, inside edge 'c's" | `foundations` has two-foot swizzles, which are a different skill. The single-foot C-cut is the actual push mechanic behind backward skating. |
| **Front-to-back dribble** · **diagonal dribble** | SP 8U Puck Control (b)(c); 8UM "Basic Dribbling Skills" | The tree collapses three named 8U stickhandling patterns into one generic "Forward Dribble". |
| **Attacking the triangle** | SP 8U Puck Control (d) — persists through 18U | A named 8U skill present in every SP age band and absent from the app. |
| **Stick on puck** · **stick lift** | SP 8U Body Contact (a)(b); 8UM Checking column "poke check, hook check, lift the stick check, covering" | The first defensive skills a Mite learns. Zero representation. |
| **Change of pace (with puck)** | 8UM Puck Control matrix "change of pace" | |

### 4b. Missing 10U (should be intermediate)
Flip shot · screen shot · shooting off a rebound (SP 10U Shooting c/d/f) · receiving a pass with the **skate** (SP 10U Passing e) · indirect / bank pass (SP 10U Passing f; HCU9 U9 "stationary bank pass") · give and take (SP 10U Puck Control h) · accelerating with the puck / one-hand carry (SP 10U Puck Control i) · **poke check** (SP 10U Body Contact c).

### 4c. Missing 12U (should be advanced)
Change of direction with the puck · backward puck control · fakes and deception while stickhandling · puck off the boards (SP 12U Puck Control j/k/l/m) · receiving a pass with the **hand** · surround the puck · one-touch passes · area passes (SP 12U Passing g/h/i/j) · fake shots (SP 12U Shooting i) · **backward cross-under start** · **backward two-skate stop** · **backward power stop (one skate)** (SP 12U Skating o/p/q) · stick press (SP 12U Body Contact f) · delivering and receiving body contact / contact confidence (SP 12U Body Contact h/i) · face-offs · shot blocking (SP 12U team concepts).

### 4d. Missing 14U (should be expert)
Fake shot · stop and go (SP 14U Puck Control n/o) · crisp passes (SP 14U Passing k) · shoulder check · receiving a body check (SP 14U Body Contact j/k) · forward and backward pivots as a *speed* skill and "backward skating with minimal crossovers" (SP 16/18U Skating x/y).

### 4e. The two whole missing performance areas

**Checking / body contact — 0 of 11 nodes.** USA Hockey's four-step progression is *positioning & angling → stick checks → body contact → body checking*, and it explicitly "begins the first time a young player steps on the ice", with body checking only at 14U/U15. The app has `h-angling`, `h-gap-control`, `h-box-out` and `h-closeout` as `type: "defensive"` skating nodes, but nothing for poke check, stick lift, sweep/press/pry/tap checks, rubbing out, pinning, screening out, contact confidence, or receiving a check. For a progress app this is the largest content gap after goaltending, and it's the one with a safety dimension — USA Hockey's whole argument is that checking is a *skill progression*, not a switch flipped at 14U. ([OMHA](https://www.omha.net/page/show/885509-checking-4-step-progression), [CHK](https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf))

**Goaltending — see §7.**

---

## 5. NAMING problems

| App name | Problem | USA Hockey / Hockey Canada term |
|---|---|---|
| Euro Step | Basketball term. Appears in **no** hockey curriculum. | "change of direction" (12U) or "fakes and deception while stickhandling" (12U) |
| Mirror Skating | Invented. | "body position: man-you-net" (SP 10U); "defensive side" / "steering" (CHK) |
| Close-Out Skating | Basketball loan-word. | **"Closing the Gap"** (CHK drills 40–41); "gap control" (SP 10U) |
| Power Slide Stop | Not a USA Hockey term, and duplicates One-Foot Stop. | **"one-foot power stop"** (8UM) / **"one-foot stop"** (SP 10U) |
| Inside/Outside Edges | The curriculum name is shorter and is an 8U item, which is the tier signal. | **"edge control"** (SP 8U, item b) |
| Forward Dribble | Not a USA Hockey pattern name; conflates three. | "lateral (side-to-side) / front-to-back / diagonal stickhandling" (SP 8U) |
| Skating with Puck | Vague. | "open ice carry — forehand & backhand" (HCU9); "accelerating with the puck (one-hand carry)" (SP 10U) |
| Spin-o-rama | Slang; also mis-typed as `skating` rather than puck control. | **"spin around"** (SP 14U Puck Control p) |
| Backhand Top Shelf | Describes a *result*, not a skill. | "shots in close (pull the puck in and get it up)" (SP 14U Shooting l) |
| Quick Release Shot | Coaching slang. | "stick position in scoring areas" (SP 14U Shooting k) |
| The Michigan (Lacrosse) | Not a curriculum skill at any age. | — |
| Hockey Stop / Backward Crystal-clear duplicates | `h-hockey-stop` vs `f-hockey-stop`; `h-bwd-cross` vs `f-bwd-crossover` — same skill, two ids, and in the second case two different levels. | one canonical node |
| Tight Turns (plural) | Inconsistent with the rest of the catalog's singular naming (`Mohawk Turn`, `Wrist Shot`). | "controlled turn" (SP 8U, item f) |

---

## 6. EXTRAS / trick moves to reconsider

Four nodes have **no counterpart anywhere** in SP (8U → 16/18U), the 8U/10U/12U practice manuals, *Checking the Right Way*, or Hockey Canada's U9 core-skills matrix:

| id | Status |
|---|---|
| `h-michigan` — The Michigan (lacrosse) | Highlight-reel finish. Zero curriculum presence. |
| `h-between-legs` | Highlight-reel finish. Zero curriculum presence. |
| `h-euro-step` | Not a hockey skill at all; the name is imported from basketball. |
| `h-no-look-pass` | Closest official cousin is 12U "fakes and deception"; "no-look" is a style, not a graded skill. |

**Do they belong in a skill tree at all?** Yes — but not in *this* one, and not at "expert".

- **The argument for keeping them:** they're the reason a 10-year-old opens the app. Stripping them removes the aspirational pull that makes a progress tracker sticky, and they *are* real things players practise.
- **The argument against the current placement:** putting The Michigan at the same tier as "top speed sprint", "one-foot edge work" and "close-out skating" asserts an equivalence that no governing body recognises. Worse, the tree currently lets a player reach `h-michigan` (via `h-toe-drag`) while still having **no backhand shot, no poke check, no flip shot and no backward power stop** — because those nodes don't exist. That's not a cosmetic flaw; it's a tree that rewards the wrong thing at the moment the player is most impressionable.
- **Recommendation:** move all four to a separate, **non-gating "Show Moves" shelf** — visible, celebrated, badge-able, but outside the graded progression, with no node depending on them and no contribution to a level score. Add a one-line note per move ("not part of USA Hockey's progression — a fun extra once your fundamentals are solid"). `h-spin-move` and `h-no-look-pass` are the two that *can* stay in-tree if renamed to their official cousins ("spin around", 14U; "fakes and deception", 12U).

Also worth reconsidering: `h-quick-feet` ("Quick Feet Agility") is USA Hockey's **8U** "ABCs of skating" wearing a 12U label, and `h-mirror-skating` is a real 10U concept wearing an invented name. Neither is a trick move, but both are tier-inflated in the same way.

---

## 7. Goalie skills: gap or scope choice?

**Verdict: a real gap, with one important caveat about 8U.**

Goaltending is **one of USA Hockey's six individual-skill performance areas**, listed alongside Skating, Puck Control, Passing & Receiving, Shooting and Body Contact in every practice-plan manual and in SP from 10U through 16/18U:

- **8U:** SP explicitly says *coaches should not designate full-time goaltenders* so that players develop skating and athleticism. The ADM Mite handbook: *"USA Hockey suggests the use of rotating goaltenders, size-appropriate nets or specialty target nets at 8U"*, and if a child does play goal, *"it is of extreme importance that the goaltender be involved in all the stations"*. So **omitting a goalie track at the beginner tier is correct and matches the ADM.** ([MITE](https://assets.ngin.com/attachments/document/0115/3516/USA_Hockey_Mite_8U_Handbook.pdf))
  *(Caveat: the older 8U practice-plan manual's emphasis matrix does carry a Goalkeeping column — basic stance, parallel shuffle, lateral T-guide, fwd/bwd movement, stick/body/glove/leg saves, stacking pads, "V" drop, rebounds. The ADM superseded this for 8U game play, but the skills themselves are taught young.)*
- **10U:** SP adds a full goaltending branch — positioning (stance, angling), movement (forward, backward, lateral), save technique (stick, glove, body/pads, butterfly), recovery.
- **12U:** adds sliding butterfly, stopping the puck behind the net, puck retention (cradling, rebound control), game situations (screen shots, walkouts, wraparounds).
- **14U:** adds puck handling (passing/clearing forehand and backhand), breakaways, line rushes, D-zone face-offs, communication.
- ADM's own guidance is that **full-time goaltending should start at 12–13**, and *"players should not go to the rink and be a backup goalie ever before the age of 13."* ([ADMG](https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time))

**Recommendation:** add a fifth top-level tree, `goalie[]`, ~16 nodes, **unlocked from the intermediate tier (10U) onward**, explicitly *not* offered at beginner. Suggested roster, in SP order:

`g-stance` (intermediate) · `g-angles` (int) · `g-shuffle` (int) · `g-t-push` (int) · `g-fwd-bwd-movement` (int) · `g-stick-save` (int) · `g-glove-save` (int) · `g-body-save` (int) · `g-butterfly` (int) · `g-recovery` (int) · `g-sliding-butterfly` (advanced) · `g-rebound-control` (adv) · `g-puck-stop-behind-net` (adv) · `g-screen-walkout-wraparound` (adv) · `g-puck-handling-pass-clear` (expert) · `g-breakaways` (expert) · `g-dzone-faceoffs-communication` (expert).

Keeping it a **separate tree** (rather than nodes inside `hockey[]`) also matches how USA Hockey structures it, and lets the app state the ADM's rotate-don't-specialise rule at 8U instead of silently omitting the position.

---

## 8. Balance check: puck skills vs skating skills

| Group | RinkBuddy `hockey[]` | USA Hockey SP (cumulative to 14U) |
|---|---|---|
| Skating (incl. starts + stops) | 22 (45%) | 23 (32%) |
| Puck control | 8 | 16 |
| Passing & receiving | 5 | 11 |
| Shooting | 9 | 12 |
| Body contact / checking | **0** (4 "defensive" nodes are skating-based positioning) | 11 |
| Goaltending | **0** | 7 branches |
| **Total** | **49** | **73 + goaltending** |

The skating-vs-puck balance inside what the app *does* cover is reasonable — slightly skating-heavy, which is defensible for a skating-progress app. The real imbalance is that **two of six official performance areas are empty**, and that within the covered areas the app skews toward the flashy end: 4 of 9 shooting nodes and 3 of 8 puck-control nodes are 14U-or-unofficial moves, while 8 straightforward 8U/10U skills (backhand shot, flip shot, screen shot, off-rebound, skate reception, bank pass, give-and-take, one-hand carry) are absent entirely.

Core 8U skating specifically: **present** are fall/recovery with gear ✅, ready stance ✅, V-start ✅, forward striding (via `f-fwd-stroke`) ✅, two-foot turns (via `h-tight-turn`) ✅, hockey stop ✅ (mis-tiered). **Absent** are C-cuts and single-foot edges as beginner nodes (edges exist only at `advanced`). So the 8U skating layer is mostly there but is *tagged* as intermediate/advanced, which is the actual defect rather than missing content.

---

## 9. Concrete JSON edit list

```json
[
  {"id":"h-edge-work","change":"level + name + prereqs + rewire dependents","from":{"level":"advanced","name":"Inside/Outside Edges","prereqs":["h-tight-turn"]},"to":{"level":"beginner","name":"Edge Control","prereqs":["h-ready-stance"]},"why":"SP lists 'edge control' as 8U Skating item (b), taught before starts, stops, turns and crossovers. The current arrow makes tight turns gate edges, inverting the most load-bearing relationship in skating instruction. After this edit, add h-edge-work to the prereqs of h-tight-turn, h-hockey-stop and h-mohawk.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-deflection","change":"level + prereqs","from":{"level":"expert","prereqs":["h-receiving","h-one-timer"]},"to":{"level":"intermediate","prereqs":["h-receiving"]},"why":"SP introduces 'deflection' at 10U (Shooting e), alongside flip shot and screen shot. Gating it behind the 14U one-timer is a 2-tier inversion.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-slap-shot","change":"level + prereqs","from":{"level":"intermediate","prereqs":["h-wrist-shot"]},"to":{"level":"advanced","prereqs":["h-snap-shot"]},"why":"SP introduces the slap shot at 12U (Shooting h). The 12U practice-manual emphasis matrix lists 'Slap'; the 8U and 10U matrices do not contain it at all.","source":"https://usahockey.cachefly.net/Coaching/Manuals/12UPracticePlan.pdf"},
  {"id":"h-hockey-stop","change":"level + prereqs","from":{"level":"intermediate","prereqs":["f-snowplow","f-fwd-stroke"]},"to":{"level":"beginner","prereqs":["f-snowplow","h-edge-work"]},"why":"The USA Hockey 8U Practice Plan Manual carries a dedicated 'CONTROLLED HOCKEY STOP' teaching page; Hockey Canada's U9 core skills list the two-foot parallel stop. The 10U skill is the ONE-foot stop, which h-1ft-stop already covers correctly.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-1ft-edges","change":"level","from":"expert","to":"intermediate","why":"Hockey Canada U9 core skills include balance on one foot, one-skate glides forward and backward, inside/outside-edge figure 8s and one-leg weaving. This is 8-9 year-old content, not elite.","source":"https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf"},
  {"id":"h-tight-turn","change":"level + name + prereqs","from":{"level":"intermediate","name":"Tight Turns","prereqs":["f-fwd-crossover"]},"to":{"level":"beginner","name":"Controlled Turn","prereqs":["h-edge-work"]},"why":"SP 8U Skating item (f) 'controlled turn'; the 8U manual has a 'CONTROL TURNS' page; HC U9 lists 'glide turns / tight turns'.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-power-start","change":"level","from":"intermediate","to":"beginner","why":"SP 8U Skating (c)(d): forward start and forward stride, with 'push to full extension of the thrusting leg' as the 8U teaching point.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-crossover-start","change":"level","from":"intermediate","to":"beginner","why":"Hockey Canada U9 'Starting and Stopping: crossover start'; PYHA 8U checklist 'crossover start (side start)'.","source":"https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf"},
  {"id":"h-bwd-snowplow-stop","change":"level","from":"intermediate","to":"beginner","why":"SP 8U Skating (i) 'backward stop'; the 8U manual has a 'BACKWARD STOP - SNOWPLOW' teaching page.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-fwd-bwd-pivot","change":"level","from":"intermediate","to":"beginner","why":"The 8U manual has a 'FORWARD TO BACKWARD TURN' teaching page; PYHA 8U lists pivoting forward-to-backward, backward-to-forward and 360s.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-bwd-fwd-pivot","change":"level","from":"intermediate","to":"beginner","why":"The 8U manual has a 'BACKWARD TO FORWARD - STEP OUT' teaching page; HC U9 lists pivots both directions, open and reverse.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-skating-dribble","change":"level + name","from":{"level":"intermediate","name":"Skating with Puck"},"to":{"level":"beginner","name":"Open-Ice Carry"},"why":"The entire 8U cross-ice model exists to maximise puck-touches in motion; HC U9 lists 'open ice carry - forehand & backhand' and 'weaving with puck'.","source":"https://assets.ngin.com/attachments/document/0115/3516/USA_Hockey_Mite_8U_Handbook.pdf"},
  {"id":"h-forehand-pass","change":"level + prereqs","from":{"level":"intermediate","prereqs":["h-wrist-shot"]},"to":{"level":"beginner","prereqs":["h-stationary-puck"]},"why":"SP 8U Passing (a). A shot must not gate a pass - passing and shooting are parallel branches off puck control in every progression.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-backhand-pass","change":"level","from":"intermediate","to":"beginner","why":"SP 8U Passing (b) 'backhand pass'.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-receiving","change":"level","from":"intermediate","to":"beginner","why":"SP 8U Passing (c) 'receiving a pass properly with the stick'.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-mohawk","change":"level","from":"advanced","to":"intermediate","why":"SP introduces the mohawk turn at 10U (Skating m); HC U9 lists 'Heel to Heel (Mohawk)' under Edge Control at U9.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-toe-drag","change":"level","from":"advanced","to":"intermediate","why":"SP introduces the toe drag at 10U (Puck Control g); HC U9 lists 'toe drag - side/front' at U9.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-protect-puck","change":"level","from":"advanced","to":"intermediate","why":"SP introduces 'puck protection' at 10U (Puck Control e).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-saucer-pass","change":"level","from":"advanced","to":"intermediate","why":"SP introduces 'saucer pass (forehand and backhand)' at 10U (Passing d).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-shooting-stride","change":"level","from":"advanced","to":"intermediate","why":"HC U9 lists 'forehand / backhand shots in motion' at U9; shooting off the stride is assumed by 10U in SP.","source":"https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf"},
  {"id":"h-deke","change":"level + prereqs","from":{"level":"advanced","prereqs":["h-skating-dribble","h-backhand-pass"]},"to":{"level":"intermediate","prereqs":["h-skating-dribble","h-stationary-puck"]},"why":"HC U9 Individual Offensive Tactics lists body fakes, stick fakes and dekes at U9; PYHA 8U lists 'dekes around cones and players'. A backhand PASS is not a prerequisite for a forehand-backhand deke.","source":"https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf"},
  {"id":"h-gap-control","change":"level","from":"advanced","to":"intermediate","why":"SP introduces 'gap control concept' at 10U under Body Contact (d) and 'gap control' at 10U under Defensive Concepts (a).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-angling","change":"level","from":"advanced","to":"intermediate","why":"SP introduces 'body positioning and angling' at 10U (Body Contact e). Angling is step 1 of USA Hockey's 4-step checking progression, which begins the first time a player steps on the ice.","source":"https://www.omha.net/page/show/885509-checking-4-step-progression"},
  {"id":"h-mirror-skating","change":"level + name","from":{"level":"expert","name":"Mirror Skating"},"to":{"level":"intermediate","name":"Defensive Side Position (Man-You-Net)"},"why":"'Mirror skating' appears in no curriculum. SP's 10U Defensive Concepts (e) is 'body position: man-you-net'; the checking manual calls the skill defensive side / steering.","source":"https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-closeout","change":"level + name","from":{"level":"expert","name":"Close-Out Skating"},"to":{"level":"advanced","name":"Closing the Gap"},"why":"'Close-out' is a basketball term. Checking the Right Way names the skill 'Closing the Gap' (drill 40) and 'Closing the Gap Tight' (drill 41), built on 10U gap control.","source":"https://cdn2.sportngin.com/attachments/document/0107/5730/Checking_Manual_FINAL_15.pdf"},
  {"id":"h-backwards-cross-full","change":"level","from":"expert","to":"advanced","why":"Backward crossover is a 10U skill; the speed qualifier is 12U lateral skating / 14U speed. Expert overstates it by one tier.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-one-timer","change":"level + prereqs","from":{"level":"advanced","prereqs":["h-slap-shot","h-receiving"]},"to":{"level":"expert","prereqs":["h-snap-shot","h-receiving"]},"why":"SP introduces one-timers at 14U (Shooting j). A one-timer is not built on the slap shot - it is most often a snap/wrist release off a moving puck.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-spin-move","change":"level + type + name","from":{"level":"advanced","type":"skating","name":"Spin-o-rama"},"to":{"level":"expert","type":"stick","name":"Spin Around"},"why":"SP lists 'spin around' at 14U under Puck Control (p), not under Skating. Tier and category are both wrong.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-power-stop","change":"merge into h-1ft-stop (delete node)","from":{"level":"advanced","name":"Power Slide Stop"},"to":null,"why":"USA Hockey has one skill here: 'One Foot Power Stop' (8U manual teaching page) = 'one-foot stop' (SP 10U). h-1ft-stop already models it. Shipping both creates two parallel names for one skill at two different tiers.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-quick-feet","change":"level + name","from":{"level":"advanced","name":"Quick Feet Agility","prereqs":["h-power-start"]},"to":{"level":"intermediate","name":"ABCs of Skating (Agility, Balance, Coordination, Speed)","prereqs":["h-ready-stance"]},"why":"SP lists 'ABCs of skating' as 8U Skating item (j) and as a through-line at every age; the discrete 'quickness/agility/power' qualifiers appear at 14U. Advanced splits the difference wrongly, and gating ABCs behind a start is backwards.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-quick-release","change":"name","from":"Quick Release Shot","to":"Shots in Close / Stick Position in Scoring Areas","why":"SP 14U Shooting (k)(l). Tier is already correct; only the label is slang.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-backhand-shelf","change":"prereqs","from":["h-deke","h-backhand-pass"],"to":["h-backhand-shot","h-deke"],"why":"A backhand finish must be built on the backhand SHOT (8U), not the backhand PASS. Requires adding h-backhand-shot below (see additions).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-fwd-dribble","change":"name","from":"Forward Dribble","to":"Front-to-Back Dribble","why":"SP names three distinct 8U stickhandling patterns - lateral, front-to-back, diagonal. 'Forward dribble' is not one of them and collapses two of the three.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-michigan","change":"move out of graded tree to non-gating 'Show Moves' shelf","from":{"level":"expert","tree":"hockey"},"to":{"tree":"show-moves","gating":false},"why":"Appears in no USA Hockey age band (8U-18U), no practice-plan emphasis matrix, and no Hockey Canada U9 matrix. Tagging it 'expert' next to top speed and edge work asserts an equivalence no governing body recognises.","source":"https://www.usahockey.com/skillprogressions"},
  {"id":"h-between-legs","change":"move out of graded tree to non-gating 'Show Moves' shelf","from":{"level":"expert","tree":"hockey"},"to":{"tree":"show-moves","gating":false},"why":"Same as h-michigan: zero curriculum presence at any age.","source":"https://www.usahockey.com/skillprogressions"},
  {"id":"h-euro-step","change":"delete or rename + move","from":{"level":"expert","name":"Euro Step","tree":"hockey"},"to":{"name":"Change of Direction with the Puck","level":"advanced","type":"stick"},"why":"'Euro step' is a basketball term absent from every hockey curriculum consulted. If the intent was a wide Datsyuk-style deke, SP's 12U Puck Control (j) 'change of direction' and (l) 'fakes and deception while stickhandling' are the real skills.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-no-look-pass","change":"rename + level, or move to Show Moves","from":{"level":"expert","name":"No-Look Pass","prereqs":["h-saucer-pass","h-skating-dribble"]},"to":{"level":"advanced","name":"Deception While Passing","prereqs":["h-forehand-pass","h-skating-dribble"]},"why":"SP 12U Puck Control (l) 'fakes and deception'; PYHA lists 'eye contact' as an 8U passing sub-point. 'No-look' is a style, not a graded skill, and the saucer-pass prereq is unrelated.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-bwd-cross","change":"prereqs (resolve cross-tree conflict)","from":["f-bwd-stroke","f-fwd-crossover"],"to":["f-bwd-crossover"],"why":"f-bwd-crossover is the same skill tagged 'beginner' in foundations while h-bwd-cross is 'intermediate' in hockey, and h-bwd-cross does not even depend on it. Pick one canonical node or make the hockey node an explicit alias.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"f-hockey-stop","change":"deduplicate against h-hockey-stop","from":{"level":"intermediate","prereqs":["f-snowplow","f-fwd-stroke"]},"to":"alias of h-hockey-stop (or delete one node)","why":"f-hockey-stop and h-hockey-stop are the same skill with identical prereqs, duplicated across two trees. A learner can complete one and still see the other locked.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},

  {"id":"h-backhand-shot","change":"ADD","from":null,"to":{"name":"Backhand Shot","type":"stick","level":"beginner","prereqs":["h-stick-grip","h-stationary-puck"]},"why":"SP 8U Shooting (b). One of only two shots taught at 8U, and currently the missing floor under the expert 'Backhand Top Shelf' node.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-lateral-dribble","change":"ADD","from":null,"to":{"name":"Lateral (Side-to-Side) Stickhandling","type":"stick","level":"beginner","prereqs":["h-stationary-puck"]},"why":"SP 8U Puck Control (a); 8U manual 'Basic Dribbling Skills'.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-diagonal-dribble","change":"ADD","from":null,"to":{"name":"Diagonal Stickhandling","type":"stick","level":"beginner","prereqs":["h-lateral-dribble"]},"why":"SP 8U Puck Control (c).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-attack-triangle","change":"ADD","from":null,"to":{"name":"Attacking the Triangle","type":"stick","level":"beginner","prereqs":["h-fwd-dribble"]},"why":"SP 8U Puck Control (d); persists in every age band through 16/18U. A named core skill entirely absent from the tree.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-c-cuts","change":"ADD","from":null,"to":{"name":"C-Cuts (Forward and Backward)","type":"skating","level":"beginner","prereqs":["h-edge-work"]},"why":"HC U9 lists C-cuts left/right/alternating both forward and backward, plus the backward C-cut start. Two-foot swizzles in foundations are a different skill.","source":"https://cdn.hockeycanada.ca/hockey-canada/Hockey-Programs/Players/Downloads/2020/u9-core-skills-e.pdf"},
  {"id":"h-stick-on-puck","change":"ADD","from":null,"to":{"name":"Stick on Puck","type":"defensive","level":"beginner","prereqs":["h-stick-grip"]},"why":"SP 8U Body Contact (a). The first defensive skill a Mite learns; the tree has no checking nodes at all.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-stick-lift","change":"ADD","from":null,"to":{"name":"Stick Lift","type":"defensive","level":"beginner","prereqs":["h-stick-on-puck"]},"why":"SP 8U Body Contact (b); 8U manual Checking column 'lift the stick check'.","source":"https://usahockey.cachefly.net/Coaching/Manuals/8UPracticePlan.pdf"},
  {"id":"h-poke-check","change":"ADD","from":null,"to":{"name":"Poke Check","type":"defensive","level":"intermediate","prereqs":["h-stick-on-puck","h-angling"]},"why":"SP 10U Body Contact (c); step 2 of the four-step checking progression.","source":"https://www.omha.net/page/show/885509-checking-4-step-progression"},
  {"id":"h-flip-shot","change":"ADD","from":null,"to":{"name":"Flip Shot","type":"stick","level":"intermediate","prereqs":["h-backhand-shot"]},"why":"SP 10U Shooting (c); HC U9 lists forehand and backhand flip shots.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-screen-shot","change":"ADD","from":null,"to":{"name":"Screen Shot","type":"stick","level":"intermediate","prereqs":["h-wrist-shot"]},"why":"SP 10U Shooting (d).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-rebound-shot","change":"ADD","from":null,"to":{"name":"Shooting Off a Rebound","type":"stick","level":"intermediate","prereqs":["h-wrist-shot","h-receiving"]},"why":"SP 10U Shooting (f).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-skate-reception","change":"ADD","from":null,"to":{"name":"Receiving a Pass with the Skate","type":"stick","level":"intermediate","prereqs":["h-receiving"]},"why":"SP 10U Passing (e).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-indirect-pass","change":"ADD","from":null,"to":{"name":"Indirect / Bank Pass","type":"stick","level":"intermediate","prereqs":["h-forehand-pass"]},"why":"SP 10U Passing (f); HC U9 lists the stationary bank pass.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-one-hand-carry","change":"ADD","from":null,"to":{"name":"Accelerating with the Puck (One-Hand Carry)","type":"stick","level":"intermediate","prereqs":["h-skating-dribble"]},"why":"SP 10U Puck Control (i).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-bwd-cross-under-start","change":"ADD","from":null,"to":{"name":"Backward Cross-Under Start","type":"start","level":"advanced","prereqs":["h-bwd-cross"]},"why":"SP 12U Skating (o).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-bwd-two-skate-stop","change":"ADD","from":null,"to":{"name":"Backward Two-Skate Stop","type":"stop","level":"advanced","prereqs":["h-bwd-snowplow-stop"]},"why":"SP 12U Skating (p).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-bwd-power-stop","change":"ADD","from":null,"to":{"name":"Backward Power Stop (One Skate)","type":"stop","level":"advanced","prereqs":["h-bwd-two-skate-stop"]},"why":"SP 12U Skating (q).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-fakes-deception","change":"ADD","from":null,"to":{"name":"Fakes and Deception While Stickhandling","type":"stick","level":"advanced","prereqs":["h-deke","h-toe-drag"]},"why":"SP 12U Puck Control (l); also the honest home for the 'no-look' and 'Euro step' nodes.","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-backward-puck-control","change":"ADD","from":null,"to":{"name":"Backward Puck Control","type":"stick","level":"advanced","prereqs":["h-bwd-cross","h-skating-dribble"]},"why":"SP 12U Puck Control (k).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-contact-confidence","change":"ADD","from":null,"to":{"name":"Body Contact: Delivering and Receiving (Contact Confidence)","type":"defensive","level":"advanced","prereqs":["h-angling","h-stick-lift"]},"why":"SP 12U Body Contact (h)(i); step 3 of the four-step checking progression, taught at 12U in preparation for body checking at 14U.","source":"https://www.omha.net/page/show/885509-checking-4-step-progression"},
  {"id":"h-stop-and-go","change":"ADD","from":null,"to":{"name":"Stop and Go (with Puck)","type":"stick","level":"expert","prereqs":["h-protect-puck","h-1ft-stop"]},"why":"SP 14U Puck Control (o).","source":"https://cdn1.sportngin.com/attachments/document/0066/4690/Skill_Progression_Manual_19_FINAL.pdf"},
  {"id":"h-shoulder-check","change":"ADD","from":null,"to":{"name":"Shoulder Check / Receiving a Body Check","type":"defensive","level":"expert","prereqs":["h-contact-confidence"]},"why":"SP 14U Body Contact (j)(k); body checking is step 4 and is introduced at 14U/U15, never earlier.","source":"https://www.omha.net/page/show/885509-checking-4-step-progression"},
  {"id":"goalie[]","change":"ADD NEW TREE (~17 nodes, intermediate tier and above; explicitly none at beginner)","from":null,"to":{"tree":"goalie","unlocks_at":"intermediate","nodes":["g-stance","g-angles","g-shuffle","g-t-push","g-fwd-bwd-movement","g-stick-save","g-glove-save","g-body-save","g-butterfly","g-recovery","g-sliding-butterfly","g-rebound-control","g-puck-stop-behind-net","g-screen-walkout-wraparound","g-puck-handling-pass-clear","g-breakaways","g-dzone-faceoffs-communication"]},"why":"Goaltending is one of USA Hockey's six individual-skill performance areas, with a full branch in SP at 10U, 12U, 14U and 16/18U. Omitting it at beginner is CORRECT and matches the ADM (rotating goalies at 8U, no full-time goalie before 12-13), but omitting it entirely is a gap.","source":"https://www.admkids.com/news_article/show/710723-10u-q-and-a-when-is-the-time-for-full-time"}
]
```

---

## 10. Suggested order of work

1. **Fix `h-edge-work` first** (tier + the inverted prereq) — it is the structural error and everything above it re-sorts once it moves.
2. Apply the 11 straight tier demotions in the 8U skating cluster and the passing block; this alone moves the tree from 13/49 correct to ~31/49.
3. Fix the four prereq inversions (`h-forehand-pass ← h-wrist-shot`, `h-one-timer ← h-slap-shot`, `h-deke ← h-backhand-pass`, `h-deflection ← h-one-timer`).
4. Deduplicate `f-hockey-stop`/`h-hockey-stop`, `f-bwd-crossover`/`h-bwd-cross`, and merge `h-power-stop` into `h-1ft-stop`.
5. Add `h-backhand-shot` and the 10U shooting/passing block (flip, screen, off-rebound, skate reception, bank pass) — the cheapest way to close the biggest content hole.
6. Move the four trick moves to a non-gating shelf.
7. Add the checking track, then the goalie tree.
