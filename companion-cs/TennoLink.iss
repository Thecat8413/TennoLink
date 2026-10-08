[Setup]
AppName=TennoLink
AppVersion=1.0.0
AppPublisher=Thecat8413
AppPublisherURL=https://github.com/Thecat8413/TennoLink
AppSupportURL=https://github.com/Thecat8413/TennoLink/issues
AppUpdatesURL=https://github.com/Thecat8413/TennoLink/releases
DefaultDirName={localappdata}\Programs\TennoLink
DefaultGroupName=TennoLink
DisableProgramGroupPage=yes
OutputBaseFilename=TennoLink-Setup
OutputDir=..\
Compression=lzma2/ultra
SolidCompression=yes
PrivilegesRequired=lowest
SetupIconFile=compiler:SetupClassicIcon.ico
UninstallDisplayIcon={app}\TennoLink.exe

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "startupicon"; Description: "Start TennoLink automatically on Windows login"; GroupDescription: "Startup:"

[Files]
Source: "..\TennoLink.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\TennoLink"; Filename: "{app}\TennoLink.exe"
Name: "{autodesktop}\TennoLink"; Filename: "{app}\TennoLink.exe"; Tasks: desktopicon
Name: "{userstartup}\TennoLink"; Filename: "{app}\TennoLink.exe"; Tasks: startupicon

[Run]
Filename: "{app}\TennoLink.exe"; Description: "{cm:LaunchProgram,TennoLink}"; Flags: nowait postinstall skipifsilent

[Registry]
; If the user selects the startup icon task, ensure the app's registry value is also set so the app's internal "Start on login" checkbox reflects the state.
Root: HKCU; Subkey: "SOFTWARE\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "TennoLink"; ValueData: """{app}\TennoLink.exe"""; Tasks: startupicon
