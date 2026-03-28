# Ice Skating AI Detection Research

## Free Ice Skating Footage Sources

- **Pexels** — https://www.pexels.com/search/videos/ice%20skating/ (11,000+ free 4K videos, no attribution required)
- **Pixabay** — https://pixabay.com/videos/search/ice%20skating/ (hundreds of royalty-free clips)
- **Videezy** — https://www.videezy.com/free-video/ice-skating (578 free clips, Creative Commons)
- **Vecteezy** — https://www.vecteezy.com/free-videos/ice-skating (545 free skating videos)

---

## Jump Identification: The Golden Rule

**Focus on the TAKEOFF, not the air position.** All jumps look similar in the air and land the same way (backward, outside edge). The entry is what distinguishes them.

### Toe Jumps (toe pick assists takeoff)
If the free leg reaches BACK and STABS ice before takeoff = toe jump.

| Jump | Takeoff Edge | Key Visual Cue |
|------|-------------|-----------------|
| Toe Loop | Back outside | Open body position, toe tap, rotates AWAY from planted foot |
| Flip | Back inside | Turn entry immediately before + toe tap |
| Lutz | Back outside | Long backward glide (NO turn before) + toe tap. Counter-rotational |

### Edge Jumps (no toe pick assist)
If the free leg SWINGS UP and FORWARD = edge jump.

| Jump | Takeoff Edge | Key Visual Cue |
|------|-------------|-----------------|
| Salchow | Back inside | Sweeping/knock-kneed motion at takeoff |
| Loop | Back outside | Crossed/close legs at takeoff, same foot landing |
| Axel | Forward outside | ONLY forward-facing takeoff jump. 1.5+ rotations |

### Difficulty Ranking (ISU)
Toe Loop → Salchow → Loop → Flip → Lutz → Axel

### Flip vs. Lutz Confusion
- Flip: skater does a TURN immediately before the jump, enters on inside edge
- Lutz: skater does a LONG backward glide, enters on outside edge
- "Flutz" = wrong edge on Lutz (cheating to inside edge)

### Landings
All clean jumps land the same way: backward, on one foot, outside edge. ~90% of skaters rotate counterclockwise and land on their right foot.

---

## Jump Phase Detection (from Research)

A complete jump has 4 consecutive phases:
1. **S1 - Glide/Preparation**: Entry edge, body positioning
2. **S2 - Takeoff**: The moment of leaving the ice
3. **S3 - Air rotation**: Tight body position, arms pulled in
4. **S4 - Landing**: Back outside edge, free leg extended

### Frame-Level Labeling (YourSkatingCoach approach)
- **B-label**: Take-off frame (first frame feet leave ice)
- **I-label**: Continuous in-air frame
- **E-label**: Landing frame (first frame blade touches ice)
- **O-label**: Everything else

---

## Spin vs. Jump Distinction

Both involve rotation. Key differences:
- **Spins**: Rotation happens ON the ice, in ONE spot. Between frames: same location, body orientation changes
- **Jumps**: Rotation happens IN THE AIR. Between frames: skater's position on ice changes (takeoff → landing spot)

Common AI error: predicting a spin as the air time of a jump because both show rotation.

---

## Key Detection Challenges from Real Videos

Based on analysis of 16 real skating videos (4K, 120fps):

1. **Wide-angle shots**: Skater is 10-15% of frame height in rink-wide shots
2. **Multiple skaters**: Public sessions have 3-8 people on ice — must identify primary subject
3. **Camera blocking**: Selfie-style videos where body/hand fills frame (unusable)
4. **Inverted footage**: Phone orientation issues (upside-down frames)
5. **Boards-level camera angle**: Shooting from ice level doesn't show feet/blade detail well
6. **Motion blur at 120fps→1fps**: Extracting 1 frame/sec loses micro-movements but captures overall motion

---

## State of the Art: AI in Skating (2025-2026)

### ISU + Omega (Milano Cortina 2026 Olympics)
- 14 × 8K cameras around rink
- AI tracks trajectory, position, movement in x/y/z axes
- Measures jump heights, air times, landing speeds in real time
- Data-to-graphic pipeline < 0.1 seconds
- Goal: support judges in awarding technical scores

### MIT OOFSkate
- Optical tracking system for jump analysis
- Mobile app: film a jump → get physical metrics (rotation count, height, etc.)
- Used by Team USA skaters and NBC Sports commentators
- Single camera input (phone video)

### Google Cloud + US Ski & Snowboard
- Computer vision + LLMs convert ordinary video into biomechanical insights
- Analyzes rotations, takeoff angles, airtime, landings
- No specialized motion-capture equipment needed

### Research Datasets
- **SkatingVerse**: 28 action classes, 1,687 official videos (jumps + spins)
- **YourSkatingCoach**: 454 videos of 6 recognized jumps with frame-level annotations
- **FSD-10**: 10 most frequent jump/spin types, optical flow + 2D pose estimation

### Key Research Findings
- 2D pose estimation as input outperforms raw image features
- Focusing on frames with large joint displacements improves detection
- Multi-view 3D reconstruction helps but requires multiple cameras
- Temporal action segmentation (frame-by-frame labeling) is the leading approach

---

## Sources

- ISU AI Judging: https://news.cgtn.com/news/2026-02-11/International-Skating-Union-weighs-AI-s-role-in-judging--1KFKl1sSgLK/p.html
- MIT OOFSkate: https://news.mit.edu/2026/3-questions-using-ai-help-olympic-skaters-land-quint-0210
- Olympic AI Tech: https://spectrum.ieee.org/winter-olympics-2026-tech
- Axios Olympic AI: https://www.axios.com/2026/02/16/olympics-figure-skating-ai
- YourSkatingCoach Benchmark: https://arxiv.org/html/2410.20427v2
- 3D Pose Skating: https://arxiv.org/html/2408.16638v1
- VIFSS Pose Learning: https://arxiv.org/html/2508.10281v1
- Jump Guide: https://adultsskatetoo.com/blogs/guides/every-figure-skating-jump-explained
- Jump Identification: https://www.tumblr.com/yuzuruhanyuedits/172689586403/identify-figure-skating-jumps-in-real-time
- BGSU Jump Guide: https://www.bgsu.edu/content/dam/BGSU/ice-arena/documents/Identifying-Different-Jumps-Aspire.pdf
- Olympics Element Guide: https://www.olympics.com/en/news/the-jumps-spins-and-turns-of-figure-skating
