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
if (-not $map.ContainsKey($Vertical)) { Write-Host "Unknown: $Vertical"; exit 1 }
$src = $map[$Vertical]
$out = ".\dist-$Vertical"
if (-not (Test-Path $src)) { Write-Host "Source missing: $src"; exit 1 }
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force -Path $out | Out-Null
if ($Vertical -eq 'pitch') {
  Copy-Item "$src\index.html" "$out\index.html" -Force
} else {
  Copy-Item "$src\*" $out -Recurse -Force
  # Copy the vertical's own config to root /data/ so seller dashboard can find it
  $srcData = "$src\data"
  if (Test-Path $srcData) {
    New-Item -ItemType Directory -Force -Path "$out\data" | Out-Null
    Copy-Item "$srcData\*" "$out\data\" -Force
    # Find first config-*.json and duplicate as active-config.json
    $first = Get-ChildItem "$srcData\config-*.json" | Select-Object -First 1
    if ($first) { Copy-Item $first.FullName "$out\data\active-config.json" -Force }
  }
  if (Test-Path ".\seller") { Copy-Item ".\seller" "$out\seller" -Recurse -Force }
  if (Test-Path ".\track")  { Copy-Item ".\track"  "$out\track"  -Recurse -Force }
}
Write-Host "Built $Vertical -> $out" -ForegroundColor Green