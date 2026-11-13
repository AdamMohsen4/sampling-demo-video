# Sampling demo video

A ~2½-minute Swedish walkthrough of Sampling (Urval), function by function, ending with Pollflow AI's suggestion
cards and "Visa i sidan". Built with Remotion from real captures of the product.

- `src/storyboard.ts`: chapters, Swedish copy, timing and what each beat zooms to, points at and highlights.
- `src/components/Tour.tsx`: the camera, cursor, highlights, callouts and caption card.
- `public/shots/*.png` + `src/data/manifest.json`: 2× captures and the boxes (CSS px in a 1920×1080 viewport).
- `capture/`: the scripts that made them.

## Preview and render

```bash
npm i
npx remotion studio          # preview, every chapter is its own composition under "Chapters"
npx remotion render SamplingDemo out/pollflow-sampling-demo.mp4 --crf=16
```

## Re-capturing after UI changes

The captures come from an isolated stack, so nobody's dev data is touched: flow-survey-api on port 3100 against a
`flowsurvey_demo` database, its survey-api stand-in on 4600 (`PORT=4600 node scripts/fake-survey-api.mjs`), and the
webapp on 5176 (`VITE_API_URL=http://localhost:3100 npx vite --port 5176`). Then:

1. `node capture/seed.mjs` (draft + live project) and `node capture/seed-live.mjs` (a mid-field live project).
2. Log in once as `qa@example.com` and save Playwright's storage state as `auth.json` next to the scripts.
3. `node capture/capture.mjs <dir>`: writes the PNGs and `manifest.json` into `<dir>/capture`; copy them to
   `public/shots` and `src/data`. The `a*` states call Pollflow AI (two OpenAI turns) and approve one suggestion.

Project ids in the scripts (3, 26) are the ones the seed produced; adjust them if yours differ.
