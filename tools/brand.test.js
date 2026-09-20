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
