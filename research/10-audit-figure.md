# 10 — Figure Skating Skill Tree Audit

**Audited file:** `research/catalog-current.json` → `figure` array (35 skills)
**Date:** 2026-09-19
**Verdict in one line:** the tree is *ordered* mostly correctly but *calibrated* badly — it is missing its entire bottom third, it is shifted one band too high through the middle, it puts a Pre-Silver turn (bracket) next to a Free Skate 2 jump, and it crams a 6× difficulty range (2T → 3A) into a single "expert" tag.

---

## 0. Authoritative sources used

| Key | Document | URL |
|---|---|---|
| `LTS-BASIC` | Learn to Skate USA — Basic 1–6 curriculum | https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf |
| `LTS-FS` | Learn to Skate USA — Pre-Free Skate + Free Skate 1–6 curriculum | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `USFS-TEST` | U.S. Figure Skating — 2025-26 Singles Test Requirements | https://usfigureskating.org/documents/2025/8/15/Singles_Test_Requirements_2025-26.pdf |
| `USFS-WBP` | U.S. Figure Skating — 2025-26 Singles Well-Balanced Free Skate Requirements | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `USFS-SS` | U.S. Figure Skating — Skater Checklist, Skating Skills (Pre-Preliminary → Gold) | https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf |
| `ISU-SOV` | ISU Communication 2786 — Singles & Pairs Scale of Values | https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf |
| `ISU-TPH` | ISU Technical Panel Handbook — Singles | https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf |
| `RENAME` | USFS test rename, effective July 1 2023 | https://www.washingtonfsc.org/new-test-names/ |
| `USFS-TS` | USFS Test Structure & Figure Skating Levels | https://usfigureskating.org/sports/2025/12/2/test-structure.aspx |

### ⚠️ Correction to the brief's premise: the USFS test ladder was renamed

The brief assumes the test ladder is *Pre-Preliminary → Preliminary → Pre-Juvenile → Juvenile → Intermediate → Novice → Junior → Senior*. **That has not been the test structure since July 1, 2023.** Standard tests are now:

**Pre-Preliminary → Preliminary → Pre-Bronze → Bronze → Pre-Silver → Silver → Pre-Gold → Gold**

with the mapping Pre-Juvenile→Pre-Bronze, Juvenile→Bronze, Intermediate→Pre-Silver, Novice→Silver, Junior→Pre-Gold, Senior→Gold; "Moves in the Field" is now "Skating Skills" (`RENAME`, confirmed by the level headers in `USFS-TEST` and `USFS-SS`).

*Juvenile / Intermediate / Novice / Junior / Senior still exist — but as **competition** levels only* (`USFS-WBP`). This audit cites both: the **test** name, and where useful the old/competition name in parentheses. If the app ever surfaces level names to users, it must use the new ones.

### Mapping used for the app's four bands

| App tag | LTS equivalent | USFS test equivalent (old competition name) | Defining capability |
|---|---|---|---|
| `beginner` | Basic 4 – Free Skate 2 | below Pre-Preliminary | first spins, half jumps, toe loop/Salchow |
| `intermediate` | Free Skate 3 – Free Skate 6 | Pre-Preliminary – Preliminary | all six singles incl. Axel; all 3 basic spin positions |
| `advanced` | beyond FS6 | Pre-Bronze – Bronze (Pre-Juvenile – Juvenile) | double jumps; spin combos w/ change of foot; leveled step sequence |
| `expert` | — | Pre-Silver – Gold (Intermediate – Senior) | triples; *required* flying spin; brackets/rockers/counters; ChSq |

This is the brief's proposed mapping, made explicit at the LTS boundary. Applied honestly it redistributes the tree from **1 / 9 / 9 / 16** to roughly **7 / 12 / 7 / 9** — which is the single biggest finding.

### Difficulty ground truth (ISU base values, `ISU-SOV`)

`1T 0.40 · 1S 0.40 · 1Lo 0.50 · 1F 0.50 · 1Lz 0.60 · 1A 1.10` → the brief's ordering (toe ≤ sal < loop = flip < lutz < axel) is **confirmed**, with the correction that **toe loop and Salchow are worth exactly the same (0.40), as are loop and flip (0.50)** — they are ties, not a strict chain.

`2T 1.30 · 2S 1.30 · 2Lo 1.70 · 2F 1.80 · 2Lz 2.10 · 2A 3.30`
`3T 4.20 · 3S 4.30 · 3Lo 4.90 · 3F 5.30 · 3Lz 5.90 · 3A 8.00` · `4T 9.50 · 4A 12.50`

Spins: `USpB 1.20 … USp4 2.90`, `SSpB 1.30 … SSp4 3.00`, `CSpB 1.30 … CSp4 3.10`, `LSpB 1.40 … LSp4 3.20`, `FCSpB 1.90 … FCSp4 3.80`, `CoSpB 1.80 … CoSp4 3.60`, `CCoSpB 2.00 … CCoSp4 4.20`. `StSqB 1.60 … StSq4 4.10`, `ChSq1 3.50`.

---

## 1. Skill-by-skill table

| id | app level | official level (first required / typically learned) | verdict | source URL |
|---|---|---|---|---|
| `2ft-spin` | beginner | **LTS Basic 4** "Beginning two-foot spin — up to two revolutions"; Basic 5 "Advanced two-foot spin — 4–6" | ✅ level correct — ❌ but duplicates foundations `f-2ft-spin`, which is tagged *intermediate*. Contradiction. | https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf |
| `3turn` | intermediate | **LTS Basic 5** (forward outside 3-turn) / **Basic 6** (forward inside) / **FS1** (back outside) / **FS2** (back inside) | ❌ too high (should be beginner) — ❌ name is ambiguous across 4 distinct turns — ❌ duplicates foundations `f-fwd-outside-3turn`/`f-fwd-inside-3turn`, tagged *advanced*. Three-way contradiction. | https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf |
| `mohawk` | intermediate | **LTS Pre-Free Skate** "Forward inside open mohawk from a standstill"; *Five-Step Mohawk Sequence* at FS5 / Pre-Bronze Skating Skills | ❌ one band high (beginner); the *sequence* is the intermediate thing | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `waltz` | intermediate | **LTS Pre-Free Skate**, jump element G | ❌ one band high (beginner). Waltz jump is the *second* jump taught, after the bunny hop and mazurka. | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `toe` | intermediate | **LTS Free Skate 1**, jump F | ❌ one band high (beginner) | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `sal` | intermediate | **LTS Free Skate 2**, jump F | ❌ one band high (beginner) | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `loop` | intermediate | **LTS Free Skate 3**, jump E | ✅ correct | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `uspin` | intermediate | **LTS Pre-Free Skate** "One-foot upright spin… min. three revolutions"; **FS1** "Upright spin, entry from back crossovers" | ❌ one band high (beginner) | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `sspin` | intermediate | **LTS Free Skate 4**, spin D "Sit spin (minimum three revolutions)" | ✅ correct | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `bracket` | intermediate | **Pre-Silver Skating Skills test** (old Intermediate MIF), "Brackets in the Field Sequence" | 🔴 **worst error in the tree — 3 bands low.** Same test level as the first required double jump and the flying camel. | https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf |
| `flip` | advanced | **LTS Free Skate 4**, jump F | ❌ one band high (intermediate) | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `lutz` | advanced | **LTS Free Skate 5**, jump E | ❌ one band high (intermediate) | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `axel` | advanced | **LTS Free Skate 6**, jump F "Beginning Axel"; *required* in competition from Preliminary ("1 must be an Axel-type jump") | ❌ one band high (intermediate) — ✅ correctly the last single; but flagged: 1A (1.10) is ~2× 1Lz (0.60) and closer to 2T (1.30). Belongs **with the singles**, as the top rung. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `cspin` | advanced | **LTS Free Skate 5**, spin C "Camel spin (minimum three revolutions)" | ❌ one band high (intermediate) | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `combospin` | advanced | **LTS Free Skate 6** "Camel-sit spin combination"; *required* as "1 spin combination, min 6 revs" at Pre-Bronze | ⚠️ borderline — learned at FS6 (intermediate), required at Pre-Bronze (advanced). Acceptable; prefer intermediate. | https://usfigureskating.org/documents/2025/8/15/Singles_Test_Requirements_2025-26.pdf |
| `stseq` | advanced | **Bronze test** "One Step Sequence — must fully utilize the ice surface"; leveled StSq required at Juvenile competition | ✅ correct | https://usfigureskating.org/documents/2025/8/15/Singles_Test_Requirements_2025-26.pdf |
| `layback` | advanced | **LTS Free Skate 6**, spin D "Layback or attitude spin or cross-foot spin (three revolutions)" | ❌ one band high (intermediate). ISU: layback is a **variation of the upright position**, not a fourth basic position. | https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf |
| `spread-eagle` | advanced | Not a listed ISU element. USFS names it at **Pre-Preliminary**: pChSq "at least two different movements (spirals, spread eagles, etc.)" | ❌ two bands high (intermediate at most) | https://usfigureskating.org/documents/2025/8/15/Singles_Test_Requirements_2025-26.pdf |
| `ina-bauer` | advanced | Not a listed ISU element; named in the ISU ChSq definition alongside spirals, arabesques, spread eagles, hydroblading | ❌ one band high (intermediate) | https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf |
| `2toe` | expert | Permitted from **Preliminary** competition (2S/2T/2Lo only); permitted on the **Bronze test** | ❌ one band high (advanced). BV 1.30. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `2sal` | expert | Permitted from **Preliminary** competition | ❌ one band high (advanced). BV 1.30. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `2loop` | expert | Permitted from **Preliminary** competition | ❌ one band high (advanced). BV 1.70. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `2flip` | expert | Permitted from **Pre-Juvenile** competition ("all single and double jumps except the double Axel") / Pre-Bronze test | ❌ one band high (advanced). BV 1.80. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `2lutz` | expert | Permitted from **Pre-Juvenile** competition / Pre-Bronze test | ❌ one band high (advanced). BV 2.10. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `2axel` | expert | First permitted at **Juvenile** competition; a required option at the **Pre-Gold test** ("double flip, double Lutz, or double Axel") | ✅ correct. BV 3.30 — more than 1.5× 2Lz. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `fspin` | expert | Flying entries *permitted* from Pre-Bronze; a flying spin **required** at Pre-Silver test / Intermediate competition ("at least ONE of the two spins MUST have a flying entry") | ✅ level correct — ❌ "Flying Spin" is not an element name (ISU: FUSp / FCSp / FSSp / FLSp, named by *landing* position) | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `fcamel` | expert | FCSp; the named flying spin at Intermediate/Pre-Silver level | ✅ level correct — ❌ prereq order inverted: the flying camel is usually the *first* flying spin, so it cannot depend on a generic `fspin` | https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf |
| `biellmann` | expert | Not a standalone element. ISU: a *position/difficult variation* of an upright/layback spin; "can only be taken… after 8 revolutions in the layback position" | ✅ level correct — ⚠️ mark as variation, not element. Prereq `layback` is exactly right per the handbook. | https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf |
| `chsq` | expert | ISU: "The Choreographic Sequence is included in Junior and Senior Free Skating." USFS: required at Novice/Junior/Senior — **but a simplified pChSq is required at Pre-Preliminary and Preliminary** | ⚠️ level right for ChSq — ❌ prereq `stseq` is backwards for the domestic pChSq, which arrives *before* any step sequence | https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf |
| `3toe` | expert | One triple permitted at **Juvenile**; all triples at **Intermediate** competition | ✅ band correct — ❌ BV 4.20 = 3.2× `2toe`, same tag | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `3sal` | expert | as above | ✅ band correct. BV 4.30. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `3loop` | expert | as above | ✅ band correct. BV 4.90. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `3flip` | expert | as above | ✅ band correct. BV 5.30. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `3lutz` | expert | as above | ✅ band correct. BV 5.90. | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |
| `3axel` | expert | Bonus-bearing at **Novice/Junior**, "1.0 for each triple Axel" | ✅ band correct — ❌ BV 8.00 = **6.2× `2toe`**, which carries the identical `expert` tag | https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf |

---

## 2. MISPLACEMENTS, ranked by severity

**S1 — `bracket` at `intermediate`.** A bracket turn is on the **Pre-Silver Skating Skills test** ("Brackets in the Field Sequence… controlled brackets (not jumped) in/out on proper edge") — the same rung as the flying camel and the first required double. The app ranks it beside the Salchow. A skater following this tree would be told to learn brackets before the flip. → **expert**. `USFS-SS`

**S2 — the whole tree is shifted one band up because its bottom is missing.** Under the app's own tags, `Two-Foot Spin` (Basic 4) is "beginner" and the Salchow (FS2) is "intermediate" — but there are ten LTS elements between them and none are in the tree. Five jumps (`waltz`, `toe`, `sal`), two turns (`3turn`, `mohawk`) and one spin (`uspin`) all need to drop one band, and 7 new beginner rungs need to appear (§3). Consequence today: the beginner user sees exactly **one** figure skill.

**S3 — every double and every triple shares one `expert` tag.** `2toe` BV 1.30 and `3axel` BV 8.00 are the same tag: a **6.2× spread**, larger than the entire beginner→advanced range. Two fixes, do both: (a) demote 2T/2S/2Lo/2F/2Lz to `advanced` (they are permitted from Preliminary/Pre-Juvenile competition and on the Bronze test); (b) add a numeric `sov` field per jump so the UI can sort inside a band without inventing a fifth tier. If a fifth tier is wanted, `elite` for 3A + quads is the natural cut. `ISU-SOV`, `USFS-WBP`

**S4 — `axel` sits in the same band as `flip` and `lutz`.** The Axel is correctly placed *last among singles* and correctly *not* grouped with the doubles — it is a single (ISU code `1A`) and USFS requires "an Axel-type jump" at every competition level from Preliminary. But 1A (1.10) is worth as much as 1F + 1Lz combined, and it is the only forward-takeoff jump. It should be the terminal single, with `lutz` in its prereq chain, and flagged in the UI as the gateway to doubles. `ISU-SOV`, `USFS-WBP`

**S5 — `flip`, `lutz`, `cspin`, `layback` at `advanced`.** All four are Learn to Skate **Free Skate 4–6** elements — group-lesson material, not Pre-Juvenile/Juvenile. → `intermediate`. `LTS-FS`

**S6 — `spread-eagle` at `advanced`.** USFS names spread eagles as an example movement for the **Pre-Preliminary** choreographic sequence — the very first test. Two bands too high. `ina-bauer` likewise (ISU ChSq definition). Both are `move`s whose difficulty is hip turnout, not skating level. `USFS-TEST`, `ISU-TPH`

**S7 — cross-tree level contradictions.** `2ft-spin` (figure, *beginner*) vs `f-2ft-spin` (foundations, *intermediate*) — same element, two tags. `3turn` (figure, *intermediate*) vs `f-fwd-outside-3turn` + `f-fwd-inside-3turn` (foundations, *advanced*) — same element, three tags. Pick one home per element; a figure skill should not restate a foundation.

**S8 — `chsq` prereq `stseq` is backwards at the low end.** USFS requires a pChSq at Pre-Preliminary/Preliminary and only introduces a step sequence at Bronze. The dependency is inverted for anyone below Bronze. `USFS-TEST`

**S9 — `fcamel` depends on `fspin`.** Inverted: the flying camel is the entry-level flying spin. Model it the other way (`fcamel` → `flying-sit` → `death-drop`), with **back spin** as the shared prerequisite.

**S10 — `mohawk` and `combospin` one band high** (Pre-Free Skate and FS6 respectively). Minor.

**S11 — `2axel` prereq is `axel` alone.** That skips the entire double ladder: BV 1.10 → 3.30 with nothing between. Add `2lutz`.

**S12 — triples have no cross-jump ordering.** `3lutz` requires only `2lutz`, so the graph permits a triple Lutz before a triple Salchow. Real order: 3S/3T → 3Lo → 3F → 3Lz → 3A, matching `ISU-SOV` exactly.

---

## 3. MISSING elements

### 3a. The missing bottom (why "Two-Foot Spin" is alone)

Ordered as LTS actually teaches them — this is the answer to "what comes before the waltz jump":

| Element | Level | Where it lives officially | Source |
|---|---|---|---|
| **Bunny Hop** | beginner | LTS **Basic 6**, element F — *the first jump on ice* | `LTS-BASIC` |
| **Mazurka** | beginner | LTS **Pre-Free Skate**, jump F (R and L) | `LTS-FS` |
| *(then Waltz Jump — Pre-Free Skate, jump G)* | | | |
| **Half Flip** | beginner | LTS **Free Skate 1**, jump E | `LTS-FS` |
| **Half Lutz** | beginner | LTS **Free Skate 2**, jump E | `LTS-FS` |
| **Back Spin** (backward upright/scratch) | beginner | LTS **FS2** "Beginning back spin (one to two revolutions)"; **FS3** "Advanced back spin with free foot in crossed leg position" | `LTS-FS` |
| **Waltz Three-Turn** | beginner | LTS **FS3**, skating skill C | `LTS-FS` |
| **Waltz Eight** | beginner | **Pre-Preliminary Skating Skills test**; LTS **FS4** | `USFS-SS`, `LTS-FS` |

> **🔴 `back-spin` is the single most important missing node in the whole tree.** It is the prerequisite for the change-of-foot spin, every flying spin, the combination spin's second foot, and the air position of every multi-rotation jump. Nothing in `figure` or `foundations` contains it.

### 3b. Missing middle

| Element | Level | Official home | Source |
|---|---|---|---|
| **Half Loop / Euler (`Eu`)** | intermediate | LTS **FS4**, jump E; SOV code `Eu`, BV 0.00 | `LTS-FS`, `ISU-SOV` |
| **Change-of-Foot Spin** (`CUSp`) | intermediate | LTS **FS4** "Forward upright spin to backward upright spin (3 revs each foot)" | `LTS-FS` |
| **Jump Combination** | intermediate | LTS **FS3** "Waltz jump-toe loop or Salchow-toe loop combination"; required on every USFS test from Preliminary | `LTS-FS`, `USFS-TEST` |
| **Jump Sequence** | intermediate | LTS **FS6** "Waltz jump-half loop-Salchow sequence" | `LTS-FS` |
| **Forward Power Three-Turns** | intermediate | LTS **FS4**; **Preliminary Skating Skills test** | `LTS-FS`, `USFS-SS` |
| **Split Jump / Stag / Falling Leaf** | intermediate | LTS **FS4** bonus skill | `LTS-FS` |
| **Cross-Foot Spin** | intermediate | LTS **FS6**, spin D option | `LTS-FS` |
| **Spiral / Spiral Sequence** | intermediate → expert | Basic 6 "Forward spiral on a straight line"; FS2 alternating spirals; **Pre-Silver** and **Gold Skating Skills** "Spiral Sequence" | `LTS-BASIC`, `LTS-FS`, `USFS-SS` |
| **Five-Step / Eight-Step Mohawk Sequence** | intermediate / advanced | LTS **FS5**; **Pre-Bronze** / **Bronze Skating Skills** | `LTS-FS`, `USFS-SS` |
| **Power Pulls** | advanced | LTS **FS6** "Forward power pulls"; **Pre-Gold Skating Skills** | `LTS-FS`, `USFS-SS` |

### 3c. Missing top

| Element | Level | Official home | Source |
|---|---|---|---|
| **Flying Sit Spin (`FSSp`)** | expert | SOV `FSSpB 2.00 … FSSp4 3.60`; distinct element from FCSp | `ISU-SOV` |
| **Death Drop / Butterfly** | expert | flying spin variants; landing-position naming per handbook | `ISU-TPH` |
| **Forward Twizzles** | expert | **Pre-Silver Skating Skills** | `USFS-SS` |
| **Backward Twizzles** | expert | **Silver Skating Skills** | `USFS-SS` |
| **Counters (fwd & bwd, outside & inside)** | expert | **Silver Skating Skills** | `USFS-SS` |
| **Rockers (fwd & bwd, outside & inside)** | expert | **Pre-Gold Skating Skills** | `USFS-SS` |
| **Choctaw / Rocker Choctaw Sequence** | expert | **Silver** and **Pre-Gold Skating Skills** | `USFS-SS` |
| **Quad Toe Loop (`4T`)** | elite | SOV `4T 9.50`; "1.0 for each quad" bonus at Junior | `ISU-SOV`, `USFS-WBP` |
| **Hydroblading** | expert (move) | named in the ISU ChSq definition | `ISU-TPH` |

### 3d. Structural gaps (not elements)

- **No `sov` / numeric difficulty field.** Four ordinal bands cannot express a 0.40 → 12.50 range. Add `sov` (ISU base value) to every jump and spin; it is a published number and makes ordering auditable.
- **No `test` field.** Each node should record the test/LTS level it maps to (`"LTS-FS4"`, `"Pre-Silver SS"`) so levels are derived, not asserted.
- **No combination/sequence concept.** Every USFS test from Preliminary up requires jump combinations; the tree models only solo jumps.
- **`type` taxonomy is lossy.** `bracket`/`3turn`/`mohawk` are tagged `step` but are **turns**; `stseq`/`chsq` are **sequences**; `spread-eagle`/`ina-bauer` are **moves/transitions**. Suggest `jump | spin | turn | sequence | move`.

---

## 4. NAMING problems

| Current | Problem | Correct name |
|---|---|---|
| `Three Turn` | Collapses four distinct elements taught across Basic 5 → FS2; also duplicates two foundations nodes | `Forward Outside Three-Turn` (+ `Forward Inside`, `Backward Outside`, `Backward Inside` as separate nodes) — `LTS-BASIC`, `LTS-FS` |
| `Forward Bracket` | USFS calls the test element "Brackets in the Field Sequence"; "Forward Bracket" is under-specified (FO vs FI) and the test covers in *and* out on proper edge | `Bracket Turn` / `Brackets in the Field` — `USFS-SS` |
| `Mohawk` | LTS names the entry element precisely; the sequence is a different element | `Forward Inside Open Mohawk`, plus `Five-Step Mohawk Sequence` — `LTS-FS` |
| `Flying Spin` | Not an element. ISU names flying spins by landing position: `FUSp`, `FCSp`, `FSSp`, `FLSp` | replace with `Flying Sit Spin` (and keep `Flying Camel Spin`) — `ISU-TPH`, `ISU-SOV` |
| `Combination Spin` | ISU term is inverted | `Spin Combination` (`CoSp`) / `Spin Combination with Change of Foot` (`CCoSp`) — `ISU-SOV` |
| `Choreo Sequence` | Abbreviated | `Choreographic Sequence` (`ChSq`) — `ISU-TPH` |
| `Upright Spin` | Correct ISU term (`USp`) but LTS learners know it as the one-foot / scratch spin | `Upright (Scratch) Spin` — `LTS-FS` |
| `Toe Loop`, `Salchow`, `Loop`, `Flip`, `Lutz`, `Axel` | Asymmetric with `Double …` / `Triple …` siblings | prefix `Single ` (`1T`, `1S`, `1Lo`, `1F`, `1Lz`, `1A`) — `ISU-SOV` |
| `Biellmann Spin` | ISU treats it as a *position/difficult variation* of a layback/upright spin, not a listed element | `Biellmann Position (layback variation)` — `ISU-TPH` |
| `Spread Eagle`, `Ina Bauer` | Fine as names, but typed as elements; ISU lists them as ChSq movements | keep names, retype as `move`, note "not an ISU listed element" — `ISU-TPH` |
| `Step Sequence` | Fine (`StSq`), but should note it is *leveled* (B/1/2/3/4) | `Step Sequence (StSq)` — `ISU-SOV` |
| level names anywhere in UI | "Pre-Juvenile/Juvenile/Intermediate/Novice/Junior/Senior" are no longer test names | use Pre-Bronze/Bronze/Pre-Silver/Silver/Pre-Gold/Gold — `RENAME` |

---

## 5. Concrete JSON edit list

```json
[
  {"id":"bracket","change":"level","from":"intermediate","to":"expert","why":"Brackets in the Field is a Pre-Silver Skating Skills test element (old Intermediate MIF) — same rung as the first required double jump and the flying camel, not the Salchow.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"bracket","change":"name","from":"Forward Bracket","to":"Bracket Turn (Brackets in the Field)","why":"USFS test element name; 'Forward Bracket' omits FI/FO/BO/BI and the in-and-out requirement.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"bracket","change":"prereqs","from":["3turn"],"to":["3turn","f-bwd-outside-edge","f-bwd-inside-edge"],"why":"Brackets in the Field runs in and out of both forward and backward edges.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},

  {"id":"waltz","change":"level","from":"intermediate","to":"beginner","why":"Waltz jump is LTS Pre-Free Skate element G.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"waltz","change":"prereqs","from":["3turn"],"to":["bunny-hop","mazurka","3turn"],"why":"LTS order is bunny hop (Basic 6) -> mazurka (Pre-FS) -> waltz jump (Pre-FS); the FO three-turn (Basic 5) precedes all three.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"toe","change":"level","from":"intermediate","to":"beginner","why":"Toe loop is LTS Free Skate 1 element F.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"toe","change":"prereqs","from":["3turn","f-bwd-crossover"],"to":["waltz","half-flip","f-bwd-outside-edge"],"why":"FS1 pairs the half flip with the toe loop; the toe loop needs a back-outside landing edge, not merely crossovers.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"sal","change":"level","from":"intermediate","to":"beginner","why":"Salchow is LTS Free Skate 2 element F.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"sal","change":"prereqs","from":["3turn"],"to":["waltz","mohawk","half-lutz"],"why":"Salchow launches off a back-inside edge reached via the forward inside mohawk (Pre-FS) or FO three-turn; FS2 teaches it alongside the half Lutz.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},

  {"id":"uspin","change":"level","from":"intermediate","to":"beginner","why":"One-foot upright spin is LTS Pre-Free Skate element E (min. three revolutions); FS1 adds the back-crossover entry.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"3turn","change":"level","from":"intermediate","to":"beginner","why":"Forward outside three-turn is LTS Basic 5 element D; forward inside is Basic 6 element A.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"3turn","change":"name","from":"Three Turn","to":"Forward Outside Three-Turn","why":"Four distinct three-turns are taught across Basic 5 to FS2; one generic node cannot carry them.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"3turn","change":"dedupe","from":"figure.3turn + foundations.f-fwd-outside-3turn + foundations.f-fwd-inside-3turn","to":"keep the foundations nodes only; have figure reference them","why":"Same element tagged intermediate in figure and advanced in foundations — a direct contradiction inside one catalog.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"2ft-spin","change":"dedupe","from":"figure.2ft-spin (beginner) + foundations.f-2ft-spin (intermediate)","to":"keep foundations.f-2ft-spin, retag it beginner (Basic 4)","why":"Same element, two levels. Basic 4 'Beginning two-foot spin' is unambiguously a beginner rung.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"mohawk","change":"level","from":"intermediate","to":"beginner","why":"Forward inside open mohawk from a standstill is LTS Pre-Free Skate element A.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},

  {"id":"flip","change":"level","from":"advanced","to":"intermediate","why":"Flip is LTS Free Skate 4 element F.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"lutz","change":"level","from":"advanced","to":"intermediate","why":"Lutz is LTS Free Skate 5 element E.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"axel","change":"level","from":"advanced","to":"intermediate","why":"'Beginning Axel' is LTS Free Skate 6 element F; an Axel-type jump is required from Preliminary competition.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"axel","change":"prereqs","from":["waltz","loop"],"to":["waltz","loop","lutz","half-loop","back-spin"],"why":"Axel is the terminal single (1A 1.10 vs 1Lz 0.60); FS6 teaches the waltz-half loop-Salchow sequence immediately before it, and the back spin supplies the air position.","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},
  {"id":"cspin","change":"level","from":"advanced","to":"intermediate","why":"Camel spin is LTS Free Skate 5 element C.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"layback","change":"level","from":"advanced","to":"intermediate","why":"'Layback or attitude spin or cross-foot spin' is LTS Free Skate 6 element D; ISU classifies layback as an upright-position variation.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"combospin","change":"level","from":"advanced","to":"intermediate","why":"Camel-sit combination is LTS Free Skate 6 element C; the Pre-Bronze test then requires it at 6 revolutions.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"combospin","change":"prereqs","from":["uspin","sspin","cspin"],"to":["uspin","sspin","cspin","cf-spin"],"why":"A spin combination with change of foot (CCoSp) requires the change-of-foot spin taught at FS4.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},

  {"id":"spread-eagle","change":"level","from":"advanced","to":"intermediate","why":"USFS names spread eagles as an example pChSq movement on the Pre-Preliminary test — the lowest test on the ladder.","source":"https://usfigureskating.org/documents/2025/8/15/Singles_Test_Requirements_2025-26.pdf"},
  {"id":"ina-bauer","change":"level","from":"advanced","to":"intermediate","why":"ISU lists Ina Bauers beside spirals and spread eagles as Choreographic Sequence movements, not as a graded element.","source":"https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf"},

  {"id":"2toe","change":"level","from":"expert","to":"advanced","why":"Double toe loop is permitted from Preliminary competition and on the Bronze test; BV 1.30.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"2sal","change":"level","from":"expert","to":"advanced","why":"Double Salchow is permitted from Preliminary competition; BV 1.30.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"2loop","change":"level","from":"expert","to":"advanced","why":"Double loop is permitted from Preliminary competition; BV 1.70.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"2flip","change":"level","from":"expert","to":"advanced","why":"Double flip is permitted from Pre-Juvenile competition / Pre-Bronze test; BV 1.80.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"2lutz","change":"level","from":"expert","to":"advanced","why":"Double Lutz is permitted from Pre-Juvenile competition / Pre-Bronze test; BV 2.10.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"2axel","change":"prereqs","from":["axel"],"to":["axel","2lutz"],"why":"2A (3.30) is first permitted at Juvenile, after the whole double ladder; depending on 1A alone skips 1.10 -> 3.30.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},

  {"id":"fspin","change":"name","from":"Flying Spin","to":"Flying Sit Spin (FSSp)","why":"'Flying Spin' is not an element; ISU names flying spins by landing position (FUSp/FCSp/FSSp/FLSp).","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},
  {"id":"fspin","change":"prereqs","from":["sspin","cspin"],"to":["sspin","back-spin","fcamel"],"why":"The flying camel is the entry-level flying spin; the flying sit follows it. Every flying spin needs the back spin.","source":"https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf"},
  {"id":"fcamel","change":"prereqs","from":["cspin","fspin"],"to":["cspin","back-spin"],"why":"Removes the inverted dependency: FCSp is the first flying spin taught and the one named at Pre-Silver/Intermediate level.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"biellmann","change":"type","from":"spin","to":"spin-variation","why":"ISU: the Biellmann is a position/difficult variation of an upright or layback spin, taken only after 8 revolutions in layback.","source":"https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf"},
  {"id":"chsq","change":"prereqs","from":["stseq"],"to":["spread-eagle","spiral-seq"],"why":"A ChSq is 'at least 2 different skating movements like spirals, arabesques, spread eagles, Ina Bauers'; it does not require a step sequence, and USFS requires a pChSq at Pre-Preliminary, before any StSq.","source":"https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf"},

  {"id":"3toe","change":"prereqs","from":["2toe"],"to":["2toe","2axel"],"why":"Triples are permitted only from Juvenile (one) / Intermediate (all), after the full double repertoire including 2A.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},
  {"id":"3loop","change":"prereqs","from":["2loop"],"to":["2loop","3sal"],"why":"SOV order 3T 4.20 / 3S 4.30 < 3Lo 4.90 < 3F 5.30 < 3Lz 5.90 < 3A 8.00 is the real learning order; today 3Lz unlocks from 2Lz alone.","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},
  {"id":"3flip","change":"prereqs","from":["2flip"],"to":["2flip","3loop"],"why":"Same SOV-ordered chain.","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},
  {"id":"3lutz","change":"prereqs","from":["2lutz"],"to":["2lutz","3flip"],"why":"Same SOV-ordered chain.","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},
  {"id":"3axel","change":"prereqs","from":["2axel"],"to":["2axel","3lutz"],"why":"3A (8.00) is the last triple and carries a dedicated 1.0 bonus at Novice/Junior.","source":"https://www.usfigureskating.org/sites/default/files/media-files/2025-26%20Singles%20FS%20Chart.pdf"},

  {"id":"back-spin","change":"add","from":null,"to":{"id":"back-spin","name":"Back Spin (Backward Upright)","type":"spin","level":"beginner","prereqs":["uspin"]},"why":"HIGHEST-PRIORITY ADDITION. LTS FS2 'Beginning back spin', FS3 'Advanced back spin with free foot in crossed leg position'. Prerequisite for change-of-foot spins, all flying spins, and every multi-rotation jump air position. Absent from figure AND foundations.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"bunny-hop","change":"add","from":null,"to":{"id":"bunny-hop","name":"Bunny Hop","type":"jump","level":"beginner","prereqs":["f-fwd-stroke","f-1ft-glide"]},"why":"LTS Basic 6 element F — the first jump a skater learns, currently missing so the tree starts at the waltz jump.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"mazurka","change":"add","from":null,"to":{"id":"mazurka","name":"Mazurka","type":"jump","level":"beginner","prereqs":["bunny-hop"]},"why":"LTS Pre-Free Skate jump F (R and L), taught immediately before the waltz jump.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"half-flip","change":"add","from":null,"to":{"id":"half-flip","name":"Half Flip","type":"jump","level":"beginner","prereqs":["waltz","f-fwd-inside-3turn"]},"why":"LTS Free Skate 1 jump E; the toe-pick half jump that precedes the toe loop and flip.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"half-lutz","change":"add","from":null,"to":{"id":"half-lutz","name":"Half Lutz","type":"jump","level":"beginner","prereqs":["half-flip"]},"why":"LTS Free Skate 2 jump E; precedes the single Lutz's outside-edge takeoff.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"half-loop","change":"add","from":null,"to":{"id":"half-loop","name":"Half Loop / Euler (Eu)","type":"jump","level":"intermediate","prereqs":["loop"]},"why":"LTS Free Skate 4 jump E; ISU code Eu, the connector in the FS6 waltz-half loop-Salchow sequence and in combinations.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"cf-spin","change":"add","from":null,"to":{"id":"cf-spin","name":"Change-of-Foot Spin (CUSp)","type":"spin","level":"intermediate","prereqs":["uspin","back-spin"]},"why":"LTS Free Skate 4 spin C 'forward upright spin to backward upright spin, 3 revs each foot'; required for CCoSp from Bronze.","source":"https://www.cityicepavilion.com/wp-content/uploads/2024/05/Curriculum_FreeSkate.pdf"},
  {"id":"jump-combo","change":"add","from":null,"to":{"id":"jump-combo","name":"Jump Combination","type":"jump","level":"intermediate","prereqs":["waltz","toe"]},"why":"LTS FS3 'Waltz jump-toe loop or Salchow-toe loop combination'; every USFS singles test from Preliminary requires a two-jump combination.","source":"https://usfigureskating.org/documents/2025/8/15/Singles_Test_Requirements_2025-26.pdf"},
  {"id":"spiral-seq","change":"add","from":null,"to":{"id":"spiral-seq","name":"Spiral Sequence","type":"sequence","level":"expert","prereqs":["f-fwd-spiral","mohawk"]},"why":"Spiral currently exists only in foundations. The graded element is the Spiral Sequence on the Pre-Silver and Gold Skating Skills tests ('free leg must be hip level or higher').","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"f-fwd-spiral","change":"level","from":"advanced","to":"beginner","why":"Cross-tree fix: 'Forward spiral on a straight line' is LTS Basic 6 element G, not an advanced move.","source":"https://cdn1.sportngin.com/attachments/document/0102/3199/Curriculum_BasicSkills_1-6.pdf"},
  {"id":"twizzle-f","change":"add","from":null,"to":{"id":"twizzle-f","name":"Forward Twizzles","type":"turn","level":"expert","prereqs":["3turn","bracket"]},"why":"Pre-Silver Skating Skills test element 4, alongside brackets.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"counter","change":"add","from":null,"to":{"id":"counter","name":"Counter Turn","type":"turn","level":"expert","prereqs":["bracket"]},"why":"Forward & Backward Outside/Inside Counters are Silver Skating Skills elements 2 and 3 — above brackets, below rockers.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"rocker","change":"add","from":null,"to":{"id":"rocker","name":"Rocker Turn","type":"turn","level":"expert","prereqs":["counter"]},"why":"Forward & Backward Outside/Inside Rockers are Pre-Gold Skating Skills elements 1 and 2 — the top of the turn ladder.","source":"https://members.usfsaonline.org/sites/default/files/media-files/Skater%20Checklist_Skating%20Skills.pdf"},
  {"id":"4toe","change":"add","from":null,"to":{"id":"4toe","name":"Quad Toe Loop","type":"jump","level":"expert","prereqs":["3toe","3axel"]},"why":"SOV 4T 9.50; '1.0 for each quad' bonus at Junior. If the tree tops out at 3A it understates the real ceiling.","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},

  {"id":"*","change":"schema","from":"{id,name,type,level,prereqs}","to":"{id,name,code,type,level,prereqs,sov,test}","why":"Add ISU element code (1A/2Lz/FCSp/CCoSp/StSq/ChSq), ISU base value, and the LTS/USFS test level each node maps to. Four ordinal bands cannot express 0.40 -> 12.50; the tree's levels should be derived from `test`, not asserted.","source":"https://usfigureskating.org/documents/2026/6/3/ISU_2786-SinglesPairs-SOV-Update-260602_with_notes.pdf"},
  {"id":"*","change":"type-taxonomy","from":["jump","spin","step","move"],"to":["jump","spin","turn","sequence","move"],"why":"3turn/mohawk/bracket are turns; stseq/chsq/spiral-seq are sequences; spread-eagle/ina-bauer are moves. 'step' currently conflates all three.","source":"https://usfigureskating.org/documents/2026/7/23/TP-HandbookSingles-26-27-15-July-2026.pdf"},
  {"id":"*","change":"level-naming","from":"Pre-Juvenile / Juvenile / Intermediate / Novice / Junior / Senior (as TEST names)","to":"Pre-Bronze / Bronze / Pre-Silver / Silver / Pre-Gold / Gold","why":"USFS renamed the standard test ladder effective July 1, 2023, and renamed Moves in the Field to Skating Skills. The old names survive only as competition levels.","source":"https://www.washingtonfsc.org/new-test-names/"}
]
```

---

## 6. Answers to the brief's specific questions

**Is "Two-Foot Spin" being the only beginner skill a symptom?** Yes. The tree begins at LTS Pre-Free Skate and skips Basic 4 → Free Skate 2 entirely. The waltz jump is *not* a first element — before it come the bunny hop (Basic 6), the two-foot spin (Basic 4–5), the forward outside three-turn (Basic 5), the forward inside open mohawk and the mazurka (Pre-Free Skate). Seven beginner rungs are listed in §3a.

**Is the Axel correctly harder than all other singles?** Yes — 1A 1.10 vs 1Lz 0.60, the only forward-takeoff jump, and the only one USFS *requires by name* at every competition level from Preliminary. **It should sit with the singles, not the doubles** (ISU code `1A`; LTS teaches it at Free Skate 6), but it should be the terminal single, after the Lutz, and the UI should mark it as the gateway rung — its base value is nearer 2T (1.30) than 1Lz (0.60).

**Is the spin order right?** Mostly. Correct: two-foot → upright → sit → camel, layback branching off upright (ISU explicitly classifies layback and Biellmann as *upright* variations), combination after all three basic positions, Biellmann after layback. Wrong/missing: **the back spin is absent**, so the flying spins and the change-of-foot spin have no real parent; and `fcamel` depending on a generic `fspin` inverts the actual teaching order.

**Are the moves-in-the-field entries sane?** No. `spread-eagle` and `ina-bauer` are tagged `advanced` but USFS and ISU name them as example movements for the *Pre-Preliminary* choreographic sequence. `bracket` is tagged `intermediate` but is a Pre-Silver Skating Skills element. And **spiral is indeed missing from `figure`** — it sits in `foundations` at `advanced`, which is itself wrong (LTS Basic 6). The right fix is to demote `f-fwd-spiral` to beginner and add a separate `spiral-seq` (Pre-Silver / Gold Skating Skills) to `figure`.

**Should triples split from doubles?** Yes. 2T (1.30) and 3A (8.00) carry the same tag across a 6.2× spread. Demote 2T/2S/2Lo/2F/2Lz to `advanced` (permitted from Preliminary/Pre-Juvenile competition), keep 2A and all triples at `expert`, and add a numeric `sov` field so the UI can order inside a band. A fifth `elite` tier for 3A + quads is optional but defensible.
