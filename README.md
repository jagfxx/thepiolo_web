# THEPIOLO — Digital Web Studio

Premium portfolio website for **THEPIOLO**, a modern digital web studio.

## Stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Framer Motion](https://www.framer.com/motion/)

## Brand

- Background: `#13131E`
- Accent gradient: `#B440FF` → `#FF71E4` → `#FF2E2E`
- Logos: `public/THEPIOLO-05.svg` (with background), `public/THEPIOLO-ONLYLOGO-05.svg` (transparent)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

This project is **Next.js** (not a static `public/` folder).

In Vercel → Project → **Settings → General**:

| Setting | Value |
|---------|--------|
| Framework Preset | **Next.js** |
| Root Directory | *(empty)* |
| Build Command | `npm run build` |
| Output Directory | *(empty — do not use `public` or `out`)* |
| Install Command | `npm install` |

If you see `404: NOT_FOUND`, the Output Directory is usually wrong. Clear it, save, then **Redeploy** from the latest `main` commit.

`vercel.json` in the repo forces the Next.js framework.

## Languages

- English (`en`) and Spanish (`es`) via the navbar switcher (EN / ES)
- Translations in `src/lib/i18n/dictionaries/`
- Preference saved in `localStorage` (`thepiolo-locale`)

## Featured project

Transport Service Medellín — live at [transportservicemedellin.com](https://transportservicemedellin.com).  
Preview screenshot in `public/projects/tsm-preview.png`.

## Customize

- Update contact email in `src/components/Contact.tsx`
- Adjust copy in `src/lib/i18n/dictionaries/en.ts` and `es.ts`
