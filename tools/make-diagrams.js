#!/usr/bin/env node
/**
 * Generates skill-diagrams.js — one ice-trace diagram per core skill.
 *
 *   node tools/make-diagrams.js            # writes skill-diagrams.js
 *   node tools/make-diagrams.js --preview  # also writes work/diagrams.html
 *
 * Each diagram shows what the BLADE LEAVES ON THE ICE, seen from above, which is
 * how the skill is taught at the boards. Everything is drawn from the standard
 * pattern for that skill — the lemon of a swizzle, the cusp of a three-turn, the
 * T of a T-stop — not from an image model's guess at what skating looks like.
 *
 * Conventions:
 *   - Travel is left to right unless the skill is backward.
 *   - The accent colour is the trace the skill is named for; dimmer lines are
 *     context (the other foot, the circle being skated, the body's height).
 *   - Blade marks are small rounded bars, drawn where a foot is on the ice.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ACC = 'var(--accent,#38bdf8)';
const DIM = 'currentColor';

// ── drawing helpers ─────────────────────────────────────────────────────────
const trace = (d, o = {}) =>
  `<path d="${d}" fill="none" stroke="${o.color || ACC}" stroke-width="${o.w || 2.4}" ` +
  `stroke-linecap="round" stroke-linejoin="round"` +
  `${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}` +
  `${o.opacity ? ` opacity="${o.opacity}"` : ''}` +
  `${o.marker ? ` marker-end="url(#${o.marker})"` : ''}/>`;

const blade = (x, y, angle = 0, o = {}) =>
  `<rect x="${x - 7}" y="${y - 2}" width="14" height="4" rx="2" ` +
  `transform="rotate(${angle} ${x} ${y})" fill="${o.color || DIM}" opacity="${o.opacity || 0.55}"/>`;

const spray = (x, y, angle = 0) =>
  `<g transform="rotate(${angle} ${x} ${y})" opacity="0.5">` +
  [0, 1, 2, 3].map(i =>
    `<path d="M${x + i * 5},${y} l4,-${4 + i}" stroke="${DIM}" stroke-width="1.6" stroke-linecap="round" fill="none"/>`
  ).join('') + '</g>';

// A small figure seen from the side, for the skills whose point is body shape.
const figure = (x, y, pose) => {
  const p = {
    // head cx,cy ; body path ; legs path
    squat: ['0,-26', 'M0,-22 L0,-10', 'M0,-10 L-9,-2 M0,-10 L9,-2 M-9,-2 L-9,4 M9,-2 L9,4'],
    // arabesque: torso tipped forward, free leg lifted behind above hip height
    arabesque: ['-20,-28', 'M-17,-26 L4,-16 M-14,-24 L-26,-16', 'M4,-16 L4,4 M4,-16 L28,-30'],
    air: ['0,-28', 'M0,-24 L0,-12', 'M0,-12 L-7,-2 M0,-12 L7,-2'],
  }[pose];
  return `<g transform="translate(${x} ${y})" opacity="0.75" stroke="${DIM}" fill="none" stroke-width="2" stroke-linecap="round">` +
    `<circle cx="${p[0].split(',')[0]}" cy="${p[0].split(',')[1]}" r="4" fill="${DIM}" stroke="none" opacity="0.9"/>` +
    `<path d="${p[1]}"/><path d="${p[2]}"/></g>`;
};

// Blade seen end-on, tipped onto one edge. side: 'outside' | 'inside' | 'flat'
const bladeEdge = (x, y, side) => {
  const tilt = side === 'outside' ? -22 : side === 'inside' ? 22 : 0;
  const dot = side === 'outside' ? -6 : side === 'inside' ? 6 : 0;
  return `<g transform="translate(${x} ${y})">` +
    `<line x1="-16" y1="10" x2="16" y2="10" stroke="${DIM}" stroke-width="1.5" opacity="0.35"/>` +
    `<g transform="rotate(${tilt})">` +
    `<rect x="-7" y="-14" width="14" height="20" rx="3" fill="none" stroke="${DIM}" stroke-width="2" opacity="0.65"/>` +
    `<line x1="${dot}" y1="6" x2="${dot}" y2="10" stroke="${ACC}" stroke-width="3" stroke-linecap="round"/>` +
    `</g></g>`;
};

const svg = (id, body) =>
  `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ice trace">` +
  `<defs><marker id="ar-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">` +
  `<path d="M0,0 L10,5 L0,10 z" fill="${ACC}"/></marker>` +
  `<marker id="ard-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">` +
  `<path d="M0,0 L10,5 L0,10 z" fill="${DIM}" opacity="0.55"/></marker></defs>${body}</svg>`;

// ── the skills ──────────────────────────────────────────────────────────────
// caption = what the picture is showing, in one line.
const D = {};
const add = (id, caption, body) => { D[id] = { caption, svg: svg(id, body(id)) }; };

add('f-fwd-swizzle', 'Feet push apart and close again: each pair of arcs is one lemon.', id =>
  trace('M30,60 Q52,38 74,60 Q96,38 118,60 Q140,38 162,60', { marker: `ar-${id}` }) +
  trace('M30,60 Q52,82 74,60 Q96,82 118,60 Q140,82 162,60', { marker: `ar-${id}` }) +
  blade(30, 54) + blade(30, 66));

add('f-bwd-swizzle', 'The same lemons, travelling backwards — heels lead the push.', id =>
  trace('M170,60 Q148,38 126,60 Q104,38 82,60 Q60,38 38,60', { marker: `ar-${id}` }) +
  trace('M170,60 Q148,82 126,60 Q104,82 82,60 Q60,82 38,60', { marker: `ar-${id}` }) +
  blade(170, 54) + blade(170, 66));

add('f-fwd-stroke', 'Each foot pushes to the side, then glides. The trace alternates.', id =>
  trace('M28,60 Q56,44 84,58', { marker: `ard-${id}`, color: DIM, opacity: 0.45 }) +
  trace('M84,58 Q112,74 140,58', {}) +
  trace('M140,58 Q164,46 184,54', { marker: `ar-${id}` }) +
  trace('M28,60 l-9,-7', { color: DIM, opacity: 0.5, w: 2 }) +
  trace('M84,58 l-8,8', { color: DIM, opacity: 0.5, w: 2 }) +
  blade(28, 60, -20));

add('f-bwd-stroke', 'Backwards, each push carves a C. The trace is a row of C-cuts.', id =>
  // half circles alternating above and below the travel line = C-cuts
  trace('M168,60 A17,17 0 1,1 134,60', { color: DIM, opacity: 0.45 }) +
  trace('M134,60 A17,17 0 1,0 100,60', {}) +
  trace('M100,60 A17,17 0 1,1 66,60', {}) +
  trace('M66,60 A17,17 0 1,0 32,60', { marker: `ar-${id}` }) +
  blade(168, 60, 20));

// A crossover trace: the skater follows a circle, and at each step one blade
// steps across the circle line. Marks are drawn crossing the ellipse itself.
const RX = 66, RY = 40;
// A step across the circle line: a short bar centred on the ellipse, tilted off
// the normal so it reads as a foot placed across the path rather than along it.
const crossMark = (deg, over) => {
  const r = deg * Math.PI / 180;
  const px = 100 + RX * Math.cos(r), py = 60 + RY * Math.sin(r);
  let nx = Math.cos(r) / RX, ny = Math.sin(r) / RY;         // outward normal
  const n = Math.hypot(nx, ny); nx /= n; ny /= n;
  const tilt = (over ? 26 : -26) * Math.PI / 180;            // lean the bar over/under
  const ax = nx * Math.cos(tilt) - ny * Math.sin(tilt);
  const ay = nx * Math.sin(tilt) + ny * Math.cos(tilt);
  const L = over ? 13 : 10;
  const p = (s) => `${(px + ax * s).toFixed(1)},${(py + ay * s).toFixed(1)}`;
  return trace(`M${p(-L)} L${p(L)}`,
    { w: over ? 3.4 : 2.2, opacity: over ? 1 : 0.5, color: over ? ACC : DIM });
};
const circleGuide = `<ellipse cx="100" cy="60" rx="66" ry="40" fill="none" stroke="${DIM}" stroke-width="2" opacity="0.28" stroke-dasharray="5 7"/>`;

add('f-fwd-crossover', 'Skating a circle: at every step the outside foot crosses over the line.', id =>
  circleGuide +
  [40, 80, 120].map(d => crossMark(d, true)).join('') +
  [60, 100].map(d => crossMark(d, false)).join('') +
  trace('M34,52 A66,40 0 0,1 78,21', { marker: `ar-${id}`, color: DIM, opacity: 0.7, w: 2 }) +
  `<text x="100" y="62" text-anchor="middle" font-size="10" fill="${ACC}" opacity="0.85">bold = crossing over</text>` +
  `<text x="100" y="74" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">faint = pushing under</text>`);

add('f-bwd-crossover', 'The same circle backwards — the power comes from the foot pushing under.', id =>
  circleGuide +
  [40, 80, 120].map(d => crossMark(d, true)).join('') +
  [60, 100].map(d => crossMark(d, false)).join('') +
  trace('M78,21 A66,40 0 0,0 34,52', { marker: `ar-${id}`, color: DIM, opacity: 0.7, w: 2 }) +
  `<text x="100" y="62" text-anchor="middle" font-size="10" fill="${ACC}" opacity="0.85">bold = crossing over</text>` +
  `<text x="100" y="74" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">faint = pushing under</text>`);

add('f-2ft-glide', 'Two blades, two straight parallel lines. No push, just glide.', id =>
  trace('M30,50 L168,50', { marker: `ar-${id}` }) +
  trace('M30,70 L168,70', { marker: `ar-${id}` }) +
  blade(30, 50) + blade(30, 70));

add('f-1ft-glide', 'One line only. The free foot is off the ice and leaves no mark.', id =>
  trace('M30,68 L168,68', { marker: `ar-${id}` }) +
  trace('M36,44 L150,44', { color: DIM, opacity: 0.3, dash: '4 7', w: 2 }) +
  blade(30, 68) +
  `<text x="93" y="38" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.45">free foot, lifted</text>`);

add('f-dip', 'The trace is a plain glide — the skill is the height: down and back up.', id =>
  trace('M30,84 L168,84', { marker: `ar-${id}` }) +
  trace('M30,74 L168,74', { marker: `ar-${id}` }) +
  trace('M34,30 Q100,62 166,30', { color: DIM, opacity: 0.45, dash: '5 5', w: 2 }) +
  figure(100, 70, 'squat') +
  `<text x="100" y="22" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">body height</text>`);

add('f-fwd-spiral', 'One long held edge while the free leg stays up behind you.', id =>
  trace('M26,78 Q100,66 176,58', { marker: `ar-${id}` }) +
  figure(96, 66, 'arabesque') +
  blade(26, 78, -8));

add('f-2ft-hop', 'Both blades leave the ice: the trace breaks, then starts again.', id =>
  trace('M26,78 L74,78', {}) +
  trace('M126,78 L176,78', { marker: `ar-${id}` }) +
  trace('M74,78 Q100,44 126,78', { color: DIM, opacity: 0.5, dash: '4 5', w: 2 }) +
  blade(74, 78) + blade(126, 78) + figure(100, 52, 'air'));

add('f-snowplow', 'Both toes turn in. The two traces converge and shave the ice.', id =>
  trace('M30,46 L120,58', {}) +
  trace('M30,74 L120,62', {}) +
  trace('M120,58 L150,60', { marker: `ar-${id}`, opacity: 0.5, dash: '4 4' }) +
  trace('M120,62 L150,60', { opacity: 0.5, dash: '4 4' }) +
  spray(126, 52, -12) + spray(126, 68, 12) +
  blade(30, 46, 8) + blade(30, 74, -8));

add('f-t-stop', 'The back blade drags across the line of travel — the two traces form a T.', id =>
  trace('M26,70 L150,70', { marker: `ar-${id}` }) +
  trace('M104,50 L104,90', { color: DIM, opacity: 0.8, w: 3 }) +
  spray(110, 50, 60) +
  blade(150, 70) +
  `<text x="104" y="104" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">dragging foot</text>`);

add('f-hockey-stop', 'Both blades turn sideways at once and skid across the travel line.', id =>
  trace('M22,60 L104,60', {}) +
  trace('M108,40 Q132,50 148,44', { w: 3 }) +
  trace('M108,78 Q132,88 148,82', { w: 3 }) +
  spray(150, 42, -20) + spray(150, 80, 20) +
  blade(112, 40, 74) + blade(112, 78, 74) +
  `<text x="130" y="108" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">blades square to travel</text>`);

// Edges. The trace is just a curve — what separates inside from outside is which
// side of the blade bites, and that depends on the foot you're on versus the way
// the curve bends. You lean into the curve either way, so the diagram names the
// foot instead of inventing a difference in lean.
const edge = (id, caption, dir, side, footNote) => add(id, caption, () => {
  const fwd = dir === 'fwd';
  const A = 'M30,88', B = '172,46', C = 'Q100,24';               // one curve, bending left
  const d = fwd ? `${A} ${C} ${B}` : `M172,46 Q100,24 30,88`;
  return trace(d, { marker: `ar-${id}` }) +
    trace(`${A} ${C} ${B}`, { color: DIM, opacity: 0.14, w: 9 }) +
    blade(fwd ? 30 : 172, fwd ? 88 : 46, fwd ? -34 : -14) +
    bladeEdge(40, 34, side) +
    `<text x="118" y="92" text-anchor="middle" font-size="10" fill="${ACC}" opacity="0.8">` +
    `one foot, held, ${fwd ? 'forward' : 'backward'}</text>` +
    `<text x="118" y="104" text-anchor="middle" font-size="9.5" fill="${DIM}" opacity="0.55">${footNote[0]}</text>` +
    `<text x="118" y="115" text-anchor="middle" font-size="9.5" fill="${DIM}" opacity="0.55">${footNote[1]}</text>`;
});

edge('f-fwd-outside-edge', 'One foot, one curve, riding the little-toe side of the blade.', 'fwd', 'outside',
  ['left foot curving left,', 'or right foot curving right']);
edge('f-fwd-inside-edge', 'One foot, one curve, riding the big-toe side of the blade.', 'fwd', 'inside',
  ['left foot curving right,', 'or right foot curving left']);
edge('f-bwd-outside-edge', 'The little-toe edge again, travelling backwards.', 'bwd', 'outside',
  ['left foot curving left,', 'or right foot curving right']);
edge('f-bwd-inside-edge', 'The big-toe edge, travelling backwards.', 'bwd', 'inside',
  ['left foot curving right,', 'or right foot curving left']);

add('f-transition', 'Both feet pivot halfway round; the line keeps going the same way.', id =>
  trace('M24,60 L86,60', {}) +
  trace('M114,60 L176,60', { marker: `ar-${id}` }) +
  `<circle cx="100" cy="60" r="15" fill="none" stroke="${DIM}" stroke-width="2" opacity="0.5" stroke-dasharray="4 4"/>` +
  trace('M92,46 A14,14 0 1,1 90,74', { color: DIM, opacity: 0.7, w: 2, marker: `ard-${id}` }) +
  blade(80, 60) + blade(120, 60) +
  `<text x="100" y="100" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">turn in place, keep gliding</text>`);

add('f-fwd-outside-3turn', 'One foot turns at a point — the blade leaves a cusp, like a 3.', id =>
  trace('M30,88 Q62,50 100,44', {}) +                       // first lobe, entering
  trace('M100,44 L88,58 L100,44', { w: 3 }) +                // the cusp itself
  trace('M100,44 Q142,40 168,78', { marker: `ar-${id}` }) +  // second lobe, exiting
  `<circle cx="100" cy="44" r="3.4" fill="${ACC}"/>` +
  `<text x="100" y="108" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.55">the cusp — where the blade turns</text>`);

add('f-2ft-spin', 'Both blades stay down and trace tight rings in one spot.', id =>
  `<circle cx="100" cy="58" r="26" fill="none" stroke="${ACC}" stroke-width="2.4" opacity="0.9"/>` +
  `<circle cx="100" cy="58" r="17" fill="none" stroke="${ACC}" stroke-width="2.4" opacity="0.55"/>` +
  trace('M100,20 A38,38 0 0,1 132,34', { marker: `ar-${id}`, color: DIM, opacity: 0.6, w: 2 }) +
  blade(100, 84) + blade(114, 84) +
  `<text x="100" y="108" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">stays on one spot</text>`);

add('f-1ft-spin', 'One blade winds a tight coil — the spin travels as little as possible.', id =>
  trace('M128,74 C104,86 74,74 76,56 C78,38 104,30 118,40 C130,48 126,62 112,62 C102,62 100,54 106,50', {}) +
  trace('M100,20 A40,40 0 0,1 136,38', { marker: `ar-${id}`, color: DIM, opacity: 0.6, w: 2 }) +
  `<text x="100" y="108" text-anchor="middle" font-size="10" fill="${DIM}" opacity="0.5">one foot, coiling inward</text>`);

// ── write out ───────────────────────────────────────────────────────────────
const order = Object.keys(D);
const js = `// Generated by tools/make-diagrams.js — do not edit by hand.
// One ice-trace diagram per core skill: what the blade leaves on the ice, seen
// from above. Inline SVG, themed with --accent and the surrounding text colour.
const SKILL_DIAGRAMS = ${JSON.stringify(D, null, 2)};
if (typeof module !== 'undefined') module.exports = { SKILL_DIAGRAMS };
`;
fs.writeFileSync(path.join(ROOT, 'skill-diagrams.js'), js);
console.log(`skill-diagrams.js — ${order.length} diagrams`);

if (process.argv.includes('--preview')) {
  const work = path.join(ROOT, 'work');
  fs.mkdirSync(work, { recursive: true });
  const cards = order.map(id => `<figure><div class="d">${D[id].svg}</div>
    <figcaption><b>${id}</b><span>${D[id].caption}</span></figcaption></figure>`).join('\n');
  fs.writeFileSync(path.join(work, 'diagrams.html'),
    `<!doctype html><meta charset="utf-8"><title>Ice traces</title>
<style>body{background:#0b1015;color:#e6eef3;font:15px system-ui;margin:0;padding:24px}
:root{--accent:#38bdf8}h1{font-size:1.2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
figure{margin:0;background:#131c23;border:1px solid #223039;border-radius:10px;padding:10px}
.d svg{width:100%;height:auto;color:#e6eef3}
figcaption{font-size:.8rem;color:#9ab}figcaption b{display:block;color:#38bdf8;font-family:ui-monospace,monospace;font-size:.72rem;margin:6px 0 2px}
</style><h1>Ice traces — ${order.length} skills</h1><div class="grid">${cards}</div>`);
  console.log('work/diagrams.html');
}
