# MedMitra Firebase deploy script
# Uses the service account JSON from the parent folder.

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$KeyFile = Join-Path (Split-Path -Parent $ProjectRoot) "medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json"
$ProjectId = "medmitra-46913"

if (-not (Test-Path $KeyFile)) {
  Write-Error "Service account key not found: $KeyFile"
}

Write-Host "Building app..." -ForegroundColor Cyan
Set-Location $ProjectRoot
npm run build

Write-Host "Installing function dependencies..." -ForegroundColor Cyan
Set-Location (Join-Path $ProjectRoot "functions")
npm install --silent

Write-Host "Seeding Firestore via Admin SDK..." -ForegroundColor Cyan
node seed.js

Set-Location $ProjectRoot

# Option A: deploy with Firebase CLI (recommended — run `firebase login` once first)
if (Get-Command firebase -ErrorAction SilentlyContinue) {
  Write-Host "Deploying with Firebase CLI..." -ForegroundColor Cyan
  Write-Host "If this fails, run: firebase login" -ForegroundColor Yellow
  firebase deploy --only "firestore,storage,hosting,functions" --project $ProjectId --non-interactive
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Done! https://$ProjectId.web.app" -ForegroundColor Green
    exit 0
  }
}

# Option B: service account (needs IAM roles on the key — see README below)
Write-Host "Trying service account deploy..." -ForegroundColor Cyan
$env:GOOGLE_APPLICATION_CREDENTIALS = $KeyFile
firebase deploy --only "firestore,storage,hosting,functions" --project $ProjectId --non-interactive
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Deploy failed. Fix one of these:" -ForegroundColor Red
  Write-Host "  1. Run: firebase login   then: npm run deploy" -ForegroundColor Yellow
  Write-Host "  2. In Google Cloud IAM, grant the service account:" -ForegroundColor Yellow
  Write-Host "     Firebase Admin + Service Usage Admin roles" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Firestore data was seeded successfully via Admin SDK." -ForegroundColor Green
  exit 1
}

Write-Host "Done! https://$ProjectId.web.app" -ForegroundColor Green
