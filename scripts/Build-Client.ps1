param([Parameter(Mandatory)][string]$Client)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$c = ".\clients\$Client"
if (-not (Test-Path $c)) { Write-Host "No client: $c" -ForegroundColor Red; exit 1 }
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "vite build failed" -ForegroundColor Red; exit 1 }
$o = ".\dist-$Client"
if (Test-Path $o) { Remove-Item $o -Recurse -Force }
New-Item -ItemType Directory -Force -Path $o | Out-Null
if (Test-Path ".\dist\assets") { Copy-Item ".\dist\assets" "$o\assets" -Recurse -Force }
Copy-Item ".\dist\clients\$Client\src\index.html" "$o\index.html" -Force
Copy-Item "$c\src\checkout.html" "$o\checkout.html" -Force
Copy-Item "$c\src\main.js" "$o\main.js" -Force
Copy-Item "$c\src\style.css" "$o\style.css" -Force
if (Test-Path "$c\seller") { Copy-Item "$c\seller" "$o\seller" -Recurse -Force }
if (Test-Path "$c\track") { Copy-Item "$c\track" "$o\track" -Recurse -Force }
New-Item -ItemType Directory -Force -Path "$o\data" | Out-Null
Copy-Item "$c\src\config.json" "$o\data\config-$Client.json" -Force
Copy-Item "$c\src\config.json" "$o\data\active-config.json" -Force
$cfg = (Get-Content "$c\src\config.json" -Raw).Trim()
$id = (ConvertFrom-Json $cfg).id
$out = 'window.__CONFIGS = {' + [Environment]::NewLine + '  "' + $id + '": ' + $cfg + ',' + [Environment]::NewLine + '  "active": ' + $cfg + [Environment]::NewLine + '};'
[System.IO.File]::WriteAllText("$o\configs.js", $out, (New-Object Text.UTF8Encoding $false))
Write-Host "Built $Client" -ForegroundColor Green
