# Combined skill-tree edit list

Built from research/09 (foundations), 10 (figure), 11 (hockey). 173 edits.

Stages are ordered by risk: 1-2 cannot break existing tags, 3-4 can.


## Stage 1 — Levels and prerequisites (no ids change — existing tags survive)


### foundations (22)

| id | change | from | to | why |
|---|---|---|---|---|
| `f-t-stop` | level | beginner | advanced | T-stop is Basic 6 F — the final stopping element in the curriculum, taught after three-turns and the one-foot spin. Two bands too low. |
| `f-bwd-crossover` | level | beginner | advanced | Backward crossovers are Basic 5 C, taught after both backward edges on a circle. Two bands too low. |
| `f-bwd-stroke` | level | beginner | advanced | Backward stroking is Basic 6 D, the second-to-last skating skill in Basic 1-6. Two bands too low. |
| `f-fwd-crossover` | level | beginner | intermediate | Forward crossovers are Basic 4 C, the headline element of Basic 4. |
| `f-bwd-outside-edge` | level | intermediate | advanced | Backward outside edge on a circle is Basic 5 A. |
| `f-bwd-inside-edge` | level | intermediate | advanced | Backward inside edge on a circle is Basic 5 B. |
| `f-hockey-stop` | level | intermediate | advanced | Hockey stop is Basic 5 F, taught after backward crossovers and the forward outside three-turn. |
| `f-fwd-stroke` | level | beginner | intermediate | Beginning forward stroking is Basic 3 A — the first FUNdamentals element. Basic 1-2 forward travel is marching and swizzles. |
| `f-lunge` | level | advanced | intermediate | Forward lunges (both legs) is the Basic 4 bonus skill, not an advanced element. |
| `f-fwd-outside-edge` | prereqs | ['f-fwd-crossover'] | ['f-fwd-stroke', 'f-fwd-halfswizzle-pumps'] | Edges (Basic 4 A) precede crossovers (Basic 4 C). A crossover is a sequence of edges; gating the edge behind it is backwards. Forward half swizzle pum |
| `f-fwd-inside-edge` | prereqs | ['f-fwd-crossover'] | ['f-fwd-stroke', 'f-fwd-halfswizzle-pumps'] | Same inversion: Basic 4 B precedes Basic 4 C. |
| `f-fwd-crossover` | prereqs | ['f-fwd-stroke'] | ['f-fwd-outside-edge', 'f-fwd-inside-edge'] | Basic 4 C comes after Basic 4 A and B. |
| `f-bwd-outside-edge` | prereqs | ['f-bwd-crossover'] | ['f-bwd-1ft-glide', 'f-bwd-halfswizzle-pumps'] | Basic 5 A precedes Basic 5 C. Its real precursors are backward one-foot glides (Basic 4 E) and backward half swizzle pumps (Basic 4 D). |
| `f-bwd-inside-edge` | prereqs | ['f-bwd-crossover'] | ['f-bwd-1ft-glide', 'f-bwd-halfswizzle-pumps'] | Same inversion: Basic 5 B precedes Basic 5 C. |
| `f-bwd-crossover` | prereqs | ['f-bwd-stroke'] | ['f-bwd-outside-edge', 'f-bwd-inside-edge'] | Backward crossovers (Basic 5 C) follow the backward edges, and precede backward stroking (Basic 6 D) rather than following it. |
| `f-bwd-stroke` | prereqs | ['f-bwd-2ft-glide'] | ['f-bwd-crossover'] | Backward stroking is Basic 6 D, taught after backward crossovers (Basic 5 C). The current edge runs the wrong way. |
| `f-transition` | prereqs | ['f-fwd-stroke', 'f-bwd-stroke'] | ['f-fwd-stroke', 'f-bwd-2ft-glide'] | Moving forward-to-backward two-foot turns is Basic 3 C; requiring backward stroking locks a Basic 3 element behind Basic 6 D. |
| `f-snowplow` | prereqs | ['f-fwd-stroke'] | ['f-march', 'f-2ft-glide'] | Beginning snowplow stop is Basic 1 G, taught in the same session as marching. Requiring Basic 3 stroking means a Basic 1 skater cannot log their first |
| `f-t-stop` | prereqs | ['f-fwd-stroke'] | ['f-fwd-outside-edge', 'f-hockey-stop'] | Basic 6 F should not unlock on a Basic 3 element; the T-stop needs edge control and a prior moving stop. |
| `f-hockey-stop` | prereqs | ['f-snowplow', 'f-fwd-stroke'] | ['f-snowplow', 'f-fwd-crossover'] | Basic 5 F should not unlock before any of Basic 4; the two-foot skid depends on the edge work in Basic 4. |
| `f-bwd-swizzle` | prereqs | ['f-fwd-swizzle'] | ['f-bwd-wiggle'] | Backward swizzles is Basic 2 E; its official precursor is backward wiggles (Basic 1 F), not the forward swizzle. |
| `f-2ft-spin` | prereqs | ['f-fwd-crossover'] | ['f-fwd-pivot', 'f-fwd-crossover'] | The beginning two-foot spin (Basic 4 F) is entered from a pivot; forward pivots is the Basic 3 bonus skill and the natural precursor. |

### figure (36)

| id | change | from | to | why |
|---|---|---|---|---|
| `bracket` | level | intermediate | expert | Brackets in the Field is a Pre-Silver Skating Skills test element (old Intermediate MIF) — same rung as the first required double jump and the flying  |
| `bracket` | prereqs | ['3turn'] | ['3turn', 'f-bwd-outside-edge', 'f-bwd-inside-edge'] | Brackets in the Field runs in and out of both forward and backward edges. |
| `waltz` | level | intermediate | beginner | Waltz jump is LTS Pre-Free Skate element G. |
| `waltz` | prereqs | ['3turn'] | ['bunny-hop', 'mazurka', '3turn'] | LTS order is bunny hop (Basic 6) -> mazurka (Pre-FS) -> waltz jump (Pre-FS); the FO three-turn (Basic 5) precedes all three. |
| `toe` | level | intermediate | beginner | Toe loop is LTS Free Skate 1 element F. |
| `toe` | prereqs | ['3turn', 'f-bwd-crossover'] | ['waltz', 'half-flip', 'f-bwd-outside-edge'] | FS1 pairs the half flip with the toe loop; the toe loop needs a back-outside landing edge, not merely crossovers. |
| `sal` | level | intermediate | beginner | Salchow is LTS Free Skate 2 element F. |
| `sal` | prereqs | ['3turn'] | ['waltz', 'mohawk', 'half-lutz'] | Salchow launches off a back-inside edge reached via the forward inside mohawk (Pre-FS) or FO three-turn; FS2 teaches it alongside the half Lutz. |
| `uspin` | level | intermediate | beginner | One-foot upright spin is LTS Pre-Free Skate element E (min. three revolutions); FS1 adds the back-crossover entry. |
| `3turn` | level | intermediate | beginner | Forward outside three-turn is LTS Basic 5 element D; forward inside is Basic 6 element A. |
| `mohawk` | level | intermediate | beginner | Forward inside open mohawk from a standstill is LTS Pre-Free Skate element A. |
| `flip` | level | advanced | intermediate | Flip is LTS Free Skate 4 element F. |
| `lutz` | level | advanced | intermediate | Lutz is LTS Free Skate 5 element E. |
| `axel` | level | advanced | intermediate | 'Beginning Axel' is LTS Free Skate 6 element F; an Axel-type jump is required from Preliminary competition. |
| `axel` | prereqs | ['waltz', 'loop'] | ['waltz', 'loop', 'lutz', 'half-loop', 'back-spin'] | Axel is the terminal single (1A 1.10 vs 1Lz 0.60); FS6 teaches the waltz-half loop-Salchow sequence immediately before it, and the back spin supplies  |
| `cspin` | level | advanced | intermediate | Camel spin is LTS Free Skate 5 element C. |
| `layback` | level | advanced | intermediate | 'Layback or attitude spin or cross-foot spin' is LTS Free Skate 6 element D; ISU classifies layback as an upright-position variation. |
| `combospin` | level | advanced | intermediate | Camel-sit combination is LTS Free Skate 6 element C; the Pre-Bronze test then requires it at 6 revolutions. |
| `combospin` | prereqs | ['uspin', 'sspin', 'cspin'] | ['uspin', 'sspin', 'cspin', 'cf-spin'] | A spin combination with change of foot (CCoSp) requires the change-of-foot spin taught at FS4. |
| `spread-eagle` | level | advanced | intermediate | USFS names spread eagles as an example pChSq movement on the Pre-Preliminary test — the lowest test on the ladder. |
| `ina-bauer` | level | advanced | intermediate | ISU lists Ina Bauers beside spirals and spread eagles as Choreographic Sequence movements, not as a graded element. |
| `2toe` | level | expert | advanced | Double toe loop is permitted from Preliminary competition and on the Bronze test; BV 1.30. |
| `2sal` | level | expert | advanced | Double Salchow is permitted from Preliminary competition; BV 1.30. |
| `2loop` | level | expert | advanced | Double loop is permitted from Preliminary competition; BV 1.70. |
| `2flip` | level | expert | advanced | Double flip is permitted from Pre-Juvenile competition / Pre-Bronze test; BV 1.80. |
| `2lutz` | level | expert | advanced | Double Lutz is permitted from Pre-Juvenile competition / Pre-Bronze test; BV 2.10. |
| `2axel` | prereqs | ['axel'] | ['axel', '2lutz'] | 2A (3.30) is first permitted at Juvenile, after the whole double ladder; depending on 1A alone skips 1.10 -> 3.30. |
| `fspin` | prereqs | ['sspin', 'cspin'] | ['sspin', 'back-spin', 'fcamel'] | The flying camel is the entry-level flying spin; the flying sit follows it. Every flying spin needs the back spin. |
| `fcamel` | prereqs | ['cspin', 'fspin'] | ['cspin', 'back-spin'] | Removes the inverted dependency: FCSp is the first flying spin taught and the one named at Pre-Silver/Intermediate level. |
| `chsq` | prereqs | ['stseq'] | ['spread-eagle', 'spiral-seq'] | A ChSq is 'at least 2 different skating movements like spirals, arabesques, spread eagles, Ina Bauers'; it does not require a step sequence, and USFS  |
| `3toe` | prereqs | ['2toe'] | ['2toe', '2axel'] | Triples are permitted only from Juvenile (one) / Intermediate (all), after the full double repertoire including 2A. |
| `3loop` | prereqs | ['2loop'] | ['2loop', '3sal'] | SOV order 3T 4.20 / 3S 4.30 < 3Lo 4.90 < 3F 5.30 < 3Lz 5.90 < 3A 8.00 is the real learning order; today 3Lz unlocks from 2Lz alone. |
| `3flip` | prereqs | ['2flip'] | ['2flip', '3loop'] | Same SOV-ordered chain. |
| `3lutz` | prereqs | ['2lutz'] | ['2lutz', '3flip'] | Same SOV-ordered chain. |
| `3axel` | prereqs | ['2axel'] | ['2axel', '3lutz'] | 3A (8.00) is the last triple and carries a dedicated 1.0 bonus at Novice/Junior. |
| `f-fwd-spiral` | level | advanced | beginner | Cross-tree fix: 'Forward spiral on a straight line' is LTS Basic 6 element G, not an advanced move. |

### hockey (23)

| id | change | from | to | why |
|---|---|---|---|---|
| `h-deflection` | level + prereqs | {'level': 'expert', 'prereqs': ['h-receiving', 'h-one-timer']} | {'level': 'intermediate', 'prereqs': ['h-receiving']} | SP introduces 'deflection' at 10U (Shooting e), alongside flip shot and screen shot. Gating it behind the 14U one-timer is a 2-tier inversion. |
| `h-slap-shot` | level + prereqs | {'level': 'intermediate', 'prereqs': ['h-wrist-shot']} | {'level': 'advanced', 'prereqs': ['h-snap-shot']} | SP introduces the slap shot at 12U (Shooting h). The 12U practice-manual emphasis matrix lists 'Slap'; the 8U and 10U matrices do not contain it at al |
| `h-hockey-stop` | level + prereqs | {'level': 'intermediate', 'prereqs': ['f-snowplow', 'f-fwd-stroke']} | {'level': 'beginner', 'prereqs': ['f-snowplow', 'h-edge-work']} | The USA Hockey 8U Practice Plan Manual carries a dedicated 'CONTROLLED HOCKEY STOP' teaching page; Hockey Canada's U9 core skills list the two-foot pa |
| `h-1ft-edges` | level | expert | intermediate | Hockey Canada U9 core skills include balance on one foot, one-skate glides forward and backward, inside/outside-edge figure 8s and one-leg weaving. Th |
| `h-power-start` | level | intermediate | beginner | SP 8U Skating (c)(d): forward start and forward stride, with 'push to full extension of the thrusting leg' as the 8U teaching point. |
| `h-crossover-start` | level | intermediate | beginner | Hockey Canada U9 'Starting and Stopping: crossover start'; PYHA 8U checklist 'crossover start (side start)'. |
| `h-bwd-snowplow-stop` | level | intermediate | beginner | SP 8U Skating (i) 'backward stop'; the 8U manual has a 'BACKWARD STOP - SNOWPLOW' teaching page. |
| `h-fwd-bwd-pivot` | level | intermediate | beginner | The 8U manual has a 'FORWARD TO BACKWARD TURN' teaching page; PYHA 8U lists pivoting forward-to-backward, backward-to-forward and 360s. |
| `h-bwd-fwd-pivot` | level | intermediate | beginner | The 8U manual has a 'BACKWARD TO FORWARD - STEP OUT' teaching page; HC U9 lists pivots both directions, open and reverse. |
| `h-forehand-pass` | level + prereqs | {'level': 'intermediate', 'prereqs': ['h-wrist-shot']} | {'level': 'beginner', 'prereqs': ['h-stationary-puck']} | SP 8U Passing (a). A shot must not gate a pass - passing and shooting are parallel branches off puck control in every progression. |
| `h-backhand-pass` | level | intermediate | beginner | SP 8U Passing (b) 'backhand pass'. |
| `h-receiving` | level | intermediate | beginner | SP 8U Passing (c) 'receiving a pass properly with the stick'. |
| `h-mohawk` | level | advanced | intermediate | SP introduces the mohawk turn at 10U (Skating m); HC U9 lists 'Heel to Heel (Mohawk)' under Edge Control at U9. |
| `h-toe-drag` | level | advanced | intermediate | SP introduces the toe drag at 10U (Puck Control g); HC U9 lists 'toe drag - side/front' at U9. |
| `h-protect-puck` | level | advanced | intermediate | SP introduces 'puck protection' at 10U (Puck Control e). |
| `h-saucer-pass` | level | advanced | intermediate | SP introduces 'saucer pass (forehand and backhand)' at 10U (Passing d). |
| `h-shooting-stride` | level | advanced | intermediate | HC U9 lists 'forehand / backhand shots in motion' at U9; shooting off the stride is assumed by 10U in SP. |
| `h-deke` | level + prereqs | {'level': 'advanced', 'prereqs': ['h-skating-dribble', 'h-backhand-pass']} | {'level': 'intermediate', 'prereqs': ['h-skating-dribble', 'h-stationa | HC U9 Individual Offensive Tactics lists body fakes, stick fakes and dekes at U9; PYHA 8U lists 'dekes around cones and players'. A backhand PASS is n |
| `h-gap-control` | level | advanced | intermediate | SP introduces 'gap control concept' at 10U under Body Contact (d) and 'gap control' at 10U under Defensive Concepts (a). |
| `h-angling` | level | advanced | intermediate | SP introduces 'body positioning and angling' at 10U (Body Contact e). Angling is step 1 of USA Hockey's 4-step checking progression, which begins the  |
| `h-backwards-cross-full` | level | expert | advanced | Backward crossover is a 10U skill; the speed qualifier is 12U lateral skating / 14U speed. Expert overstates it by one tier. |
| `h-one-timer` | level + prereqs | {'level': 'advanced', 'prereqs': ['h-slap-shot', 'h-receiving']} | {'level': 'expert', 'prereqs': ['h-snap-shot', 'h-receiving']} | SP introduces one-timers at 14U (Shooting j). A one-timer is not built on the slap shot - it is most often a snap/wrist release off a moving puck. |
| `h-backhand-shelf` | prereqs | ['h-deke', 'h-backhand-pass'] | ['h-backhand-shot', 'h-deke'] | A backhand finish must be built on the backhand SHOT (8U), not the backhand PASS. Requires adding h-backhand-shot below (see additions). |

*Stage 1 total: 81*


## Stage 2 — Add missing skills (purely additive)


### foundations (14)

| id | change | from | to | why |
|---|---|---|---|---|
| `f-bwd-wiggle` | add | None | {'id': 'f-bwd-wiggle', 'name': 'Backward Wiggles', 'type': 'locomotion | Basic 1 F, 6-8 in a row. The first backward motion in the curriculum and the missing root of the backward branch. |
| `f-scooter-push` | add | None | {'id': 'f-scooter-push', 'name': 'Scooter Pushes', 'type': 'locomotion | Basic 2 A (R and L). The single-leg push that makes stroking possible. |
| `f-2ft-turn-inplace` | add | None | {'id': 'f-2ft-turn-inplace', 'name': 'Two-Foot Turns in Place', 'type' | Basic 2 F, forward to backward in place, CW and CCW. The tree only has the moving Basic 3 version. |
| `f-curves` | add | None | {'id': 'f-curves', 'name': 'Curves', 'type': 'locomotion', 'level': 'b | Basic 2 bonus skill. |
| `f-fwd-halfswizzle-pumps` | add | None | {'id': 'f-fwd-halfswizzle-pumps', 'name': 'Forward Half Swizzle Pumps  | Basic 3 B, 6-8 consecutive CW and CCW. The official precursor to the forward edge and crossover. |
| `f-bwd-1ft-glide` | add | None | {'id': 'f-bwd-1ft-glide', 'name': 'Backward One-Foot Glide', 'type': ' | Basic 3 D (beginning) and Basic 4 E (R and L, count of 4). Currently absent, yet several backward skills depend on it. |
| `f-bwd-snowplow` | add | None | {'id': 'f-bwd-snowplow', 'name': 'Backward Snowplow Stop', 'type': 'st | Basic 3 E (R and L). The tree currently has no backward stop of any kind. |
| `f-fwd-pivot` | add | None | {'id': 'f-fwd-pivot', 'name': 'Forward Pivots', 'type': 'turn', 'level | Basic 3 bonus skill, CW and CCW. The official entry into the two-foot spin. |
| `f-bwd-halfswizzle-pumps` | add | None | {'id': 'f-bwd-halfswizzle-pumps', 'name': 'Backward Half Swizzle Pumps | Basic 4 D, CW and CCW. The direct precursor to the backward crossover. |
| `f-2ft-spin-adv` | add | None | {'id': 'f-2ft-spin-adv', 'name': 'Advanced Two-Foot Spin', 'type': 'sp | Basic 5 E, 4-6 revolutions. The tree jumps from the 2-revolution Basic 4 spin straight to the one-foot spin, skipping a level. |
| `f-side-toe-hop` | add | None | {'id': 'f-side-toe-hop', 'name': 'Side Toe Hop', 'type': 'balance', 'l | Basic 5 bonus skill (R and L). |
| `f-fwd-inside-mohawk` | add | None | {'id': 'f-fwd-inside-mohawk', 'name': 'Forward Inside Open Mohawk', 't | Basic 6 A, from a standstill, R to L and L to R. ADDED IN THE 2020 REVISION and therefore absent from SKILL_RESEARCH.md; the tree has no mohawk in fou |
| `f-transition-bwd-fwd` | add | None | {'id': 'f-transition-bwd-fwd', 'name': 'Moving Backward to Forward Two | Basic 6 C, on a circle, CW and CCW. The tree has only the forward-to-backward direction. |
| `f-bunny-hop` | add | None | {'id': 'f-bunny-hop', 'name': 'Bunny Hop', 'type': 'jump', 'level': 'a | Basic 6 G. The first jump in the curriculum and a conspicuous gap in a skating-progress app. |

### figure (13)

| id | change | from | to | why |
|---|---|---|---|---|
| `back-spin` | add | None | {'id': 'back-spin', 'name': 'Back Spin (Backward Upright)', 'type': 's | HIGHEST-PRIORITY ADDITION. LTS FS2 'Beginning back spin', FS3 'Advanced back spin with free foot in crossed leg position'. Prerequisite for change-of- |
| `bunny-hop` | add | None | {'id': 'bunny-hop', 'name': 'Bunny Hop', 'type': 'jump', 'level': 'beg | LTS Basic 6 element F — the first jump a skater learns, currently missing so the tree starts at the waltz jump. |
| `mazurka` | add | None | {'id': 'mazurka', 'name': 'Mazurka', 'type': 'jump', 'level': 'beginne | LTS Pre-Free Skate jump F (R and L), taught immediately before the waltz jump. |
| `half-flip` | add | None | {'id': 'half-flip', 'name': 'Half Flip', 'type': 'jump', 'level': 'beg | LTS Free Skate 1 jump E; the toe-pick half jump that precedes the toe loop and flip. |
| `half-lutz` | add | None | {'id': 'half-lutz', 'name': 'Half Lutz', 'type': 'jump', 'level': 'beg | LTS Free Skate 2 jump E; precedes the single Lutz's outside-edge takeoff. |
| `half-loop` | add | None | {'id': 'half-loop', 'name': 'Half Loop / Euler (Eu)', 'type': 'jump',  | LTS Free Skate 4 jump E; ISU code Eu, the connector in the FS6 waltz-half loop-Salchow sequence and in combinations. |
| `cf-spin` | add | None | {'id': 'cf-spin', 'name': 'Change-of-Foot Spin (CUSp)', 'type': 'spin' | LTS Free Skate 4 spin C 'forward upright spin to backward upright spin, 3 revs each foot'; required for CCoSp from Bronze. |
| `jump-combo` | add | None | {'id': 'jump-combo', 'name': 'Jump Combination', 'type': 'jump', 'leve | LTS FS3 'Waltz jump-toe loop or Salchow-toe loop combination'; every USFS singles test from Preliminary requires a two-jump combination. |
| `spiral-seq` | add | None | {'id': 'spiral-seq', 'name': 'Spiral Sequence', 'type': 'sequence', 'l | Spiral currently exists only in foundations. The graded element is the Spiral Sequence on the Pre-Silver and Gold Skating Skills tests ('free leg must |
| `twizzle-f` | add | None | {'id': 'twizzle-f', 'name': 'Forward Twizzles', 'type': 'turn', 'level | Pre-Silver Skating Skills test element 4, alongside brackets. |
| `counter` | add | None | {'id': 'counter', 'name': 'Counter Turn', 'type': 'turn', 'level': 'ex | Forward & Backward Outside/Inside Counters are Silver Skating Skills elements 2 and 3 — above brackets, below rockers. |
| `rocker` | add | None | {'id': 'rocker', 'name': 'Rocker Turn', 'type': 'turn', 'level': 'expe | Forward & Backward Outside/Inside Rockers are Pre-Gold Skating Skills elements 1 and 2 — the top of the turn ladder. |
| `4toe` | add | None | {'id': '4toe', 'name': 'Quad Toe Loop', 'type': 'jump', 'level': 'expe | SOV 4T 9.50; '1.0 for each quad' bonus at Junior. If the tree tops out at 3A it understates the real ceiling. |

### hockey (23)

| id | change | from | to | why |
|---|---|---|---|---|
| `h-backhand-shot` | ADD | None | {'name': 'Backhand Shot', 'type': 'stick', 'level': 'beginner', 'prere | SP 8U Shooting (b). One of only two shots taught at 8U, and currently the missing floor under the expert 'Backhand Top Shelf' node. |
| `h-lateral-dribble` | ADD | None | {'name': 'Lateral (Side-to-Side) Stickhandling', 'type': 'stick', 'lev | SP 8U Puck Control (a); 8U manual 'Basic Dribbling Skills'. |
| `h-diagonal-dribble` | ADD | None | {'name': 'Diagonal Stickhandling', 'type': 'stick', 'level': 'beginner | SP 8U Puck Control (c). |
| `h-attack-triangle` | ADD | None | {'name': 'Attacking the Triangle', 'type': 'stick', 'level': 'beginner | SP 8U Puck Control (d); persists in every age band through 16/18U. A named core skill entirely absent from the tree. |
| `h-c-cuts` | ADD | None | {'name': 'C-Cuts (Forward and Backward)', 'type': 'skating', 'level':  | HC U9 lists C-cuts left/right/alternating both forward and backward, plus the backward C-cut start. Two-foot swizzles in foundations are a different s |
| `h-stick-on-puck` | ADD | None | {'name': 'Stick on Puck', 'type': 'defensive', 'level': 'beginner', 'p | SP 8U Body Contact (a). The first defensive skill a Mite learns; the tree has no checking nodes at all. |
| `h-stick-lift` | ADD | None | {'name': 'Stick Lift', 'type': 'defensive', 'level': 'beginner', 'prer | SP 8U Body Contact (b); 8U manual Checking column 'lift the stick check'. |
| `h-poke-check` | ADD | None | {'name': 'Poke Check', 'type': 'defensive', 'level': 'intermediate', ' | SP 10U Body Contact (c); step 2 of the four-step checking progression. |
| `h-flip-shot` | ADD | None | {'name': 'Flip Shot', 'type': 'stick', 'level': 'intermediate', 'prere | SP 10U Shooting (c); HC U9 lists forehand and backhand flip shots. |
| `h-screen-shot` | ADD | None | {'name': 'Screen Shot', 'type': 'stick', 'level': 'intermediate', 'pre | SP 10U Shooting (d). |
| `h-rebound-shot` | ADD | None | {'name': 'Shooting Off a Rebound', 'type': 'stick', 'level': 'intermed | SP 10U Shooting (f). |
| `h-skate-reception` | ADD | None | {'name': 'Receiving a Pass with the Skate', 'type': 'stick', 'level':  | SP 10U Passing (e). |
| `h-indirect-pass` | ADD | None | {'name': 'Indirect / Bank Pass', 'type': 'stick', 'level': 'intermedia | SP 10U Passing (f); HC U9 lists the stationary bank pass. |
| `h-one-hand-carry` | ADD | None | {'name': 'Accelerating with the Puck (One-Hand Carry)', 'type': 'stick | SP 10U Puck Control (i). |
| `h-bwd-cross-under-start` | ADD | None | {'name': 'Backward Cross-Under Start', 'type': 'start', 'level': 'adva | SP 12U Skating (o). |
| `h-bwd-two-skate-stop` | ADD | None | {'name': 'Backward Two-Skate Stop', 'type': 'stop', 'level': 'advanced | SP 12U Skating (p). |
| `h-bwd-power-stop` | ADD | None | {'name': 'Backward Power Stop (One Skate)', 'type': 'stop', 'level': ' | SP 12U Skating (q). |
| `h-fakes-deception` | ADD | None | {'name': 'Fakes and Deception While Stickhandling', 'type': 'stick', ' | SP 12U Puck Control (l); also the honest home for the 'no-look' and 'Euro step' nodes. |
| `h-backward-puck-control` | ADD | None | {'name': 'Backward Puck Control', 'type': 'stick', 'level': 'advanced' | SP 12U Puck Control (k). |
| `h-contact-confidence` | ADD | None | {'name': 'Body Contact: Delivering and Receiving (Contact Confidence)' | SP 12U Body Contact (h)(i); step 3 of the four-step checking progression, taught at 12U in preparation for body checking at 14U. |
| `h-stop-and-go` | ADD | None | {'name': 'Stop and Go (with Puck)', 'type': 'stick', 'level': 'expert' | SP 14U Puck Control (o). |
| `h-shoulder-check` | ADD | None | {'name': 'Shoulder Check / Receiving a Body Check', 'type': 'defensive | SP 14U Body Contact (j)(k); body checking is step 4 and is introduced at 14U/U15, never earlier. |
| `goalie[]` | ADD NEW TREE (~17 nodes, intermediate tier and above; explicitly none at beginner) | None | {'tree': 'goalie', 'unlocks_at': 'intermediate', 'nodes': ['g-stance', | Goaltending is one of USA Hockey's six individual-skill performance areas, with a full branch in SP at 10U, 12U, 14U and 16/18U. Omitting it at beginn |

*Stage 2 total: 50*


## Stage 3 — Renames, types, de-duplication (display only; ids preserved)


### foundations (14)

| id | change | from | to | why |
|---|---|---|---|---|
| `f-transition` | name | Forward to Backward Transition | Moving Forward to Backward Two-Foot Turn | 'Transition' is hockey vocabulary. LTS USA calls this a two-foot turn (Basic 3 C), and the official name makes the missing backward-to-forward mirror  |
| `f-1ft-glide` | name | One-Foot Glide | Forward One-Foot Glide | Basic 2 B is specifically the FORWARD one-foot glide; the backward one-foot glide is a separate element at Basic 3 D / Basic 4 E. The unqualified name |
| `f-fwd-stroke` | name | Forward Stroking/Skating | Beginning Forward Stroking | Official Basic 3 A wording; the slash form is not LTS terminology. |
| `f-bwd-stroke` | name | Backward Stroking/Skating | Backward Stroking | Official Basic 6 D wording. |
| `f-fwd-spiral` | name | Forward Spiral | Forward Spiral on a Straight Line | Basic 6 H specifies the straight line, which distinguishes it from the Free Skate 2 spirals on a continuous axis. |
| `f-1ft-spin` | name | One-Foot Spin | Beginning One-Foot Spin | Basic 6 E wording; 2-4 revolutions, optional free leg position and entry. |
| `f-2ft-hop` | name | Two-Foot Hop | Two-Foot Hop in Place | 'In place' is part of the Basic 1 bonus element and is the pass criterion. |
| `f-march` | name | Marching on Ice | March Forward Across the Ice | Official Basic 1 B wording. |
| `f-fall-getup` | name | Falling & Getting Up | Sit on Ice and Stand Up | Official Basic 1 A wording. Optional — the app name is clearer for users, but the official term is what a coach signs off. |
| `f-lunge` | name | Lunge | Forward Lunges | Basic 4 bonus wording: 'Forward lunges — both legs'. |
| `f-fwd-outside-edge` | name | Forward Outside Edge | Forward Outside Edge on a Circle | 'On a circle' is part of Basic 4 A and defines the test pattern. |
| `f-fwd-inside-edge` | name | Forward Inside Edge | Forward Inside Edge on a Circle | 'On a circle' is part of Basic 4 B. |
| `f-bwd-outside-edge` | name | Backward Outside Edge | Backward Outside Edge on a Circle | 'On a circle' is part of Basic 5 A. |
| `f-bwd-inside-edge` | name | Backward Inside Edge | Backward Inside Edge on a Circle | 'On a circle' is part of Basic 5 B. |

### figure (9)

| id | change | from | to | why |
|---|---|---|---|---|
| `bracket` | name | Forward Bracket | Bracket Turn (Brackets in the Field) | USFS test element name; 'Forward Bracket' omits FI/FO/BO/BI and the in-and-out requirement. |
| `3turn` | name | Three Turn | Forward Outside Three-Turn | Four distinct three-turns are taught across Basic 5 to FS2; one generic node cannot carry them. |
| `3turn` | dedupe | figure.3turn + foundations.f-fwd-outside-3turn + foundations.f-fwd-inside-3turn | keep the foundations nodes only; have figure reference them | Same element tagged intermediate in figure and advanced in foundations — a direct contradiction inside one catalog. |
| `2ft-spin` | dedupe | figure.2ft-spin (beginner) + foundations.f-2ft-spin (intermediate) | keep foundations.f-2ft-spin, retag it beginner (Basic 4) | Same element, two levels. Basic 4 'Beginning two-foot spin' is unambiguously a beginner rung. |
| `fspin` | name | Flying Spin | Flying Sit Spin (FSSp) | 'Flying Spin' is not an element; ISU names flying spins by landing position (FUSp/FCSp/FSSp/FLSp). |
| `biellmann` | type | spin | spin-variation | ISU: the Biellmann is a position/difficult variation of an upright or layback spin, taken only after 8 revolutions in layback. |
| `*` | schema | {id,name,type,level,prereqs} | {id,name,code,type,level,prereqs,sov,test} | Add ISU element code (1A/2Lz/FCSp/CCoSp/StSq/ChSq), ISU base value, and the LTS/USFS test level each node maps to. Four ordinal bands cannot express 0 |
| `*` | type-taxonomy | ['jump', 'spin', 'step', 'move'] | ['jump', 'spin', 'turn', 'sequence', 'move'] | 3turn/mohawk/bracket are turns; stseq/chsq/spiral-seq are sequences; spread-eagle/ina-bauer are moves. 'step' currently conflates all three. |
| `*` | level-naming | Pre-Juvenile / Juvenile / Intermediate / Novice / Junior / Senior (as TEST names) | Pre-Bronze / Bronze / Pre-Silver / Silver / Pre-Gold / Gold | USFS renamed the standard test ladder effective July 1, 2023, and renamed Moves in the Field to Skating Skills. The old names survive only as competit |

### hockey (13)

| id | change | from | to | why |
|---|---|---|---|---|
| `h-edge-work` | level + name + prereqs + rewire dependents | {'level': 'advanced', 'name': 'Inside/Outside Edges', 'prereqs': ['h-tight-turn']} | {'level': 'beginner', 'name': 'Edge Control', 'prereqs': ['h-ready-sta | SP lists 'edge control' as 8U Skating item (b), taught before starts, stops, turns and crossovers. The current arrow makes tight turns gate edges, inv |
| `h-tight-turn` | level + name + prereqs | {'level': 'intermediate', 'name': 'Tight Turns', 'prereqs': ['f-fwd-crossover']} | {'level': 'beginner', 'name': 'Controlled Turn', 'prereqs': ['h-edge-w | SP 8U Skating item (f) 'controlled turn'; the 8U manual has a 'CONTROL TURNS' page; HC U9 lists 'glide turns / tight turns'. |
| `h-skating-dribble` | level + name | {'level': 'intermediate', 'name': 'Skating with Puck'} | {'level': 'beginner', 'name': 'Open-Ice Carry'} | The entire 8U cross-ice model exists to maximise puck-touches in motion; HC U9 lists 'open ice carry - forehand & backhand' and 'weaving with puck'. |
| `h-mirror-skating` | level + name | {'level': 'expert', 'name': 'Mirror Skating'} | {'level': 'intermediate', 'name': 'Defensive Side Position (Man-You-Ne | 'Mirror skating' appears in no curriculum. SP's 10U Defensive Concepts (e) is 'body position: man-you-net'; the checking manual calls the skill defens |
| `h-closeout` | level + name | {'level': 'expert', 'name': 'Close-Out Skating'} | {'level': 'advanced', 'name': 'Closing the Gap'} | 'Close-out' is a basketball term. Checking the Right Way names the skill 'Closing the Gap' (drill 40) and 'Closing the Gap Tight' (drill 41), built on |
| `h-spin-move` | level + type + name | {'level': 'advanced', 'type': 'skating', 'name': 'Spin-o-rama'} | {'level': 'expert', 'type': 'stick', 'name': 'Spin Around'} | SP lists 'spin around' at 14U under Puck Control (p), not under Skating. Tier and category are both wrong. |
| `h-power-stop` | merge into h-1ft-stop (delete node) | {'level': 'advanced', 'name': 'Power Slide Stop'} | None | USA Hockey has one skill here: 'One Foot Power Stop' (8U manual teaching page) = 'one-foot stop' (SP 10U). h-1ft-stop already models it. Shipping both |
| `h-quick-feet` | level + name | {'level': 'advanced', 'name': 'Quick Feet Agility', 'prereqs': ['h-power-start']} | {'level': 'intermediate', 'name': 'ABCs of Skating (Agility, Balance,  | SP lists 'ABCs of skating' as 8U Skating item (j) and as a through-line at every age; the discrete 'quickness/agility/power' qualifiers appear at 14U. |
| `h-quick-release` | name | Quick Release Shot | Shots in Close / Stick Position in Scoring Areas | SP 14U Shooting (k)(l). Tier is already correct; only the label is slang. |
| `h-fwd-dribble` | name | Forward Dribble | Front-to-Back Dribble | SP names three distinct 8U stickhandling patterns - lateral, front-to-back, diagonal. 'Forward dribble' is not one of them and collapses two of the th |
| `h-euro-step` | delete or rename + move | {'level': 'expert', 'name': 'Euro Step', 'tree': 'hockey'} | {'name': 'Change of Direction with the Puck', 'level': 'advanced', 'ty | 'Euro step' is a basketball term absent from every hockey curriculum consulted. If the intent was a wide Datsyuk-style deke, SP's 12U Puck Control (j) |
| `h-no-look-pass` | rename + level, or move to Show Moves | {'level': 'expert', 'name': 'No-Look Pass', 'prereqs': ['h-saucer-pass', 'h-skating-dribble']} | {'level': 'advanced', 'name': 'Deception While Passing', 'prereqs': [' | SP 12U Puck Control (l) 'fakes and deception'; PYHA lists 'eye contact' as an 8U passing sub-point. 'No-look' is a style, not a graded skill, and the  |
| `f-hockey-stop` | deduplicate against h-hockey-stop | {'level': 'intermediate', 'prereqs': ['f-snowplow', 'f-fwd-stroke']} | alias of h-hockey-stop (or delete one node) | f-hockey-stop and h-hockey-stop are the same skill with identical prereqs, duplicated across two trees. A learner can complete one and still see the o |

*Stage 3 total: 36*


## Stage 4 — Structural (new trees, show-moves shelf, removals)


### foundations (3)

| id | change | from | to | why |
|---|---|---|---|---|
| `f-bwd-stroking-adv` | remove | foundations | None | Duplicate of f-bwd-stroke. There is exactly one backward stroking element (Basic 6 D) in Basic 1-6, and no advanced backward stroking anywhere in Free |
| `f-edge-control` | remove | foundations | None | Not an LTS USA element at any level — a coaching concept with no pass criterion, sitting on top of the four edge skills it depends on. If kept, retitl |
| `f-snowplow` | split | Snowplow Stop | ['Beginning Snowplow Stop (Basic 1 G, beginner)', 'Moving Snowplow Sto | One node covers two separately assessed elements a level apart. Splitting them also gives the Basic 1 skater an achievable first stop. |

### hockey (3)

| id | change | from | to | why |
|---|---|---|---|---|
| `h-michigan` | move out of graded tree to non-gating 'Show Moves' shelf | {'level': 'expert', 'tree': 'hockey'} | {'tree': 'show-moves', 'gating': False} | Appears in no USA Hockey age band (8U-18U), no practice-plan emphasis matrix, and no Hockey Canada U9 matrix. Tagging it 'expert' next to top speed an |
| `h-between-legs` | move out of graded tree to non-gating 'Show Moves' shelf | {'level': 'expert', 'tree': 'hockey'} | {'tree': 'show-moves', 'gating': False} | Same as h-michigan: zero curriculum presence at any age. |
| `h-bwd-cross` | prereqs (resolve cross-tree conflict) | ['f-bwd-stroke', 'f-fwd-crossover'] | ['f-bwd-crossover'] | f-bwd-crossover is the same skill tagged 'beginner' in foundations while h-bwd-cross is 'intermediate' in hockey, and h-bwd-cross does not even depend |

*Stage 4 total: 6*
