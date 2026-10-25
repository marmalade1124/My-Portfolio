# Product motion trial

Three native CSS/SVG cover loops, three eight-second Huashu-rendered screenshot stories, and native animated workflow explanations. The Lapcat app and website share one app overview. The approved portfolio is published from `main`; the redesign branch retains its preview.

The videos use Huashu Art Motion v1.2.0's `t2_keynote_ui` grammar, 960×600 at24fps, silent H.264. Its blurred surround/shadow are removed in a temporary engine copy to preserve the white portfolio design. No added runtime dependency. Covers and process diagrams use web CSS/SVG; they are not exported Huashu video scenes.

## Behavior

- Only the centered cover animates; Pause cover motion stops it. Reduced-motion preference and hidden tabs disable cover loops.
- Stories wait for native Play controls, preload no video bytes, and pause when offscreen or when the tab is hidden. Browser autoplay permission is never needed. Media errors leave a readable fallback and the original gallery available.
- Process diagrams play once for eight seconds on request. Reduced motion shows the complete static list. They explain the workflow and do not execute product actions.
- TwentyFour uses demo photographs. Lapcat uses browser-preview screenshots, not an outdoor recording. 3.14 uses existing native-app renders. Portrait shots in these landscape overview clips are smaller than the original gallery images; fullscreen and the gallery remain available for detail.

## Rebuild and verify

Requires Python with Playwright, NumPy and Pillow, an installed Playwright Chromium, FFmpeg/FFprobe, and the installed Huashu skill. The engine is copied into ignored/untracked `tmp/huashu/engine`; no skill installation files are modified.

```powershell
python docs/motion/render_stories.py --skill C:/Users/razie/.codex/skills/huashu-art-motion
$skillRoot = 'C:/Users/razie/.codex/skills/huashu-art-motion'
foreach ($clip in @('twentyfour', 'picolor', 'lapcat')) {
  python -X utf8 "$skillRoot/scripts/qa.py" --project tmp/huashu/engine --spec "docs/motion/$clip.json" --out "tmp/huashu/qa/$clip" --sub-band 0
}
```

Inspect all clips at normal speed and obtain an independent review in `docs/motion/审片/` before running the skill's `deliver.py`. Existing delivery reports include gate metrics and independent-review evidence. Run `deliver.py` with `--spec docs/motion/<name>.json --root docs/motion --qa tmp/huashu/qa/<name> --out tmp/huashu/delivery/<name>`. It needs NumPy/OpenCV (`uv run --with numpy --with opencv-python-headless python -X utf8 ...`). Publish the gated MP4 to `public/motion/` and copy its generated report without changing the fingerprinted facts.

Browser checks, with the dev server and Playwright CLI browser open:

```powershell
npx --yes --package @playwright/cli playwright-cli run-code --filename=tests/product-motion.browser.js
```

Physical-device performance and Safari playback are not verified. Gate warnings about white area are accepted for this deliberately plain screenshot overview; no blank scenes or rapid flashing were detected. Reports retain their original machine-generated host timestamps; the project/review date is2026-10-23 Asia/Manila.
