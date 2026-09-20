# Extracted skill clips

Cut from footage/ with ffmpeg, 720p, native 120 fps (play at 0.25x for slow motion).
Each one is referenced from the matching labels/*.json event via its "clip" field.

| Clip | Skill | Quality | Source |
|---|---|---|---|
| swizzles_best_1791_121.6s.mp4 | Forward swizzles | 4/5 — the reference example | IMG_1791 @121.6s |
| swizzles_shaky_1791_102.4s.mp4 | Forward swizzles | 2/5 — balance lost, arms out | IMG_1791 @102.4s |
| fwd-stroking_1792_58.4s.mp4 | Forward stroking | 4/5 — best side-on view | IMG_1792 @58.4s (rotation fixed) |
| fwd-stroking_1792_68.4s.mp4 | Forward stroking | 3/5 | IMG_1792 @68.4s (rotation fixed) |
| fwd-skating_1791_25.3s.mp4 | Forward skating toward camera | 3/5 | IMG_1791 @25.3s |
| two-foot-turn_1787_10.2s.mp4 | Two-foot turn / pivot | 3/5 | IMG_1787 @10.2s |
| transition-bwd-fwd_1787_25.2s.mp4 | Backward-to-forward transition | 3/5 | IMG_1787 @25.2s |

IMG_1792 note: the file is tagged 90° but is really landscape upside-down.
Decode with `-display_rotation 0` then `hflip,vflip`, or the clip comes out sideways.
