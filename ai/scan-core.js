'use strict';
/**
 * scan-core — find WHERE to look in a skating clip, before any AI sees it.
 *
 * Pure functions over already-decoded grayscale frames, so the same code runs in
 * the browser (canvas) and in Node (ffmpeg), and can be tested without either.
 *
 *   motionSeries(frames)      per-frame motion energy, centroid, box, camera flag
 *   activityWindows(series)   the stretches worth sending, with their peak moment
 *   trackSubject(series)      which blob is the skater, frame by frame
 *   evidencePlan(windows)     the exact timestamps and crops to cut for the model
 *
 * A frame is { t: seconds, data: Uint8Array (grayscale), width, height }.
 * Every box and centroid is normalised to 0..1 of the frame, so callers can work
 * at whatever resolution they like.
 *
 * Why this exists: sampling one frame a second misses jumps and most turns
 * outright (research/03). Sending everything at 12-15 fps is unaffordable. So
 * the client finds the few seconds that matter and sends those densely.
 */

const CAMERA_MOVING = 'camera-moving';

const DEFAULTS = {
  diffThreshold: 24,      // per-pixel change (0-255) that counts as movement
  cameraFraction: 0.35,   // more of the frame than this changing = the camera moved
  compensate: true,       // undo the camera's own movement before measuring
  compensateAbove: 0.08,  // only bother when this much of the frame disagrees
  compensateGain: 0.75,   // and only keep the shift if it explains this much away
  cameraShiftPx: 1.5,     // a shift this big means the phone moved, not the skater
};

// ── camera movement ─────────────────────────────────────────────────────────
// Handheld footage moves the whole frame, which swamps the skater's own motion:
// on batch 1 and 2 every missed attempt was in a panning clip. Estimating the
// frame-to-frame shift and differencing against the shifted frame puts handheld
// clips back on the same footing as a phone propped on the boards.

function downsample2(data, W, H) {
  const w = W >> 1, h = H >> 1;
  const out = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const k = (j * 2) * W + i * 2;
      out[j * w + i] = (data[k] + data[k + 1] + data[k + W] + data[k + W + 1]) >> 2;
    }
  }
  return { data: out, W: w, H: h };
}

// Sum of absolute differences over a fixed inner region, so every candidate
// shift is judged on the same pixels.
function searchSAD(prev, cur, W, H, range, cx = 0, cy = 0, stride = 2) {
  const m = Math.max(2, Math.abs(cx) + range + 1, Math.abs(cy) + range + 1);
  if (W - 2 * m < 4 || H - 2 * m < 4) return { dx: cx, dy: cy, sad: Infinity };
  let best = { dx: cx, dy: cy, sad: Infinity };
  for (let dy = cy - range; dy <= cy + range; dy++) {
    for (let dx = cx - range; dx <= cx + range; dx++) {
      let sad = 0, n = 0;
      for (let j = m; j < H - m; j += stride) {
        const row = j * W, srow = (j - dy) * W;
        for (let i = m; i < W - m; i += stride) {
          sad += Math.abs(cur[row + i] - prev[srow + i - dx]);
          n++;
        }
      }
      const mean = n ? sad / n : Infinity;
      if (mean < best.sad) best = { dx, dy, sad: mean };
    }
  }
  return best;
}

/** How far the whole picture moved between two frames, in pixels. */
function estimateShift(prev, cur, W, H, opts = {}) {
  const maxShift = opts.maxShift ?? Math.max(4, Math.round(W * 0.08));
  const p2 = downsample2(prev, W, H), c2 = downsample2(cur, W, H);
  const coarse = searchSAD(p2.data, c2.data, p2.W, p2.H, Math.ceil(maxShift / 2), 0, 0, 1);
  const fine = searchSAD(prev, cur, W, H, 2, coarse.dx * 2, coarse.dy * 2, 2);
  return { dx: fine.dx, dy: fine.dy, sad: fine.sad };
}

// One difference pass: cur(i,j) against prev(i-dx, j-dy).
function diffAt(prev, cur, W, H, dx, dy, threshold) {
  const mask = new Uint8Array(W * H);
  const x0 = Math.max(0, dx), x1 = Math.min(W, W + dx);
  const y0 = Math.max(0, dy), y1 = Math.min(H, H + dy);
  let changed = 0, compared = 0, sx = 0, sy = 0;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let j = y0; j < y1; j++) {
    const row = j * W, srow = (j - dy) * W;
    for (let i = x0; i < x1; i++) {
      compared++;
      if (Math.abs(cur[row + i] - prev[srow + i - dx]) > threshold) {
        mask[row + i] = 1; changed++; sx += i; sy += j;
        if (i < minX) minX = i; if (i > maxX) maxX = i;
        if (j < minY) minY = j; if (j > maxY) maxY = j;
      }
    }
  }
  return { mask, changed, compared, sx, sy, minX, minY, maxX, maxY };
}

// ── 1. motion ───────────────────────────────────────────────────────────────
// Each frame is compared with the one before it, not with a running background.
// A background model sounds cleverer, but it keeps a ghost of the skater for as
// long as it takes to forget them, which stretches every window past the action
// and glues separate attempts together.
function motionSeries(frames, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const out = [];
  let prev = null;

  for (const f of frames) {
    const { data, width: W, height: H, t } = f;
    if (!prev) {
      prev = data;
      out.push({ t, energy: 0, changed: 0, centroid: null, box: null, mask: null, data,
                 width: W, height: H, cameraMoving: false, reason: null });
      continue;
    }
    const bg = prev;

    let d = diffAt(bg, data, W, H, 0, 0, o.diffThreshold);
    const rawEnergy = d.changed / Math.max(1, d.compared);
    let shift = { dx: 0, dy: 0 };

    // Only hunt for a camera shift when the frame looks globally different —
    // otherwise a lone moving skater on plain ice is the best "shift" there is,
    // and compensating would erase the very thing we're looking for.
    if (o.compensate && rawEnergy >= o.compensateAbove) {
      const s = estimateShift(bg, data, W, H, { maxShift: o.maxShift });
      if (s.dx || s.dy) {
        const alt = diffAt(bg, data, W, H, s.dx, s.dy, o.diffThreshold);
        const altEnergy = alt.changed / Math.max(1, alt.compared);
        if (altEnergy < rawEnergy * o.compensateGain) { d = alt; shift = { dx: s.dx, dy: s.dy }; }
      }
    }

    const energy = d.changed / Math.max(1, d.compared);
    const panned = Math.hypot(shift.dx, shift.dy) >= o.cameraShiftPx;
    const cameraMoving = panned || rawEnergy > o.cameraFraction;
    out.push({
      t, energy, changed: d.changed, mask: d.mask, data, width: W, height: H, shift, rawEnergy,
      centroid: d.changed ? { x: (d.sx / d.changed) / W, y: (d.sy / d.changed) / H } : null,
      box: d.changed
        ? { x: d.minX / W, y: d.minY / H, w: (d.maxX - d.minX + 1) / W, h: (d.maxY - d.minY + 1) / H }
        : null,
      cameraMoving, reason: cameraMoving ? CAMERA_MOVING : null,
    });

    prev = data;
  }
  return out;
}

// ── 2. windows worth sending ────────────────────────────────────────────────
const percentile = (sorted, p) => {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * p)));
  return sorted[i];
};

// The floor adapts to the clip: a still camera at a quiet rink and a handheld
// phone in a busy session have very different idea of "nothing happening".
function autoThreshold(energies, floor = 0.008) {
  const sorted = [...energies].sort((a, b) => a - b);
  const quiet = percentile(sorted, 0.25);
  const busy = percentile(sorted, 0.90);
  return Math.max(floor, quiet + 0.25 * (busy - quiet));
}

// Tried and rejected: judging each frame against a rolling local baseline
// instead of one threshold for the clip. It sounds right — a clip can hold both
// a camera being carried across the rink and a skater working quietly at a
// distance — but measured against the hand labels it found no extra attempt and
// asked to send 3% more of every clip. The reason is in the footage: in a busy
// handheld clip the skater's own motion sits inside the ambient level, so no
// threshold, local or global, separates them. That needs a person detector.
function activityWindows(series, opts = {}) {
  const { minGap = 0.5, minLength = 0.3, pad = 0.1, threshold, floor = 0.008 } = opts;
  if (!series.length) return [];
  const thr = threshold ?? autoThreshold(series.map(f => f.energy), floor);

  const runs = [];
  let cur = null;
  for (const f of series) {
    if (f.energy > thr) {
      if (!cur) cur = { start: f.t, end: f.t, peak: f.t, peakE: f.energy, n: 0, cam: 0 };
      cur.end = f.t;
      cur.n++;
      if (f.cameraMoving) cur.cam++;
      if (f.energy > cur.peakE) { cur.peakE = f.energy; cur.peak = f.t; }
    } else if (cur) { runs.push(cur); cur = null; }
  }
  if (cur) runs.push(cur);

  const merged = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && r.start - last.end < minGap) {
      last.end = r.end; last.n += r.n; last.cam += r.cam;
      if (r.peakE > last.peakE) { last.peakE = r.peakE; last.peak = r.peak; }
    } else merged.push({ ...r });
  }

  const t0 = series[0].t, t1 = series[series.length - 1].t;
  return merged
    .filter(r => r.end - r.start >= minLength)
    .map(r => ({
      start: Math.max(t0, +(r.start - pad).toFixed(3)),
      end: Math.min(t1, +(r.end + pad).toFixed(3)),
      peak: r.peak,
      energy: +r.peakE.toFixed(4),
      cameraMoving: r.n > 0 && r.cam / r.n > 0.5,
    }));
}

// ── 3. which blob is the skater ─────────────────────────────────────────────
function components(mask, W, H, minArea) {
  const seen = new Uint8Array(W * H);
  const found = [];
  const stack = [];
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue;
    stack.length = 0; stack.push(start); seen[start] = 1;
    let area = 0, sx = 0, sy = 0, minX = W, minY = H, maxX = -1, maxY = -1;
    while (stack.length) {
      const k = stack.pop();
      const x = k % W, y = (k / W) | 0;
      area++; sx += x; sy += y;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (x > 0 && mask[k - 1] && !seen[k - 1]) { seen[k - 1] = 1; stack.push(k - 1); }
      if (x < W - 1 && mask[k + 1] && !seen[k + 1]) { seen[k + 1] = 1; stack.push(k + 1); }
      if (y > 0 && mask[k - W] && !seen[k - W]) { seen[k - W] = 1; stack.push(k - W); }
      if (y < H - 1 && mask[k + W] && !seen[k + W]) { seen[k + W] = 1; stack.push(k + W); }
    }
    if (area >= minArea) {
      found.push({ area, cx: (sx / area) / W, cy: (sy / area) / H,
        x: minX / W, y: minY / H, w: (maxX - minX + 1) / W, h: (maxY - minY + 1) / H });
    }
  }
  return found;
}

/**
 * Picks one blob per frame and keeps picking the same one: the biggest moving
 * thing, unless a smaller blob sits much closer to where the skater just was.
 * Returns a normalised box per frame, or null when nothing moved.
 */
function trackSubject(series, opts = {}) {
  const { minAreaFraction = 0.0015, smooth = 0.45, maxJump = 0.35 } = opts;
  const out = [];
  let prev = null;

  for (const f of series) {
    if (!f.mask || !f.changed) { out.push(null); continue; }
    const blobs = components(f.mask, f.width, f.height, Math.max(4, minAreaFraction * f.width * f.height));
    if (!blobs.length) { out.push(null); continue; }

    const biggest = blobs.reduce((a, b) => (b.area > a.area ? b : a));
    let pick = biggest;
    if (prev) {
      const pcx = prev.x + prev.w / 2, pcy = prev.y + prev.h / 2;
      const near = blobs
        .map(b => ({ b, d: Math.hypot(b.cx - pcx, b.cy - pcy) }))
        .filter(({ b, d }) => d < maxJump && b.area > biggest.area * 0.25)
        .sort((a, b) => a.d - b.d)[0];
      if (near) pick = near.b;
    }

    const box = prev
      ? {
          x: prev.x + (pick.x - prev.x) * smooth,
          y: prev.y + (pick.y - prev.y) * smooth,
          w: prev.w + (pick.w - prev.w) * smooth,
          h: prev.h + (pick.h - prev.h) * smooth,
        }
      : { x: pick.x, y: pick.y, w: pick.w, h: pick.h };
    out.push(box);
    prev = box;
  }
  return out;
}

// ── 3b. tap-to-select: track the person the skater pointed at ───────────────
// Picking the biggest moving blob fails on real rink footage in two ways, both
// seen in Milo's batch 3: standing next to the phone beats skating twenty metres
// away, and anyone passing closer to the lens steals the box. Once the skater
// taps themselves, neither happens: we follow THAT body and measure ITS motion.
//
// The tracker is appearance plus motion. A small grayscale patch of the subject
// is matched around where they were predicted to be, and blobs of movement that
// overlap the match pull it into place. When the subject stands still there is
// nothing to match against, so the box simply holds.

function extractPatch(data, W, H, box, pw, ph) {
  const patch = new Uint8Array(pw * ph);
  const x0 = box.x * W, y0 = box.y * H, bw = box.w * W, bh = box.h * H;
  for (let j = 0; j < ph; j++) {
    const sy = Math.min(H - 1, Math.max(0, Math.round(y0 + (j + 0.5) * bh / ph)));
    for (let i = 0; i < pw; i++) {
      const sx = Math.min(W - 1, Math.max(0, Math.round(x0 + (i + 0.5) * bw / pw)));
      patch[j * pw + i] = data[sy * W + sx];
    }
  }
  return patch;
}

function patchCost(data, W, H, box, patch, pw, ph) {
  const x0 = box.x * W, y0 = box.y * H, bw = box.w * W, bh = box.h * H;
  if (x0 < -bw * 0.5 || y0 < -bh * 0.5 || x0 + bw > W + bw * 0.5 || y0 + bh > H + bh * 0.5) return Infinity;
  let sum = 0;
  for (let j = 0; j < ph; j++) {
    const sy = Math.min(H - 1, Math.max(0, Math.round(y0 + (j + 0.5) * bh / ph)));
    for (let i = 0; i < pw; i++) {
      const sx = Math.min(W - 1, Math.max(0, Math.round(x0 + (i + 0.5) * bw / pw)));
      sum += Math.abs(data[sy * W + sx] - patch[j * pw + i]);
    }
  }
  return sum / (pw * ph);
}

/**
 * Follow a subject from the frame and box the user tapped.
 * seed: { t, box:{x,y,w,h} } in normalised units. Returns a box per frame.
 */
function trackFrom(series, seed, opts = {}) {
  const {
    patchW = 10, patchH = 14, searchPx = 10, blobPull = 0.45,
    patchAlpha = 0.08, coastFrames = 25, stayPenalty = 0.45,
    learnRatio = 1.8, learnFloor = 20, lostRatio = 4, lostFloor = 60, lostGrace = 4,
  } = opts;
  const out = new Array(series.length).fill(null);
  if (!series.length || !seed || !seed.box) return out;

  let seedIdx = 0, bestD = Infinity;
  series.forEach((f, i) => { const d = Math.abs(f.t - seed.t); if (d < bestD) { bestD = d; seedIdx = i; } });

  const run = (from, step) => {
    const W = series[from].width, H = series[from].height;
    let box = { ...seed.box };
    let patch = extractPatch(frameData(series, from), W, H, box, patchW, patchH);
    let vx = 0, vy = 0, missed = 0, costRef = null, lostRun = 0;

    for (let i = from; i >= 0 && i < series.length; i += step) {
      const f = series[i];
      const data = frameData(series, i);
      if (!data) { out[i] = { ...box }; continue; }

      // where we expect them, then a small search around it
      const pred = { ...box, x: box.x + vx * step, y: box.y + vy * step };
      // A flat patch — a plain jersey, plain ice — matches equally well all over
      // the search area, so without a nudge towards the prediction the box
      // wanders and a parked skater looks like they are moving.
      let best = { box: pred, raw: patchCost(data, W, H, pred, patch, patchW, patchH) };
      best.cost = best.raw;
      const stepPx = 2;
      for (let dy = -searchPx; dy <= searchPx; dy += stepPx) {
        for (let dx = -searchPx; dx <= searchPx; dx += stepPx) {
          const cand = { ...pred, x: pred.x + dx / W, y: pred.y + dy / H };
          const raw = patchCost(data, W, H, cand, patch, patchW, patchH);
          const cost = raw + stayPenalty * Math.hypot(dx, dy);
          if (cost < best.cost) best = { box: cand, cost, raw };
        }
      }

      // Two levels of doubt. A mediocre match still moves the box — bodies
      // change shape as they skate — but only a GOOD match is allowed to update
      // the template. That distinction is what stops the tracker adopting
      // whoever walked past: without it, one bad frame and it learns a stranger.
      const ref = costRef === null ? best.raw : costRef;
      const confident = best.raw <= Math.max(learnFloor, ref * learnRatio + 10);
      const lost = best.raw > Math.max(lostFloor, ref * lostRatio + 40);
      if (lost) best.box = pred;
      lostRun = lost ? lostRun + 1 : 0;
      // Saying "they left the frame" beats handing the box to a stranger: an
      // empty track costs us a window, a wrong track costs us the whole clip.
      const absent = lostRun > lostGrace;

      // movement that overlaps the match pulls the box onto it, which keeps the
      // tracker on a skater whose appearance changes as they turn
      if (!lost && !absent && f.mask && f.changed) {
        const blobs = components(f.mask, W, H, Math.max(4, 0.0008 * W * H));
        const cx = best.box.x + best.box.w / 2, cy = best.box.y + best.box.h / 2;
        // The blob has to be THIS body: its centre inside the tracked box (with
        // a little slack), and a similar height. A blob merely nearby is
        // somebody else — usually someone passing closer to the lens.
        const padX = best.box.w * 0.35, padY = best.box.h * 0.35;
        const near = blobs
          .map(b => ({ b, d: Math.hypot((b.cx - cx) / Math.max(0.01, best.box.w),
                                        (b.cy - cy) / Math.max(0.01, best.box.h)) }))
          .filter(({ b }) => b.cx > best.box.x - padX && b.cx < best.box.x + best.box.w + padX &&
                             b.cy > best.box.y - padY && b.cy < best.box.y + best.box.h + padY &&
                             b.h < best.box.h * 1.8 && b.h > best.box.h * 0.5)
          .sort((a, b) => a.d - b.d)[0];
        if (near) {
          best.box = {
            x: best.box.x + (near.b.cx - near.b.w / 2 - best.box.x) * blobPull,
            y: best.box.y + (near.b.cy - near.b.h / 2 - best.box.y) * blobPull,
            w: best.box.w + (near.b.w - best.box.w) * 0.25,
            h: best.box.h + (near.b.h - best.box.h) * 0.25,
          };
          missed = 0;
        } else missed++;
      } else missed++;

      const nx = Math.min(Math.max(best.box.x, -best.box.w * 0.3), 1 - best.box.w * 0.7);
      const ny = Math.min(Math.max(best.box.y, -best.box.h * 0.3), 1 - best.box.h * 0.7);
      vx = (nx - box.x) * 0.6 / step + vx * 0.4;
      vy = (ny - box.y) * 0.6 / step + vy * 0.4;
      box = { ...best.box, x: nx, y: ny };
      out[i] = absent ? null : { ...box, held: missed > 0, lost };

      if (missed > coastFrames) { vx = 0; vy = 0; }        // stop drifting on a lost subject
      if (confident) {
        costRef = costRef === null ? best.raw : costRef + (best.raw - costRef) * 0.2;
        if (!missed) {
          const fresh = extractPatch(data, W, H, box, patchW, patchH);
          for (let k = 0; k < patch.length; k++) patch[k] += (fresh[k] - patch[k]) * patchAlpha;
        }
      }
    }
  };

  run(seedIdx, 1);
  if (seedIdx > 0) run(seedIdx, -1);
  return out;
}

// motionSeries keeps masks, not pixels, so the tracker needs the frames too.
// They are attached by trackFrom's caller through attachFrames(), or read from
// the series when the caller kept them there.
function frameData(series, i) { return series[i] && (series[i].data || null); }
function attachFrames(series, frames) {
  frames.forEach((f, i) => { if (series[i]) series[i].data = f.data; });
  return series;
}

/** How much the tracked subject is doing, frame by frame. */
function subjectActivity(series, track, opts = {}) {
  const { speedWeight = 2.2, pad = 0.15, speedDeadband = 0.06 } = opts;
  return series.map((f, i) => {
    const b = track[i];
    if (!b || !f.mask) return { t: f.t, activity: 0, inside: 0, speed: 0 };
    const W = f.width, H = f.height;
    const x0 = Math.max(0, Math.round((b.x - b.w * pad) * W));
    const x1 = Math.min(W, Math.round((b.x + b.w * (1 + pad)) * W));
    const y0 = Math.max(0, Math.round((b.y - b.h * pad) * H));
    const y1 = Math.min(H, Math.round((b.y + b.h * (1 + pad)) * H));
    let changed = 0, area = Math.max(1, (x1 - x0) * (y1 - y0));
    for (let j = y0; j < y1; j++) {
      for (let i2 = x0; i2 < x1; i2++) if (f.mask[j * W + i2]) changed++;
    }
    const prev = track[i - 1];
    const dt = i > 0 ? Math.max(0.001, f.t - series[i - 1].t) : 1;
    const raw = prev
      ? Math.hypot((b.x + b.w / 2) - (prev.x + prev.w / 2), (b.y + b.h / 2) - (prev.y + prev.h / 2)) / dt
      : 0;
    const speed = Math.max(0, raw - speedDeadband);   // tracker jitter is not skating
    const inside = changed / area;
    return { t: f.t, inside, speed, activity: inside + speedWeight * speed };
  });
}

/**
 * Windows built from the subject's own activity rather than the whole frame.
 * On a propped phone, a "camera moving" frame means the lens was blocked or the
 * phone was being handled — never something worth sending — so those frames are
 * dropped when the clip is otherwise static. On genuinely handheld footage most
 * frames carry the flag, and dropping them would leave nothing, so we don't.
 */
function subjectWindows(series, track, opts = {}) {
  const act = subjectActivity(series, track, opts);
  const camShare = series.filter(f => f.cameraMoving).length / Math.max(1, series.length);
  const drop = opts.dropCameraMoving ?? (camShare < 0.3);
  const proxy = series.map((f, i) => ({
    t: f.t,
    energy: (drop && f.cameraMoving) ? 0 : act[i].activity,
    cameraMoving: f.cameraMoving,
  }));
  return activityWindows(proxy, { floor: 0.12, ...opts });
}

// ── 4. what to cut and send ─────────────────────────────────────────────────
function nearestIndex(series, t) {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < series.length; i++) {
    const d = Math.abs(series[i].t - t);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

// A crop that holds the whole skater with room around them, square in pixels so
// the tiles line up in a grid, and always inside the frame.
function cropFor(box, frameW, frameH, zoom = 2.2) {
  const h = Math.min(1, Math.max(0.12, box.h * zoom));
  const w = Math.min(1, h * (frameH / frameW));
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  return {
    x: +Math.min(Math.max(cx - w / 2, 0), 1 - w).toFixed(4),
    y: +Math.min(Math.max(cy - h / 2, 0), 1 - h).toFixed(4),
    w: +w.toFixed(4), h: +h.toFixed(4),
  };
}

function evidencePlan(windows, opts = {}) {
  const { tiles = 12, burstFps = 15, track = null, series = null, zoom = 2.2 } = opts;
  const frameW = series?.[0]?.width || 16, frameH = series?.[0]?.height || 9;

  return windows.map(w => {
    const start = w.start, end = w.end;
    const peak = typeof w.peak === 'number' ? Math.min(end, Math.max(start, w.peak)) : (start + end) / 2;
    const dur = Math.max(0.001, end - start);
    let times = [];

    if (dur <= tiles / burstFps) {
      // short enough to send at full burst rate
      const n = Math.max(2, Math.min(tiles, Math.round(dur * burstFps) + 1));
      for (let i = 0; i < n; i++) times.push(start + dur * (i / (n - 1)));
    } else {
      // dense around the peak, the rest spread so the run still reads as a whole
      const dense = Math.max(4, Math.round(tiles * 0.6));
      const spread = tiles - dense;
      const half = ((dense - 1) / 2) / burstFps;
      const dStart = Math.max(start, peak - half), dEnd = Math.min(end, peak + half);
      for (let i = 0; i < dense; i++) times.push(dStart + (dEnd - dStart) * (i / (dense - 1)));
      for (let i = 0; i < spread; i++) times.push(start + dur * ((i + 0.5) / spread));
    }

    times = [...new Set(times.map(t => +t.toFixed(3)))].sort((a, b) => a - b);
    // dropping duplicates can leave us short; fill the widest gaps back up
    while (times.length > tiles) times.splice(Math.floor(times.length / 2), 1);
    while (times.length < tiles) {
      let gi = 0, gap = -1;
      for (let i = 1; i < times.length; i++) {
        if (times[i] - times[i - 1] > gap) { gap = times[i] - times[i - 1]; gi = i; }
      }
      if (gap <= 0.0005) break;
      times.splice(gi, 0, +((times[gi] + times[gi - 1]) / 2).toFixed(3));
    }

    const crops = times.map(t => {
      if (!track || !series) return null;
      const i = nearestIndex(series, t);
      let box = track[i];
      for (let d = 1; !box && d < series.length; d++) {   // nearest frame that saw the skater
        box = track[i - d] || track[i + d];
      }
      return box ? cropFor(box, frameW, frameH, zoom) : null;
    }).filter(c => c !== null);

    return {
      start, end, peak, tiles: times.length, times,
      crops: crops.length === times.length ? crops : [],
      cameraMoving: !!w.cameraMoving,
    };
  });
}

module.exports = {
  motionSeries, activityWindows, trackSubject, evidencePlan, estimateShift,
  trackFrom, subjectActivity, subjectWindows, attachFrames,
  autoThreshold, cropFor, CAMERA_MOVING, DEFAULTS,
};
