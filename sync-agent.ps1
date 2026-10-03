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

$candidateDirs = @(
    "$env:LOCALAPPDATA\AlecaFrame",
    "$env:LOCALAPPDATA\WFHelper\api-helper",
    "$env:LOCALAPPDATA\WFHelper",
    "$env:LOCALAPPDATA\Warframe",
    "$env:APPDATA\WFHelper\api-helper",
    "$env:APPDATA\WFHelper",
    "$env:APPDATA\wfhelper",
    "$env:USERPROFILE\.config\WFHelper\api-helper",
    "$env:USERPROFILE\.config\wfhelper"
)

function Get-LatestInventory {
    $candidates = @()
    foreach ($dir in $candidateDirs) {
        $datPath = "$dir\lastData.dat"
        $jsonPath = "$dir\inventory.json"
        
        if (Test-Path $datPath) { $candidates += Get-Item $datPath }
        if (Test-Path $jsonPath) { $candidates += Get-Item $jsonPath }
    }
    
    if (Test-Path ".\inventory.json") { $candidates += Get-Item ".\inventory.json" }

    if ($candidates.Count -eq 0) { return $null }
    
    # Return the file with the most recent LastWriteTime
    return $candidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1
}

$latestFile = Get-LatestInventory
if ($null -eq $latestFile) {
    Write-Warning "Could not find lastData.dat or inventory.json in any known paths."
    Write-Host "Ensure Warframe and AlecaFrame or WFHelper are running and logged in." -ForegroundColor Yellow
} else {
    Write-Host " Found Data    : $($latestFile.FullName)" -ForegroundColor Gray
}

Write-Host "====================================================" -ForegroundColor Cyan

function Send-Sync {
    $targetFile = Get-LatestInventory
    if ($null -eq $targetFile) { return }
    $path = $targetFile.FullName

    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($path)
        $endpoint = "$ServerUrl/api/upload/dat?player=$([Uri]::EscapeDataString($PlayerName))"
        if ($RoomCode) {
            $endpoint += "&room=$([Uri]::EscapeDataString($RoomCode))"
        }

        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Syncing $(Split-Path $path -Leaf) ($($fileBytes.Length) bytes)..." -ForegroundColor Yellow

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

    $watchers = @()
    foreach ($dir in $candidateDirs) {
        if (Test-Path $dir) {
            $watcher = New-Object System.IO.FileSystemWatcher
            $watcher.Path = $dir
            $watcher.IncludeSubdirectories = $false
            $watcher.EnableRaisingEvents = $true

            $action = {
                $name = $Event.SourceEventArgs.Name
                if ($name -match "lastData.dat" -or $name -match "inventory.json") {
                    Start-Sleep -Milliseconds 600 # Debounce
                    Send-Sync
                }
            }
            Register-ObjectEvent $watcher 'Changed' -Action $action | Out-Null
            Register-ObjectEvent $watcher 'Created' -Action $action | Out-Null
            $watchers += $watcher
        }
    }

    if ($watchers.Count -eq 0) {
        Write-Warning "No valid directories to watch. Running in polling mode."
        while ($true) {
            Start-Sleep -Seconds 15
            Send-Sync
        }
    } else {
        Write-Host "Attached $($watchers.Count) directory watchers." -ForegroundColor Gray
        while ($true) {
            Start-Sleep -Seconds 1
        }
    }
}
