# DEPLOYMENT

## Cloudflare account

Account ID: 50794477c8b66d11472829fb4f927a06
Worker: outreach-save-api
D1 database: webforge-orders

## Pages projects

| Project | URL | Purpose |
|---|---|---|
| sfox-pitch | https://sfox-pitch.pages.dev/ | Sales page |
| techseller-mockup | https://techseller-mockup.pages.dev/ | Phones and Tech |
| monetech-outreach | https://monetech-outreach.pages.dev/ | Sneakers and Shoes |
| fragrance-seller-mockup | https://fragrance-seller-mockup.pages.dev/ | Fragrances |
| lumo-mockup | https://lumo-mockup.pages.dev/ | Skincare |
| sfox-salon | https://sfox-salon.pages.dev/ | Salon vertical |
| sfox-services | https://sfox-services.pages.dev/ | Services vertical |
| sfox-restaurant | https://sfox-restaurant.pages.dev/ | Restaurant vertical |
| sfox-studio | https://sfox-studio.pages.dev/ | Studio vertical |
| sfox-personal | https://sfox-personal.pages.dev/ | Personal vertical |
| sfox-starter | https://sfox-starter.pages.dev/ | Starter demo |

## CI/CD

File: .github/workflows/deploy.yml
Triggers on: every push to main

Steps:
1. Node 22 + npm install
2. Ensure Cloudflare Pages projects exist (idempotent)
3. Build all brands via Build-Brand.ps1
4. Build all verticals via Build-Vertical.ps1
5. Deploy each dist-<name>/ to its matching Pages project

GitHub secrets used:
- CLOUDFLARE_API_TOKEN - Pages Edit + Workers Scripts Edit
- CLOUDFLARE_ACCOUNT_ID - 50794477c8b66d11472829fb4f927a06

## Manual deploy (single project)

npx wrangler pages deploy ./dist-<name> --project-name=<pages-project> --branch=main

Example:
npx wrangler pages deploy ./pitch --project-name=sfox-pitch --branch=main

## Rolling back

Every Pages deployment is preserved. To roll back:
1. Cloudflare dashboard - Workers and Pages - <project>
2. Deployments tab
3. Find previous good deploy - Rollback to this deployment

Nothing is deleted. Ever.

## Worker deploys

cd worker
npx wrangler deploy
