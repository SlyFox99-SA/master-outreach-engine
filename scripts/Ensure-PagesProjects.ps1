param(
  [string[]]$Projects = @(
    'fragrance-seller-mockup',
    'monetech-outreach',
    'lumo-mockup',
    'techseller-mockup',
    'salon-demo',
    'services-demo',
    'restaurant-demo',
    'studio-demo',
    'personal-demo',
    'starter-demo',
    'master-outreach'
  )
)

foreach ($name in $Projects) {
  Write-Host "Checking: $name" -ForegroundColor Cyan
  $create = npx --yes wrangler pages project create $name --production-branch=main 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  created $name" -ForegroundColor Green
  } elseif ($create -match 'already exists' -or $create -match 'A project with this name') {
    Write-Host "  $name already exists" -ForegroundColor Gray
  } else {
    Write-Host "  failed: $($create -join ' ')" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "All Pages projects are ready" -ForegroundColor Green