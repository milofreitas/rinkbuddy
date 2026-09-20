// node --test tools/brand.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const { contrastRatio, parseThemes, colourLiterals, colourGradients, pngInfo, stripTokenBlocks } = require('./brand.js');

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

test('colourGradients catches a brand hue nested two levels deep (color-mix(var()))', () => {
  // This exact shape (radial-gradient wrapping color-mix wrapping var()) fooled the old
  // single-nesting regex: it nests one level deeper than "(?:[^()]|\([^()]*\))*" tolerates,
  // so the whole gradient silently failed to match and passed as "clean".
  const html = `.a{background:radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 60%)}
                .b{background:linear-gradient(to top, rgba(0,0,0,0.7), transparent)}`;
  const found = colourGradients(html);
  assert.strictEqual(found.length, 1);
  assert.match(found[0], /var\(--accent\)/);
  assert.match(found[0], /^radial-gradient\(/);
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

test('blockAfter handles compact CSS with no space before brace', () => {
  const html = '<style>:root{--bg:#F5F8FA;}.x{color:#ff0000;}</style>';
  const found = colourLiterals(html, []);
  // Token colours must not leak through — only the .x rule's colour should be found
  assert.deepStrictEqual(found, ['#ff0000']);
});

test('parseThemes with compact dark theme block does not skip dark tokens', () => {
  const html = '<style>:root{--bg:#F5F8FA;}:root[data-theme="dark"]{--bg:#0B1826;}</style>';
  const themes = parseThemes(html);
  assert.strictEqual(themes.light['--bg'], '#F5F8FA');
  assert.strictEqual(themes.dark['--bg'], '#0B1826');
});

const fs = require('node:fs');
const path = require('node:path');
const INDEX = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const TOKENS = [
  '--bg', '--surface', '--surface2', '--border', '--text', '--text-dim',
  '--accent', '--accent-wash', '--accent-text', '--on-accent',
  '--success', '--warning', '--danger', '--radius',
  '--success-wash', '--success-text', '--warning-wash', '--warning-text',
  '--danger-wash', '--danger-text', '--neutral-wash', '--neutral-text',
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
    ['--success-text', '--success-wash'], ['--warning-text', '--warning-wash'],
    ['--danger-text', '--danger-wash'], ['--neutral-text', '--neutral-wash'],
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

test('the app header has a theme toggle wired to setTheme', () => {
  assert.match(INDEX, /id="themeToggle"/);
  assert.match(INDEX, /function toggleTheme\(\)/);
  assert.match(INDEX, /window\.setTheme\((?:'|")(?:light|dark)(?:'|")\)|setTheme\(next\)/);
});

// Documented exceptions, each for a structural reason, not convenience:
//   Google's four brand hues and its button chrome — Google's guidelines require them
//   #F5F8FA / #0B1826 — the theme-color <meta> cannot reference a CSS variable, and
//     setTheme must write a literal into it
//   rgba(0,0,0,a) — theme-neutral structure: video letterbox, scrims, shadows.
//     White alpha washes are NOT exempt: they vanish on a light surface.
// #000/#fff are deliberately NOT in this flat list — see whiteBlackOffenders() below.
// They are scoped to background-only, not flattened into an always-allowed value, because
// a bare "#fff is fine" entry is exactly what hid the Fix-1 bug: index.html:1417 shipped
// color:#fff on an accent background and measured 2.04:1 once dark theme's --accent went
// light blue. A value-only allowlist can't tell "background:#fff" from "color:#fff" apart;
// only checking where the literal sits in the source can.
const ALLOWED_LITERALS = [
  '#4285f4', '#34a853', '#fbbc05', '#ea4335',
  '#333', '#ddd', '#f5f5f5', '#bbb',
  '#F5F8FA', '#0B1826',
];
const BLACK_ALPHA = /^rgba?\(\s*0\s*,\s*0\s*,\s*0\b/i;

// #000/#fff are allowed only where they establish theme-neutral BACKGROUND structure
// (video letterbox, scrims) — never as a text/foreground colour, full stop.
const WHITE_BLACK_HEX = /#(?:fff(?:fff)?|000(?:000)?)\b/gi;
const AS_BACKGROUND = /background(?:-color)?\s*:\s*$/i;
// The one glyph that is legitimately white-as-a-fill rather than white-as-text: the
// play-button triangle drawn over a fixed rgba(0,0,0,0.55) scrim on a video thumbnail
// (index.html, playEvidence thumbnails). The scrim is theme-neutral by the same rule as
// the exemption above; the glyph on top of it is exempt for the identical reason. This is
// named narrowly on purpose — it is not a general licence for icon fills, only this one
// glyph sitting on this one theme-neutral scrim. Reported in the Fix-1 writeup rather than
// folded into a broader "fill is fine" rule.
const PLAY_ICON_FILL = /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.55\s*\)[\s\S]{0,200}?fill="\s*$/i;

function whiteBlackOffenders(html) {
  const body = stripTokenBlocks(html);
  const offenders = [];
  let m;
  WHITE_BLACK_HEX.lastIndex = 0;
  while ((m = WHITE_BLACK_HEX.exec(body))) {
    const before = body.slice(Math.max(0, m.index - 260), m.index);
    if (AS_BACKGROUND.test(before)) continue;
    if (PLAY_ICON_FILL.test(before)) continue;
    offenders.push(m[0]);
  }
  return offenders;
}

// #fff/#000 are excluded here and checked exclusively by whiteBlackOffenders() above,
// which knows WHERE each one sits; colourLiterals only knows what value it is, so leaving
// them in this generic pass would flag every legitimate background:#000 video placeholder
// right alongside the one that matters.
const IS_WHITE_OR_BLACK = /^#(?:fff(?:fff)?|000(?:000)?)$/i;
const remainingLiterals = () => [
  ...colourLiterals(INDEX, ALLOWED_LITERALS)
    .filter(v => !BLACK_ALPHA.test(v))
    .filter(v => !IS_WHITE_OR_BLACK.test(v)),
  ...whiteBlackOffenders(INDEX),
];

// Ratchet: this number only ever goes down. Task 4 → 119, Task 5 → 49, Task 6 → 0.
const MAX_LITERALS = 0;

test(`index.html carries at most ${MAX_LITERALS} colour literals`, () => {
  const found = remainingLiterals();
  assert.ok(found.length <= MAX_LITERALS,
    `${found.length} literals left, budget is ${MAX_LITERALS}. First ten: ${found.slice(0, 10).join(', ')}`);
});

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

// The tinted-badge bug: background: color-mix(in srgb, var(--X) N%, transparent) paired
// with color: var(--X) in the same rule (or the same inline style="" attribute). Composited
// against a real parent this lands anywhere from 3.5:1 to 4.4:1 depending on theme and
// parent — it cannot be judged correct by reading the source. Rather than compositing every
// rule against its actual DOM parent, this walks each declaration block and flags the
// pattern itself: a tint of --X standing behind text coloured --X. The fix is always the
// same shape — swap both onto an opaque --X-wash / --X-text pair (see the accent one, and
// the success/warning/danger/neutral ones added alongside it) so contrast no longer depends
// on what happens to be behind the badge.
//
// One deliberate exemption: .nav-btn.active's background is a barely-there 5% accent wash
// behind the active nav tab, not a status/label badge — it measures 5.35:1 (light) / 6.60:1
// (dark) against its real parent (--surface) and turning it into an opaque wash would make
// the active tab a solid chip, which is a bigger visual change than this pattern warrants.
const BADGE_BUG_EXEMPT = new Set(['.nav-btn.active']);

function tintedBadgeOffenders(html) {
  const offenders = [];
  const mixRe = /background(?:-color)?\s*:\s*color-mix\(in srgb,\s*var\((--[a-z0-9-]+)\)[^)]*\)/gi;
  function scan(block, label) {
    let m;
    mixRe.lastIndex = 0;
    while ((m = mixRe.exec(block))) {
      const token = m[1];
      // negative lookbehind keeps "border-color:"/"background-color:" from matching as "color:"
      const colorRe = new RegExp(`(?<![a-zA-Z-])color\\s*:\\s*var\\(${token}\\)`, 'i');
      if (colorRe.test(block)) offenders.push(`${label}: ${token}`);
    }
  }
  const styleTag = /<style>([\s\S]*?)<\/style>/.exec(html);
  if (styleTag) {
    for (const rule of styleTag[1].match(/[^{}]+\{[^{}]*\}/g) || []) {
      const selector = rule.slice(0, rule.indexOf('{')).trim();
      if (BADGE_BUG_EXEMPT.has(selector)) continue;
      scan(rule, selector);
    }
  }
  for (const m of html.matchAll(/style\s*=\s*"([^"]*)"/g)) {
    scan(m[1], 'inline style');
  }
  return offenders;
}

test('no badge-style rule pairs text colour with a color-mix of that same token as its background', () => {
  const found = tintedBadgeOffenders(INDEX);
  assert.deepStrictEqual(found, [],
    `the tinted-badge bug is back (use the matching -wash/-text token pair instead): ${found.join(', ')}`);
});

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

test('the iOS launch screen sets navy on the view itself, not just the IB design-time cache', () => {
  const storyboard = fs.readFileSync(path.join(REPO, 'ios/App/App/Base.lproj/LaunchScreen.storyboard'), 'utf8');
  // <resources><systemColor name="systemBackgroundColor"> is an Interface Builder
  // design-time preview cache. At runtime, systemColor="systemBackgroundColor" on the view
  // resolves through the dynamic UIColor.systemBackground (white in light mode, black in
  // dark) instead, ignoring that cache entirely. Asserting on the whole file — as this test
  // used to — would keep passing even if the view still pointed at the dynamic colour, as
  // long as the unused <resources> cache still had navy in it. It has to be checked on the
  // view's own element.
  const view = /<imageView key="view"[\s\S]*?<\/imageView>/.exec(storyboard);
  assert.ok(view, "could not find the launch screen's root view");
  assert.doesNotMatch(view[0], /systemColor="systemBackgroundColor"/,
    'the view still resolves its background through the dynamic UIColor.systemBackground, not a fixed navy');
  assert.match(view[0], /<color key="backgroundColor"[^>]*\bred="0\.058/,
    "the view's own backgroundColor is not navy #0F2338");
});

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

test('build.sh copies every web asset the app serves', () => {
  const build = fs.readFileSync(path.join(REPO, 'build.sh'), 'utf8');
  for (const [file] of WEB_ICONS) {
    assert.ok(build.includes(file), `build.sh does not copy ${file}`);
  }
  assert.ok(build.includes('favicon.svg'), 'build.sh does not copy favicon.svg');
});
