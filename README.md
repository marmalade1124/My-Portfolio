# Raziel Salamat — spatial portfolio experiment

Branch: `codex/avea-portfolio-redesign`. Main/production remain on the original portfolio. Design reference: [Avea](https://avea.studio/), its [gallery script](https://avea.studio/script.js?v=139), and [project-page presentation](https://avea.studio/forme-forme).

## Run

```powershell
pnpm install
pnpm dev --host 127.0.0.1 --port 5180
pnpm build
```

## Gallery

Seven featured projects occupy a continuous CSS 3D ring. Wheel input adds velocity; friction decays momentum and softly settles onto a project. Pointer movement directly updates position and vertical tilt, with pointer capture after a drag begins. Motion speed drives skew and scale. Selecting a neighbor travels by the shortest ring path. List and Slider share the continuous position with vertical/horizontal image arrangements; the list also exposes the complete 31-project archive.

`useGalleryMotion.ts` writes transforms through refs using `requestAnimationFrame`; React updates only when the centered project changes. Frame-time-normalized physics live in `ringPhysics.ts`. The loop sleeps when settled, pauses for overlays/project pages, and cleans up events/observers/frames. Keyboard actions are immediate. Reduced motion removes inertia, tilt, deformation, and page animation.

The presentation uses Archivo, a white canvas, image-only cards, a centered hover frame, and minimal metadata. It uses the portfolio's own project assets and branding, not Avea's images, logo, or source bundles. No Anime.js, Three.js, Lenis, Next.js migration, or new dependency is needed.

## Project pages

Every project has a direct `/work/<project-id>` URL. The existing Vercel rewrite supports refresh/deep linking. Browser back/forward and the all-work action return to the gallery; invalid project paths have a fallback.

Desktop pages use a fixed header and a horizontally arranged story. Native vertical scrolling translates the image strip horizontally, with a percentage indicator. The opening has two columns (project description and solutions), followed by existing project imagery, case-study reasoning/limitations, and the next-project link. Continuing to wheel at the start/end fills a threshold before moving to the previous/next project. Explicit navigation remains available without gestures.

Desktop project entry slides horizontally over 1.7 seconds; exit takes 420ms. Home-to-project exit takes 550ms. Keyboard/reduced-motion navigation skips animation. Phones use a vertical image stack and explicit previous/next controls. Menu Escape closes the overlay without leaving the project; Escape on the project returns to work.

## Content and documents

Menu panels retain experience, education (expected graduation 2027), leadership, skills, contact, and separate view/download actions for the two-page CAD resume and 15-page visual portfolio. PDF assets and their accessible viewer remain unchanged. Original stable portfolio components are preserved in source but not mounted.

## Checks

With the local server running:

```powershell
node tests/ring-physics.test.mjs
npx --yes --package @playwright/cli playwright-cli open http://127.0.0.1:5180/ --browser msedge
npx --yes --package @playwright/cli playwright-cli run-code --filename=tests/studio.browser.js
npx --yes --package @playwright/cli playwright-cli run-code --filename=tests/studio-motion.browser.js
```

The unit test imports TypeScript with the available Node 24 runtime. It verifies friction, targeting, settling, wrapping, direct-drag control, and rear-card orientation. Browser checks cover inertia and deformation, direct drag tilt, reduced motion, keyboard/focus, real project URLs, history, horizontal progress, mobile vertical layout, all-project index, documents, invalid routes, project entry timing, and end-of-story navigation. Older browser scripts target the stable main design. Physical-phone gestures and Safari require device testing.

## Safe review

Push only this branch for its protected Vercel preview. Do not merge into `main`, change the production branch, or promote the preview until accepted. Returning locally: save branch work, then `git switch main`.
