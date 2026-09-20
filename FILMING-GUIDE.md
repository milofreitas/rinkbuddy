# Filming guide — learned from real rink footage

Live document. Updated 2026-09-19 after scanning batch 1 (8 clips, 485 s total, IMG_1782–1791).

## What batch 1 produced

| Clip | Length | Result |
|---|---|---|
| IMG_1782 | 76 s | Best framing (~70% of frame) but no skill performed |
| IMG_1783 | 139 s | Subject 5–15% of frame — too far |
| IMG_1784 | 47 s | 4K; good for 8 s then subject recedes |
| IMG_1785 | 4 s | Unusable — hand over lens, portrait |
| IMG_1786 | 56 s | Close but portrait |
| IMG_1787 | 34 s | Good — landscape, 50–70% of frame, 2 turns |
| IMG_1788 | 3 s | Unusable — camera against shirt |
| IMG_1791 | 127 s | Best — 4K, **2 clean forward-swizzle sequences** (102.6–104.0 s, 122.2–123.5 s) |

**Yield: ~3 s of labelable skill from ~8 minutes of footage (≈0.6%).** Everything below exists to raise that number.

## Settings that are already right — don't change them
- 120 fps (240 fps slo-mo also fine for jumps/spins later). Frames are sharp, blur is minimal.
- 1080p is enough; 4K helps only if the skater is far away.
- AirDrop preserves every frame. Messages/WhatsApp/email do NOT — they re-encode to ~30 fps.

## The five rules, in order of impact
1. **Keep the camera ON the skater.** ~25% of IMG_1791 points at the operator's shirt, other skaters, or the ceiling. This is the single biggest loss and it costs nothing to fix.
2. **Fill at least a third of the frame** — ideally half. Pose models need roughly 150–200 px of person; at 1080p that is ~1/3 of frame height. Under ~10 m from the camera.
3. **One skill per clip, 10–15 s, with 3–5 repetitions.** Repetitions are what test whether the scan finds *every* attempt, not just the obvious one.
4. **Landscape, always.** Two clips in batch 1 were portrait.
5. **Film side-on and level**, a few seconds before and after each attempt so the entry edge is visible.

## Clothing — yes, it matters for the first dataset
Treat the first batch as a **calibration set**: make the body as readable as possible, then deliberately degrade it later to test robustness.

**Wear (≈70% of clips):**
- Fitted leggings or slim training pants, fitted top. Baggy sweats hide the knee bend and free-leg position — the exact cues that separate skills.
- Strong contrast against white ice: navy, black, deep red, teal. Avoid white, cream, pale grey, light blue.
- **Contrasting upper vs lower** (e.g. dark top, mid-tone bottoms). A single block of one colour makes hip position ambiguous.
- **Ankles and boots visible** — never cover the boot with a trouser leg. Edges are judged at the ankle/blade.
- One distinctive colour so the tracker (and Claude) can lock onto the right person in a public session.
- Hair tied back; gloves that contrast with the top.
- Same outfit for a whole session.

**Avoid:** long skirts/dresses over hip and knee, long coats, baggy hoodies (hide shoulder rotation), all-white outfits, and — for figure-skating technique — full hockey pads, which hide most joints.

**Then break it on purpose (≈30% of clips):** normal rink clothes, so we can measure how much accuracy the clothing is buying. If the AI only works on fitted navy leggings, we are fooling ourselves — real users wear whatever they own.

**Optional accelerator for the calibration set only:** a bright sock/ankle band in a colour that appears nowhere else (e.g. hi-vis orange) makes ankle and blade tracking far easier to verify by eye. Never ship this as a product requirement.

## Priority shot list (no jumps for now)
Forward swizzles · forward crossovers (both directions) · hockey stop (both) · snowplow stop · forward outside/inside three-turn · backward skating and backward crossovers · one-foot glide each foot · T-stop.

Hardest pairs, and therefore the most valuable to film: **hockey stop vs T-stop**, **inside vs outside three-turn**.

## Labels
Say the skill out loud at the start of each clip, or name the file (`crossovers-ccw_01.mov`). Either gives ground truth for free — see `labels/README.md`.
