# Boast IQ — marketing site

Static marketing site for boast-iq.com. Deployed via Cloudflare Pages from this repo.

## Files

- `index.html` — landing page (the only HTML the host serves at `/`)
- `landing.css` — design system + section styles
- `landing.js` — sticky nav, stat counters, court-tab switcher, FAQ accordion
- `assets/` — dashboard screenshot, player heatmap, shot map

## Deploy — Cloudflare Pages + GoDaddy DNS

### 1. Push to GitHub

```bash
cd /Users/kabeerahuja/Download/Coding/boast-iq-web
git init
git add .
git commit -m "Initial marketing site"
# Create a new EMPTY repo at github.com/new (no README, no .gitignore — we have those)
# Then:
git remote add origin https://github.com/<your-username>/boast-iq-web.git
git branch -M main
git push -u origin main
```

### 2. Connect Cloudflare Pages

1. Sign up / log in at [cloudflare.com](https://cloudflare.com).
2. Workers & Pages → Create application → Pages → Connect to Git.
3. Select `boast-iq-web` repo.
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `/`
5. Save and Deploy. First deploy in ~30 seconds. You get a `<project>.pages.dev` URL.

### 3. Add boast-iq.com as a custom domain

In the Cloudflare Pages project → Custom domains → Set up a custom domain:

- Add `boast-iq.com` (apex)
- Add `www.boast-iq.com`

Cloudflare shows the exact DNS records to add.

### 4. GoDaddy DNS

Easiest path — change nameservers to Cloudflare (recommended):

1. In Cloudflare, add `boast-iq.com` as a site (Add a site → Free plan).
2. Cloudflare gives you 2 nameservers, e.g. `ana.ns.cloudflare.com` and `chad.ns.cloudflare.com`.
3. GoDaddy → My Products → DNS for `boast-iq.com` → Nameservers → Change → Enter the 2 Cloudflare nameservers.
4. Wait 5 minutes to ~24 hours for propagation. Cloudflare emails you when active.
5. Back in Cloudflare Pages → Custom domains, both `boast-iq.com` and `www.boast-iq.com` will turn green. SSL auto-provisions.

Alternative — keep GoDaddy DNS:

1. In GoDaddy DNS for `boast-iq.com`, add the records Cloudflare Pages shows you (a CNAME for `www` and a CNAME-flattened `@` record, OR an A record to Cloudflare's IP).
2. Delete the GoDaddy parking-page A records pointing to `parkingcrew.net` or similar.

### 5. After it's live

Update the tracker-app links in `index.html`. Currently they point to `#` (placeholder). Replace with your live tracker URL:

```bash
# In index.html, change every href="#" that's a CTA button to:
href="https://<your-workspace>--boastiq-tracker-web.modal.run"
# (or app.boast-iq.com once you set that subdomain up)
```

The CTAs to update: nav "Sign in" + "Try free", hero "Upload a match", pricing "Get started" + "Start 7-day trial", final CTA "Try Boast IQ", footer "Try free".

## Local preview

```bash
cd /Users/kabeerahuja/Download/Coding/boast-iq-web
python3 -m http.server 8000
# open http://localhost:8000
```
