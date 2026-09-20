#!/usr/bin/env python3
"""Prepare rink footage so Claude can scan it in-chat (no API, no cost).

  python3 tools/clips.py list                       # probe every clip in footage/
  python3 tools/clips.py sheets <clip> [options]    # contact sheets Claude reads
  python3 tools/clips.py burst <clip> <t> [options] # dense frames around one moment

Sheets are numbered grids with a timestamp burned into each frame, so Claude can
say "frame 14 (3.75s): takeoff" and we can jump straight back to that moment.

Options: --fps 4  --cols 5 --rows 4  --width 640  --start 0 --end 30
         --crop x,y,w,h   (crop to the skater first — big accuracy win at distance)
         --rotate 90|180|270  (ignore the file's orientation tag and turn the raw
                               frame clockwise — iPhones propped on the boards
                               often tag it wrong and every player shows it sideways)
"""
import json, os, subprocess, sys, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FOOTAGE, WORK = ROOT / 'footage', ROOT / 'work'
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
VIDEO_EXT = {'.mov', '.mp4', '.m4v', '.avi', '.webm', '.mkv'}
ROTATE = {'0': '', '90': 'transpose=1', '180': 'hflip,vflip', '270': 'transpose=2'}


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(cmd[:3])}...\n{r.stderr.strip()[:600]}")
    return r.stdout


def probe(path):
    out = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
               'stream=avg_frame_rate,width,height,nb_frames,duration,codec_name',
               '-show_entries', 'format=duration', '-of', 'json', str(path)])
    d = json.loads(out); s = d['streams'][0]
    num, den = (s.get('avg_frame_rate') or '0/1').split('/')
    fps = float(num) / float(den) if float(den) else 0.0
    dur = float(s.get('duration') or d.get('format', {}).get('duration') or 0)
    return {'name': path.name, 'fps': round(fps, 2), 'w': s.get('width'), 'h': s.get('height'),
            'seconds': round(dur, 2), 'codec': s.get('codec_name'),
            'size_mb': round(path.stat().st_size / 1e6, 1)}


def find_clip(name):
    p = Path(name)
    if p.exists() and p.suffix.lower() in VIDEO_EXT:
        return p
    hits = [f for f in sorted(FOOTAGE.iterdir()) if f.suffix.lower() in VIDEO_EXT
            and name.lower() in f.name.lower()] if FOOTAGE.exists() else []
    if not hits:
        sys.exit(f"no clip matching {name!r} in footage/")
    return hits[0]


def opts(argv):
    o = {'fps': 4.0, 'cols': 5, 'rows': 4, 'width': 640, 'start': 0.0, 'end': None, 'crop': None, 'rotate': None}
    i = 0
    while i < len(argv):
        k = argv[i].lstrip('-')
        if k not in o:
            sys.exit(f"unknown option --{k}")
        v = argv[i + 1]
        o[k] = v if k in ('crop', 'rotate') else (int(v) if k in ('cols', 'rows', 'width') else float(v))
        i += 2
    if o['rotate'] is not None and o['rotate'] not in ROTATE:
        sys.exit('--rotate takes 0, 90, 180 or 270 (clockwise, applied to the raw frame)')
    return o


def extract(clip, o, outdir, fps, start, duration):
    outdir.mkdir(parents=True, exist_ok=True)
    for f in outdir.glob('*.jpg'):
        f.unlink()
    vf = []
    if o['crop']:
        vf.append('crop=' + ':'.join(x.strip() for x in o['crop'].split(',')[2:] + o['crop'].split(',')[:2]))
    if o['rotate'] is not None:
        # iPhones propped on the boards often tag the wrong orientation, so every
        # player shows the clip sideways. --rotate ignores the tag and turns the raw
        # frame by hand. Check `clips.py list` for a clip whose picture looks wrong.
        vf += [f for f in [ROTATE[o['rotate']]] if f]
    vf += [f"fps={fps}", f"scale={o['width']}:-2"]
    cmd = ['ffmpeg', '-loglevel', 'error']
    if o['rotate'] is not None:
        cmd.append('-noautorotate')
    cmd += ['-ss', str(start)]
    if duration is not None:
        cmd += ['-t', str(duration)]
    cmd += ['-i', str(clip), '-vf', ','.join(vf), '-q:v', '3', str(outdir / 'f_%04d.jpg')]
    run(cmd)
    return sorted(outdir.glob('f_*.jpg'))


def sheets(frames, outdir, cols, rows, start, fps, tag):
    """Tile frames into numbered grids with timestamps burned in."""
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.truetype(FONT, 22)
    per = cols * rows
    made = []
    for s in range(math.ceil(len(frames) / per)):
        chunk = frames[s * per:(s + 1) * per]
        w, h = Image.open(chunk[0]).size
        sheet = Image.new('RGB', (cols * w, math.ceil(len(chunk) / cols) * h), 'black')
        draw = ImageDraw.Draw(sheet)
        for i, fp in enumerate(chunk):
            x, y = (i % cols) * w, (i // cols) * h
            sheet.paste(Image.open(fp), (x, y))
            n = s * per + i + 1
            label = f"{n}  {start + (n - 1) / fps:.2f}s"
            draw.rectangle([x + 4, y + 4, x + 10 + draw.textlength(label, font=font), y + 34], fill='black')
            draw.text((x + 8, y + 6), label, fill='#00e5ff', font=font)
            draw.rectangle([x, y, x + w - 1, y + h - 1], outline='#333')
        out = outdir / f"{tag}_sheet{s + 1}.jpg"
        sheet.save(out, quality=80, optimize=True)
        made.append(out)
    return made


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    cmd = sys.argv[1]

    if cmd == 'list':
        clips = [f for f in sorted(FOOTAGE.iterdir()) if f.suffix.lower() in VIDEO_EXT] if FOOTAGE.exists() else []
        if not clips:
            print('footage/ is empty — drop .mov/.mp4 clips there'); return
        for c in clips:
            p = probe(c)
            print(f"{p['name']:<40} {p['seconds']:>6.2f}s  {p['fps']:>6.2f} fps  {p['w']}x{p['h']}  {p['size_mb']:>6.1f} MB  {p['codec']}")
        return

    if cmd in ('sheets', 'burst'):
        clip = find_clip(sys.argv[2])
        if cmd == 'burst':
            t = float(sys.argv[3]); o = opts(sys.argv[4:])
            if o['fps'] == 4.0: o['fps'] = 15.0
            start, dur, tag = max(0.0, t - 1.0), 2.5, f"burst_{t:g}s"
        else:
            o = opts(sys.argv[3:])
            start = o['start']; dur = (o['end'] - start) if o['end'] else None
            tag = 'sheet'
        outdir = WORK / clip.stem
        frames = extract(clip, o, outdir / tag, o['fps'], start, dur)
        made = sheets(frames, outdir, o['cols'], o['rows'], start, o['fps'], tag)
        info = probe(clip)
        print(f"{clip.name}: {info['seconds']}s @ {info['fps']} fps native")
        print(f"{len(frames)} frames at {o['fps']} fps, {o['width']}px wide")
        for m in made:
            print(m.relative_to(ROOT))
        return

    sys.exit(__doc__)


if __name__ == '__main__':
    main()
