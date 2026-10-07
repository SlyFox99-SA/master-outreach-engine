# RESTRUCTURE PLAN

Status: PROPOSAL — nothing moves until approved.

## 1. Purpose

Move from shared-engine to fully isolated client folders. Editing one client cannot affect any other. Ever.

Keep one shared worker + D1 for now — data isolated by brand column. Migrate to per-client workers around 10 clients.

## 2. Current problem

All clients share main.js, style.css, checkout.html, seller/, track/. A change meant for one can ripple into another.

## 3. Target state

clients/<name>/ — own src/, own config, own seller/, own track/. Self-contained.

templates/shells/ — sellable designs.
templates/addons/ — purchasable features.
templates/engine/ — shared reference.

## 4. Isolation rules

1. Clients never import from templates.
2. Editing a client = only that client folder.
3. Editing a shell = new clients only.
4. Shared fix = explicit Migrate-Client.ps1 run.
5. Deploy = build only their folder.

## 5. Shared worker + D1 (current decision)

Worker: outreach-save-api.gifttsima16.workers.dev
D1: webforge-orders

Data isolated by brand column. Every insert tags the brand. Every seller read filters by brand. Auth via per-brand tokens (transitioning to Cloudflare Access — see 5.5).

Acceptable until ~10 clients. Then migrate per-client.

## 5.5 Seller identity (Cloudflare Access)

Current: bearer token in URL (?t=<40-char-secret>).
Target: Cloudflare Access magic-link. Free up to 50 users.

How: set policy /seller/* requires login. Client enters email, gets magic link, clicks, in.

What stays login-free: buyers, public site, cart, checkout, tracking.
Login only for seller dashboard.

Migration: new clients get Access day one. Existing clients retrofit per-client, zero downtime.

## 6. Migration to per-client workers

At ~10 clients: copy worker per client, create per-client D1, migrate rows, switch over. Zero downtime. Per-client rollback available.

Trigger: 10+ clients, or any single client traffic degrades shared worker, or compliance needs isolation.

## 7. Phase plan

0. git tag working-v1
1. docs folder (DONE)
2. clients/_TEMPLATE
3. Move Zaheera
4. Move 3 other clients
5. Move engine
6. Move shells
7. Archive old verticals
8. Rewrite build scripts
9. Push

One phase per session. Local verify before push. git revert if broken.

## 8. Safety nets

Tag before each phase. Local build verify. Never push without verification. Cloudflare keeps full deploy history.

## 9. What stays shared

Worker, D1, docs, scripts, templates.
NOT client HTML/CSS/JS/config.

## 10. Addons

Purchasable features. In templates/addons/<name>/.
Applied via Apply-Addon.ps1. Per-client, no cross-effect.

## 11. Client folder layout

clients/<name>/
  README.md    domain, package, addons, notes
  src/         index.html, checkout.html, main.js, style.css, config.json
  seller/      admin panel
  track/       tracking page
  DEPLOYS.md   deploy history

Nothing outside this folder referenced. Copy elsewhere = works.

## 12. Glossary

Shell — sellable storefront design.
Client — one business who bought a shell.
Template — pristine source we copy from.
Engine — shared backend (worker + D1).
Addon — purchasable feature.
Fork — copy template into new client folder.

## 13. Approval

This document is the plan. Nothing moves until approved.
