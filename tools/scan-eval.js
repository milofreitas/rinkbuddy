#!/usr/bin/env node
/**
 * Grades the motion scan against the hand labels — no API, no cost.
 *
 *   node tools/scan-eval.js                 # every clip in labels/
 *   node tools/scan-eval.js IMG_1791        # one clip
 *   node tools/scan-eval.js IMG_1791 --sheet 121.6   # draw the evidence grid too
 *
 * Options: --fps 10  --width 160  --tiles 12  --rotate 180
 *
 * What it measures:
 *   found    — labeled attempts that land inside a proposed window (recall)
 *   airtime  — share of the clip the scan wants to send (the cost side)
 *   windows  — how many stretches it proposes
 *
 * Recall is the number that matters: a missed attempt can never be labeled or
 * scored later, while a few extra seconds of evidence only costs tokens.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { motionSeries, activityWindows, trackSubject, evidencePlan, trackFrom, subjectWindows } = require('../ai/scan-core.js');

const ROOT = path.join(__dirname, '..');
const FOOTAGE = path.join(ROOT, 'footage');
const LABELS = path.join(ROOT, 'labels');
const WORK = path.join(ROOT, 'work');
const ROTATE = { '90': 'transpose=1', '180': 'hflip,vflip', '270': 'transpose=2' };

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : dflt;
};
const FPS = +flag('fps', 10);
const WIDTH = +flag('width', 160);
const TILES = +flag('tiles', 12);
const ROT = flag('rotate', null);
const SHEET_AT = flag('sheet', null);
const SEED_FROM = flag('seed-from', null);
const only = args.filter(a => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true)[0];

function probe(file) {
  const out = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=width,height,duration', '-show_entries', 'stream_side_data=rotation',
    '-show_entries', 'format=duration', '-of', 'json', file], { encoding: 'utf8' }).stdout;
  const d = JSON.parse(out);
  const s = d.streams[0];
  const rotation = Math.abs(+((s.side_data_list || []).find(x => x.rotation !== undefined) || {}).rotation || 0);
  return {
    w: s.width, h: s.height, rotation,
    seconds: +(s.duration || d.format.duration),
  };
}

// Decode the whole clip as small grayscale frames, straight into memory.
function decode(file, rotate) {
  const vf = [];
  if (rotate) vf.push(ROTATE[rotate]);
  vf.push(`fps=${FPS}`, `scale=${WIDTH}:-2`, 'format=gray');
  const cmd = ['-v', 'error'];
  if (rotate) cmd.push('-noautorotate');
  cmd.push('-i', file, '-vf', vf.join(','), '-f', 'rawvideo', '-pix_fmt', 'gray', '-');
  const r = spawnSync('ffmpeg', cmd, { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error('ffmpeg failed: ' + r.stderr.toString().slice(0, 300));

  const info = probe(file);
  // Work out the size ffmpeg actually produced. Two things can transpose it: our
  // own --rotate, and a 90/270 tag in the file that ffmpeg applies by itself
  // (which it does NOT do when we pass -noautorotate). Getting this wrong slices
  // the raw stream at the wrong stride and every frame becomes noise.
  const swap = rotate
    ? (rotate === '90' || rotate === '270')
    : (info.rotation === 90 || info.rotation === 270);
  const srcW = swap ? info.h : info.w, srcH = swap ? info.w : info.h;
  const W = WIDTH, H = Math.round(srcH / srcW * WIDTH / 2) * 2;
  const buf = r.stdout, size = W * H;
  const frames = [];
  for (let i = 0; i * size + size <= buf.length; i++) {
    frames.push({ t: i / FPS, data: buf.subarray(i * size, i * size + size), width: W, height: H });
  }
  return { frames, info };
}

const overlaps = (a, b) => Math.min(a.end, b.end) - Math.max(a.start, b.start);

function grade(clipName, opts = {}) {
  const file = path.join(FOOTAGE, clipName.endsWith('.MOV') ? clipName : clipName + '.MOV');
  if (!fs.existsSync(file)) return console.log(`${clipName}: not in footage/`);
  const labelFile = path.join(LABELS, path.basename(file).replace(/\.\w+$/, '') + '.json');
  const label = fs.existsSync(labelFile) ? JSON.parse(fs.readFileSync(labelFile, 'utf8')) : { events: [] };

  // a wrong orientation tag in the file is corrected the same way the scan tool does it
  const rotate = opts.rotate || (label.camera && label.camera.rotation_tag_wrong ? '180' : null)
    || (label.camera && /upside-down/.test(label.camera.rotation_note || '') ? '180' : null);

  const t0 = Date.now();
  const { frames, info } = decode(file, rotate);
  const series = motionSeries(frames);
  let windows = activityWindows(series, { minGap: 0.6, minLength: 0.4, pad: 0.25 });
  let track = trackSubject(series);
  let mode = 'whole frame';

  // With a seed — the tap the skater would give us — follow THAT body and judge
  // the clip by what it does, instead of by whatever changed the most pixels.
  const seedSpec = opts.seedFrom ?? (label.subject_seed ? label.subject_seed.t : null);
  if (seedSpec !== null && seedSpec !== undefined) {
    const at = +seedSpec;
    const i = series.reduce((b, f, k) => Math.abs(f.t - at) < Math.abs(series[b].t - at) ? k : b, 0);
    const box = (label.subject_seed && label.subject_seed.box)
      ? { x: label.subject_seed.box[0], y: label.subject_seed.box[1],
          w: label.subject_seed.box[2], h: label.subject_seed.box[3] }
      : track[i];
    if (box) {
      track = trackFrom(series, { t: series[i].t, box });
      windows = subjectWindows(series, track, { minGap: 0.6, minLength: 0.4, pad: 0.25 });
      mode = `seeded at ${series[i].t.toFixed(1)}s`;
    } else {
      console.log('  (no subject visible at the seed time — falling back to whole-frame)');
    }
  }
  const plan = evidencePlan(windows, { tiles: TILES, track, series });
  const secs = (Date.now() - t0) / 1000;

  const events = (label.events || []).filter(e => typeof e.t_start === 'number');
  const hits = events.map(e => {
    const win = windows.find(w => overlaps(w, { start: e.t_start, end: e.t_end }) > 0);
    return { e, win };
  });
  const found = hits.filter(h => h.win).length;
  const airtime = windows.reduce((n, w) => n + (w.end - w.start), 0);
  const handheld = windows.filter(w => w.cameraMoving).length;

  console.log(`\n${path.basename(file)}  ${info.seconds.toFixed(0)}s  ${info.w}x${info.h}` +
    `${rotate ? `  rotate ${rotate}` : ''}  ${mode}  scanned in ${secs.toFixed(1)}s`);
  console.log(`  windows ${windows.length} (${handheld} flagged camera-moving)` +
    `   airtime ${airtime.toFixed(1)}s = ${(airtime / info.seconds * 100).toFixed(0)}% of the clip` +
    `   tiles ${plan.reduce((n, p) => n + p.tiles, 0)}`);
  if (!events.length) {
    console.log('  no labeled attempts in this clip — nothing to grade, windows only');
  } else {
    console.log(`  found ${found}/${events.length} labeled attempts`);
    for (const { e, win } of hits) {
      const mark = win ? 'hit ' : 'MISS';
      console.log(`    ${mark} ${e.skill_id || e.skill || '?'} ${e.t_start}-${e.t_end}s` +
        (win ? ` -> window ${win.start.toFixed(1)}-${win.end.toFixed(1)}s peak ${win.peak.toFixed(1)}s` : ''));
    }
  }
  if (opts.verbose) {
    windows.slice(0, 12).forEach(w => console.log(
      `    window ${w.start.toFixed(1)}-${w.end.toFixed(1)}s peak ${w.peak.toFixed(1)} energy ${w.energy}` +
      (w.cameraMoving ? ' [camera moving]' : '')));
  }
  return { clip: path.basename(file), found, total: events.length, windows: windows.length, airtime, plan, series, track, file, rotate, info };
}

// Cut the tiles a window would actually send, so the evidence can be eyeballed.
function drawSheet(res, atSeconds) {
  const win = res.plan.reduce((best, p) =>
    Math.abs(p.peak - atSeconds) < Math.abs(best.peak - atSeconds) ? p : best, res.plan[0]);
  if (!win) return console.log('no windows to draw');
  const dir = path.join(WORK, path.basename(res.file, '.MOV') + '_evidence');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  win.times.forEach((t, i) => {
    const c = win.crops[i];
    const vf = [];
    if (res.rotate) vf.push(ROTATE[res.rotate]);
    if (c) {
      const W = res.info.w, H = res.info.h;
      vf.push(`crop=${Math.round(c.w * W)}:${Math.round(c.h * H)}:${Math.round(c.x * W)}:${Math.round(c.y * H)}`);
    }
    vf.push('scale=320:-2');
    const cmd = ['-v', 'error'];
    if (res.rotate) cmd.push('-noautorotate');
    cmd.push('-ss', String(t), '-i', res.file, '-frames:v', '1', '-vf', vf.join(','),
      '-q:v', '3', path.join(dir, `t_${String(i + 1).padStart(2, '0')}.jpg`));
    spawnSync('ffmpeg', cmd);
  });
  console.log(`\nevidence for window ${win.start.toFixed(1)}-${win.end.toFixed(1)}s -> ${path.relative(ROOT, dir)}` +
    ` (${win.times.length} tiles at ${win.times.map(t => t.toFixed(2)).join(', ')})`);
}

const clips = only
  ? [only]
  : fs.readdirSync(LABELS).filter(f => f.endsWith('.json') && f !== 'README.md').map(f => f.replace('.json', ''));

let found = 0, total = 0, air = 0, dur = 0;
for (const c of clips) {
  const r = grade(c, { rotate: ROT, verbose: !!only, seedFrom: SEED_FROM });
  if (!r) continue;
  found += r.found; total += r.total; air += r.airtime; dur += r.info.seconds;
  if (only && SHEET_AT) drawSheet(r, +SHEET_AT);
}
if (clips.length > 1) {
  console.log(`\n── all clips ──`);
  console.log(`found ${found}/${total} labeled attempts (${total ? (found / total * 100).toFixed(0) : 0}%)`);
  console.log(`airtime ${air.toFixed(0)}s of ${dur.toFixed(0)}s = ${(air / dur * 100).toFixed(0)}% proposed for sending`);
}
