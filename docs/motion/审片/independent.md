# Independent motion review

Date: 2026-10-23 (Asia/Manila)
Reviewer: independent review agent; did not implement or render these clips.

## Evidence and result

Reviewed tmp/huashu/twentyfour.mp4, picolor.mp4, and lapcat.mp4 using FFprobe, eight evenly spaced extracted frames per clip, FFmpeg blackdetect/scene-difference scan, and ProductMotion.tsx plus its CSS/playback integration. Review contact sheets are in tmp/huashu/review/.

All three files are silent H.264, 960×600, 24 fps, exactly 8.000 seconds. Sampled frames contain their intended actual screenshots throughout. No black spans or rapid high-difference scene cuts were reported by the scan. Screenshot transitions preserve the white visual treatment. No delivery blocker found in the inspected evidence.

## Findings

- Nonblocking framing tradeoff: TwentyFour and Lapcat portrait screens occupy a narrow central portion of the 8:5 video. Their overall interface is visible, but small text cannot be read comfortably at inline/mobile sizes. Treat these as visual overviews, not tutorials; keep the original gallery screenshots available. 3.14 fills the video more effectively.
- Claims are appropriately bounded in the visible captions: TwentyFour identifies demo photographs/no upload here; Lapcat identifies browser-preview screenshots rather than an outdoor GPS recording. The process diagrams explicitly say they illustrate a workflow and do not run the apps/send data. This review does not independently verify the apps' backend or recording behavior.
- Videos are user-started with native controls, no autoplay, and pause when their region leaves view or the page becomes hidden. Playback errors provide a readable fallback. Cover loops have a global pause button, only animate while centered, and respect reduced motion/document visibility. The shutter is one slow closure/opening per six-second loop rather than rapid repeated flashing.
- Process timing is bounded to eight seconds and reduced-motion users retain the static explanatory steps.

## Limits

Frame/metadata/code review and automated scene scans were performed; continuous normal-speed audiovisual playback, physical devices, Safari, and assistive-technology interaction were not independently exercised here. A browser main-journey check remains the implementer's responsibility. These are screenshot stories, not recordings of live app interactions.
