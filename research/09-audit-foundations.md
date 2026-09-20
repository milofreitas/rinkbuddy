# FOUNDATIONS tree audit vs. Learn to Skate USA Basic 1–6

**Date:** 2026-09-19
**Tree audited:** `research/catalog-current.json` → `foundations` (32 skills)
**Authority:** Learn to Skate USA Basic Skills curriculum (US Figure Skating)
**Cross-check:** Skate Canada CanSkate stage chart

---

## 0. Source verification (read this first — the existing transcription is stale)

`SKILL_RESEARCH.md` transcribes the **2016** edition of the Basic Skills curriculum.
That edition is genuinely obsolete. The curriculum was revised in **2020** and Basic 6 gained an element.

| Source | Date | Status |
|---|---|---|
| [learntoskateusa.com/media/1159/curriculum_basicskills.pdf](https://web.archive.org/web/20250826210250/https://www.learntoskateusa.com/media/1159/curriculum_basicskills.pdf) (archived) | PDF metadata: **2016-03-08** | **Superseded.** Basic 6 has 7 elements, no mohawk. This is what `SKILL_RESEARCH.md` and the Riedell blog reproduce. The URL now 404s — LTS USA redesigned the site and removed it. |
| [broadmoorworldarena.com/.../Curriculum_BasicSkills.pdf](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) | PDF metadata: **2020-06-17** | **CURRENT / PRIMARY.** Official LTS USA-branded "BASIC SKILLS – FUNdamentals" sheet. Basic 6 has **8** elements; Basic 6 A is the forward inside open mohawk. Hosted by the Broadmoor World Arena (US Figure Skating's home rink, Colorado Springs). |
| [new_Basic_1-6_skill_sheet.pdf](https://cdn1.sportngin.com/attachments/document/6263-2523945/new_Basic_1-6_skill_sheet.pdf) | 2021-09-18 | **Corroborates the 2020 list** element-for-element, including the Basic 6 mohawk. |
| [learntoskateusa.com/basic_skills](https://www.learntoskateusa.com/basic_skills) | live 2026 | Program overview only — the live site no longer publishes the element list. Confirms the six-level structure and the Basic 1–2 / Basic 3–6 split. |
| [Curriculum_FreeSkate.pdf](https://njwcc.com/wp-content/uploads/2025/09/Curriculum_FreeSkate.pdf) | 2016/2018 | Used only to place skills **beyond** Basic 6. Note it still lists the mohawk under Pre-Free Skate — that is the pre-2020 placement, superseded. |
| [CanSkate Skills Chart](https://cslfsc.uplifterinc.com/sites/files/CanSkate-Skills-Chart.pdf) | Skate Canada 2012 | Cross-check only. |

**Net effect on this audit:** one extra missing element (the Basic 6 mohawk) that a `SKILL_RESEARCH.md`-based audit would not have caught. Everything else in the old transcription checks out, with minor wording drift (Basic 5 advanced two-foot spin is *4–6 revolutions*; Basic 6 spiral is *R or L*).

### Official Basic 1–6, current (2020) edition

| Level | Elements (bonus marked «) |
|---|---|
| **Basic 1** | Sit on ice and stand up · March forward across the ice · Forward two-foot glide · Dip · Forward swizzles 6–8 · **Backward wiggles 6–8** · Beginning snowplow stop (one or two feet) · «Two-foot hop in place |
| **Basic 2** | **Scooter pushes R/L** · Forward one-foot glides R/L · Backward two-foot glide · Rocking horse · Backward swizzles 6–8 · **Two-foot turns forward to backward in place** · Moving snowplow stop · «**Curves** |
| **Basic 3** | Beginning forward stroking · **Forward half swizzle pumps on a circle** · Moving forward-to-backward two-foot turns on a circle · **Beginning backward one-foot glides** · **Backward snowplow stop R/L** · Forward slalom · «**Forward pivots** |
| **Basic 4** | Forward outside edge on a circle R/L · Forward inside edge on a circle R/L · Forward crossovers CW/CCW · **Backward half swizzle pumps on a circle** · **Backward one-foot glides R/L** · Beginning two-foot spin (≤2 revs) · «Forward lunges both legs |
| **Basic 5** | Backward outside edge on a circle R/L · Backward inside edge on a circle R/L · Backward crossovers CW/CCW · Forward outside three-turn R/L · **Advanced two-foot spin 4–6 revs** · Hockey stop both directions · «**Side toe hop R/L** |
| **Basic 6** | **Forward inside open mohawk from a standstill** · Forward inside three-turn R/L · **Moving backward-to-forward two-foot turn on a circle** · Backward stroking · Beginning one-foot spin 2–4 revs · T-stops R/L · **Bunny hop** · Forward spiral on a straight line · «Shoot the duck |

**Bold = absent from the RinkBuddy tree.** 46 official elements; the tree covers 31 of them across 30 entries (2 of its 32 entries are not official elements).

---

## 1. Level mapping used

| App tag | Official band | Rationale |
|---|---|---|
| `beginner` | Basic 1–2 | LTS USA's own "Discover, Learn and Play" grouping |
| `intermediate` | Basic 3–4 | first half of "FUNdamentals" |
| `advanced` | Basic 5–6 and beyond | second half of FUNdamentals + Pre-Free Skate |

This is the mapping the task specified, and it happens to line up with LTS USA's published two-block split ([learntoskateusa.com/basic_skills](https://www.learntoskateusa.com/basic_skills)), so it is defensible as-is.

All "source URL" cells below point to the primary 2020 curriculum sheet unless noted:
`BM` = https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf
`SS21` = https://cdn1.sportngin.com/attachments/document/6263-2523945/new_Basic_1-6_skill_sheet.pdf
`FS` = https://njwcc.com/wp-content/uploads/2025/09/Curriculum_FreeSkate.pdf

---

## 2. Full skill table

| id | app level | official level | verdict | source URL |
|---|---|---|---|---|
| f-fall-getup | beginner | Basic 1 A | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-march | beginner | Basic 1 B | ✅ correct (name drift) | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-2ft-glide | beginner | Basic 1 C | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-dip | beginner | Basic 1 D | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-swizzle | beginner | Basic 1 E | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-snowplow | beginner | Basic 1 G (beginning) / Basic 2 G (moving) | ✅ level correct — ❌ **prereq inverted** (gated behind Basic 3 stroking) | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-2ft-hop | beginner | Basic 1 « bonus | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-1ft-glide | beginner | Basic 2 B | ✅ correct (name ambiguous vs. the backward version) | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-2ft-glide | beginner | Basic 2 C | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-rocking-horse | beginner | Basic 2 D | ✅ correct — prereqs exactly right | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-swizzle | beginner | Basic 2 E | ✅ level correct — ⚠️ skips backward wiggles (Basic 1 F) | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-stroke | beginner | **Basic 3 A** | ❌ **one band low** → intermediate | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-slalom | intermediate | Basic 3 F | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-transition | intermediate | Basic 3 C (moving, on a circle) | ✅ level correct — ❌ **prereq inverted** (requires Basic 6 backward stroking); name is hockey vocabulary | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-outside-edge | intermediate | Basic 4 A | ✅ level correct — ❌ **prereq backwards** (gated behind crossovers) | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-inside-edge | intermediate | Basic 4 B | ✅ level correct — ❌ **prereq backwards** (gated behind crossovers) | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-crossover | beginner | **Basic 4 C** | ❌ **one band low** → intermediate; prereqs miss the edges | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-2ft-spin | intermediate | Basic 4 F | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-lunge | advanced | **Basic 4 « bonus** | ❌ **one band high** → intermediate | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-outside-edge | intermediate | **Basic 5 A** | ❌ **one band low** → advanced; prereq backwards | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-inside-edge | intermediate | **Basic 5 B** | ❌ **one band low** → advanced; prereq backwards | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-crossover | beginner | **Basic 5 C** | ❌ **two bands low** → advanced; prereq inverted | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-outside-3turn | advanced | Basic 5 D | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-hockey-stop | intermediate | **Basic 5 F** | ❌ **one band low** → advanced | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-fwd-inside-3turn | advanced | Basic 6 B | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-stroke | beginner | **Basic 6 D** | ❌ **two bands low** → advanced; also feeds Basic 5 crossovers, which is backwards | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-1ft-spin | advanced | Basic 6 E | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-t-stop | beginner | **Basic 6 F** | ❌ **two bands low** → advanced; unlocks on Basic 3 stroking | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) · [SS21](https://cdn1.sportngin.com/attachments/document/6263-2523945/new_Basic_1-6_skill_sheet.pdf) |
| f-fwd-spiral | advanced | Basic 6 H | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-shoot-the-duck | advanced | Basic 6 « bonus | ✅ correct | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-bwd-stroking-adv | advanced | **not an official element** (duplicate of Basic 6 D) | ❌ **merge into f-bwd-stroke** | [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf) |
| f-edge-control | intermediate | **not in Basic 1–6** (nearest: Free Skate 1 B consecutive edges) | ❌ **remove or retitle + move past Basic 6** | [FS](https://njwcc.com/wp-content/uploads/2025/09/Curriculum_FreeSkate.pdf) |

**Score: 18 of 32 correct. 12 level errors, 2 non-elements, 15 official elements missing.**

---

## 3. MISPLACEMENTS (ranked by severity)

### Tier 1 — two bands wrong (advanced curriculum sitting in `beginner`)

These are the dangerous ones: a true novice sees them unlocked in week one.

1. **`f-t-stop` — beginner → advanced.** The T-stop is **Basic 6 F**, the *last* stopping skill in the whole curriculum, taught after three-turns and one-foot spins. In the tree it unlocks off `f-fwd-stroke` (Basic 3) and is tagged beginner — three levels early. A beginner attempting a T-stop drags a flat backward blade and catches it. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf), [SS21](https://cdn1.sportngin.com/attachments/document/6263-2523945/new_Basic_1-6_skill_sheet.pdf).
2. **`f-bwd-crossover` — beginner → advanced.** Backward crossovers are **Basic 5 C**. Skaters reach them after *both* backward edges on a circle (Basic 5 A/B), which themselves follow backward one-foot glides (Basic 3 D / Basic 4 E) that the tree doesn't even contain. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).
3. **`f-bwd-stroke` — beginner → advanced.** Backward stroking is **Basic 6 D** — the very end of the curriculum. The tree unlocks it off a Basic 2 backward two-foot glide. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).

### Tier 2 — one band wrong, understated (skill is harder than the tag says)

4. **`f-fwd-crossover` — beginner → intermediate.** Basic 4 C. Crossovers are the headline Basic 4 element and the tree's second-most-depended-on node; tagging them beginner distorts everything downstream. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).
5. **`f-bwd-outside-edge` — intermediate → advanced.** Basic 5 A. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).
6. **`f-bwd-inside-edge` — intermediate → advanced.** Basic 5 B. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).
7. **`f-hockey-stop` — intermediate → advanced.** Basic 5 F, taught after backward crossovers and the forward outside three-turn. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).
8. **`f-fwd-stroke` — beginner → intermediate.** Basic 3 A. "Beginning forward stroking showing correct use of blade" is where FUNdamentals starts; Basic 1–2 forward travel is marching and swizzles, not stroking. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).

### Tier 3 — one band wrong, overstated (harmless but gates progress)

9. **`f-lunge` — advanced → intermediate.** The forward lunge is the **Basic 4 bonus skill**, not an advanced element. Marking it advanced hides an early confidence win. Source: [BM](https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf).

### Tier 4 — not level errors, but wrong entries

10. **`f-bwd-stroking-adv`** duplicates `f-bwd-stroke`. There is exactly one backward stroking element in Basic 1–6 (Basic 6 D) and no "advanced backward stroking" anywhere in Free Skate 1–6. Merge.
11. **`f-edge-control`** is not an element in any LTS USA level — it is a coaching concept. The nearest real element is **Free Skate 1 B**, "Basic forward outside and forward inside consecutive edges (four to six consecutive edges)" ([FS](https://njwcc.com/wp-content/uploads/2025/09/Curriculum_FreeSkate.pdf)). Either delete it or retitle it "Consecutive Edges" and place it past Basic 6.

---

## 4. MISSING official elements (15)

| Element (official wording) | Belongs at | App level it should carry | Note |
|---|---|---|---|
| Backward wiggles — 6–8 in a row | **Basic 1 F** | beginner | The first backward motion in the curriculum. Its absence is why `f-bwd-swizzle` hangs off a forward skill. |
| Scooter pushes — R and L | **Basic 2 A** | beginner | The single-leg push that makes stroking possible later. |
| Two-foot turns forward to backward **in place** — CW and CCW | **Basic 2 F** | beginner | The tree only has the *moving* Basic 3 version (`f-transition`). |
| Curves | **Basic 2 « bonus** | beginner | |
| Forward half swizzle pumps on a circle — 6–8 CW and CCW | **Basic 3 B** | intermediate | The direct precursor to the forward crossover. Missing it is the reason the crossover prereq chain is thin. |
| Beginning backward one-foot glides | **Basic 3 D** | intermediate | |
| Backward snowplow stop — R and L | **Basic 3 E** | intermediate | **The tree contains no backward stop at all**, yet gates several backward skills. |
| Forward pivots — CW and CCW | **Basic 3 « bonus** | intermediate | The official entry into the two-foot spin. |
| Backward half swizzle pumps on a circle — CW and CCW | **Basic 4 D** | intermediate | Direct precursor to the backward crossover. |
| Backward one-foot glides — R and L | **Basic 4 E** | intermediate | |
| Advanced two-foot spin — 4–6 revolutions | **Basic 5 E** | advanced | The tree jumps `f-2ft-spin` (≤2 revs) straight to `f-1ft-spin`, skipping a whole level. |
| Side toe hop — R and L | **Basic 5 « bonus** | advanced | |
| **Forward inside open mohawk from a standstill (R to L and L to R)** | **Basic 6 A** | advanced | **Added in the 2020 revision** — not in `SKILL_RESEARCH.md`. The tree has no mohawk anywhere in foundations. |
| Moving backward-to-forward two-foot turn on a circle — CW and CCW | **Basic 6 C** | advanced | The mirror of `f-transition`; the tree only has forward→backward. |
| Bunny hop | **Basic 6 G** | advanced | The first jump every skater learns; a conspicuous gap. |

Structural pattern in the gaps: **the backward progression and the "pumps" progression are both gutted.** The tree has backward swizzles and backward crossovers but nothing in between — no wiggles, no backward one-foot glide, no backward snowplow stop, no backward half-swizzle pumps. That is four of the five rungs of the backward ladder missing.

CanSkate cross-check agrees on the shape: Skate Canada also builds backward travel through sculling → 2-foot-to-1-foot glide → circle thrusts → crosscuts across Stages 2–5, i.e. three intermediate rungs before crossovers ([CanSkate Skills Chart](https://cslfsc.uplifterinc.com/sites/files/CanSkate-Skills-Chart.pdf)).

---

## 5. NAMING

| id | app name | official wording | severity |
|---|---|---|---|
| f-fall-getup | Falling & Getting Up | **Sit on ice and stand up** | minor — app wording is arguably clearer for users |
| f-march | Marching on Ice | **March forward across the ice** | minor |
| f-1ft-glide | One-Foot Glide | **Forward one-foot glide** | **medium** — ambiguous; "backward one-foot glide" is a *separate* element (Basic 3 D / Basic 4 E) that is missing, so the unqualified name silently absorbs two skills |
| f-fwd-stroke | Forward Stroking/Skating | **Beginning forward stroking** | medium — the slash form isn't LTS terminology |
| f-bwd-stroke | Backward Stroking/Skating | **Backward stroking** | medium |
| f-transition | Forward to Backward Transition | **Moving forward to backward two-foot turn on a circle** | **high** — "transition" is hockey vocabulary; LTS calls this a *two-foot turn*, and the name hides that the backward-to-forward mirror (Basic 6 C) is missing |
| f-2ft-hop | Two-Foot Hop | **Two-foot hop in place** | minor — "in place" is the pass criterion |
| f-fwd-spiral | Forward Spiral | **Forward spiral on a straight line** | medium — "on a straight line" distinguishes it from the Free Skate 2 spiral on an axis |
| f-1ft-spin | One-Foot Spin | **Beginning one-foot spin (2–4 revolutions)** | minor |
| f-lunge | Lunge | **Forward lunges — both legs** | minor |
| f-fwd-outside-edge etc. | Forward Outside Edge | **Forward outside edge on a circle** | minor — "on a circle" is part of the element |
| f-t-stop | T-Stop | **T-stops (R and L)** | ✅ acceptable |
| f-snowplow | Snowplow Stop | **Beginning snowplow stop** (B1) / **Moving snowplow stop** (B2) | medium — one node covers two graded elements |
| f-rocking-horse | Rocking Horse | **Rocking horse** | ✅ correct |
| f-shoot-the-duck | Shoot the Duck | **Shoot the duck** | ✅ correct |
| f-hockey-stop | Hockey Stop | **Hockey stop — both directions** | ✅ correct |
| f-fwd-slalom | Forward Slalom | **Forward slalom** | ✅ correct |
| f-2ft-spin | Beginning Two-Foot Spin | **Beginning two-foot spin** | ✅ correct |
| f-edge-control | Edge Control | *no official equivalent* | see EXTRAS |
| f-bwd-stroking-adv | Backward Stroking (Advanced) | *no official equivalent* | see EXTRAS |

The four terms the task flagged — **snowplow stop, backward wiggles, rocking horse, two-foot turn, T-stop** — check out as follows: snowplow stop ✅ present and correctly named (but conflates B1/B2); rocking horse ✅ present and correct; T-stop ✅ correctly named (badly levelled); **backward wiggles ❌ absent entirely**; **two-foot turn ❌ present but renamed "transition", and only one of the two official directions exists**.

---

## 6. EXTRAS (in the tree, not in Basic 1–6)

| id | what it is | recommendation |
|---|---|---|
| `f-edge-control` | Not an LTS element. A coaching umbrella over the four edge skills it already depends on, so it adds a node with no assessable pass criterion. | **Remove** from foundations. If you want the concept, retitle it **"Consecutive Edges"** and place it in the figure track as Free Skate 1 B / Free Skate 2 B ([FS](https://njwcc.com/wp-content/uploads/2025/09/Curriculum_FreeSkate.pdf)). |
| `f-bwd-stroking-adv` | Duplicate of Basic 6 D. No "advanced backward stroking" exists in Basic 1–6 or Free Skate 1–6. The real next rung is **Free Skate 1 A, forward power stroking**. | **Merge** into `f-bwd-stroke`. If you want the next rung, add "Forward Power Stroking" (Free Skate 1 A) to the figure track instead. |

Everything else in the tree is a genuine Basic 1–6 element. Notably **`f-hockey-stop` should stay in foundations** — despite the name it is Basic 5 F, a required figure-skating element, not a hockey-track extra.

---

## 7. PREREQ problems (teaching-order violations)

### A. Edges gated behind crossovers — both directions, the worst structural error

```
tree:     f-fwd-crossover → f-fwd-outside-edge, f-fwd-inside-edge
official: Basic 4 A/B (edges) → Basic 4 C (crossovers)

tree:     f-bwd-crossover → f-bwd-outside-edge, f-bwd-inside-edge
official: Basic 5 A/B (edges) → Basic 5 C (crossovers)
```

This is backwards in both the curriculum's ordering *and* in physics: a crossover **is** a sequence of edges — an outside edge on the crossing foot over an inside edge on the pushing foot. Teaching the crossover first is how skaters learn to step flat-footed around a circle and then have to unlearn it. All four edge nodes need their prereqs reversed.

### B. Basic 3 and Basic 5 skills gated behind Basic 6 skills

- `f-transition` (Basic 3 C) requires `f-bwd-stroke` (**Basic 6 D**) — a Basic 3 element locked behind the second-to-last element in the curriculum. Should depend on the backward two-foot glide.
- `f-bwd-crossover` (Basic 5 C) requires `f-bwd-stroke` (**Basic 6 D**) — inverted. Officially backward stroking comes *after* backward crossovers. The dependency should run the other way.

### C. Basic 1 skill gated behind a Basic 3 skill

- `f-snowplow` (Basic 1 G) requires `f-fwd-stroke` (**Basic 3 A**). The beginning snowplow stop is the seventh thing a skater ever does, taught in the same session as marching. Depending it on stroking means a genuine Basic 1 student cannot record their first stop.

### D. Under-gated

- `f-t-stop` (Basic 6 F) unlocks on `f-fwd-stroke` alone — three levels of prerequisite skipped.
- `f-hockey-stop` (Basic 5 F) unlocks on snowplow + stroking, skipping all of Basic 4.
- `f-bwd-swizzle` (Basic 2 E) depends on `f-fwd-swizzle`; officially **backward wiggles** (Basic 1 F) is the precursor. Add that node and re-point.
- `f-2ft-spin` (Basic 4 F) depends on the crossover; officially the two-foot spin is entered **from a pivot** (Basic 3 bonus), which is the better prereq once forward pivots exist.

### E. Correct as written (no change)

`f-rocking-horse` ← forward + backward swizzles (it is literally one of each) · `f-1ft-glide` ← two-foot glide · `f-fwd-stroke` ← forward swizzles · `f-fwd-outside-3turn` ← forward outside edge · `f-fwd-inside-3turn` ← forward inside edge · `f-1ft-spin` ← two-foot spin · `f-fwd-spiral` ← forward outside edge · `f-lunge` ← stroking + dip · `f-shoot-the-duck` ← dip + forward outside edge · `f-bwd-2ft-glide` ← backward swizzles.

---

## 8. Edits as JSON

```json
[
  {"id":"f-t-stop","change":"level","from":"beginner","to":"advanced","why":"T-stop is Basic 6 F — the final stopping element in the curriculum, taught after three-turns and the one-foot spin. Two bands too low.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-crossover","change":"level","from":"beginner","to":"advanced","why":"Backward crossovers are Basic 5 C, taught after both backward edges on a circle. Two bands too low.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-stroke","change":"level","from":"beginner","to":"advanced","why":"Backward stroking is Basic 6 D, the second-to-last skating skill in Basic 1-6. Two bands too low.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-crossover","change":"level","from":"beginner","to":"intermediate","why":"Forward crossovers are Basic 4 C, the headline element of Basic 4.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-outside-edge","change":"level","from":"intermediate","to":"advanced","why":"Backward outside edge on a circle is Basic 5 A.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-inside-edge","change":"level","from":"intermediate","to":"advanced","why":"Backward inside edge on a circle is Basic 5 B.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-hockey-stop","change":"level","from":"intermediate","to":"advanced","why":"Hockey stop is Basic 5 F, taught after backward crossovers and the forward outside three-turn.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-stroke","change":"level","from":"beginner","to":"intermediate","why":"Beginning forward stroking is Basic 3 A — the first FUNdamentals element. Basic 1-2 forward travel is marching and swizzles.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-lunge","change":"level","from":"advanced","to":"intermediate","why":"Forward lunges (both legs) is the Basic 4 bonus skill, not an advanced element.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},

  {"id":"f-fwd-outside-edge","change":"prereqs","from":["f-fwd-crossover"],"to":["f-fwd-stroke","f-fwd-halfswizzle-pumps"],"why":"Edges (Basic 4 A) precede crossovers (Basic 4 C). A crossover is a sequence of edges; gating the edge behind it is backwards. Forward half swizzle pumps (Basic 3 B) is the official precursor.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-inside-edge","change":"prereqs","from":["f-fwd-crossover"],"to":["f-fwd-stroke","f-fwd-halfswizzle-pumps"],"why":"Same inversion: Basic 4 B precedes Basic 4 C.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-crossover","change":"prereqs","from":["f-fwd-stroke"],"to":["f-fwd-outside-edge","f-fwd-inside-edge"],"why":"Basic 4 C comes after Basic 4 A and B.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-outside-edge","change":"prereqs","from":["f-bwd-crossover"],"to":["f-bwd-1ft-glide","f-bwd-halfswizzle-pumps"],"why":"Basic 5 A precedes Basic 5 C. Its real precursors are backward one-foot glides (Basic 4 E) and backward half swizzle pumps (Basic 4 D).","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-inside-edge","change":"prereqs","from":["f-bwd-crossover"],"to":["f-bwd-1ft-glide","f-bwd-halfswizzle-pumps"],"why":"Same inversion: Basic 5 B precedes Basic 5 C.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-crossover","change":"prereqs","from":["f-bwd-stroke"],"to":["f-bwd-outside-edge","f-bwd-inside-edge"],"why":"Backward crossovers (Basic 5 C) follow the backward edges, and precede backward stroking (Basic 6 D) rather than following it.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-stroke","change":"prereqs","from":["f-bwd-2ft-glide"],"to":["f-bwd-crossover"],"why":"Backward stroking is Basic 6 D, taught after backward crossovers (Basic 5 C). The current edge runs the wrong way.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-transition","change":"prereqs","from":["f-fwd-stroke","f-bwd-stroke"],"to":["f-fwd-stroke","f-bwd-2ft-glide"],"why":"Moving forward-to-backward two-foot turns is Basic 3 C; requiring backward stroking locks a Basic 3 element behind Basic 6 D.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-snowplow","change":"prereqs","from":["f-fwd-stroke"],"to":["f-march","f-2ft-glide"],"why":"Beginning snowplow stop is Basic 1 G, taught in the same session as marching. Requiring Basic 3 stroking means a Basic 1 skater cannot log their first stop.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-t-stop","change":"prereqs","from":["f-fwd-stroke"],"to":["f-fwd-outside-edge","f-hockey-stop"],"why":"Basic 6 F should not unlock on a Basic 3 element; the T-stop needs edge control and a prior moving stop.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-hockey-stop","change":"prereqs","from":["f-snowplow","f-fwd-stroke"],"to":["f-snowplow","f-fwd-crossover"],"why":"Basic 5 F should not unlock before any of Basic 4; the two-foot skid depends on the edge work in Basic 4.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-swizzle","change":"prereqs","from":["f-fwd-swizzle"],"to":["f-bwd-wiggle"],"why":"Backward swizzles is Basic 2 E; its official precursor is backward wiggles (Basic 1 F), not the forward swizzle.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-2ft-spin","change":"prereqs","from":["f-fwd-crossover"],"to":["f-fwd-pivot","f-fwd-crossover"],"why":"The beginning two-foot spin (Basic 4 F) is entered from a pivot; forward pivots is the Basic 3 bonus skill and the natural precursor.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},

  {"id":"f-bwd-wiggle","change":"add","from":null,"to":{"id":"f-bwd-wiggle","name":"Backward Wiggles","type":"locomotion","level":"beginner","prereqs":["f-2ft-glide"]},"why":"Basic 1 F, 6-8 in a row. The first backward motion in the curriculum and the missing root of the backward branch.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-scooter-push","change":"add","from":null,"to":{"id":"f-scooter-push","name":"Scooter Pushes","type":"locomotion","level":"beginner","prereqs":["f-march","f-2ft-glide"]},"why":"Basic 2 A (R and L). The single-leg push that makes stroking possible.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-2ft-turn-inplace","change":"add","from":null,"to":{"id":"f-2ft-turn-inplace","name":"Two-Foot Turns in Place","type":"turn","level":"beginner","prereqs":["f-2ft-glide","f-bwd-2ft-glide"]},"why":"Basic 2 F, forward to backward in place, CW and CCW. The tree only has the moving Basic 3 version.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-curves","change":"add","from":null,"to":{"id":"f-curves","name":"Curves","type":"locomotion","level":"beginner","prereqs":["f-fwd-swizzle"]},"why":"Basic 2 bonus skill.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-halfswizzle-pumps","change":"add","from":null,"to":{"id":"f-fwd-halfswizzle-pumps","name":"Forward Half Swizzle Pumps on a Circle","type":"locomotion","level":"intermediate","prereqs":["f-fwd-stroke"]},"why":"Basic 3 B, 6-8 consecutive CW and CCW. The official precursor to the forward edge and crossover.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-1ft-glide","change":"add","from":null,"to":{"id":"f-bwd-1ft-glide","name":"Backward One-Foot Glide","type":"balance","level":"intermediate","prereqs":["f-bwd-2ft-glide"]},"why":"Basic 3 D (beginning) and Basic 4 E (R and L, count of 4). Currently absent, yet several backward skills depend on it.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-snowplow","change":"add","from":null,"to":{"id":"f-bwd-snowplow","name":"Backward Snowplow Stop","type":"stop","level":"intermediate","prereqs":["f-bwd-swizzle","f-bwd-2ft-glide"]},"why":"Basic 3 E (R and L). The tree currently has no backward stop of any kind.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-pivot","change":"add","from":null,"to":{"id":"f-fwd-pivot","name":"Forward Pivots","type":"turn","level":"intermediate","prereqs":["f-fwd-stroke"]},"why":"Basic 3 bonus skill, CW and CCW. The official entry into the two-foot spin.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-halfswizzle-pumps","change":"add","from":null,"to":{"id":"f-bwd-halfswizzle-pumps","name":"Backward Half Swizzle Pumps on a Circle","type":"locomotion","level":"intermediate","prereqs":["f-bwd-swizzle","f-bwd-1ft-glide"]},"why":"Basic 4 D, CW and CCW. The direct precursor to the backward crossover.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-2ft-spin-adv","change":"add","from":null,"to":{"id":"f-2ft-spin-adv","name":"Advanced Two-Foot Spin","type":"spin","level":"advanced","prereqs":["f-2ft-spin"]},"why":"Basic 5 E, 4-6 revolutions. The tree jumps from the 2-revolution Basic 4 spin straight to the one-foot spin, skipping a level.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-side-toe-hop","change":"add","from":null,"to":{"id":"f-side-toe-hop","name":"Side Toe Hop","type":"balance","level":"advanced","prereqs":["f-2ft-hop","f-fwd-stroke"]},"why":"Basic 5 bonus skill (R and L).","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-inside-mohawk","change":"add","from":null,"to":{"id":"f-fwd-inside-mohawk","name":"Forward Inside Open Mohawk","type":"turn","level":"advanced","prereqs":["f-fwd-inside-edge","f-transition"]},"why":"Basic 6 A, from a standstill, R to L and L to R. ADDED IN THE 2020 REVISION and therefore absent from SKILL_RESEARCH.md; the tree has no mohawk in foundations at all.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-transition-bwd-fwd","change":"add","from":null,"to":{"id":"f-transition-bwd-fwd","name":"Moving Backward to Forward Two-Foot Turn","type":"turn","level":"advanced","prereqs":["f-transition","f-bwd-crossover"]},"why":"Basic 6 C, on a circle, CW and CCW. The tree has only the forward-to-backward direction.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bunny-hop","change":"add","from":null,"to":{"id":"f-bunny-hop","name":"Bunny Hop","type":"jump","level":"advanced","prereqs":["f-fwd-stroke","f-2ft-hop"]},"why":"Basic 6 G. The first jump in the curriculum and a conspicuous gap in a skating-progress app.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},

  {"id":"f-bwd-stroking-adv","change":"remove","from":"foundations","to":null,"why":"Duplicate of f-bwd-stroke. There is exactly one backward stroking element (Basic 6 D) in Basic 1-6, and no advanced backward stroking anywhere in Free Skate 1-6. Merge its prereqs into f-bwd-stroke.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-edge-control","change":"remove","from":"foundations","to":null,"why":"Not an LTS USA element at any level — a coaching concept with no pass criterion, sitting on top of the four edge skills it depends on. If kept, retitle to 'Consecutive Edges' and move to the figure track as Free Skate 1 B.","source":"https://njwcc.com/wp-content/uploads/2025/09/Curriculum_FreeSkate.pdf"},

  {"id":"f-transition","change":"name","from":"Forward to Backward Transition","to":"Moving Forward to Backward Two-Foot Turn","why":"'Transition' is hockey vocabulary. LTS USA calls this a two-foot turn (Basic 3 C), and the official name makes the missing backward-to-forward mirror (Basic 6 C) obvious.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-1ft-glide","change":"name","from":"One-Foot Glide","to":"Forward One-Foot Glide","why":"Basic 2 B is specifically the FORWARD one-foot glide; the backward one-foot glide is a separate element at Basic 3 D / Basic 4 E. The unqualified name silently absorbs two skills.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-stroke","change":"name","from":"Forward Stroking/Skating","to":"Beginning Forward Stroking","why":"Official Basic 3 A wording; the slash form is not LTS terminology.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-stroke","change":"name","from":"Backward Stroking/Skating","to":"Backward Stroking","why":"Official Basic 6 D wording.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-spiral","change":"name","from":"Forward Spiral","to":"Forward Spiral on a Straight Line","why":"Basic 6 H specifies the straight line, which distinguishes it from the Free Skate 2 spirals on a continuous axis.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-1ft-spin","change":"name","from":"One-Foot Spin","to":"Beginning One-Foot Spin","why":"Basic 6 E wording; 2-4 revolutions, optional free leg position and entry.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-2ft-hop","change":"name","from":"Two-Foot Hop","to":"Two-Foot Hop in Place","why":"'In place' is part of the Basic 1 bonus element and is the pass criterion.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-march","change":"name","from":"Marching on Ice","to":"March Forward Across the Ice","why":"Official Basic 1 B wording.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fall-getup","change":"name","from":"Falling & Getting Up","to":"Sit on Ice and Stand Up","why":"Official Basic 1 A wording. Optional — the app name is clearer for users, but the official term is what a coach signs off.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-lunge","change":"name","from":"Lunge","to":"Forward Lunges","why":"Basic 4 bonus wording: 'Forward lunges — both legs'.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-outside-edge","change":"name","from":"Forward Outside Edge","to":"Forward Outside Edge on a Circle","why":"'On a circle' is part of Basic 4 A and defines the test pattern.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-fwd-inside-edge","change":"name","from":"Forward Inside Edge","to":"Forward Inside Edge on a Circle","why":"'On a circle' is part of Basic 4 B.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-outside-edge","change":"name","from":"Backward Outside Edge","to":"Backward Outside Edge on a Circle","why":"'On a circle' is part of Basic 5 A.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-bwd-inside-edge","change":"name","from":"Backward Inside Edge","to":"Backward Inside Edge on a Circle","why":"'On a circle' is part of Basic 5 B.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"},
  {"id":"f-snowplow","change":"split","from":"Snowplow Stop","to":["Beginning Snowplow Stop (Basic 1 G, beginner)","Moving Snowplow Stop (Basic 2 G, beginner)"],"why":"One node covers two separately assessed elements a level apart. Splitting them also gives the Basic 1 skater an achievable first stop.","source":"https://www.broadmoorworldarena.com/assets/doc/Curriculum_BasicSkills-417dce1334.pdf"}
]
```

**Resulting tree:** 32 − 2 removed + 14 added = **44 skills**, or **46** once the two elements the plan deliberately folds are unfolded (`f-snowplow` split into beginning/moving, and `f-bwd-1ft-glide` split into the Basic 3 D beginning version and the Basic 4 E graded version) — matching the 46 official Basic 1–6 elements exactly. 14 adds cover the 15 missing elements because the two backward one-foot glide elements are folded into one node.

---

## 9. Follow-up

`SKILL_RESEARCH.md` should be re-transcribed from the 2020 sheet — its Basic 6 list is missing the mohawk, and its Basic 5 spin count ("4-6 revolutions" vs. the app's silence) and Basic 6 spiral hand ("R or L") are the only other drifts. Nothing else in Section 1 of that file is wrong.
