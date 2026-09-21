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
| `hero-left.png`, `hero-right.png` | Photo band behind the card — the venue, then the couple |
| `gallery-1…4.jpg` | "Us, lately" instax prints |
| `how-we-met.jpg`, `becoming-us.jpg`, `the-question.jpg`, `she-said-yes.jpg` | The four "How we got here" chapters, in that order |
| `og-hero.jpg` | Link preview on Facebook, Messenger, iMessage — a 1200×630 snapshot of the hero |

To swap a story photo, replace the file in place, or change `src` and `alt` on
that chapter in `story.chapters`.

## Link previews

`app/layout.jsx` sets `metadataBase` to the live URL, which is what makes the
Open Graph tags absolute — Facebook cannot read a relative or `localhost`
image. If the site moves to another domain, change `SITE_URL` there.

`og-hero.jpg` is a screenshot of the hero at 1200×630. Redo it whenever the
hero changes: `npm run build`, serve `./out`, and grab the top of the page
scrolled just far enough to fit the JANE & IAN line.

Facebook caches previews hard. After deploying, paste the URL into the
[Sharing Debugger](https://developers.facebook.com/tools/debug/) and hit
**Scrape Again**, or the old preview will keep showing.

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
