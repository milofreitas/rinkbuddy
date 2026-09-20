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

test('the app header has a theme toggle wired to setTheme', () => {
  assert.match(INDEX, /id="themeToggle"/);
  assert.match(INDEX, /function toggleTheme\(\)/);
  assert.match(INDEX, /window\.setTheme\((?:'|")(?:light|dark)(?:'|")\)|setTheme\(next\)/);
});

const GOOGLE_BRAND = ['#4285f4', '#34a853', '#fbbc05', '#ea4335'];
// Ratchet: this number only ever goes down. Task 4 → 60, Task 5 → 45, Task 6 → 0.
const MAX_LITERALS = 60;

test(`index.html carries at most ${MAX_LITERALS} colour literals`, () => {
  const found = colourLiterals(INDEX, GOOGLE_BRAND);
  assert.ok(found.length <= MAX_LITERALS,
    `${found.length} literals left, budget is ${MAX_LITERALS}. First ten: ${found.slice(0, 10).join(', ')}`);
});
