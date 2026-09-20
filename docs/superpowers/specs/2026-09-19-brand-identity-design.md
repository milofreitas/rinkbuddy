# RinkBuddy brand identity — design spec

**Date:** 2026-09-19
**Status:** Approved by Milo, ready for implementation planning
**Scope:** New logo, new colour system (light + dark), and every surface both appear on.

---

## 1. Why

RinkBuddy currently ships **five different logos** and none of them match:

| Surface | What is there today |
|---|---|
| App header | Filled gradient skate, viewBox 0 0 32 28 ([index.html:844](../../../index.html)) |
| Landing nav | Stroked outline skate, different paths ([index.html:400](../../../index.html)) |
| PWA icon | White boot on navy, `icon-192.svg` / `icon-512.svg` |
| Browser tab | Canvas-drawn arc from `generateIcon()` ([index.html:4471](../../../index.html)), which appends `<link>` tags at runtime and overrides the SVG icons |
| iOS + Android icon and splash | **Capacitor's default logo.** This would go to the App Store as-is |

The colour system has matching problems:

- The palette is stock Tailwind (`sky-400`, `indigo-400`, `pink-400` on a navy base) with sky-to-indigo gradients on text and buttons. It reads as a generic AI startup — the aesthetic [research/05-demand-market.md](../../../research/05-demand-market.md) found adult skaters actively distrust, against a positioning of "progress journal + feedback between lessons".
- White text on the primary button gradient scores **2.1:1 to 3.0:1**. WCAG AA needs 4.5:1 for text that size.
- 247 hard-coded colour values — 107 hex (33 distinct) and 140 `rgba()` (66 distinct) — plus 53 gradients (43 carrying brand colour) and 7 gradient-text treatments, against only 8 named tokens.
- Dark mode only, with no light theme.

## 2. Decisions

| Question | Decision |
|---|---|
| Brand feel | Friendly training partner — warm, encouraging, human; a journal you want to open |
| Themes | **Both**, following the device setting |
| Mark | Ice skate, full bleed, no container shape |
| Colour | Night navy + ice blue; amber reserved for streaks and warnings |
| Icon shade | Frost-white skate on deep navy (candidate E) |

Rejected along the way, and why: abstract swooshes and carve lines (read as generic startup marks, nothing about ice); the speech-bubble container (good small-size behaviour, but Milo wanted the skate to own the whole icon); amber-dominant (too orange); night-and-cyan *gradients* (that is the look being replaced — flat colour only).

## 3. The mark

Generated with Nano Banana 2 from prompts built on real skate references (Wikimedia figure and hockey skate photography), then vectorised: the raster was flattened to exact brand colours, traced with vtracer, and the outer geometry rebuilt by hand from measurements.

### Files (`brand/`)

| File | Use |
|---|---|
| `rinkbuddy-skate.svg` | Frost `#E8F1F7` skate — dark backgrounds, store icon |
| `rinkbuddy-skate-navy.svg` | Navy `#0F2338` skate — light backgrounds |
| `rinkbuddy-skate-simple.svg` / `-navy` | Fewer interior details — **required below 24px** |
| `rinkbuddy-store.png` | 1024×1024, navy field, no alpha — App Store |
| `rinkbuddy-mark*.svg` | Speech-bubble versions, kept as alternates, not in active use |

### Rules

- **Clear space:** at least 12% of the mark's width on every side.
- **Minimum sizes:** the simplified cut at 32px and below; the detailed cut above 32px. Under 24px the lace gaps fill in and the detailed cut reads as a blob — and favicon-32.png measured better with the simplified cut too, so the line sits at 32px rather than 24px; a measured legibility call, not an oversight.
- **Backgrounds:** frost on navy, navy on white or ice. Never frost on ice or navy on navy.
- **Never:** recolour to a third hue, add gradients, outline it, rotate it, or stretch it.
- **Lockup:** mark then wordmark, gap equal to 25% of the mark's width, optically centred on the x-height.
- **Hockey sibling:** owed. Needs re-tracing without the bubble; its current trace has a colour halo.

## 4. Colour

### Brand constants

| Name | Hex | Role |
|---|---|---|
| Night navy | `#0F2338` | Anchor: icon field, light-theme text, dark-theme mark contrast |
| Ice | `#4FC3E8` | Dark-theme accent: buttons, progress, data |
| Deep ice | `#0F6E92` | Light-theme accent (the bright ice fails contrast on white) |
| Frost | `#E8F1F7` | Dark-theme text, mark on dark |

### Light theme

| Token | Hex | Contrast |
|---|---|---|
| `--bg` | `#F5F8FA` | — |
| `--surface` | `#FFFFFF` | — |
| `--text` | `#0F2338` | 15:1 on card |
| `--text-dim` | `#566B7D` | 4.9:1 |
| `--accent` | `#0F6E92` | 5.6:1, white text on it |
| `--accent-wash` | `#E1F1F8` | with `#0A4A63` text |
| `--success` | `#1E7A4D` | — |
| `--warning` | `#9A6200` | streaks and warnings, 5.1:1 |
| `--danger` | `#B4362C` | — |

### Dark theme

| Token | Hex | Contrast |
|---|---|---|
| `--bg` | `#0B1826` | — |
| `--surface` | `#13293D` | — |
| `--text` | `#E8F1F7` | 16:1 |
| `--text-dim` | `#8FA8BC` | 7.2:1 |
| `--accent` | `#4FC3E8` | 8.8:1, navy text on it |
| `--accent-wash` | `#0F3448` | with `#9FD8EC` text |
| `--success` | `#4FBE86` | — |
| `--warning` | `#E3A44A` | streaks and warnings |
| `--danger` | `#F08B80` | — |

### Rules

- **No gradient text, anywhere.** Replace all 7 `background-clip:text` treatments with solid colour.
- **Gradients on buttons and surfaces go too** — flat fills only. This is the single biggest visual difference from the old look.
- **Ice is for measurement** (progress bars, the radar chart, data). **Amber is for encouragement and caution** (streaks, warnings). Never swap them; that separation is what stops the UI turning into confetti.
- Every text-on-background pair ships at AA or better. Any new pair gets checked before it lands.
- No colour literals in component CSS. Every value resolves to a token, except: Google's brand hues and button chrome (their guidelines require them), the two theme-color values a `<meta>` tag cannot express as a variable, and theme-neutral `#000`/`#fff`/`rgba(0,0,0,a)` structure such as the video letterbox and drop shadows. A white alpha wash is never exempt: it vanishes on a light surface.

## 5. Typography

- **UI:** unchanged system stack.
- **Wordmark:** open. Figtree 700 in all mockups; try two or three alternatives before locking. "RinkBuddy" stays one word, camel case, with "Buddy" in the accent colour.

## 6. Surfaces to update

**Assets to generate:** favicon SVG plus 32 and 16px PNG; `apple-touch-icon` 180px PNG (iOS ignores SVG here); PWA 192 and 512 plus maskable; iOS AppIcon 1024 (no alpha, App Store rejects transparency); Android adaptive icon foreground, background and monochrome layers plus legacy mipmaps at five densities; splash screens (one navy treatment, used in both themes — the splash is a brand moment, not a UI surface); an OG image at 1200×630 for the ad test.

**Code:**

1. Replace the three inline SVG logos in [index.html](../../../index.html) with the new mark.
2. Delete `generateIcon()` and its `<link>` injection — it is why the tab icon doesn't match anything else.
3. Replace the 8-token `:root` block with the light and dark sets, switching on `prefers-color-scheme` with a manual override.
4. Migrate 247 colour literals onto tokens; the contrast failures get fixed as part of that pass, not separately. Google's sign-in button colours stay literal — they are Google's brand, not ours.
5. Remove the 53 gradients and 7 gradient-text treatments.
6. Update `manifest.json` (`theme_color`, `background_color`, icons) and `capacitor.config.json` background colours.
7. Replace the iOS and Android icon and splash assets, and the LaunchScreen background.
8. `build.sh` copies `index.html`, `manifest.json`, `sw.js` and the icons to `www/` — new icon files must be added to that list or they will not reach the native builds.

## 7. Out of scope

Flagged during this work, deliberately not part of it:

- Android still declares the old app name: `package_name` and `custom_url_scheme` are `com.iceedge.app` in `android/app/src/main/res/values/strings.xml`, and the Java package is `com/iceedge/app`, while `capacitor.config.json` says `com.rinkbuddy.app`. Needs resolving before a Play submission.
- [APPSTORE_LISTING.md](../../../APPSTORE_LISTING.md) claims the app was "designed with input from competitive figure skaters, coaches, and skating enthusiasts" — already noted as unverified in the session notes.
- The hockey sibling mark.

## 8. Verification

1. Every screen rendered in both themes at phone and desktop width, compared against the mockups.
2. Automated contrast check over the token pairs; AA or better, no exceptions.
3. The mark rendered at 16, 20, 24, 44, 180, 512 and 1024px and inspected — the simplified cut takes over below 24px.
4. iOS icon checked for alpha (App Store rejects it) and Android adaptive icon checked against the 66dp safe zone.
5. The dev server run and each changed view exercised, not just diffed.
