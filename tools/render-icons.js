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

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
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
  execFileSync(CHROME, args, { stdio: 'ignore' });
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
