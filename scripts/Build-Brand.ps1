param([Parameter(Mandatory)][string]$Brand)
$root = Split-Path -Parent $PSScriptRoot; Set-Location $root
$config = ".\data\config-$Brand.json"
if (-not (Test-Path $config)) { Write-Host "No config: $config" -ForegroundColor Red; exit 1 }
Copy-Item $config ".\data\active-config.json" -Force
npm run build
$out = ".\dist-$Brand"
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
Rename-Item ".\dist" $out
$brandContent = (Get-Content $config -Raw).Trim()
$newConfigs = 'window.__CONFIGS = {' + [Environment]::NewLine + '  "active": ' + $brandContent + [Environment]::NewLine + '};'
Set-Content "$out\configs.js" -Value $newConfigs -NoNewline -Encoding utf8
Copy-Item ".\main.js" "$out\main.js" -Force
if (Test-Path ".\admin") { Copy-Item ".\admin" "$out\admin" -Recurse -Force }
Write-Host "Built $Brand -> $out" -ForegroundColor Green
