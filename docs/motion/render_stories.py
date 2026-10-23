"""Render the checked-in Huashu specs; publish only through deliver.py after review."""
import argparse
from pathlib import Path
import shutil
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument('--skill', type=Path, required=True, help='Installed huashu-art-motion directory (v1.2.0)')
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
engine = root / 'tmp/huashu/engine'
shutil.copytree(args.skill / 'scripts/engine', engine, dirs_exist_ok=True)
# Keep the portfolio's white presentation instead of the engine's blurred surround.
clip = engine / 'clips/t2_keynote_ui.js'
source = clip.read_text(encoding='utf-8')
start = source.index('    if (!ctx.alpha) { const bg = PAINT.cached')
end = source.index('    const f = s.f;', start)
source = source[:start] + source[end:]
start = source.index("    g.save(); g.shadowColor = 'rgba(0,0,0,.5)'")
end = source.index('    if (s.geo.fit', start)
clip.write_text(source[:start] + source[end:], encoding='utf-8')
for name in ('twentyfour', 'picolor', 'lapcat'):
    subprocess.run([sys.executable, '-X', 'utf8', str(args.skill / 'scripts/storyboard_lint.py'),
                    str(root / f'docs/motion/{name}-storyboard.md')], check=True)
    subprocess.run([sys.executable, '-X', 'utf8', str(engine / 'render.py'),
                    '--spec', str(root / f'docs/motion/{name}.json'),
                    '--out', str(root / f'tmp/huashu/{name}.mp4')], check=True)
