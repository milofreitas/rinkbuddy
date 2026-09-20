# Labels — the ground truth we build by hand (no API)

One JSON file per clip, written by Claude in chat + confirmed by Milo.
These are the gold labels: the eval set the automatic scan gets graded against,
and the seed data for a future pose classifier. Never let a model overwrite them.

Schema (labels/<clip-stem>.json):
{
  "clip": "waltz-jump_01.mov",
  "filmed": "2026-09-19",
  "skater": "milo",            // consent basis; adults only for now
  "discipline": "figure",      // figure | hockey | foundations
  "camera": {"fps": 240, "distance_m": 8, "angle": "side", "handheld": false},
  "events": [
    {"t_start": 3.10, "t_takeoff": 3.42, "t_landing": 3.95, "t_end": 4.30,
     "skill_id": "f-waltz-jump", "skill": "Waltz Jump",
     "outcome": "clean",       // clean | two-foot | fall | wrong-edge | under-rotated | aborted
     "quality": 4,             // 1-5
     "cues": "forward outside takeoff, free leg swings through, lands back outside RFO",
     "labeled_by": "claude+milo", "confidence": "high"}
  ],
  "notes": "public session, 3 other skaters on ice"
}

Phases — mark them on EVERY skill, not just jumps
-------------------------------------------------
The cheapest accuracy we can buy. On figure-skating video, labelling the phases
of a movement instead of only naming it raised segmentation F1@50 from 76.4 to
84.2 on 2D pose and 72.8 to 86.6 on 3D pose — with no extra clips filmed
(VIFSS, arXiv 2508.10281, annotation ablation).

So each event carries three boundaries in addition to t_start / t_end:

  "t_entry":  when the preparation begins   (the glide or step into it)
  "t_exec":   when the skill itself starts  (takeoff, the first push, the turn)
  "t_exit":   when the skill is over        (landing, the last close, the exit edge)

Jumps keep t_takeoff and t_landing as well; they are the same idea named for the
element. For a repeated skill such as swizzles, one event per repetition, each
with its own phases, and a repIndex/repCount so a run of four reads as four.

Rules
- Label what is VISIBLE, not what was intended. Aborted attempts count.
- Include failures — they are the most valuable examples.
- If unsure between two skills (flip vs lutz), set confidence "low" and say why in cues.
