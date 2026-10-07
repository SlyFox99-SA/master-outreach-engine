# NEW CLIENT ONBOARDING

## When a client says yes

They have picked a shell and paid.

## Step 1 - Copy template

./scripts/New-Client.ps1 -Name sipho-sneakers -Shell hype

Creates clients/sipho-sneakers/ from clients/_TEMPLATE/ with chosen shell.

## Step 2 - Fill config

Edit clients/sipho-sneakers/src/config.json:
- Brand name, tagline, logo URL
- Colours (theme.primary, theme.accent)
- WhatsApp number, bank details
- Products, hero title and subtitle

## Step 3 - Local test

./scripts/Build-Client.ps1 -Client sipho-sneakers
npx vite preview --outDir dist-sipho-sneakers

Open http://localhost:4173/ and verify:
- Storefront renders with their brand
- Add to cart works
- Checkout loads with their bank details
- Seller dashboard loads

## Step 4 - Deploy

./scripts/Deploy-Client.ps1 -Client sipho-sneakers

Creates Cloudflare Pages project and deploys.

## Step 5 - Domain wiring

Option A - apex domain:
Client changes nameservers at registrar to Cloudflare values.
BEFORE: screenshot their DNS records. Recreate MX records in Cloudflare if they use email.

Option B - subdomain:
Client adds CNAME: shop -> project.pages.dev
No nameserver change, no email risk.

## Step 6 - Seller access

New clients: Cloudflare Access policy on seller path. Allowed emails: client@email.com.
Client enters email, gets magic link, in.

Legacy: send URL with token param. Bookmark on phone.

## Step 7 - Handover

WhatsApp them:
- Store URL
- Seller dashboard URL
- Everything is live. Any questions, WhatsApp me.

## Addons

Apply each purchased addon:
./scripts/Apply-Addon.ps1 -Client sipho-sneakers -Addon dark-mode

## Per-client README

Each client folder has README.md with domain, package, addons, login method, deploy notes.
