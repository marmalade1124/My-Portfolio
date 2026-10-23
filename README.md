# Raziel Salamat — studio portfolio experiment

Experimental redesign on `codex/avea-portfolio-redesign`, based on the spatial gallery direction of [AVEA](https://avea.studio/) and its [Awwwards listing](https://www.awwwards.com/sites/avea). The current production portfolio is preserved on `main`. Do not merge or promote this branch to production until the design is accepted.

## Run locally

```powershell
pnpm install
pnpm dev --host 127.0.0.1 --port 5180
pnpm build
```

## Experience

- **Showcase:** six selected projects arranged in a CSS perspective gallery. Scroll, swipe/drag, use the previous/next buttons, or focus the gallery and press arrow keys. Click the centered project to read its details; click a neighboring card to select it.
- **List:** all 29 projects in a scrollable index, with the selected-work image stack alongside. Every index item opens its project details, including projects without images.
- **Slider:** a larger, flat preview of the selected work with the same browsing controls.
- **Menu:** selected work, project index, about/experience/education/leadership/toolkit, documents, and contact.
- **Project details:** existing descriptions, roles, technology lists, external links, case studies, screenshot evidence, and scope limitations. Screenshot galleries reuse the existing accessible viewer.
- **Documents:** original current website assets are retained: two-page CAD-focused resume and 15-page visual portfolio. Both keep expected graduation in 2027 and remain separately viewable/downloadable.

The redesign uses your existing assets and content. It does not reuse Avea's proprietary images, logo, or source bundles. CSS perspective recreates the gallery presentation without adding WebGL or other dependencies. Keyboard navigation and reduced-motion preference avoid carousel movement. The former portfolio components remain in source for comparison, but are not mounted by the experimental App.

## Structure

`src/components/studio/StudioPortfolio.tsx` owns the shell, views, and content panels; `studio.css` contains the scoped visual system. Shared project content stays in `src/lib/data.ts`. Existing `ResumeModal` and `ImageLightboxModal` retain document/gallery behavior. `src/App.tsx` mounts the experiment.

## Verify

```powershell
npx --yes --package @playwright/cli playwright-cli open http://127.0.0.1:5180/ --browser msedge
npx --yes --package @playwright/cli playwright-cli run-code --filename=tests/studio.browser.js
npx --yes --package @playwright/cli playwright-cli run-code --filename=tests/studio-motion.browser.js
```

Covers view changes, selected-project navigation, keyboard/focus behavior, case studies, galleries, all-project index, current education, resume preview, contact links, and 320/390/768/1440/1920px layouts. The older browser scripts target the stable main design. Physical-phone gestures and Safari remain separate device checks.

## Safe review

Push only `codex/avea-portfolio-redesign` for a branch preview. Do not merge into `main`, change the Vercel production branch, or promote a preview during this experiment. To return to the original locally: `git switch main` after saving branch work. Git switching changes this checkout, so close an experimental local preview when returning to main.
