# Run after: gh auth login
# Usage: .\scripts\deploy-github.ps1

$ErrorActionPreference = "Stop"
$RepoName = "naturalresourcesfl"

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    Write-Error "GitHub CLI (gh) not found. Install: winget install GitHub.cli"
}

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in. Run: gh auth login" -ForegroundColor Yellow
    gh auth login --hostname github.com --git-protocol https --web
}

Set-Location $PSScriptRoot\..

$owner = gh api user -q .login
Write-Host "GitHub user: $owner" -ForegroundColor Cyan

if (-not (git rev-parse --git-dir 2>$null)) {
    git init -b main
    git add .
    git commit -m "Initial commit: Natural Resources Pest Control website"
}

$remoteUrl = gh repo view "$owner/$RepoName" --json url -q .url 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating public repo $owner/$RepoName ..." -ForegroundColor Cyan
    gh repo create $RepoName --public --description "Natural Resources Pest Control — Miami, FL" --source=. --remote=origin --push
} else {
    Write-Host "Repo exists. Pushing to origin ..."
    git push -u origin main
}

Write-Host "Enabling GitHub Pages (Actions workflow) ..." -ForegroundColor Cyan
gh api "repos/$owner/$RepoName/pages" -X PUT -f build_type=workflow 2>$null
if ($LASTEXITCODE -ne 0) {
    gh api "repos/$owner/$RepoName/pages" -X POST -f build_type=workflow
}

Write-Host ""
Write-Host "Done. Pages deploy runs on push to main." -ForegroundColor Green
Write-Host "Site URL (after workflow completes): https://$owner.github.io/$RepoName/" -ForegroundColor Green
Write-Host "Check Actions: https://github.com/$owner/$RepoName/actions" -ForegroundColor Green
