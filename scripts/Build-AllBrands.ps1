$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Get-ChildItem .\data\config-*.json | Where-Object { $_.Name -ne 'active-config.json' -and $_.Name -ne '_template.json' } | ForEach-Object { $brand = $_.BaseName.Substring(7); & "$PSScriptRoot\Build-Brand.ps1" -Brand $brand }
Get-ChildItem .\dist-* -Directory | Select-Object Name, LastWriteTime
