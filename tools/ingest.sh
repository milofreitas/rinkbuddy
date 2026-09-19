#!/bin/bash
# Move skating clips AirDropped/downloaded in the last day into footage/, then probe them.
# Usage: bash tools/ingest.sh            (last 24h from Downloads + Desktop)
#        bash tools/ingest.sh 7          (last 7 days)
cd "$(dirname "$0")/.." || exit 1
DAYS=${1:-1}
mkdir -p footage
found=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  base=$(basename "$f")
  dest="footage/$base"
  [ -e "$dest" ] && dest="footage/$(date +%H%M%S)_$base"
  mv "$f" "$dest" && echo "moved: $base" && found=$((found+1))
done < <(find ~/Downloads ~/Desktop -maxdepth 1 -type f \( -iname '*.mov' -o -iname '*.mp4' -o -iname '*.m4v' \) -mtime -"$DAYS" 2>/dev/null)
echo "$found new clip(s) in footage/"
echo
python3 tools/clips.py list
