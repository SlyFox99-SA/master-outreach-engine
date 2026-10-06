param([Parameter(Mandatory)][string]$Vertical)
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$map = @{
  'salon'      = 'templates/salon'
  'services'   = 'templates/services'
  'restaurant' = 'templates/restaurant'
  'studio'     = 'templates/studio'
  'personal'   = 'templates/personal'
  'starter'    = 'templates/starter'
  'pitch'      = 'pitch'
}

if (-not $map.ContainsKey($Vertical)) {
  Write-Host "Unknown vertical: $Vertical" -ForegroundColor Red
  Write-Host "Valid: salon, services, restaurant, studio, personal, starter, pitch" -ForegroundColor Yellow
  exit 1
}

$src = $map[$Vertical]
$out = ".\dist-$Vertical"

if (-not (Test-Path $src)) {
  Write-Host "Source not found: $src" -ForegroundColor Red
  exit 1
}

if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force -Path $out | Out-Null

if ($Vertical -eq 'pitch') {
  Copy-Item "$src\index.html" "$out\index.html" -Force
} else {
  Copy-Item "$src\*" $out -Recurse -Force
}

Write-Host "Built $Vertical -> $out" -ForegroundColor Green