#!/usr/bin/env python3
"""Insert sourced skill nodes into a tree in index.html, with validation.

  python3 tools/add-skills.py <nodes.json> <tree> [--dry-run]

<nodes.json> is a list of {id, name, type, level, prereqs, tip, source}.
<tree> is an existing tree (foundations|figure|hockey) or a new one (e.g. goalie),
which is created if it does not exist.

Refuses to write if: an id already exists, an id is malformed, a level is not one
of the four bands, a prereq points at nothing, or a node depends on itself.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / 'index.html'
LEVELS = ('beginner', 'intermediate', 'advanced', 'expert')


def skills_span(src):
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
    raise SystemExit('SKILLS block not found')


def existing_ids(block):
    return set(re.findall(r"id:'([^']+)'", block))


def esc(t):
    return str(t).replace('\\', '\\\\').replace("'", "\\'")


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    nodes = json.loads(Path(sys.argv[1]).read_text())
    tree = sys.argv[2]
    dry = '--dry-run' in sys.argv

    src = HTML.read_text()
    a, b = skills_span(src)
    block = src[a:b]
    have = existing_ids(block)
    incoming = {n['id'] for n in nodes}

    errors = []
    for n in nodes:
        nid = n.get('id', '')
        if not re.fullmatch(r'[a-z0-9-]+', nid):
            errors.append(f'malformed id: {nid!r}')
        if nid in have:
            errors.append(f'id already exists: {nid}')
        if n.get('level') not in LEVELS:
            errors.append(f"{nid}: bad level {n.get('level')!r}")
        if not n.get('name') or not n.get('type'):
            errors.append(f'{nid}: missing name or type')
        if not n.get('source'):
            errors.append(f'{nid}: no source — every node needs one')
        for p in n.get('prereqs', []):
            if p == nid:
                errors.append(f'{nid}: depends on itself')
            elif p not in have and p not in incoming:
                errors.append(f'{nid}: prereq not found: {p}')
    if errors:
        print('REFUSING TO WRITE:')
        for e in errors:
            print(' -', e)
        sys.exit(1)

    entries = ',\n    '.join(
        "{id:'%s',name:'%s',type:'%s',level:'%s',prereqs:[%s],bv:0,\n     tip:'%s'}" % (
            n['id'], esc(n['name']), n['type'], n['level'],
            ','.join(f"'{p}'" for p in n.get('prereqs', [])), esc(n.get('tip', '')))
        for n in nodes)

    m = re.search(rf"(\n  {tree}:\s*\[)", block)
    if m:                                        # append to an existing tree
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
        block = block[:end].rstrip().rstrip(',') + ',\n    ' + entries + '\n  ' + block[end:]
    else:                                        # create a new tree
        close = block.rstrip().rfind('}')
        block = block[:close].rstrip().rstrip(',') + f',\n  {tree}: [\n    ' + entries + '\n  ]\n' + block[close:]

    print(f'{len(nodes)} nodes -> {tree}')
    for n in nodes:
        print(f"  {n['id']:<26} {n['level']:<13} {n['name']}")
    if dry:
        print('\n(dry run — nothing written)')
        return
    HTML.write_text(src[:a] + block + src[b:])
    print('\nindex.html updated')


main()
