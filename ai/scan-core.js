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
  diffThreshold: 24,     // per-pixel change (0-255) that counts as movement
  cameraFraction: 0.35,  // more of the frame than this changing = the camera moved
};

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
      out.push({ t, energy: 0, changed: 0, centroid: null, box: null, mask: null,
                 width: W, height: H, cameraMoving: false, reason: null });
      continue;
    }
    const bg = prev;

    const mask = new Uint8Array(W * H);
    let changed = 0, sx = 0, sy = 0;
    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const k = j * W + i;
        if (Math.abs(data[k] - bg[k]) > o.diffThreshold) {
          mask[k] = 1; changed++; sx += i; sy += j;
          if (i < minX) minX = i; if (i > maxX) maxX = i;
          if (j < minY) minY = j; if (j > maxY) maxY = j;
        }
      }
    }

    const energy = changed / (W * H);
    const cameraMoving = energy > o.cameraFraction;
    out.push({
      t, energy, changed, mask, width: W, height: H,
      centroid: changed ? { x: (sx / changed) / W, y: (sy / changed) / H } : null,
      box: changed ? { x: minX / W, y: minY / H, w: (maxX - minX + 1) / W, h: (maxY - minY + 1) / H } : null,
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

function activityWindows(series, opts = {}) {
  const { minGap = 0.5, minLength = 0.3, pad = 0.1, threshold } = opts;
  if (!series.length) return [];
  const thr = threshold ?? autoThreshold(series.map(f => f.energy));

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
  motionSeries, activityWindows, trackSubject, evidencePlan,
  autoThreshold, cropFor, CAMERA_MOVING, DEFAULTS,
};
