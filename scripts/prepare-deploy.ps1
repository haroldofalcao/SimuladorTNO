# prepare-deploy.ps1
# Automates the validation process before deployment

Write-Host "🚀 Starting Pre-Deployment Validation..." -ForegroundColor Cyan

# 1. Clean Cache
Write-Host "`n🧹 Cleaning Next.js Cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
}
Write-Host "✔ Cache Cleared" -ForegroundColor Green

# 2. Type Check
Write-Host "`n📝 Running TypeScript Validation..." -ForegroundColor Yellow
$tscProcess = Start-Process -FilePath "npx" -ArgumentList "tsc --noEmit" -NoNewWindow -PassThru -Wait
if ($tscProcess.ExitCode -ne 0) {
    Write-Host "❌ TypeScript Validation Failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✔ TypeScript Clean" -ForegroundColor Green

# 3. Production Build
Write-Host "`n🏗️ Running Production Build..." -ForegroundColor Yellow
$buildProcess = Start-Process -FilePath "npm" -ArgumentList "run build" -NoNewWindow -PassThru -Wait
if ($buildProcess.ExitCode -ne 0) {
    Write-Host "❌ Build Failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✔ Build Successful" -ForegroundColor Green

# 4. Success Message
Write-Host "`n✅ APPLICATION READY FOR DEPLOYMENT" -ForegroundColor Cyan -BackgroundColor DarkBlue
Write-Host "You can now push to GitHub/Vercel or run 'npm start' to test locally."
