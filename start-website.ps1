param(
    [int]$Port = 5173
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$websiteRoot = $PSScriptRoot
$pidFile = Join-Path $websiteRoot '.website-server.pid'
$stdoutLog = Join-Path $websiteRoot '.website-server.out.log'
$stderrLog = Join-Path $websiteRoot '.website-server.err.log'
$url = "http://127.0.0.1:$Port/"

function Remove-StalePidFile {
    if (Test-Path -LiteralPath $pidFile) {
        Remove-Item -LiteralPath $pidFile -Force
    }
}

if (Test-Path -LiteralPath $pidFile) {
    try {
        $existingPid = [int](Get-Content -LiteralPath $pidFile -Raw).Trim()
        $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
        if ($null -ne $existingProcess) {
            Write-Host "zPlayer website is already running: $url" -ForegroundColor Green
            Start-Process -FilePath $url
            exit 0
        }
    }
    catch {
        # A damaged PID file or an exited process requires a clean start.
        $null = $true
    }

    Remove-StalePidFile
}

$vitePressPath = Join-Path $websiteRoot 'node_modules\vitepress'
if (-not (Test-Path -LiteralPath $vitePressPath)) {
    Write-Host 'First run: installing website dependencies...' -ForegroundColor Cyan
    Push-Location $websiteRoot
    try {
        if (Test-Path -LiteralPath (Join-Path $websiteRoot 'package-lock.json')) {
            & npm.cmd ci
        }
        else {
            & npm.cmd install
        }

        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed with exit code: $LASTEXITCODE"
        }
    }
    finally {
        Pop-Location
    }
}

$npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
$startArguments = @{
    FilePath = $npmCommand
    ArgumentList = @('run', 'docs:dev', '--', '--host', '127.0.0.1', '--port', [string]$Port)
    WorkingDirectory = $websiteRoot
    WindowStyle = 'Hidden'
    RedirectStandardOutput = $stdoutLog
    RedirectStandardError = $stderrLog
    PassThru = $true
}
$serverProcess = Start-Process @startArguments

Set-Content -LiteralPath $pidFile -Value $serverProcess.Id -Encoding ASCII

$ready = $false
for ($attempt = 0; $attempt -lt 60; $attempt++) {
    if ($serverProcess.HasExited) {
        break
    }

    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
            $ready = $true
            break
        }
    }
    catch {
        # The development server needs a little time to start.
        $null = $true
    }

    Start-Sleep -Milliseconds 500
}

if (-not $ready) {
    Remove-StalePidFile
    Write-Host 'Website startup failed. Check this log:' -ForegroundColor Red
    Write-Host $stderrLog
    if (Test-Path -LiteralPath $stderrLog) {
        Get-Content -LiteralPath $stderrLog -Tail 30
    }
    exit 1
}

Write-Host "zPlayer website is running: $url" -ForegroundColor Green
Write-Host 'Stop it with stop-website.cmd or .\stop-website.ps1'
Start-Process -FilePath $url
