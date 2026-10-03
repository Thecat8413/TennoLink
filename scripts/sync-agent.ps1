# ==============================================================================
# Warframe Helper - Local AlecaFrame Auto-Sync Companion (PowerShell)
# Monitors %LOCALAPPDATA%\AlecaFrame\lastData.dat and syncs with your self-hosted server
# ==============================================================================

param(
    [string]$ServerUrl = "http://localhost:3000",
    [string]$PlayerName = $env:USERNAME,
    [string]$RoomCode = "",
    [switch]$Watch = $true
)

$datPath = "$env:LOCALAPPDATA\AlecaFrame\lastData.dat"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Warframe Helper - AlecaFrame Sync Companion" -ForegroundColor Yellow
Write-Host " Target Server : $ServerUrl" -ForegroundColor Gray
Write-Host " Player Name   : $PlayerName" -ForegroundColor Gray
Write-Host " Room Code     : $(if ($RoomCode) { $RoomCode } else { '(None - Mastery & Profile only)' })" -ForegroundColor Gray
Write-Host " Watching Path : $datPath" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan

if (-not (Test-Path $datPath)) {
    Write-Warning "Could not find lastData.dat at: $datPath"
    Write-Host "Ensure Warframe and AlecaFrame are running and logged in." -ForegroundColor Yellow
}

function Send-Sync {
    if (-not (Test-Path $datPath)) { return }

    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($datPath)
        $endpoint = "$ServerUrl/api/upload/dat?player=$([Uri]::EscapeDataString($PlayerName))"
        if ($RoomCode) {
            $endpoint += "&room=$([Uri]::EscapeDataString($RoomCode))"
        }

        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Syncing lastData.dat ($($fileBytes.Length) bytes)..." -ForegroundColor Yellow

        $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $fileBytes -ContentType "application/octet-stream"
        if ($response.ok) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Sync Success! $($response.relicCount) relics, $($response.masteryCount) mastery items updated." -ForegroundColor Green
        } else {
            Write-Warning "Server responded with error: $($response.error)"
        }
    } catch {
        Write-Error "Sync failed: $_"
    }
}

# Initial Sync
Send-Sync

if ($Watch) {
    Write-Host "`nWatching for inventory updates... Press Ctrl+C to stop.`n" -ForegroundColor Cyan

    $folder = [System.IO.Path]::GetDirectoryName($datPath)
    $fileName = [System.IO.Path]::GetFileName($datPath)

    if (Test-Path $folder) {
        $watcher = New-Object System.IO.FileSystemWatcher
        $watcher.Path = $folder
        $watcher.Filter = $fileName
        $watcher.IncludeSubdirectories = $false
        $watcher.EnableRaisingEvents = $true

        $action = {
            Start-Sleep -Milliseconds 500 # Wait for file write lock to clear
            Send-Sync
        }

        Register-ObjectEvent $watcher 'Changed' -Action $action | Out-Null

        while ($true) {
            Start-Sleep -Seconds 1
        }
    } else {
        Write-Warning "Folder $folder does not exist yet. Running in polling mode."
        while ($true) {
            Start-Sleep -Seconds 15
            Send-Sync
        }
    }
}
