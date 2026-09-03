$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$websiteRoot = $PSScriptRoot
$pidFile = Join-Path $websiteRoot '.website-server.pid'

if (-not (Test-Path -LiteralPath $pidFile)) {
    Write-Host 'zPlayer website is not running.' -ForegroundColor Yellow
    exit 0
}

try {
    $serverPid = [int](Get-Content -LiteralPath $pidFile -Raw).Trim()
}
catch {
    Remove-Item -LiteralPath $pidFile -Force
    Write-Host 'Removed the invalid website process record.' -ForegroundColor Yellow
    exit 0
}

$serverProcess = Get-Process -Id $serverPid -ErrorAction SilentlyContinue
if ($null -ne $serverProcess) {
    Write-Host "Stopping website process $serverPid..."
    & taskkill.exe /PID $serverPid /T /F | Out-Null
    Write-Host 'zPlayer website stopped.' -ForegroundColor Green
}
else {
    Write-Host 'The website process has already exited. Cleaning up the record.' -ForegroundColor Yellow
}

Remove-Item -LiteralPath $pidFile -Force
