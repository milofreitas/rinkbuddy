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

Rules
- Label what is VISIBLE, not what was intended. Aborted attempts count.
- Include failures — they are the most valuable examples.
- If unsure between two skills (flip vs lutz), set confidence "low" and say why in cues.
