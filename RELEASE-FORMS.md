# Release forms

Two one-page forms: one for a skater who lets us film them for the test set, one
for a coach we pay for demonstration clips. Print, sign, keep the paper, and note
the reference number in the clip's label file (`consent_ref`).

**These are drafts, not legal advice.** They're written to be readable and to
cover the two things that matter — permission to film, and permission to use the
footage to build and test the AI. Have a lawyer read them once before going
beyond friends and a first paid coach. Adults only: anyone under 18 needs a
parent's signature and a separate conversation about children's privacy rules.

---

## Form A — Skater filming release

**RinkBuddy — permission to film and to use the footage**

Reference: `REL-2026-____`

I, **________________________________** (print name), agree to be filmed skating
by **Murilo Pugliesi Lopes (RinkBuddy)** on **____ / ____ / ________** at
**________________________________** (rink).

I give RinkBuddy permission to:

1. Keep the video, and to keep data worked out from it — such as the positions of
   my body and skates over time.
2. Use the video and that data to **build, test and improve RinkBuddy's skill
   recognition**, including as examples a computer program learns from.
3. Keep using them for as long as RinkBuddy needs them, including commercially.

RinkBuddy agrees that:

4. The video will **not be published, advertised or posted publicly** without
   asking me separately.
5. I can ask RinkBuddy to **stop using my footage for anything new** at any time,
   by writing to <email>. Work already done with it doesn't have to be undone.
6. My name is kept on this form only. Clips are filed under a code, not my name.

I am 18 or older. I'm signing freely and I've read the five points above.

Signature **____________________________**  Date **____________**

Contact (email or phone) **________________________________**

*RinkBuddy contact: Murilo Pugliesi Lopes · <email> · rinkbuddy.com*

---

## Form B — Coach demonstration licence

**RinkBuddy — demonstration clips licence**

Reference: `LIC-2026-____`

**Coach:** ________________________________
**Certification:** ________________________ (e.g. PSA rating, USA Hockey level)
**Session:** **____ / ____ / ________** at **________________________________**
**Fee:** **$__________**, paid within 7 days of the session.

The coach gives RinkBuddy permission to:

1. Film them demonstrating skating skills, and to use those clips **inside the
   RinkBuddy app and in marketing for it**, anywhere, with no time limit.
2. Use the clips and data worked out from them — such as body and skate positions
   over time — to **build, test and improve RinkBuddy's skill recognition**.
3. Edit, trim, slow down and caption the clips, so long as the technique shown
   isn't misrepresented.

RinkBuddy agrees to:

4. **Credit the coach** on every clip shown in the app: name and certification,
   with a link to a page they choose.
5. Give the coach a **copy of all the raw footage**, which they may use however
   they like, including teaching and their own promotion.
6. Give the coach **free RinkBuddy Pro**, and free Pro for their students for the
   first year.
7. Pay the fee above as a **one-off**. No royalties, and no further payment is
   owed to either side.

The coach confirms they're free to sign this — that no club, rink or federation
agreement stops them — and that the technique they demonstrate is their own work.

Coach signature **____________________________**  Date **____________**

RinkBuddy signature **____________________________**  Date **____________**

---

## Filing

| Where | What goes in it |
|---|---|
| The paper form | The only place a real name is written |
| `labels/<clip>.json` | `"consent_ref": "REL-2026-014"` and a skater code such as `S02` |
| `RinkBuddy Footage/<session>/` | The clips themselves, never in the public repo |

If a clip has no reference, it doesn't go in the training or test set. That rule
is cheap to keep now and expensive to reconstruct later.
