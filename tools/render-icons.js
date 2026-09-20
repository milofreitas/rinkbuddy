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

const IOS = 'ios/App/App/Assets.xcassets';

function ios() {
  render({ out: `${IOS}/AppIcon.appiconset/AppIcon-512@2x.png`, width: 1024, height: 1024, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.78 });
  for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
    render({ out: `${IOS}/Splash.imageset/${name}`, width: 2732, height: 2732, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.26 });
  }
}

const ANDROID = 'android/app/src/main/res';
const DENSITIES = [
  { name: 'mdpi', legacy: 48, foreground: 108 },
  { name: 'hdpi', legacy: 72, foreground: 162 },
  { name: 'xhdpi', legacy: 96, foreground: 216 },
  { name: 'xxhdpi', legacy: 144, foreground: 324 },
  { name: 'xxxhdpi', legacy: 192, foreground: 432 },
];
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
    // Adaptive foreground: transparent, mark inside the 66dp safe circle (61% of the canvas).
    render({ out: `${ANDROID}/mipmap-${d.name}/ic_launcher_foreground.png`, width: d.foreground, height: d.foreground, background: 'transparent', mark: 'rinkbuddy-skate.svg', markScale: 0.58, transparent: true });
    render({ out: `${ANDROID}/mipmap-${d.name}/ic_launcher_monochrome.png`, width: d.foreground, height: d.foreground, background: 'transparent', mark: 'rinkbuddy-skate.svg', markScale: 0.58, transparent: true });
  }
  for (const [dir, w, h] of SPLASHES) {
    render({ out: `${ANDROID}/${dir}/splash.png`, width: w, height: h, background: NAVY, mark: 'rinkbuddy-skate.svg', markScale: 0.3 });
  }
}

const TARGETS = { web, ios, android };

const target = process.argv[2] || 'all';
if (target === 'all') Object.values(TARGETS).forEach(fn => fn());
else if (TARGETS[target]) TARGETS[target]();
else {
  console.error(`unknown target: ${target}. Use one of: ${Object.keys(TARGETS).join(', ')}, all`);
  process.exit(1);
}
