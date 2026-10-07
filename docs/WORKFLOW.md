# WORKFLOW

## Daily dev

npm run dev:fresh

Local URLs:
- http://localhost:5173/ - root layout (legacy)
- http://localhost:5173/templates/brands/zaheera/ - Zaheera shell
- http://localhost:5173/templates/brands/techhub/ - TechHub shell
- http://localhost:5173/templates/brands/monetech/ - MoneTech shell
- http://localhost:5173/templates/brands/lumo/ - Lumo shell
- http://localhost:5173/seller/?brand=zaheera&t=<TOKEN> - Seller
- http://localhost:5173/pitch/ - Sales page

## Before any change

git status - see what is already modified. Do not overwrite uncommitted work.

Backup before editing: Copy-Item file file.bak

## Deploying a change

1. Local verify: npm run dev:fresh, browser test
2. Commit only what changed: git add <file>, git commit -m message, git push
3. Watch CI: https://github.com/SlyFox99-SA/master-outreach-engine/actions

## Rules

1. One file per concern. Do not mix unrelated changes in one commit.
2. Preview locally before push. No surprise deploys.
3. Never overwrite a client folder without approval. Even for improvements.
4. Commit message says what changed. Not fix - restore: techhub uses original commerce layout.
5. If CI fails, fix forward or revert. Never leave a broken main branch.

## Common commands

Restart dev clean: Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep 2; npm run dev:fresh

Build one brand: powershell -File scripts/Build-Brand.ps1 -Brand techhub

Deploy pitch only: npx wrangler pages deploy ./pitch --project-name=sfox-pitch --branch=main
