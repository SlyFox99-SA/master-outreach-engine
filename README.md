# Master Outreach Engine

One Vite + Tailwind + Alpine frame. Many brands. Swap a JSON, ship a site.

## Quick start
    npm install
    npm run dev

## Brand swap
    .\scripts\Build-Brand.ps1 -Brand zaheera
    .\scripts\Build-AllBrands.ps1
    .\scripts\New-Brand.ps1 -Slug lumo -Name "Lumo" -WhatsApp "+27821112222"
    .\scripts\Deploy-Brand.ps1 -Brand zaheera -Target netlify
