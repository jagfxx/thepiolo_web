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

## Deploy en VPS (recomendado — misma VPS que TSM-WEB)

Deploy automático con **GitHub Actions** + **PM2** + **Nginx**.

- TSM-WEB → puerto **3000** (`tsm-web`)
- THEPIOLO → puerto **3001** (`thepiolo-web`)

Guía completa: [.github/DEPLOY_SETUP.md](.github/DEPLOY_SETUP.md)

**En GitHub (repo `thepiolo_web`)** copia los mismos secrets que en TSM-WEB:

`VPS_HOST`, `VPS_USER`, `VPS_KEY` solamente (este repo **no** envía correos; TSM-WEB sí).

**En la VPS (una vez):** clonar repo, `npm run build`, `pm2 start ecosystem.config.js`, configurar Nginx (`nginx-config-thepiolo.txt`).

Cada push a `main` despliega solo.

## Deploy on Vercel (opcional)

This project is **Next.js** (not a static `public/` folder).

In Vercel → Project → **Settings → General**:

| Setting | Value |
|---------|--------|
| Framework Preset | **Next.js** |
| Root Directory | *(empty)* |
| Build Command | `npm run build` |
| Output Directory | *(empty — do not use `public` or `out`)* |
| Install Command | `npm install` |

Hobby + repo privado: el autor del commit debe ser el dueño de la cuenta Vercel, o usa la VPS.

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
