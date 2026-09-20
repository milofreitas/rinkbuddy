# RinkBuddy Brand Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the new RinkBuddy mark on every surface and replace the ad-hoc colour system with light and dark token sets that pass WCAG AA.

**Architecture:** A tiny Node toolkit (`tools/brand.js`) gives the work real tests: contrast maths, token parsing, colour-literal counting, and PNG header reading. Every visual change is then gated by a test that fails first. The token migration runs as a ratchet — each task lowers a maximum-literals budget until it reaches zero. Icons are generated from the committed SVG masters by a script, never hand-exported, so they can be regenerated when the mark changes.

**Tech Stack:** Vanilla HTML/CSS/JS in a single `index.html`; Node 18+ with `node:test` (the convention already used by `ai/scan-core.test.js`); headless Google Chrome for rasterising; Capacitor 8 for the iOS and Android shells.

**Spec:** `docs/superpowers/specs/2026-09-19-brand-identity-design.md`

## Global Constraints

- **Light theme tokens** (exact values): `--bg: #F5F8FA`, `--surface: #FFFFFF`, `--surface2: #EDF2F6`, `--border: #E1E8ED`, `--text: #0F2338`, `--text-dim: #566B7D`, `--accent: #0F6E92`, `--accent-wash: #E1F1F8`, `--accent-text: #0A4A63`, `--on-accent: #FFFFFF`, `--success: #1E7A4D`, `--warning: #9A6200`, `--danger: #B4362C`.
- **Dark theme tokens** (exact values): `--bg: #0B1826`, `--surface: #13293D`, `--surface2: #1B3550`, `--border: #24435E`, `--text: #E8F1F7`, `--text-dim: #8FA8BC`, `--accent: #4FC3E8`, `--accent-wash: #0F3448`, `--accent-text: #9FD8EC`, `--on-accent: #0F2338`, `--success: #4FBE86`, `--warning: #E3A44A`, `--danger: #F08B80`.
- `--radius: 12px` stays in both themes, unchanged.
- **Brand constants:** night navy `#0F2338`, ice `#4FC3E8`, deep ice `#0F6E92`, frost `#E8F1F7`.
- **Every text-on-background pair ships at 4.5:1 or better.** No exceptions, no "it's decorative".
- **No colour literals** in `index.html` outside the two token blocks, except the documented exceptions in `ALLOWED_LITERALS` (Task 4's test): Google's brand hues and button chrome, the two theme-color pins a `<meta>` cannot express as a variable, and theme-neutral `#000`/`#fff`/`rgba(0,0,0,a)` structure. White alpha washes are not exempt — they disappear on a light surface.
- **No colour gradients.** Alpha-only scrims over video (`rgba(0,0,0,…)` to `transparent`) are allowed; anything carrying a brand hue is not.
- **Ice is for measurement** (progress bars, the radar chart, data readouts). **Amber is for encouragement and caution** (streaks, warnings). Never swap them.
- **The mark:** detailed cut at 24px and above, simplified cut below 24px. Frost on navy, navy on white or ice. Never recoloured, outlined, rotated or stretched.
- **Tests run with** `node --test <file>`; CommonJS (`require`), `node:test` and `node:assert`, matching `ai/scan-core.test.js`.
- **Never push.** Commit locally; Milo pushes.
- Chrome for rasterising is resolved at run time: `CHROME_PATH` if set, else the usual macOS and Linux install locations. Never hardcode one absolute path — regenerating the icons on another machine is the point of the script.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `tools/brand.js` | Pure functions: contrast maths, token parsing, literal and gradient counting, PNG header reading. No I/O beyond reading files it is handed. |
| `tools/brand.test.js` | Tests for the above, plus the repo-wide gates (token parity, contrast, literal budget, asset inventory). |
| `tools/render-icons.js` | Generates every raster icon from the SVG masters via headless Chrome. |
| `favicon.svg`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `og-image.png` | Web and PWA icons, served from the repo root |

**Modified:** `index.html` (tokens, theme switching, three inline logos, `generateIcon()` removal, 247 colour literals), `manifest.json`, `capacitor.config.json`, `sw.js`, `build.sh`, the iOS asset catalogue and `LaunchScreen.storyboard`, the Android mipmaps, splash drawables, `ic_launcher_background.xml` and `mipmap-anydpi-v26/ic_launcher.xml`.

**Deleted:** `icon-192.svg`, `icon-512.svg` (the old mark), and the same two files under `www/`.

---

### Task 1: Brand toolkit

**Files:**
- Create: `tools/brand.js`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `contrastRatio(hexA, hexB) → number`, `luminance(hex) → number`, `parseThemes(html) → {light: Record<string,string>, dark: Record<string,string>}`, `colourLiterals(html, allowlist) → string[]`, `colourGradients(html) → string[]`, `pngInfo(buffer) → {width, height, colourType}`.

- [ ] **Step 1: Write the failing test**

Create `tools/brand.test.js`:

```js
// node --test tools/brand.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { contrastRatio, parseThemes, colourLiterals, colourGradients, pngInfo } = require('./brand.js');

test('contrast ratio matches known WCAG values', () => {
  assert.strictEqual(Math.round(contrastRatio('#FFFFFF', '#000000')), 21);
  assert.strictEqual(Math.round(contrastRatio('#FFFFFF', '#FFFFFF')), 1);
  // the old primary button: white on sky-400, the failure that started this work
  assert.ok(contrastRatio('#FFFFFF', '#38bdf8') < 2.2);
  // the new light accent with white on it
  assert.ok(contrastRatio('#FFFFFF', '#0F6E92') > 4.5);
});

test('contrast is symmetric and case-insensitive', () => {
  assert.strictEqual(contrastRatio('#0F6E92', '#ffffff'), contrastRatio('#FFFFFF', '#0f6e92'));
});

test('parseThemes reads both token blocks', () => {
  const html = `<style>
    :root { --bg: #F5F8FA; --text: #0F2338; --radius: 12px; }
    :root[data-theme="dark"] { --bg: #0B1826; --text: #E8F1F7; --radius: 12px; }
  </style>`;
  const themes = parseThemes(html);
  assert.strictEqual(themes.light['--bg'], '#F5F8FA');
  assert.strictEqual(themes.dark['--text'], '#E8F1F7');
});

test('colourLiterals finds colours outside the token blocks and honours the allowlist', () => {
  const html = `<style>
    :root { --bg: #F5F8FA; }
    :root[data-theme="dark"] { --bg: #0B1826; }
    .a { color: #ff0000; background: rgba(1,2,3,0.5); border-color: #4285f4; }
  </style>`;
  const found = colourLiterals(html, ['#4285f4']);
  assert.deepStrictEqual(found.sort(), ['#ff0000', 'rgba(1,2,3,0.5)'].sort());
});

test('colourLiterals ignores emoji HTML entities', () => {
  assert.deepStrictEqual(colourLiterals('<div>&#127954; &#128260;</div>', []), []);
});

test('colourGradients flags brand-coloured gradients but allows alpha scrims', () => {
  const html = `.a{background:linear-gradient(135deg,var(--accent),var(--accent2))}
                .b{background:linear-gradient(to top,rgba(0,0,0,0.7),transparent)}`;
  const found = colourGradients(html);
  assert.strictEqual(found.length, 1);
  assert.match(found[0], /var\(--accent\)/);
});

test('pngInfo reads dimensions and colour type from the IHDR chunk', () => {
  // 1x1 opaque red PNG, colour type 2 (RGB, no alpha)
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
    'base64');
  const info = pngInfo(png);
  assert.strictEqual(info.width, 1);
  assert.strictEqual(info.height, 1);
  assert.strictEqual(typeof info.colourType, 'number');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — `Cannot find module './brand.js'`

- [ ] **Step 3: Write the implementation**

Create `tools/brand.js`:

```js
'use strict';

const HEX = /(?<![&\w])#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g;
const RGBA = /\brgba?\([^)]*\)/g;
const GRADIENT = /(?:linear|radial|conic)-gradient\((?:[^()]|\([^()]*\))*\)/g;

function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(String(hex).trim());
  if (!m) throw new Error(`not a hex colour: ${hex}`);
  const full = m[1].length === 3 ? m[1].split('').map(c => c + c).join('') : m[1];
  const n = parseInt(full, 16);
  const r = srgbToLinear((n >> 16) & 255);
  const g = srgbToLinear((n >> 8) & 255);
  const b = srgbToLinear(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function blockAfter(html, selector) {
  // Whitespace-tolerant: index.html writes most rules compact (`.x{…}`), so the
  // token blocks must be found whether or not they carry a space before the brace.
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = new RegExp(escaped + '\\s*\\{').exec(html);
  if (!m) return '';
  const open = m.index + m[0].length - 1;
  const close = html.indexOf('}', open);
  if (close === -1) return '';
  return html.slice(open + 1, close);
}

function parseTokens(block) {
  const out = {};
  for (const m of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}

function parseThemes(html) {
  return {
    light: parseTokens(blockAfter(html, ':root')),
    dark: parseTokens(blockAfter(html, ':root[data-theme="dark"]')),
  };
}

function stripTokenBlocks(html) {
  let out = html;
  for (const selector of [':root', ':root[data-theme="dark"]']) {
    const block = blockAfter(out, selector);
    if (block) out = out.replace(block, '');
  }
  return out;
}

function colourLiterals(html, allowlist = []) {
  const allowed = new Set(allowlist.map(a => a.toLowerCase()));
  const body = stripTokenBlocks(html);
  const found = [...(body.match(HEX) || []), ...(body.match(RGBA) || [])];
  return found.filter(v => !allowed.has(v.toLowerCase()));
}

function colourGradients(html) {
  return (html.match(GRADIENT) || []).filter(g => /var\(--|#[0-9a-fA-F]{3,6}\b/.test(g));
}

function pngInfo(buffer) {
  if (buffer.length < 26 || buffer.readUInt32BE(0) !== 0x89504e47) {
    throw new Error('not a PNG');
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colourType: buffer[25],
    hasAlpha: buffer[25] === 4 || buffer[25] === 6,
  };
}

module.exports = {
  luminance, contrastRatio, parseThemes, colourLiterals, colourGradients, pngInfo,
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add tools/brand.js tools/brand.test.js
git commit -m "Add brand toolkit: contrast maths, token parsing, colour linting"
```

---

### Task 2: Token system and theme switching

**Files:**
- Modify: `index.html` — the `:root` block (search for `--bg: #0b1120`), the `<meta name="theme-color">` tag (line ~9), and a new inline script in `<head>`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: `parseThemes`, `contrastRatio` from Task 1.
- Produces: `index.html` with `:root` (light) and `:root[data-theme="dark"]` token blocks, a `data-theme` attribute set on `<html>` before first paint, and `window.setTheme(mode)` where mode is `'light' | 'dark' | 'system'`.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
const fs = require('node:fs');
const path = require('node:path');
const INDEX = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const TOKENS = [
  '--bg', '--surface', '--surface2', '--border', '--text', '--text-dim',
  '--accent', '--accent-wash', '--accent-text', '--on-accent',
  '--success', '--warning', '--danger', '--radius',
];

test('both themes define exactly the same token names', () => {
  const { light, dark } = parseThemes(INDEX);
  assert.deepStrictEqual(Object.keys(light).sort(), TOKENS.slice().sort());
  assert.deepStrictEqual(Object.keys(dark).sort(), TOKENS.slice().sort());
});

test('every text-on-background pair passes WCAG AA in both themes', () => {
  const themes = parseThemes(INDEX);
  const pairs = [
    ['--text', '--bg'], ['--text', '--surface'], ['--text', '--surface2'],
    ['--text-dim', '--bg'], ['--text-dim', '--surface'],
    ['--on-accent', '--accent'], ['--accent-text', '--accent-wash'],
    ['--success', '--bg'], ['--warning', '--bg'], ['--danger', '--bg'],
    ['--success', '--surface'], ['--warning', '--surface'], ['--danger', '--surface'],
  ];
  for (const [name, theme] of Object.entries(themes)) {
    for (const [fg, bg] of pairs) {
      const ratio = contrastRatio(theme[fg], theme[bg]);
      assert.ok(ratio >= 4.5,
        `${name}: ${fg} (${theme[fg]}) on ${bg} (${theme[bg]}) is ${ratio.toFixed(2)}:1, needs 4.5`);
    }
  }
});

test('the theme is applied before first paint and can be overridden', () => {
  assert.match(INDEX, /document\.documentElement\.dataset\.theme/);
  assert.match(INDEX, /rinkbuddy_theme/);
  assert.match(INDEX, /prefers-color-scheme:\s*dark/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — the light theme has the old token names (`--accent2`, `--accent3`) and there is no dark block, so the first assertion fails on key mismatch.

- [ ] **Step 3: Replace the token block**

In `index.html`, replace the whole `:root { … }` block (the one containing `--bg: #0b1120`) with:

```css
    :root {
      --bg: #F5F8FA; --surface: #FFFFFF; --surface2: #EDF2F6; --border: #E1E8ED;
      --text: #0F2338; --text-dim: #566B7D;
      --accent: #0F6E92; --accent-wash: #E1F1F8; --accent-text: #0A4A63; --on-accent: #FFFFFF;
      --success: #1E7A4D; --warning: #9A6200; --danger: #B4362C;
      --radius: 12px;
    }
    :root[data-theme="dark"] {
      --bg: #0B1826; --surface: #13293D; --surface2: #1B3550; --border: #24435E;
      --text: #E8F1F7; --text-dim: #8FA8BC;
      --accent: #4FC3E8; --accent-wash: #0F3448; --accent-text: #9FD8EC; --on-accent: #0F2338;
      --success: #4FBE86; --warning: #E3A44A; --danger: #F08B80;
      --radius: 12px;
    }
```

- [ ] **Step 4: Apply the theme before first paint**

Replace the single `<meta name="theme-color" content="#0b1120">` line with:

```html
  <meta name="theme-color" content="#F5F8FA">
  <script>
    (function () {
      var stored = null;
      try { stored = localStorage.getItem('rinkbuddy_theme'); } catch (e) {}
      var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var mode = (stored === 'light' || stored === 'dark') ? stored : system;
      document.documentElement.dataset.theme = mode;
      window.setTheme = function (choice) {
        try {
          if (choice === 'system') localStorage.removeItem('rinkbuddy_theme');
          else localStorage.setItem('rinkbuddy_theme', choice);
        } catch (e) {}
        var next = (choice === 'light' || choice === 'dark')
          ? choice
          : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.dataset.theme = next;
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', next === 'dark' ? '#0B1826' : '#F5F8FA');
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        var saved = null;
        try { saved = localStorage.getItem('rinkbuddy_theme'); } catch (e) {}
        if (!saved) window.setTheme('system');
      });
      if (mode === 'dark') {
        document.addEventListener('DOMContentLoaded', function () {
          var meta = document.querySelector('meta[name="theme-color"]');
          if (meta) meta.setAttribute('content', '#0B1826');
        });
      }
    })();
  </script>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS. If a contrast assertion fails, the token value is wrong — fix the token, never the threshold.

- [ ] **Step 6: Commit**

```bash
git add index.html tools/brand.test.js
git commit -m "Replace the colour tokens with light and dark theme sets"
```

---

### Task 3: Theme toggle in the app header

**Files:**
- Modify: `index.html` — the `.header-right` block (search for `id="streakBadge"`), and the `.btn-secondary` styles if needed
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: `window.setTheme` from Task 2.
- Produces: a `#themeToggle` button in the app header calling `toggleTheme()`.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
test('the app header has a theme toggle wired to setTheme', () => {
  assert.match(INDEX, /id="themeToggle"/);
  assert.match(INDEX, /function toggleTheme\(\)/);
  assert.match(INDEX, /window\.setTheme\((?:'|")(?:light|dark)(?:'|")\)|setTheme\(next\)/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — no `id="themeToggle"` in the file.

- [ ] **Step 3: Add the button**

In the `<div class="header-right">` block, immediately before the cloud button, insert:

```html
    <button class="btn btn-sm btn-secondary" onclick="toggleTheme()" id="themeToggle" style="padding:5px;width:32px;height:32px;display:flex;align-items:center;justify-content:center" title="Switch light or dark" aria-label="Switch light or dark">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    </button>
```

- [ ] **Step 4: Add the handler**

Next to the other UI helpers in the app script (near `function doLogout()`), add:

```js
function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  window.setTheme(next);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 6: Check it by eye in both themes**

Start the server (`npm start`), open `http://localhost:8080`, click the toggle, confirm the page switches and the choice survives a reload.

- [ ] **Step 7: Commit**

```bash
git add index.html tools/brand.test.js
git commit -m "Add a light and dark toggle to the app header"
```

---

### Task 4: Migrate the stylesheet colours (91 literals in the style block)

**Files:**
- Modify: `index.html` — the `<style>` block, from `*{margin:0` down to the end of the landing-page CSS
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: `colourLiterals`, `colourGradients` from Task 1; the tokens from Task 2.
- Produces: a stylesheet whose colours all resolve to tokens. Later tasks lower the same budget.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
// Documented exceptions, each for a structural reason, not convenience:
//   Google's four brand hues and its button chrome — Google's guidelines require them
//   #F5F8FA / #0B1826 — the theme-color <meta> cannot reference a CSS variable, and
//     setTheme must write a literal into it
//   #000 / #fff and rgba(0,0,0,a) — theme-neutral structure: video letterbox, scrims,
//     shadows. White alpha washes are NOT exempt: they vanish on a light surface.
const ALLOWED_LITERALS = [
  '#4285f4', '#34a853', '#fbbc05', '#ea4335',
  '#333', '#ddd', '#f5f5f5', '#bbb',
  '#F5F8FA', '#0B1826',
  '#000', '#fff',
];
const BLACK_ALPHA = /^rgba?\(\s*0\s*,\s*0\s*,\s*0\b/i;
const remainingLiterals = () =>
  colourLiterals(INDEX, ALLOWED_LITERALS).filter(v => !BLACK_ALPHA.test(v));

// Ratchet: this number only ever goes down. Task 4 → 119, Task 5 → 49, Task 6 → 0.
const MAX_LITERALS = 119;

test(`index.html carries at most ${MAX_LITERALS} colour literals`, () => {
  const found = remainingLiterals();
  assert.ok(found.length <= MAX_LITERALS,
    `${found.length} literals left, budget is ${MAX_LITERALS}. First ten: ${found.slice(0, 10).join(', ')}`);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — about 218 literals against a budget of 119.

- [ ] **Step 3: Migrate the stylesheet**

Work top to bottom through the `<style>` block. For each colour:

| Old | New |
|---|---|
| `#0b1120`, `#0f172a`, `#1e1b4b` (page backgrounds) | `var(--bg)` |
| `#131b2e` (cards) | `var(--surface)` |
| `#1a2540` (raised) | `var(--surface2)` |
| `#1e3a5f` (borders) | `var(--border)` |
| `#e2e8f0` (body text) | `var(--text)` |
| `#94a3b8` (secondary text) | `var(--text-dim)` |
| `#38bdf8`, `#0ea5e9`, `#818cf8`, `#6366f1`, `#8b5cf6`, `#a78bfa` (accent family) | `var(--accent)` |
| `#f472b6`, `#ec4899` (pink accent) | `var(--accent)` for emphasis, or `var(--warning)` where it marks a paid tier |
| `#34d399`, `#10b981`, `#22c55e` | `var(--success)` |
| `#fbbf24`, `#f59e0b` | `var(--warning)` |
| `#f87171`, `#ef4444` | `var(--danger)` |
| `rgba(56,189,248,α)` and other accent tints | `color-mix(in srgb, var(--accent) N%, transparent)` where N = α×100 |
| `rgba(255,255,255,α)` used as a surface tint | `var(--surface2)` or a `color-mix` on `--text` |
| `rgba(0,0,0,α)` over video only | leave as is |
| `#fff` as text on a coloured fill | `var(--on-accent)` |

Rules while migrating:

- Delete every `linear-gradient` that carries a brand colour; use the flat token instead. `.btn-primary` becomes `background:var(--accent);color:var(--on-accent)`.
- Delete all seven `-webkit-background-clip:text` treatments (`.logo`, `.stat-value`, `.processing-title`, `.lp-nav-logo`, `.lp-hero h1`, `.lp-hero-stat-value`, `.lp-price-amount`) and give each `color:var(--text)` or `color:var(--accent)`.
- `.btn-google` keeps Google's colours and its white background — it is Google's brand, and their guidelines require it.
- After each screen's worth of edits, reload the page in both themes and look at it. A token swap that compiles can still be wrong.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS at 119 or fewer literals. The `<style>` block itself should reach zero non-exempt literals; the remainder lives in markup and scripts, which Tasks 5 and 6 own.

- [ ] **Step 5: Look at every screen in both themes**

With `npm start` running, check Home, Skills and Video in light and in dark. Fix anything unreadable by changing which token is used, never by adding a literal.

- [ ] **Step 6: Commit**

```bash
git add index.html tools/brand.test.js
git commit -m "Move the stylesheet onto colour tokens and drop the gradients"
```

---

### Task 5: Migrate the landing-page markup (70 literals)

**Files:**
- Modify: `index.html` — inline `style="…"` attributes inside `<div id="landingPage">`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: the tokens from Task 2.
- Produces: landing markup free of colour literals.

- [ ] **Step 1: Lower the budget**

In `tools/brand.test.js`, change `const MAX_LITERALS = 119;` to `const MAX_LITERALS = 49;`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL at about 119 against a budget of 49.

- [ ] **Step 3: Migrate the inline styles**

Replace each inline colour in the landing markup with the matching token, using the same mapping table as Task 4. Two that need judgement:

- The Sign Up button (`background:#fff;color:#0b1120`) becomes `background:var(--accent);color:var(--on-accent)` and drops its white box-shadow.
- The hero background image sits at `opacity:0.08` with a mask; leave the image, but check it in light mode — if it muddies the text, drop the opacity to `0.05`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS at 49 or fewer.

- [ ] **Step 5: Commit**

```bash
git add index.html tools/brand.test.js
git commit -m "Move the landing page markup onto colour tokens"
```

---

### Task 6: Migrate the app markup and script colours (49 literals)

**Files:**
- Modify: `index.html` — inline styles in the app markup, and colours set from JavaScript (search for `.style.color`, `.style.background`, `fillStyle`, `strokeStyle`)
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: the tokens from Task 2.
- Produces: zero colour literals outside the token blocks and the Google allowlist.

- [ ] **Step 1: Lower the budget to zero**

In `tools/brand.test.js`, change the budget line to `const MAX_LITERALS = 0;` and add:

```js
test('no brand-coloured gradients remain', () => {
  const found = colourGradients(INDEX);
  assert.deepStrictEqual(found, [], `gradients left: ${found.slice(0, 5).join(' | ')}`);
});

test('no gradient text remains', () => {
  assert.doesNotMatch(INDEX, /background-clip:\s*text/);
});

// The hex/rgba lint cannot see CSS named colours. `stroke="white"` on an icon is
// invisible on a light surface just as surely as #fff is, and measured 2.0-2.3:1 in
// dark theme where Task 5 found them.
const NAMED_COLOUR = /(stroke|fill|color|background(?:-color)?)\s*[:=]\s*["']?\s*(white|black|red|blue|green|yellow|orange|purple|pink|gray|grey|silver|gold|navy|teal|cyan|magenta|lime|maroon|olive|aqua|fuchsia)\b/gi;

test('no CSS named colours are used for colour-bearing properties', () => {
  const found = [...INDEX.matchAll(NAMED_COLOUR)].map(m => `${m[1]}=${m[2]}`);
  assert.deepStrictEqual(found, [],
    `named colours left: ${found.slice(0, 10).join(', ')}`);
});
```

Note: `transparent`, `currentColor`, `none` and `inherit` are not colours in this sense and are not matched.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL on all four: about 49 literals, some gradients, some gradient text, and nine named colours (seven `color=white`, one `stroke=white`, one `fill=red`).

- [ ] **Step 3: Migrate the remaining markup and script colours**

The nine named colours go the same way as the literals: `white` used as text or an icon on an accent fill becomes `var(--on-accent)`; `white` on a surface becomes `var(--text)`; `red` becomes `var(--danger)`.

The canvas drawings need live token values rather than hard-coded ones. Add this helper next to the chart code and use it for every `fillStyle` and `strokeStyle`:

```js
function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
```

Then, for example, `ctx.strokeStyle = '#38bdf8'` becomes `ctx.strokeStyle = token('--accent')`.

The radar chart must also be redrawn when the theme changes, or it keeps the old theme's colours. In `window.setTheme`, after setting `dataset.theme`, add:

```js
        if (typeof drawRadarChart === 'function') requestAnimationFrame(drawRadarChart);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tools/brand.test.js`
Expected: PASS on all tests, zero literals.

- [ ] **Step 5: Check the radar chart in both themes**

With `npm start` running, open Home, toggle the theme, confirm the radar chart redraws in the new colours rather than keeping the old ones.

- [ ] **Step 6: Commit**

```bash
git add index.html tools/brand.test.js
git commit -m "Move the app markup and canvas drawing onto colour tokens"
```

---

### Task 7: Generate the web and PWA icons

**Files:**
- Create: `tools/render-icons.js`, and its outputs `favicon.svg`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `og-image.png`
- Delete: `icon-192.svg`, `icon-512.svg`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: `brand/rinkbuddy-skate.svg`, `brand/rinkbuddy-skate-simple.svg`, `pngInfo` from Task 1.
- Produces: `node tools/render-icons.js web` writes the eight web assets listed above.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
const REPO = path.join(__dirname, '..');
const WEB_ICONS = [
  ['favicon-32.png', 32, 32],
  ['favicon-16.png', 16, 16],
  ['apple-touch-icon-180.png', 180, 180],
  ['icon-192.png', 192, 192],
  ['icon-512.png', 512, 512],
  ['icon-maskable-512.png', 512, 512],
  ['og-image.png', 1200, 630],
];

test('every web icon exists at its exact size', () => {
  for (const [file, w, h] of WEB_ICONS) {
    const full = path.join(REPO, file);
    assert.ok(fs.existsSync(full), `missing ${file}`);
    const info = pngInfo(fs.readFileSync(full));
    assert.strictEqual(info.width, w, `${file} width`);
    assert.strictEqual(info.height, h, `${file} height`);
  }
});

test('favicon.svg exists and the old mark is gone', () => {
  assert.ok(fs.existsSync(path.join(REPO, 'favicon.svg')));
  assert.ok(!fs.existsSync(path.join(REPO, 'icon-192.svg')), 'old icon-192.svg still present');
  assert.ok(!fs.existsSync(path.join(REPO, 'icon-512.svg')), 'old icon-512.svg still present');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — `missing favicon-32.png`.

- [ ] **Step 3: Write the renderer**

Create `tools/render-icons.js`:

```js
'use strict';
// Rasterises the brand SVGs into every icon the app ships.
//   node tools/render-icons.js web       → web and PWA icons
//   node tools/render-icons.js ios       → iOS icon and splashes
//   node tools/render-icons.js android   → Android icons and splashes
//   node tools/render-icons.js all

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Resolved lazily so importing this file never throws, and overridable because the
// whole point of generating icons from a script is that anyone can regenerate them.
let chromePath = null;
function chrome() {
  if (chromePath) return chromePath;
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  chromePath = candidates.find(c => fs.existsSync(c));
  if (!chromePath) {
    throw new Error(
      'Chrome or Chromium not found, so the icons cannot be rendered.\n' +
      'Set CHROME_PATH to the binary. Tried:\n  ' + candidates.join('\n  '));
  }
  return chromePath;
}
const REPO = path.join(__dirname, '..');
const BRAND = path.join(REPO, 'brand');
const NAVY = '#0F2338';

// Renders one square or rectangular PNG: a background, with a mark centred on it.
function render({ out, width, height, background, mark, markScale, transparent = false }) {
  const svg = fs.readFileSync(path.join(BRAND, mark), 'utf8');
  const markPx = Math.round(Math.min(width, height) * markScale);
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden}
    body{background:${transparent ? 'transparent' : background};display:flex;align-items:center;justify-content:center}
    svg{width:${markPx}px;height:${markPx}px;display:block}
  </style></head><body>${svg}</body></html>`;

  const tmp = path.join(os.tmpdir(), `rb-icon-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
  fs.writeFileSync(tmp, html);
  const args = [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    `--screenshot=${path.join(REPO, out)}`, `--window-size=${width},${height}`,
    '--virtual-time-budget=4000',
  ];
  if (transparent) args.push('--default-background-color=00000000');
  args.push(tmp);
  execFileSync(chrome(), args, { stdio: 'ignore' });
  fs.unlinkSync(tmp);
  console.log(`wrote ${out} (${width}x${height})`);
}

const WEB = [
  { out: 'favicon-32.png', width: 32, height: 32, background: NAVY, mark: 'rinkbuddy-skate-simple.svg', markScale: 0.82 },
  { out: 'favicon-16.png', width: 16, height: 16, background: NAVY, mark: 'rinkbuddy-skate-simple.svg', markScale: 0.86 },
  { out: 'apple-touch-icon-180.png', width: 180, height: 180, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.78 },
  { out: 'icon-192.png', width: 192, height: 192, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.78 },
  { out: 'icon-512.png', width: 512, height: 512, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.78 },
  // Maskable: Android crops to a circle, so the mark sits inside the 80% safe zone.
  { out: 'icon-maskable-512.png', width: 512, height: 512, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.58 },
  { out: 'og-image.png', width: 1200, height: 630, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.42 },
];

function web() {
  for (const job of WEB) render(job);
  // favicon.svg is the master, copied rather than rasterised
  fs.copyFileSync(path.join(BRAND, 'rinkbuddy-skate-simple.svg'), path.join(REPO, 'favicon.svg'));
  console.log('wrote favicon.svg');
}

const TARGETS = { web };

const target = process.argv[2] || 'all';
if (target === 'all') Object.values(TARGETS).forEach(fn => fn());
else if (TARGETS[target]) TARGETS[target]();
else {
  console.error(`unknown target: ${target}. Use one of: ${Object.keys(TARGETS).join(', ')}, all`);
  process.exit(1);
}
```

- [ ] **Step 4: Generate the icons and delete the old ones**

```bash
node tools/render-icons.js web
rm -f icon-192.svg icon-512.svg www/icon-192.svg www/icon-512.svg
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 6: Look at the icons**

Open `favicon-16.png` and `favicon-32.png` and check the skate still reads at that size. If it turns to mush, raise `markScale` — do not switch to the detailed cut.

- [ ] **Step 7: Commit**

```bash
git add tools/render-icons.js favicon.svg favicon-32.png favicon-16.png apple-touch-icon-180.png icon-192.png icon-512.png icon-maskable-512.png og-image.png tools/brand.test.js
git add -u icon-192.svg icon-512.svg www/icon-192.svg www/icon-512.svg
git commit -m "Generate the web and PWA icons from the new mark"
```

---

### Task 8: Put the mark in the page

**Files:**
- Modify: `index.html` — the `<head>` links, the landing nav logo (search for `class="lp-nav-logo"`), the app header logo (search for `<div class="logo">`), and `generateIcon` (search for `function generateIcon`)
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: the icon files from Task 7.
- Produces: one inline mark used in both headers; no runtime icon generation.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
test('the runtime icon generator is gone', () => {
  assert.doesNotMatch(INDEX, /function generateIcon/);
  assert.doesNotMatch(INDEX, /toDataURL\('image\/png'\)/);
});

test('the head points at the new icons', () => {
  assert.match(INDEX, /<link rel="icon" type="image\/svg\+xml" href="favicon\.svg">/);
  assert.match(INDEX, /<link rel="apple-touch-icon" href="apple-touch-icon-180\.png">/);
  assert.doesNotMatch(INDEX, /icon-192\.svg/);
});

test('both headers use the same mark', () => {
  const marks = INDEX.match(/<svg[^>]*class="rb-mark"/g) || [];
  assert.strictEqual(marks.length, 2, 'expected the mark in the landing nav and the app header');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — `generateIcon` is still there.

- [ ] **Step 3: Replace the head links**

Replace `<link rel="apple-touch-icon" href="icon-192.svg">` with:

```html
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
  <link rel="apple-touch-icon" href="apple-touch-icon-180.png">
  <meta property="og:image" content="https://www.rinkbuddy.com/og-image.png">
  <meta property="og:title" content="RinkBuddy — feedback between lessons">
  <meta name="twitter:card" content="summary_large_image">
```

- [ ] **Step 4: Swap both logos**

Take the contents of `brand/rinkbuddy-skate-navy.svg`, add `class="rb-mark"` to its `<svg>` tag, and use it in place of the existing `<svg>` inside `<a href="#" class="lp-nav-logo">`. Do the same inside `<div class="logo">`.

Then make the mark follow the theme — add to the stylesheet:

```css
    .rb-mark{width:28px;height:28px;flex:none}
    .rb-mark [data-part="skate"]{fill:var(--text)}
```

and remove the hard-coded `fill` attribute from the copied `<g data-part="skate">` tag so the rule applies.

- [ ] **Step 5: Delete the runtime icon generator**

Remove the whole `function generateIcon(size) { … }` block and the `[192, 512].forEach(…)` loop that follows it.

- [ ] **Step 6: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 7: Check the tab icon**

Reload `http://localhost:8080` with a hard refresh and confirm the browser tab shows the skate, and both headers show it in the right colour in both themes.

- [ ] **Step 8: Commit**

```bash
git add index.html tools/brand.test.js
git commit -m "Use the new mark in both headers and stop generating icons at runtime"
```

---

### Task 9: Manifest, Capacitor config and service worker

**Files:**
- Modify: `manifest.json`, `capacitor.config.json`, `sw.js`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: the icon files from Task 7.
- Produces: a manifest whose icons all exist on disk.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
test('the manifest uses the new icons and brand colours', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO, 'manifest.json'), 'utf8'));
  assert.strictEqual(manifest.background_color, '#0F2338');
  assert.strictEqual(manifest.theme_color, '#0F2338');
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(REPO, icon.src)), `manifest lists a missing icon: ${icon.src}`);
  }
  assert.ok(manifest.icons.some(i => i.purpose === 'maskable'), 'no maskable icon');
});

test('the service worker caches the icons it serves offline', () => {
  const sw = fs.readFileSync(path.join(REPO, 'sw.js'), 'utf8');
  assert.match(sw, /icon-192\.png/);
  assert.match(sw, /rinkbuddy-v2/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — `background_color` is still `#0b1120`.

- [ ] **Step 3: Rewrite manifest.json**

```json
{
  "name": "RinkBuddy — Skating Performance Analyzer",
  "short_name": "RinkBuddy",
  "description": "Track your skating skills, analyze videos, and improve your performance",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#0F2338",
  "theme_color": "#0F2338",
  "orientation": "any",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

- [ ] **Step 4: Update the Capacitor background colours**

In `capacitor.config.json`, change `ios.backgroundColor` and `android.backgroundColor` from `#0b1120` to `#0F2338`.

- [ ] **Step 5: Bump the service worker cache**

In `sw.js`, change the first two lines to:

```js
const CACHE = 'rinkbuddy-v2';
const ASSETS = ['/index.html', '/manifest.json', '/favicon.svg', '/icon-192.png', '/icon-512.png'];
```

The version bump matters: without it, returning users keep the old cached shell.

- [ ] **Step 6: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add manifest.json capacitor.config.json sw.js tools/brand.test.js
git commit -m "Point the manifest, Capacitor config and service worker at the new icons"
```

---

### Task 10: iOS icon and splash

**Files:**
- Modify: `tools/render-icons.js` (add the `ios` target), `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`, the three files in `ios/App/App/Assets.xcassets/Splash.imageset/`, `ios/App/App/Base.lproj/LaunchScreen.storyboard`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: `render()` from Task 7.
- Produces: `node tools/render-icons.js ios`.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
test('the iOS app icon is 1024 square with no alpha channel', () => {
  const file = path.join(REPO, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
  const info = pngInfo(fs.readFileSync(file));
  assert.strictEqual(info.width, 1024);
  assert.strictEqual(info.height, 1024);
  assert.strictEqual(info.hasAlpha, false, 'App Store rejects icons with an alpha channel');
});

test('the iOS splash images are 2732 square', () => {
  for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
    const info = pngInfo(fs.readFileSync(path.join(REPO, 'ios/App/App/Assets.xcassets/Splash.imageset', name)));
    assert.strictEqual(info.width, 2732, name);
    assert.strictEqual(info.height, 2732, name);
  }
});

test('the iOS launch screen uses the brand navy', () => {
  const storyboard = fs.readFileSync(path.join(REPO, 'ios/App/App/Base.lproj/LaunchScreen.storyboard'), 'utf8');
  assert.match(storyboard, /red="0\.058/, 'launch screen background is not navy #0F2338');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — the current icon is Capacitor's, and the launch screen is white.

- [ ] **Step 3: Add the iOS target to the renderer**

In `tools/render-icons.js`, add above `const TARGETS`:

```js
const IOS = 'ios/App/App/Assets.xcassets';

function ios() {
  render({ out: `${IOS}/AppIcon.appiconset/AppIcon-512@2x.png`, width: 1024, height: 1024, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.78 });
  for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
    render({ out: `${IOS}/Splash.imageset/${name}`, width: 2732, height: 2732, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.26 });
  }
}
```

and add `ios` to the `TARGETS` object: `const TARGETS = { web, ios };`

- [ ] **Step 4: Generate the iOS assets**

```bash
node tools/render-icons.js ios
```

Headless Chrome writes RGB PNGs with no alpha when the background is opaque, which is what the App Store requires.

- [ ] **Step 5: Set the launch screen colour**

In `ios/App/App/Base.lproj/LaunchScreen.storyboard`, replace the `systemBackgroundColor` definition:

```xml
        <systemColor name="systemBackgroundColor">
            <color red="0.058823529411764705" green="0.13725490196078433" blue="0.2196078431372549" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
        </systemColor>
```

Those three values are `#0F2338` as sRGB fractions (15/255, 35/255, 56/255).

- [ ] **Step 6: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add tools/render-icons.js ios tools/brand.test.js
git commit -m "Replace the iOS icon and splash with the new mark"
```

---

### Task 11: Android icons and splash

**Files:**
- Modify: `tools/render-icons.js` (add the `android` target), the five `mipmap-*` directories, the eleven `drawable*/splash.png` files, `android/app/src/main/res/values/ic_launcher_background.xml`, `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- Create: `ic_launcher_monochrome.png` in each `mipmap-*` directory (the Android 13 themed-icon layer)
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: `render()` from Task 7.
- Produces: `node tools/render-icons.js android`.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
const ANDROID_RES = path.join(REPO, 'android/app/src/main/res');
const DENSITIES = [['mdpi', 48, 108], ['hdpi', 72, 162], ['xhdpi', 96, 216], ['xxhdpi', 144, 324], ['xxxhdpi', 192, 432]];

test('every Android launcher icon exists at its density size', () => {
  for (const [density, legacy, foreground] of DENSITIES) {
    for (const name of ['ic_launcher.png', 'ic_launcher_round.png']) {
      const info = pngInfo(fs.readFileSync(path.join(ANDROID_RES, `mipmap-${density}`, name)));
      assert.strictEqual(info.width, legacy, `${density}/${name}`);
    }
    const fg = pngInfo(fs.readFileSync(path.join(ANDROID_RES, `mipmap-${density}`, 'ic_launcher_foreground.png')));
    assert.strictEqual(fg.width, foreground, `${density}/ic_launcher_foreground.png`);
    assert.strictEqual(fg.hasAlpha, true, 'the adaptive foreground must be transparent');
  }
});

test('the adaptive icon background is brand navy and a monochrome layer is declared', () => {
  const colour = fs.readFileSync(path.join(ANDROID_RES, 'values/ic_launcher_background.xml'), 'utf8');
  assert.match(colour, /#0F2338/i);
  const adaptive = fs.readFileSync(path.join(ANDROID_RES, 'mipmap-anydpi-v26/ic_launcher.xml'), 'utf8');
  assert.match(adaptive, /<monochrome/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — the background colour is `#FFFFFF` and there is no monochrome layer.

- [ ] **Step 3: Add the Android target to the renderer**

In `tools/render-icons.js`, add:

```js
const ANDROID = 'android/app/src/main/res';
const DENSITIES = [
  { name: 'mdpi', legacy: 48, foreground: 108 },
  { name: 'hdpi', legacy: 72, foreground: 162 },
  { name: 'xhdpi', legacy: 96, foreground: 216 },
  { name: 'xxhdpi', legacy: 144, foreground: 324 },
  { name: 'xxxhdpi', legacy: 192, foreground: 432 },
];
// Measured, not guessed: at 0.58 the farthest opaque pixel sat 155.6px from centre on a
// 432px canvas, past both the 132px safe radius and the 144px visible radius. Scale down
// by 132/155.6 and verify by re-measuring after rendering.
const ADAPTIVE_SCALE = 0.49;
const SPLASHES = [
  ['drawable', 480, 320], ['drawable-land-mdpi', 480, 320], ['drawable-land-hdpi', 800, 480],
  ['drawable-land-xhdpi', 1280, 720], ['drawable-land-xxhdpi', 1600, 960], ['drawable-land-xxxhdpi', 1920, 1280],
  ['drawable-port-mdpi', 320, 480], ['drawable-port-hdpi', 480, 800], ['drawable-port-xhdpi', 720, 1280],
  ['drawable-port-xxhdpi', 960, 1600], ['drawable-port-xxxhdpi', 1280, 1920],
];

function android() {
  for (const d of DENSITIES) {
    for (const name of ['ic_launcher.png', 'ic_launcher_round.png']) {
      render({ out: `${ANDROID}/mipmap-${d.name}/${name}`, width: d.legacy, height: d.legacy, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.74 });
    }
    // Adaptive foreground: transparent, and scaled so the mark's INK fits the 66dp safe
    // CIRCLE. Do not reason from the bounding box: markScale sizes the artwork's square
    // box, and a square of side 58% still pushes its diagonal corners outside a circle of
    // diameter 61%, which is how the blade's toe ended up clipped by Pixel's round mask.
    // Derive the scale from the measured ink radius: render, find the farthest opaque
    // pixel from centre, and scale until that radius is <= 132px on the 432px canvas.
    render({ out: `${ANDROID}/mipmap-${d.name}/ic_launcher_foreground.png`, width: d.foreground, height: d.foreground, background: 'transparent', mark: 'rinkbuddy-skate.svg', markScale: ADAPTIVE_SCALE, transparent: true });
    render({ out: `${ANDROID}/mipmap-${d.name}/ic_launcher_monochrome.png`, width: d.foreground, height: d.foreground, background: 'transparent', mark: 'rinkbuddy-skate.svg', markScale: ADAPTIVE_SCALE, transparent: true });
  }
  for (const [dir, w, h] of SPLASHES) {
    render({ out: `${ANDROID}/${dir}/splash.png`, width: w, height: h, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.3 });
  }
}
```

and extend the targets: `const TARGETS = { web, ios, android };`

- [ ] **Step 4: Generate the Android assets**

```bash
node tools/render-icons.js android
```

- [ ] **Step 5: Set the adaptive icon background and monochrome layer**

`android/app/src/main/res/values/ic_launcher_background.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0F2338</color>
</resources>
```

`android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml` both become:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
```

The monochrome layer is what Android 13 and later use for themed icons; without it the launcher falls back to a flat grey square.

- [ ] **Step 6: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add tools/render-icons.js android tools/brand.test.js
git commit -m "Replace the Android launcher icons and splash with the new mark"
```

---

### Task 12: Build script, sync and full verification

**Files:**
- Modify: `build.sh`
- Test: `tools/brand.test.js`

**Interfaces:**
- Consumes: everything above.
- Produces: a build that copies every new asset into `www/` before `cap sync`.

- [ ] **Step 1: Write the failing test**

Append to `tools/brand.test.js`:

```js
test('build.sh copies every web asset the app serves', () => {
  const build = fs.readFileSync(path.join(REPO, 'build.sh'), 'utf8');
  for (const [file] of WEB_ICONS) {
    assert.ok(build.includes(file), `build.sh does not copy ${file}`);
  }
  assert.ok(build.includes('favicon.svg'), 'build.sh does not copy favicon.svg');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/brand.test.js`
Expected: FAIL — `build.sh does not copy favicon-32.png`.

- [ ] **Step 3: Update build.sh**

Replace the copy block (the five `cp` lines after the "Copying web assets" echo) with:

```bash
echo "📦 Copying web assets to www/..."
cp index.html www/
cp manifest.json www/
cp sw.js www/
for asset in favicon.svg favicon-32.png favicon-16.png apple-touch-icon-180.png \
             icon-192.png icon-512.png icon-maskable-512.png og-image.png; do
  cp "$asset" www/
done
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tools/brand.test.js`
Expected: PASS.

- [ ] **Step 5: Run the whole suite**

```bash
node --test tools/brand.test.js ai/scan-core.test.js
```

Expected: everything passes. The scan-core tests must still pass — nothing in this work touches them, so a failure there means something unrelated broke.

- [ ] **Step 6: Sync the native projects**

```bash
npm run cap:sync
```

- [ ] **Step 7: Look at every screen in both themes**

With `npm start` running, walk Home, Skills, Video, the account modal, the profile modal and the landing page, in light and in dark, at phone width and desktop width. Compare against `brand-v3.png` from the design session. Anything that looks wrong is a token choice to fix, not a literal to add.

- [ ] **Step 8: Commit**

```bash
git add build.sh www ios android tools/brand.test.js
git commit -m "Copy the new brand assets into native builds and sync"
```

---

## Not in this plan

- **The hockey sibling mark.** Its trace still carries a colour halo; it needs re-running through the flatten step with the label mode filter before it can be composed.
- **The wordmark typeface.** Still the system stack; picking a face is its own small task.
- **The `com.iceedge.app` package identifier** in the Android project, which disagrees with `capacitor.config.json`. Renaming a package touches the Java source tree and the Play listing, so it deserves its own plan.
- **Retiring the speech-bubble alternates** in `brand/`. They stay as alternates until someone decides otherwise.
- **Per-theme splash screens.** The spec originally asked for light and dark splashes; this plan ships one navy treatment for both, because the splash is a brand moment rather than a UI surface and per-theme variants would double the asset count for a screen that shows for under a second. The spec has been amended to match.
