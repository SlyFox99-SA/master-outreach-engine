param([Parameter(Mandatory)][string]$Brand)
$root = Split-Path -Parent $PSScriptRoot; Set-Location $root
$config = ".\data\config-$Brand.json"
if (-not (Test-Path $config)) { Write-Host "No config: $config" -ForegroundColor Red; exit 1 }
Copy-Item $config ".\data\active-config.json" -Force
npm run build
$out = ".\dist-$Brand"
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
Rename-Item ".\dist" $out
Write-Host "Built $Brand -> $out" -ForegroundColor Green
