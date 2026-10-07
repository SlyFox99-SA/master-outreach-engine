# ARCHITECTURE

## The four layers

CLIENTS          Live businesses + demos. Own HTML/CSS/JS/config. Fully isolated.
TEMPLATES        What we sell FROM. Shells + addons. Never edited for a client.
ENGINE           Shared backend. Cloudflare Worker + D1 database.
SCRIPTS + CI     Build, deploy, onboarding automation.

## Client isolation

Each client folder in clients/<name>/ contains:
- index.html, checkout.html, main.js, style.css
- config.json (brand, products, prices, bank details)
- seller/ and track/ pages

Nothing outside the client folder is referenced.
Editing client A cannot affect client B.

## Shared infrastructure

- Cloudflare Worker - data isolated by brand column
- D1 database webforge-orders - same
- docs/ - read-only reference
- scripts/ - automation, not client code
- templates/ - source for new clients only

## Data isolation

Every order write tags the brand:
  INSERT INTO orders (brand, ref, data, created_at, status) VALUES (?, ?, ?, ?, ?)

Every seller read filters by brand:
  SELECT * FROM orders WHERE brand = ? ORDER BY created_at DESC LIMIT 500

Seller auth uses per-brand tokens. Migrating to Cloudflare Access.
See RESTRUCTURE.md Section 5.5.

## Buyer identity (no login)

Buyer flow:
1. Add to cart
2. Checkout - server generates WF-YYMMDD-XXXXXX ref
3. WhatsApp opens with prefilled message
4. Track page reads ?ref=WF-...&brand=zaheera

The ref is the only identity. Like a layby slip. High entropy.

## Cost model

Cloudflare Pages      unlimited bandwidth, free
Cloudflare Workers    100k req/day, free
Cloudflare D1         5M reads + 100k writes/day, free
Cloudinary            25GB storage + bandwidth/month, free
GitHub Actions        2000 min/month, free

Total: R0/month at current scale. R0 until roughly 200 clients.
