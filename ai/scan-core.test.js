// node --test ai/scan-core.test.js
const { test } = require('node:test');
const assert = require('node:assert');
const {
  motionSeries, activityWindows, trackSubject, evidencePlan, CAMERA_MOVING,
} = require('./scan-core.js');

// ── helpers: synthetic frames, 64x36 grey ───────────────────────────────────
const W = 64, H = 36;
const blank = (v = 20) => new Uint8Array(W * H).fill(v);
const withBox = (x, y, w, h, v = 220, base = 20) => {
  const f = blank(base);
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (i >= 0 && i < W && j >= 0 && j < H) f[j * W + i] = v;
    }
  }
  return f;
};
const seq = (frames, fps = 10) =>
  frames.map((data, i) => ({ t: i / fps, data, width: W, height: H }));

test('a still scene produces almost no motion', () => {
  const s = motionSeries(seq([blank(), blank(), blank(), blank()]));
  assert.ok(s.every(f => f.energy < 0.01), `energies: ${s.map(f => f.energy)}`);
  assert.ok(s.every(f => !f.cameraMoving));
});

test('a moving box produces motion, and the centroid follows it', () => {
  const frames = [0, 6, 12, 18, 24].map(x => withBox(x, 14, 6, 8));
  const s = motionSeries(seq(frames));
  assert.ok(s[2].energy > 0.01, `energy was ${s[2].energy}`);
  const cx = s.slice(1).map(f => f.centroid.x);
  for (let i = 1; i < cx.length; i++) {
    assert.ok(cx[i] > cx[i - 1], `centroid should move right: ${cx}`);
  }
});

test('a whole-frame change is reported as camera movement, not a skater', () => {
  const a = withBox(10, 10, 8, 8);
  const b = blank(200);                       // every pixel changes
  const s = motionSeries(seq([a, b, a]));
  assert.ok(s.some(f => f.cameraMoving), 'expected a cameraMoving frame');
  assert.equal(s.find(f => f.cameraMoving).reason, CAMERA_MOVING);
});

test('windows cover the busy stretches and skip the quiet ones', () => {
  const still = blank();
  const frames = [];
  for (let i = 0; i < 10; i++) frames.push(still);                       // 0.0-0.9s quiet
  for (let i = 0; i < 10; i++) frames.push(withBox(4 + i * 4, 14, 6, 8)); // 1.0-1.9s moving
  for (let i = 0; i < 10; i++) frames.push(still);                       // 2.0-2.9s quiet
  for (let i = 0; i < 10; i++) frames.push(withBox(40 - i * 3, 14, 6, 8));// 3.0-3.9s moving
  const s = motionSeries(seq(frames));
  const w = activityWindows(s, { minGap: 0.4, minLength: 0.3, pad: 0.1 });
  assert.equal(w.length, 2, `expected 2 windows, got ${JSON.stringify(w)}`);
  assert.ok(w[0].start >= 0.7 && w[0].start <= 1.1, `first window starts ${w[0].start}`);
  assert.ok(w[0].end >= 1.8 && w[0].end <= 2.2, `first window ends ${w[0].end}`);
  assert.ok(w[1].start >= 2.7, `second window starts ${w[1].start}`);
  assert.ok(w.every(x => typeof x.peak === 'number' && x.peak >= x.start && x.peak <= x.end));
});

test('two bursts closer together than minGap become one window', () => {
  const still = blank();
  const frames = [];
  for (let i = 0; i < 5; i++) frames.push(still);
  for (let i = 0; i < 6; i++) frames.push(withBox(4 + i * 4, 14, 6, 8));
  for (let i = 0; i < 2; i++) frames.push(still);                        // 0.2s gap only
  for (let i = 0; i < 6; i++) frames.push(withBox(30 + i * 3, 14, 6, 8));
  for (let i = 0; i < 5; i++) frames.push(still);
  const w = activityWindows(motionSeries(seq(frames)), { minGap: 0.5, minLength: 0.3 });
  assert.equal(w.length, 1, `expected a merge, got ${JSON.stringify(w)}`);
});

test('the subject is the biggest moving thing, and its box is tracked', () => {
  const frames = [0, 1, 2, 3].map(i => {
    const f = withBox(6 + i * 5, 12, 12, 14);     // the skater: big, moving right
    for (let j = 4; j < 8; j++) f[j * W + (50 + (i % 2))] = 200;  // a small twitch elsewhere
    return f;
  });
  const s = motionSeries(seq(frames));
  const track = trackSubject(s);
  assert.equal(track.length, s.length);
  const boxed = track.filter(b => b && b.w > 0);
  assert.ok(boxed.length >= 2, 'expected the subject to be found in most frames');
  const xs = boxed.map(b => b.x);
  assert.ok(xs[xs.length - 1] > xs[0], `box should follow the skater right: ${xs}`);
  assert.ok(boxed.every(b => b.x < 0.6), `boxes are normalised; the twitch at x~0.78 must not steal them: ${xs}`);
});

test('evidence is dense near the peak and never exceeds the tile budget', () => {
  const win = { start: 10, end: 13, peak: 11.5 };
  const plan = evidencePlan([win], { tiles: 12, burstFps: 15, minFps: 3 });
  assert.equal(plan.length, 1);
  const times = plan[0].times;
  assert.equal(times.length, 12);
  assert.ok(times[0] >= 9.9 && times[times.length - 1] <= 13.1, `times ${times[0]}..${times.at(-1)}`);
  const nearPeak = times.filter(t => Math.abs(t - 11.5) < 0.5).length;
  const farFromPeak = times.filter(t => Math.abs(t - 11.5) > 1.0).length;
  assert.ok(nearPeak >= farFromPeak, `expected density at the peak: near ${nearPeak}, far ${farFromPeak}`);
  assert.ok(times.every((t, i) => i === 0 || t > times[i - 1]), 'times must be sorted');
});

test('a long window still fits the tile budget, sampled across the whole thing', () => {
  const plan = evidencePlan([{ start: 0, end: 20, peak: 10 }], { tiles: 16, burstFps: 15 });
  const times = plan[0].times;
  assert.equal(times.length, 16);
  assert.ok(times.at(-1) - times[0] > 10, 'a long window should be covered end to end');
});

test('crop boxes follow the tracked subject and keep the whole body', () => {
  const frames = [0, 1, 2, 3].map(i => withBox(6 + i * 5, 12, 12, 14));
  const s = motionSeries(seq(frames));
  const track = trackSubject(s);
  const plan = evidencePlan([{ start: 0, end: 0.3, peak: 0.15 }], { tiles: 4, track, series: s });
  assert.ok(plan[0].crops.length === plan[0].times.length);
  for (const c of plan[0].crops) {
    assert.ok(c.w > 0 && c.h > 0, 'crop must have size');
    assert.ok(c.x >= 0 && c.y >= 0 && c.x + c.w <= 1.0001 && c.y + c.h <= 1.0001,
      `crop must stay inside the frame in normalised units: ${JSON.stringify(c)}`);
  }
  // every crop must actually contain the skater it was cut for
  for (let i = 0; i < plan[0].crops.length; i++) {
    const c = plan[0].crops[i], t = plan[0].times[i];
    const near = track[s.reduce((best, f, k) => Math.abs(f.t - t) < Math.abs(s[best].t - t) ? k : best, 0)];
    if (!near) continue;
    const cx = near.x + near.w / 2, cy = near.y + near.h / 2;
    assert.ok(cx >= c.x && cx <= c.x + c.w && cy >= c.y && cy <= c.y + c.h,
      `crop ${JSON.stringify(c)} does not contain the subject at ${cx.toFixed(2)},${cy.toFixed(2)}`);
  }
});

// ── camera motion ───────────────────────────────────────────────────────────
// A textured background so a shift estimator has something to lock onto.
const texture = (seed = 1) => {
  const f = new Uint8Array(W * H);
  let s = seed;
  for (let k = 0; k < f.length; k++) { s = (s * 1103515245 + 12345) & 0x7fffffff; f[k] = 40 + (s % 160); }
  return f;
};
const shiftFrame = (base, dx, dy) => {
  const f = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const si = i - dx, sj = j - dy;
      f[j * W + i] = (si >= 0 && si < W && sj >= 0 && sj < H) ? base[sj * W + si] : 0;
    }
  }
  return f;
};
const paste = (frame, x, y, w, h, v = 235) => {
  const f = Uint8Array.from(frame);
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) if (i >= 0 && i < W && j >= 0 && j < H) f[j * W + i] = v;
  }
  return f;
};

test('the shift between two frames is recovered', () => {
  const { estimateShift } = require('./scan-core.js');
  const base = texture(7);
  for (const [dx, dy] of [[0, 0], [3, 0], [-4, 2], [6, -3]]) {
    const s = estimateShift(base, shiftFrame(base, dx, dy), W, H, { maxShift: 8 });
    assert.equal(s.dx, dx, `dx for ${dx},${dy} came back ${s.dx}`);
    assert.equal(s.dy, dy, `dy for ${dx},${dy} came back ${s.dy}`);
  }
});

test('a panning camera alone produces almost no motion once compensated', () => {
  const base = texture(11);
  const frames = seq([0, 3, 6, 9, 12].map(dx => shiftFrame(base, dx, 0)));
  const s = motionSeries(frames, { compensate: true });
  assert.ok(s.slice(1).every(f => f.energy < 0.02), `energies: ${s.map(f => f.energy.toFixed(3))}`);
  assert.ok(s.slice(1).every(f => f.cameraMoving), 'the pan itself should still be reported');
});

test('while panning, a skater moving differently is still found', () => {
  const base = texture(13);
  // background pans 3px/frame; the skater moves 8px/frame, so it stands out
  const frames = seq([0, 1, 2, 3, 4].map(i => paste(shiftFrame(base, i * 3, 0), 10 + i * 8, 12, 10, 12)));
  const plain = motionSeries(frames, { compensate: false });
  const comp = motionSeries(frames, { compensate: true });
  assert.ok(plain[3].energy > comp[3].energy * 2,
    `compensation should cut the pan out: plain ${plain[3].energy.toFixed(3)} vs compensated ${comp[3].energy.toFixed(3)}`);
  assert.ok(comp[3].energy > 0.005, `the skater should survive compensation: ${comp[3].energy.toFixed(4)}`);
  const c = comp[3].centroid;
  assert.ok(c && c.x > 0.15 && c.x < 0.75, `centroid should sit on the skater, got ${JSON.stringify(c)}`);
});

// Note: a rolling local threshold was tried here and removed — see the comment
// above activityWindows in scan-core.js. It passed a synthetic loud-half /
// quiet-half case but found nothing extra on real footage.
