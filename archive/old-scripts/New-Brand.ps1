param(
  [Parameter(Mandatory)][string]$Slug,
  [Parameter(Mandatory)][string]$Name,
  [string]$Tagline = "",
  [string]$WhatsApp = "+27000000000",
  [string]$Primary = "15 23 42",
  [string]$Accent = "59 130 246",
  [string]$Ink = "15 23 42",
  [string]$Surface = "248 250 252",
  [switch]$Force
)
$root = Split-Path -Parent $PSScriptRoot; Set-Location $root
$target = ".\data\config-$Slug.json"
if ((Test-Path $target) -and -not $Force) { Write-Host "Exists: $target (use -Force)" -ForegroundColor Red; exit 1 }
$tpl = Get-Content ".\data\_template.json" -Raw | ConvertFrom-Json
$tpl.id = $Slug; $tpl.brand.name = $Name; $tpl.brand.tagline = $Tagline
$tpl.whatsapp = $WhatsApp
$tpl.theme.primary = $Primary; $tpl.theme.accent = $Accent; $tpl.theme.ink = $Ink; $tpl.theme.surface = $Surface
$tpl | ConvertTo-Json -Depth 10 | Set-Content $target -Encoding utf8
Write-Host "Created $target" -ForegroundColor Green
