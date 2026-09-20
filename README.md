# Jane &amp; Ian — Wedding RSVP

One-page wedding site for **Jane &amp; Ian**, Tuesday, October 20, 2026 at Kofi &amp; Kompany, Molo, Iloilo City.

Built with Next.js 14 (App Router). RSVPs are collected through a Google Form.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

`next.config.mjs` sets `output: 'export'`, so the build writes a fully static site to `./out`. That folder can be dropped on any host — Netlify, GitHub Pages, S3, Cloudflare Pages.

## Editing content

All copy lives in **`lib/content.js`** — names, date, schedule rows, venue address, dress-code text, palette, RSVP link. Nothing is hardcoded in the components, so a text change is a one-line edit there.

To change where the RSVP button points, edit `RSVP_URL` at the top of that file.

## Photos

Everything is in `public/images/`. Replace a file in place and keep the name:

| File | Where it appears |
| --- | --- |
| `save-the-date.jpg` | Floating invitation card in the hero |
| `hero-left.jpg`, `hero-right.jpg` | Photo band behind the card |
| `story.jpg` | Our story section |
| `gallery-1…4.jpg` | "Us, lately" instax prints |

`hero-left`, `hero-right` and `story` currently reuse gallery photos as stand-ins — swap them for dedicated shots when you have them.

## Deploying

### Vercel (easiest)
Import the repo at vercel.com. Remove `output: 'export'` from `next.config.mjs` first if you want server rendering and image optimization.

### Netlify
```bash
npm run build
```
Drag the `out/` folder onto https://app.netlify.com/drop.

### GitHub Pages
Uncomment `basePath` and `assetPrefix` in `next.config.mjs`, then publish `out/` to the `gh-pages` branch.

## Structure

```
app/
  layout.jsx      fonts, metadata, <html> shell
  page.jsx        section order
  globals.css     all styling — CSS custom properties for the palette
components/
  Hero, Story, Schedule, Venue, Gallery, Footer
  Reveal.jsx      scroll-in animation wrapper
  RsvpButton.jsx  shared CTA
lib/
  content.js      every string on the site
```

## Palette

| Token | Hex |
| --- | --- |
| Navy | `#232D39` |
| Burgundy | `#4F2427` |
| Rust | `#6D3C35` |
| Ochre | `#8D6339` |
| Sand | `#C1B394` |
| Dusty rose | `#906560` |

Defined as CSS custom properties at the top of `app/globals.css`.
