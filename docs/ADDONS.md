# ADDONS

Purchasable features applied to a client site after purchase.

## Price list

| Addon | Price | What it does |
|---|---|---|
| Dark mode toggle | +R500 | Light/dark switch, saves preference |
| Animation pack | +R2,000 | Parallax, scroll reveals, hover |
| Live chat widget | +R1,500 | Sidebar chat relays to seller WhatsApp |
| Payment gateway | +R1,500 | PayFast, Yoco, Ozow |
| SMS order alerts | +R2,500 | SMS to seller on new order |
| Email receipts | +R1,000 | Auto-email buyer order ref |
| Multi-admin | +R3,000 | Up to 5 seller logins |
| Extra page | +R1,500 | About, FAQ, Blog |
| Domain setup | +R500 | We wire their domain |
| Copywriting | +R2,500 | We write site copy |
| Product photography | +R3,500 | Cape Town, half-day shoot |

## Structure

templates/addons/<name>/
  README.md   what it does, requirements, price
  patch.cjs   script that injects into a client folder
  assets/     files the addon needs

## Applying an addon

./scripts/Apply-Addon.ps1 -Client zaheera-fragrances -Addon dark-mode

Script does:
1. Verifies client folder exists
2. Verifies addon not already applied
3. Applies patch to client files only
4. Logs application in client README
5. No other client folder is touched

## Building a new addon

1. Build it in ONE client folder first, test it works
2. Extract the diff as patch.cjs in templates/addons/<name>/
3. Write the README
4. Test applying to a fresh copy of the shell
5. Now it is sellable
