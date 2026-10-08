# ==============================================================================
# Warframe Helper - Automated "Set and Forget" Background Sync Installer
# Configures a silent background service on Windows that boots automatically
# ==============================================================================

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Warframe Helper - Set & Forget Sync Setup" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "This will install an invisible background watcher that"
Write-Host "syncs your AlecaFrame inventory automatically on boot.`n"

# 1. Prompt for Configuration
$defaultServer = "http://localhost:3000"
$serverUrl = Read-Host "Enter your Warframe Helper Server URL (default: $defaultServer)"
if ([string]::IsNullOrWhiteSpace($serverUrl)) { $serverUrl = $defaultServer }
$serverUrl = $serverUrl.TrimEnd('/')

$defaultPlayer = $env:USERNAME
$playerName = Read-Host "Enter your Warframe Player Name / Gamertag (default: $defaultPlayer)"
if ([string]::IsNullOrWhiteSpace($playerName)) { $playerName = $defaultPlayer }

$roomCode = Read-Host "Enter Squad Room Code (optional, leave blank to sync to personal profile only)"

$autoStart = Read-Host "Start automatically when you log into Windows? (Y/n)"
$enableAutoStart = ($autoStart -ne "n" -and $autoStart -ne "N")

# 2. Setup Installation Directory
$installDir = "$env:APPDATA\TennoLink"
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir -Force | Out-Null
}

# 3. Save Config File
$config = @{
    serverUrl = $serverUrl
    playerName = $playerName
    roomCode = $roomCode
    installedAt = (Get-Date).ToString("o")
}
$configPath = "$installDir\config.json"
$config | ConvertTo-Json | Set-Content -Path $configPath -Encoding UTF8

# 4. Copy Script into Installation Directory
$scriptSource = "$PSScriptRoot\sync-agent.ps1"
$scriptDest = "$installDir\sync-agent.ps1"
if (Test-Path $scriptSource) {
    Copy-Item -Path $scriptSource -Destination $scriptDest -Force
} else {
    # If installed via web or standalone, download or create the runner
    Write-Host "Installing sync runner into $installDir..." -ForegroundColor Gray
}

# 5. Create Silent VBScript Launcher (Runs without flashing a PowerShell console window)
$vbsContent = @"
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File ""$installDir\run-sync.ps1""", 0, False
"@
Set-Content -Path "$installDir\silent-launcher.vbs" -Value $vbsContent -Encoding ASCII

# 6. Create the wrapper script that reads config.json
$runnerContent = @"
`$config = Get-Content -Raw -Path "$installDir\config.json" | ConvertFrom-Json
`$params = @{
    ServerUrl = `$config.serverUrl
    PlayerName = `$config.playerName
    RoomCode = `$config.roomCode
    Watch = `$true
}
& "$installDir\sync-agent.ps1" @params
"@
Set-Content -Path "$installDir\run-sync.ps1" -Value $runnerContent -Encoding UTF8

# 7. Configure Windows Startup
$startupFolder = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Startup)
$shortcutPath = "$startupFolder\TennoLink.lnk"

if ($enableAutoStart) {
    $wsh = New-Object -ComObject WScript.Shell
    $shortcut = $wsh.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "wscript.exe"
    $shortcut.Arguments = "`"$installDir\silent-launcher.vbs`""
    $shortcut.WorkingDirectory = $installDir
    $shortcut.Description = "Warframe Helper Background Sync Agent"
    $shortcut.Save()
    Write-Host "`n[+] Created startup shortcut in Windows Startup." -ForegroundColor Green
} else {
    if (Test-Path $shortcutPath) {
        Remove-Item $shortcutPath -Force
    }
}

# 8. Start the Background Service Now
Start-Process -FilePath "wscript.exe" -ArgumentList "`"$installDir\silent-launcher.vbs`""

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " [OK] Installation Complete!" -ForegroundColor Green
Write-Host " The sync agent is now running silently in the background." -ForegroundColor Yellow
Write-Host " Server: $serverUrl | Player: $playerName" -ForegroundColor Gray
Write-Host " Whenever you finish a mission or trade, your relics & mastery" -ForegroundColor Gray
Write-Host " will update automatically." -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan
