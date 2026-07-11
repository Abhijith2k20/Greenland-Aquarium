# Greenland Aquarium

Website for **Greenland Aquarium** (Horamavu, Bengaluru).

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, GSAP, Lenis
- **CMS:** [Sanity](https://www.sanity.io) — client only manages **Category**, **Collection Item**, and **Homepage Featured**
- **Contact:** WhatsApp (default). Optional Formspree email if you set an endpoint.

Store phone, hours, and address stay in code on purpose so the client dashboard stays simple.

## Quick start

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_SANITY_PROJECT_ID to your Sanity project id
npm run dev
```

Site: http://localhost:5173

### Sanity Studio (for the client)

```bash
cd studio
npm install
# Set SANITY_STUDIO_PROJECT_ID in .env
npm run dev
```

Studio: http://localhost:3333

In Studio the client only needs to:

1. **Category** — homepage collection tiles  
2. **Collection Item** — name, category, price, image  
3. **Homepage Featured** — name, subtitle, description, image  

In [sanity.io/manage](https://www.sanity.io/manage) → API → CORS origins, add:

- `http://localhost:5173`
- your live site URL (e.g. `https://www.example.com`)

Then deploy Studio for the client (so they don’t need localhost):

```bash
cd studio
npx sanity login
npm run deploy
```

Invite the client as an editor/admin on the Sanity project.

## Environment

**`frontend/.env`**

```bash
VITE_SANITY_PROJECT_ID=yourProjectId
VITE_SANITY_DATASET=production
VITE_SITE_URL=https://your-domain.com
# Optional
# VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxx
# VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
```

After setting `VITE_SITE_URL`, update `frontend/public/robots.txt` and `frontend/public/sitemap.xml` and replace `REPLACE_WITH_DOMAIN` with the same domain.

## Deploy (Cloudflare Pages)

1. Push this repo to GitHub/GitLab
2. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → connect the repo
3. Build settings:
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler pages deploy dist`  
     (do **not** use `npx wrangler deploy` — that is for Workers and will fail)
   - **Build output directory:** `dist`
4. Add environment variables (Production):
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET` = `production`
   - `VITE_SITE_URL` = `https://your-domain.com`
5. Deploy, then add your custom domain under the Pages project
6. Add the production URL to Sanity CORS
7. Update `public/robots.txt` and `public/sitemap.xml` (`REPLACE_WITH_DOMAIN`)

SPA routes (`/collection`, `/privacy`) are handled by `public/_redirects` for Cloudflare Pages.

## Contact form

By default the Visit form opens **WhatsApp** with the visitor’s message. That is intentional for a non-technical store owner.

To use email instead, create a Formspree form and set `VITE_FORMSPREE_ENDPOINT`.

## Before client handover

- [ ] All products uploaded in Sanity (real photos, not Unsplash fallbacks)
- [ ] Real Google Maps “Share → Embed” URL pasted into `frontend/src/data/content.js` → `STORE.mapsEmbed` (optional upgrade)
- [ ] Social profile URLs added in `STORE.socials` (Instagram / Facebook / YouTube) — leave blank to hide icons
- [ ] Replace sample review quotes in `content.js` with real ones if desired
- [ ] `VITE_SITE_URL` + robots/sitemap domain filled in
- [ ] Sanity Studio deployed + client invited
- [ ] Live CORS origin added
- [ ] Soft launch checklist: mobile smoke test, WhatsApp message test, `/collection` hard refresh

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| frontend | `npm run dev` | Local site |
| frontend | `npm run build` | Production build |
| studio | `npm run dev` | Local Sanity Studio |
| studio | `npm run deploy` | Hosted Studio for the client |

## Brand

- Tagline: *Bring Nature Home.*
- Phone: +91 96112 69901
- Hours: 10:00 AM – 10:00 PM (every day)
- Address: 1, SLN Complex, Opp. Anjaneya Temple, Horamavu, Bengaluru 560113
# Greenland-Aquarium
