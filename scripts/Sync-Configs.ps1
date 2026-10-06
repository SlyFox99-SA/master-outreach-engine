$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
New-Item -ItemType Directory -Force -Path .\data | Out-Null
$count = 0
Get-ChildItem templates\*\data\config-*.json -ErrorAction SilentlyContinue | ForEach-Object {
  Copy-Item $_.FullName ".\data\$($_.Name)" -Force
  $count++
}
Write-Host "Synced $count vertical configs to /data/" -ForegroundColor Green