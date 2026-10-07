param([Parameter(Mandatory)][string]$Brand)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$config = ".\data\config-$Brand.json"
if (-not (Test-Path $config)) { Write-Host "No config: $config" -ForegroundColor Red; exit 1 }

$shellHtml = ".\templates\brands\$Brand\index.html"
if (-not (Test-Path $shellHtml)) { Write-Host "No shell: $shellHtml" -ForegroundColor Red; exit 1 }

Write-Host "Syncing active-config.json -> $Brand" -ForegroundColor Cyan
Copy-Item $config ".\data\active-config.json" -Force

Write-Host "Running vite build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "vite build failed" -ForegroundColor Red; exit 1 }

$out = ".\dist-$Brand"
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force -Path $out | Out-Null

# 1. Assets (css, js, images) — hashed by vite
if (Test-Path ".\dist\assets") { Copy-Item ".\dist\assets" "$out\assets" -Recurse -Force }

# 2. Brand shell — becomes the index.html of this dist
$builtShell = ".\dist\templates\brands\$Brand\index.html"
if (-not (Test-Path $builtShell)) { Write-Host "Missing built shell: $builtShell" -ForegroundColor Red; exit 1 }
Copy-Item $builtShell "$out\index.html" -Force

# 3. Shared static files
foreach ($f in @('main.js','style.css','checkout.html','track.html')) {
  if (Test-Path ".\$f") { Copy-Item ".\$f" "$out\$f" -Force }
}

# 4. Directories
foreach ($d in @('seller','track','admin','pitch')) {
  if (Test-Path ".\$d") { Copy-Item ".\$d" "$out\$d" -Recurse -Force }
}
if (Test-Path ".\admin\configs\$Brand.yml") { Copy-Item ".\admin\configs\$Brand.yml" "$out\admin\config.yml" -Force }

# 5. Data folder with this brand's config
New-Item -ItemType Directory -Force -Path "$out\data" | Out-Null
Copy-Item $config "$out\data\config-$Brand.json" -Force
Copy-Item ".\data\active-config.json" "$out\data\active-config.json" -Force

# 6. configs.js — only this brand + active
$brandContent = (Get-Content $config -Raw).Trim()
$newConfigs = 'window.__CONFIGS = {' + [Environment]::NewLine + '  "active": ' + $brandContent + [Environment]::NewLine + '};'
[System.IO.File]::WriteAllText("$out\configs.js", $newConfigs, (New-Object Text.UTF8Encoding $false))

Write-Host "Built $Brand -> $out" -ForegroundColor Green