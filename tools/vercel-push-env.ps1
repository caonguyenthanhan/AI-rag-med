param(
  [Parameter(Mandatory = $true)][string]$EnvFile,
  [Parameter(Mandatory = $true)][ValidateSet("production", "preview", "development")][string]$TargetEnv,
  [string]$AppDir = "medical-consultation-app"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $EnvFile)) {
  throw "Env file not found: $EnvFile"
}

Push-Location $AppDir

try {
  $lines = Get-Content -Path $EnvFile -Encoding UTF8
  foreach ($line in $lines) {
    $trim = $line.Trim()
    if ($trim.Length -eq 0) { continue }
    if ($trim.StartsWith("#")) { continue }
    $idx = $trim.IndexOf("=")
    if ($idx -lt 1) { continue }

    $name = $trim.Substring(0, $idx).Trim()
    $value = $trim.Substring($idx + 1)

    if ($name.Length -eq 0) { continue }

    npx --yes vercel env add $name $TargetEnv --value "$value" --force --yes | Out-Host
  }
}
finally {
  Pop-Location
}
