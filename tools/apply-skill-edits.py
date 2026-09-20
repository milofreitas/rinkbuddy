#!/usr/bin/env python3
"""Apply the audited skill-tree edits (stages 1 and 2) to the SKILLS catalog in index.html.

Stage 1 = level + prereq corrections on existing skills (no id changes).
Stage 2 = new skills the official curricula require.

Edits come from the JSON blocks in research/09|10|11-audit-*.md. Existing entries
are patched in place so their tips survive; new entries are appended to their tree.

  python3 tools/apply-skill-edits.py --dry-run
  python3 tools/apply-skill-edits.py
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
AUDITS = {'foundations': 'research/09-audit-foundations.md',
          'figure': 'research/10-audit-figure.md',
          'hockey': 'research/11-audit-hockey.md'}
LEVELS = ('beginner', 'intermediate', 'advanced', 'expert')
DRY = '--dry-run' in sys.argv


def load_edits():
    out = {}
    for tree, f in AUDITS.items():
        m = re.search(r'```json\n(.*?)```', (ROOT / f).read_text(), re.S)
        out[tree] = json.loads(m.group(1))
    return out


def skills_block(src):
    """Return (start, end) offsets of the SKILLS object literal."""
    start = src.index('const SKILLS')
    i = src.index('{', start)
    depth = 0
    for j in range(i, len(src)):
        if src[j] == '{':
            depth += 1
        elif src[j] == '}':
            depth -= 1
            if depth == 0:
                return start, j + 1
    raise SystemExit('could not find the SKILLS block')


def split_entries(arr_src):
    """Split one tree's array source into individual {...} entry strings."""
    entries, depth, buf = [], 0, ''
    for ch in arr_src:
        if ch == '{':
            depth += 1
        if depth:
            buf += ch
        if ch == '}':
            depth -= 1
            if depth == 0:
                entries.append(buf)
                buf = ''
    return entries


def entry_id(e):
    m = re.search(r"id:\s*'([^']+)'", e)
    return m.group(1) if m else None


def set_field(entry, field, value):
    if field == 'prereqs':
        js = '[' + ','.join(f"'{p}'" for p in value) + ']'
        pat = re.compile(r"prereqs:\s*\[[^\]]*\]")
    else:
        js = f"{field}:'{value}'"
        pat = re.compile(rf"{field}:\s*'[^']*'")
        return pat.sub(js, entry, count=1)
    return pat.sub('prereqs:' + js, entry, count=1)


def wanted(edit):
    """Extract the level/prereq changes an edit asks for (stage 1 only)."""
    to = edit.get('to')
    out = {}
    if isinstance(to, dict):
        if to.get('level') in LEVELS:
            out['level'] = to['level']
        if isinstance(to.get('prereqs'), list):
            out['prereqs'] = to['prereqs']
    elif isinstance(to, str) and to in LEVELS:
        out['level'] = to
    elif isinstance(to, list):
        out['prereqs'] = to
    return out


def main():
    src = HTML.read_text()
    a, b = skills_block(src)
    block = src[a:b]
    edits = load_edits()
    report = {'level': [], 'prereqs': [], 'added': [], 'skipped': []}

    for tree, tree_edits in edits.items():
        m = re.search(rf"{tree}:\s*\[", block)
        if not m:
            raise SystemExit(f'tree {tree} not found')
        # find this tree's array span
        i = block.index('[', m.start())
        depth, end = 0, i
        for j in range(i, len(block)):
            if block[j] == '[':
                depth += 1
            elif block[j] == ']':
                depth -= 1
                if depth == 0:
                    end = j
                    break
        arr_src = block[i + 1:end]
        entries = split_entries(arr_src)
        by_id = {entry_id(e): k for k, e in enumerate(entries)}

        adds = []
        for ed in tree_edits:
            change = str(ed.get('change', '')).lower()
            sid = ed.get('id')
            if change.startswith('add'):
                spec = ed.get('to') or {}
                nid = spec.get('id') or sid
                if not nid or nid in by_id:
                    report['skipped'].append((tree, nid, 'already present'))
                    continue
                why = (ed.get('why') or '').split('.')[0][:150]
                adds.append("{id:'%s',name:%s,type:'%s',level:'%s',prereqs:[%s],bv:0,\n     tip:%s}" % (
                    nid, json.dumps(spec.get('name', nid)), spec.get('type', 'skating'),
                    spec.get('level', 'beginner'),
                    ','.join(f"'{p}'" for p in spec.get('prereqs', [])),
                    json.dumps(why)))
                report['added'].append((tree, nid, spec.get('level')))
                continue
            # stage 1: level / prereqs on an existing entry
            if sid not in by_id:
                report['skipped'].append((tree, sid, 'id not in catalog'))
                continue
            w = wanted(ed)
            if not w:
                report['skipped'].append((tree, sid, f"no level/prereq change in '{ed.get('change')}'"))
                continue
            k = by_id[sid]
            e = entries[k]
            if 'level' in w:
                cur = re.search(r"level:\s*'([^']+)'", e).group(1)
                if cur != w['level']:
                    e = set_field(e, 'level', w['level'])
                    report['level'].append((tree, sid, cur, w['level']))
            if 'prereqs' in w:
                cur = re.search(r"prereqs:\s*\[([^\]]*)\]", e).group(1)
                new = ','.join(f"'{p}'" for p in w['prereqs'])
                if cur.replace(' ', '') != new:
                    e = set_field(e, 'prereqs', w['prereqs'])
                    report['prereqs'].append((tree, sid, cur, new))
            entries[k] = e

        new_arr = ',\n    '.join(entries + adds)
        block = block[:i + 1] + '\n    ' + new_arr + '\n  ' + block[end:]

    for k in ('level', 'prereqs', 'added', 'skipped'):
        print(f"{k}: {len(report[k])}")
    for t, sid, frm, to in report['level']:
        print(f"  level   {t[:4]:<4} {sid:<24} {frm} -> {to}")
    for t, sid, lv in report['added']:
        print(f"  added   {t[:4]:<4} {sid:<24} ({lv})")
    for t, sid, why in report['skipped']:
        print(f"  skipped {t[:4]:<4} {str(sid):<24} {why}")

    if DRY:
        print('\n(dry run — nothing written)')
        return
    HTML.write_text(src[:a] + block + src[b:])
    print('\nindex.html updated')


main()
