param([Parameter(Mandatory)][string]$Brand, [ValidateSet('story','feed')][string]$Format = 'story')
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
& "$PSScriptRoot\Build-Brand.ps1" -Brand $Brand
Write-Host ""
Write-Host "Built dist-$Brand. To export the $Format PNG:" -ForegroundColor Cyan
Write-Host "  1. npm run dev" -ForegroundColor Yellow
Write-Host "  2. http://localhost:5173/?brand=$Brand&frame=$Format" -ForegroundColor Yellow
Write-Host "  3. Click Download 1080x1920" -ForegroundColor Yellow
