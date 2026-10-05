# Master Outreach Engine - Workflow

Ops guide: what to do when. No guessing.

---

## Mental model

| File | Read when | Purpose |
|---|---|---|
| `data/config-<brand>.json` | Only when URL has `?brand=<brand>` in DEV, or during `Build-Brand` in prod | Source of truth for one brand |
| `data/active-config.json` | Every default load (no `?brand=`) | The **live** brand. Must be manually synced |
| `data/_template.json` | Only by `New-Brand.ps1` | Blank starter for new clients |

**Rule:** `config-<brand>.json` is the source. `active-config.json` is the deploy target. They are NOT linked automatically.

---

## Daily dev workflow

### 1. Switch to a brand for local preview

```powershell
Copy-Item data\config-<brand>.json data\active-config.json -Force
npm run dev
```

Open `http://localhost:5173/` (no param needed - active-config is now that brand).

**Or** skip the copy entirely in dev:

```powershell
npm run dev
```

Then open `http://localhost:5173/?brand=<brand>` - reads `config-<brand>.json` directly.

---

### 2. Preview all brands quickly (dev only)

Use `?brand=` param - no rebuild, no file copy:

| URL | Brand |
|---|---|
| `http://localhost:5173/?brand=zaheera` | Zaheera perfume |
| `http://localhost:5173/?brand=monetech` | MoneTech iPhones |
| `http://localhost:5173/?brand=lumo` | Lumo skincare |
| `http://localhost:5173/?brand=techhub` | TechHub with PayFast |

---

### 3. Export an IG/TikTok story PNG

Add `&frame=story` to the URL:

```
http://localhost:5173/?brand=zaheera&frame=story
```

Click the blue **Download 1080x1920** button bottom-right. Saves a PNG ready for socials.

---

## When you EDIT a brand config

Editing `config-<brand>.json` only affects the `?brand=` URL. The default page still shows the old brand.

**To make edits visible on the default page:**

```powershell
Copy-Item data\config-<brand>.json data\active-config.json -Force
```

Then hard-reload the browser (`Ctrl + Shift + R`).

**If it still looks stale:**

```powershell
Remove-Item node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue
```

Restart `npm run dev`.

---

## When you ADD a new client

### 1. Create their config

```powershell
.\scripts\New-Brand.ps1 -Slug <slug> -Name "<Display Name>" -Tagline "<short tagline>" -WhatsApp "+27XXXXXXXXX"
```

Example:

```powershell
.\scripts\New-Brand.ps1 -Slug lumo -Name "Lumo Skincare" -Tagline "Clean beauty - Joburg" -WhatsApp "+27821112222"
```

### 2. Edit the new file

Open `data\config-<slug>.json` in VS Code. Fill in `products[]` with real items and image URLs.

### 3. Preview it

```powershell
npm run dev
```

Open `http://localhost:5173/?brand=<slug>`

### 4. Deploy it

```powershell
git add . ; git commit -m "feat: add <slug>" ; git push
```

CI builds `dist-<slug>/` automatically. Download the artifact from GitHub Actions.

---

## When you BUILD for production

### One brand

```powershell
.\scripts\Build-Brand.ps1 -Brand <slug>
```

Output: `dist-<slug>/` - ready to drag onto Netlify.

### All brands

```powershell
.\scripts\Build-AllBrands.ps1
```

Output: `dist-zaheera/`, `dist-monetech/`, `dist-lumo/`, `dist-techhub/`

### Social story PNG

```powershell
.\scripts\Build-Social.ps1 -Brand <slug> -Format story
```

Opens a URL - click the blue button to export 1080x1920 PNG.

---

## When you DEPLOY

### Fast (drag-and-drop)

1. Build locally: `.\scripts\Build-AllBrands.ps1`
2. Open `https://app.netlify.com/drop`
3. Drag `dist-<slug>/` onto the drop zone
4. Rename site: Site config -> Change site name -> `<slug>-outreach`
5. Live at `https://<slug>-outreach.netlify.app`

### Slow (CI auto-deploy, one-time setup)

See Netlify section below.

### Zip for a client

```powershell
.\scripts\Deploy-Brand.ps1 -Brand <slug> -Target zip
```

Output: `<slug>-site.zip` - email/Dropbox to client.

---

## When things BREAK

### Page shows "Loading catalogue..."

**Cause:** Alpine did not boot OR store is empty.

**Fix (in order):**

1. Open DevTools (F12) -> Console. Look for red errors.
2. If "Failed to resolve module specifier alpinejs" -> you need the importmap in `index.html` (already present) OR `npm install alpinejs` was skipped. Run `npm install alpinejs`.
3. If clean console, run in console: `Alpine.store('config').id`
   - Returns `'techhub'` etc -> store is fine, template broken
   - Returns `undefined` -> Alpine not loaded
   - Errors "Alpine is not defined" -> `window.Alpine = Alpine` line missing from main.js

### Images are broken / wrong photo showing

**Cause:** Either the URL is dead OR active-config is stale.

**Fix:**

```powershell
Copy-Item data\config-<brand>.json data\active-config.json -Force
Remove-Item node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
```

Then new tab + `Ctrl + Shift + R`.

### Vite says "Port 5173 is in use, trying another one..."

**Cause:** Previous Vite instance is a zombie.

**Fix:**

```powershell
taskkill /F /IM node.exe
npm run dev
```

Must print `Local: http://localhost:5173/` - not 5174.

### Terminal stuck at `>>`

**Cause:** Pasted a multi-line command. PowerShell is waiting for more input.

**Fix:** Press **`Ctrl + C`** on your keyboard (not typed). Prompt returns to `PS>`.

**Prevention:** One command per paste. Never paste here-strings (`@' ... '@`).

### `Stream was not readable`

**Cause:** VS Code has the target file open in an editor tab, locking it.

**Fix:** Close the file tab in VS Code, wait 2 seconds, re-run the command.

### `gh run download` returns 404

**Cause:** Old run ID or a queued run (gh CLI bug on new accounts).

**Fix:** Use the browser. Actions tab -> latest run -> Artifacts -> click download icon.

---

## When you COMMIT

### Normal commit

```powershell
git add . ; git commit -m "<message>" ; git push
```

### Commit message format

- `feat: <what>` - new feature/brand
- `fix: <what>` - bug fix
- `ci: <what>` - workflow change
- `docs: <what>` - docs only
- `chore: <what>` - deps/tooling

### What NOT to commit

- `node_modules/` - already in .gitignore
- `dist-*/` - build artifacts, in .gitignore
- `*.zip` - client handoff bundles, in .gitignore
- `.env` - secrets, in .gitignore

---

## When you need to RESET

### Soft reset (keep configs, wipe build output)

```powershell
Remove-Item dist-* -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue
```

### Medium reset (reinstall deps)

```powershell
Remove-Item node_modules, package-lock.json -Recurse -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm install
```

### Hard reset (nuke everything except configs + git)

```powershell
Remove-Item dist-*, node_modules, .vite, package-lock.json -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules\.vite -Recurse -Force -ErrorAction SilentlyContinue
npm install
```

---

## When you add a PAYMENT GATEWAY

1. Add a `payment` object to `data\config-<brand>.json`:

```json
"payment": {
  "provider": "payfast",
  "merchantId": "10000100",
  "merchantKey": "46f0cd694581a",
  "sandbox": true,
  "returnUrl": "https://<slug>-outreach.netlify.app/thank-you",
  "cancelUrl": "https://<slug>-outreach.netlify.app/"
}
```

2. Buttons auto-render if `payLink()` exists in main.js (already there).

3. Test in sandbox: card `4000 0000 0000 3055`, any expiry, any CVV.

4. Go live: set `"sandbox": false` and replace `merchantId` / `merchantKey` with real PayFast credentials.

---

## The Golden Rule

**When you swap a brand config, ALWAYS run:**

```powershell
Copy-Item data\config-<brand>.json data\active-config.json -Force
```

Every "why is this stale" bug in this session traces back to skipping that line.

---

## Quick reference card

| I want to... | Command |
|---|---|
| Dev preview a brand | `Copy-Item data\config-X.json data\active-config.json -Force ; npm run dev` |
| Dev preview via URL (no copy) | `npm run dev` then `localhost:5173/?brand=X` |
| Add a new client | `.\scripts\New-Brand.ps1 -Slug X -Name "..." -WhatsApp "+27..."` |
| Build one brand | `.\scripts\Build-Brand.ps1 -Brand X` |
| Build all brands | `.\scripts\Build-AllBrands.ps1` |
| Export IG story | `.\scripts\Build-Social.ps1 -Brand X -Format story` |
| Deploy to Netlify | Drag `dist-X/` onto https://app.netlify.com/drop |
| Zip for client | `.\scripts\Deploy-Brand.ps1 -Brand X -Target zip` |
| Commit + push | `git add . ; git commit -m "msg" ; git push` |
| Kill zombie Vite | `taskkill /F /IM node.exe` |
| Escape `>>` prompt | Press `Ctrl + C` (keys, not typed) |
| Clear Vite cache | `Remove-Item node_modules\.vite -Recurse -Force` |
| Check config | `Get-Content data\active-config.json -Raw \| ConvertFrom-Json \| Select id, @{n='brand';e={$_.brand.name}}` |
