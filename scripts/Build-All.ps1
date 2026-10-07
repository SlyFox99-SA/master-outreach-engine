$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$clients = @('zaheera-fragrances','techhub-phones','monetech-sneakers','lumo-skincare')
foreach ($c in $clients) {
  Write-Host "=== $c ===" -ForegroundColor Cyan
  & "$PSScriptRoot\Build-Client.ps1" -Client $c
}
Get-ChildItem .\dist-* -Directory | Select-Object Name, LastWriteTime
