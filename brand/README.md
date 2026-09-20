# RinkBuddy brand assets

Master files for the logo. Spec: `docs/superpowers/specs/2026-09-19-brand-identity-design.md`.

| File | Use |
|---|---|
| `rinkbuddy-skate.svg` | Frost `#E8F1F7` skate, for dark backgrounds and the store icon |
| `rinkbuddy-skate-navy.svg` | Navy `#0F2338` skate, for light backgrounds |
| `rinkbuddy-skate-simple.svg` / `-navy.svg` | Fewer interior details — use below 24px |
| `rinkbuddy-store.png` | 1024×1024 store icon, navy field, no alpha |
| `rinkbuddy-mark*.svg` | Speech-bubble versions, alternates, not in active use |
| `icon-render.html` | Regenerates `rinkbuddy-store.png` (see below) |

Regenerate the store icon after changing the mark:

```bash
cd brand && "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --allow-file-access-from-files --hide-scrollbars \
  --screenshot=rinkbuddy-store.png --window-size=1024,1024 icon-render.html
```

Source art the vectors were traced from lives outside the repo, in
`~/Documents/Claude/Nano Banana/outputs/rinkbuddy/batch-2026-09-19/`.
