# Coach demo shoot — plan, offer and paperwork

*Written 2026-09-19. Goal: 22 short demonstration clips, filmed once, owned forever.*

One coach, one session, 60–90 minutes on the ice. Out of it come the clips that
show a skater what a skill is supposed to look like — and the same clips are the
cleanest training and test data we will ever have, because a coach performs the
skill correctly, on purpose, on demand.

Everything filmed so far is the opposite: general public-session skating, filmed
handheld, with about 3 seconds of labelable skill per 8 minutes.

---

## 1. What we're buying

| Deliverable | Count | Length each |
|---|---|---|
| Correct demonstration, side-on | 22 | 4–8 s (3–5 repetitions) |
| Correct demonstration, 45° or end-on | 22 | 4–8 s |
| **The common mistake**, side-on | 12 | 4–8 s |

The mistake takes matter as much as the clean ones. A skater learns more from
"this is a two-footed three-turn, yours looks like this" than from a perfect
example alone, and the AI needs to see what wrong looks like or it will call
everything correct.

**The 22 skills** are the learn-to-skate core: forward and backward stroking,
forward and backward swizzles, forward and backward crossovers, two-foot glide,
one-foot glide, dip, forward spiral, two-foot hop, snowplow stop, T-stop, hockey
stop, the four edges (forward and backward, outside and inside), forward-to-
backward two-foot turn, forward outside three-turn, two-foot spin, one-foot spin.

**The 12 mistakes worth filming:** swizzles that drift into stroking · a one-foot
glide that touches down · a two-footed three-turn · a spin that travels · a
T-stop with the back foot not square · a snowplow that only one foot does · a
crossover where the foot steps beside instead of over · an inside edge that flats
out · a spiral with the free leg below hip height · a hockey stop that scrapes
instead of skids · a dip that leans back · backward stroking with no C-cut.

---

## 2. The offer to the coach

> **$300–500 for a 90-minute session**, plus ice time if the rink charges for it.
> Free RinkBuddy Pro for the coach and their students.
> Credit on every clip: "Demonstrated by <name>, <certification>", with a link
> to their page or booking.

Why a coach says yes: it is an hour of paid work doing what they already do all
day, their name appears next to correct technique in front of exactly the people
who hire coaches, and they keep the right to use the footage themselves.

Where to find one:
- **Learn to Skate USA program directors** at the rink — one director reaches
  50–300 families, which is also the distribution channel we want later.
- **Adult-class coaches.** Adult learners are the beachhead, and adult-class
  coaches understand that market better than elite coaches do.
- **PSA-rated coaches** for figure, **USA Hockey Level 3+** for hockey skating.
- The boards in the footage so far read Henderson / America First, so start at
  the home rink and ask the front desk who teaches the adult classes.

---

## 3. The licence (plain language)

The coach signs a one-page agreement granting RinkBuddy:

- permission to film them and to use the clips **in the product and in marketing**,
  worldwide, with no time limit;
- permission to use the clips, and data derived from them such as body-position
  points, **to build, test and improve RinkBuddy's AI**;
- a credit line with their name and certification on every clip;
- the coach keeps their own copy and their own right to use it;
- payment is a one-off fee, with no royalty and no future claim.

Two things to keep straight: this is **not legal advice**, so have a lawyer read
it once before the second shoot; and the AI-training clause has to be explicit,
because it is the clause that turns the clips into a lasting asset rather than
stock footage.

---

## 4. Running the session

**Before**
- Confirm rink permission to film, and book a quiet time. Freestyle or adult ice
  beats a public session: fewer people in frame, and no children's consent problem.
- Two phones on clamps or small tripods: one **side-on**, one at **45°**.
- Settings on both: 4K 60 fps (or 1080p 120), Auto FPS off, landscape, 1× lens.
- Ask the coach to wear **fitted clothes with contrast** — dark top, mid-tone
  bottoms, ankles and boots visible. Nothing white, nothing baggy, no long skirt.
- Print the shot list and the release. Bring a charger.

**On the ice**
- Phone 5–10 m from where the skill happens. The coach should fill at least a
  third of the frame height.
- One clip per skill: say the skill name out loud, then 3–5 repetitions, then stop.
- Then the same skill from the second angle.
- Film the mistake takes straight after the clean ones, while the skill is set up.
- Keep every fall and every scrappy attempt. They cost nothing and they're rare.

**Order** (shortest setup changes first): straight-line skills → stops →
circle work → turns and spins → mistake takes.

**After**
- AirDrop to the Mac, into `RinkBuddy Footage/<date> <rink> coach-demos/`.
- Name files `<skill-id>_<angle>_<take>.mov`, e.g. `f-fwd-swizzle_side_01.mov`.
  Named files are free ground truth — see `labels/README.md`.
- Run `bash tools/ingest.sh`, then label with `tools/clips.py`.

---

## 5. Budget

| Item | Cost |
|---|---|
| Coach fee, 90 minutes | $300–500 |
| Ice time, if charged | $0–150 |
| Clamp or tripod ×2 | ~$60 one-off |
| Lawyer reading the release once | $200–500 one-off |
| **Per shoot, after the one-off items** | **$300–650** |

That buys 44 demonstration clips plus 12 mistakes: the demo library for every
skill card, and the only correctly-performed reference data we own.

---

## 6. Outreach message

> Hi <name> — I'm building RinkBuddy, an app that helps adult skaters and
> learn-to-skate families track their progress between lessons. I'm looking for a
> coach to film a set of short demonstration clips — the Basic 1–6 skills, a few
> seconds each — that would appear in the app as the reference for what each
> skill should look like, credited to you with a link.
>
> It's about 90 minutes on the ice and I'd pay $<amount> for the session. You'd
> keep your own copy of everything, and you and your students get the app free.
>
> Would you be up for it? Happy to work around your schedule at <rink>.

Keep the first message short. Details, licence and shot list come after they say
they're interested.
