param([Parameter(Mandatory)][string]$Brand, [ValidateSet('netlify','vercel','cloudflare','zip')][string]$Target = 'netlify')
$root = Split-Path -Parent $PSScriptRoot; Set-Location $root
& "$PSScriptRoot\Build-Brand.ps1" -Brand $Brand
$dir = ".\dist-$Brand"
switch ($Target) {
  'netlify'    { npx --yes netlify-cli deploy --dir $dir --prod }
  'vercel'     { npx --yes vercel deploy $dir --prod }
  'cloudflare' { npx --yes wrangler pages deploy $dir }
  'zip'        { $z = ".\$Brand-site.zip"; if (Test-Path $z) { Remove-Item $z -Force }; Compress-Archive -Path "$dir\*" -DestinationPath $z; Write-Host "Zipped -> $z" -ForegroundColor Green }
}
