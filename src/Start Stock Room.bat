@echo off
cd /d "%~dp0"
title Herba Pharmacy - Stock Room
set "STOCKROOM_DIR=%~dp0"
if exist "runtime\bun.exe" goto shortcut

echo.
echo   First start: downloading the Stock Room engine (about 40 MB).
echo   This only happens once and needs an internet connection.
echo.
if not exist runtime mkdir runtime
curl.exe -L --fail --progress-bar -o "runtime\engine.zip" "https://github.com/oven-sh/bun/releases/download/bun-v1.4.2/bun-windows-x64.zip"
if errorlevel 1 goto fail
tar -xf "runtime\engine.zip" -C runtime
if errorlevel 1 goto fail
move /y "runtime\bun-windows-x64\bun.exe" "runtime\bun.exe" >nul
rmdir /s /q "runtime\bun-windows-x64"
del "runtime\engine.zip"
if not exist "runtime\bun.exe" goto fail
echo   Done.

:shortcut
if exist "runtime\shortcut-made.txt" goto run
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=[Environment]::GetFolderPath('Desktop'); $s=(New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $d 'Stock Room.lnk')); $s.TargetPath=(Join-Path '%~dp0' 'Start Stock Room.bat'); $s.WorkingDirectory='%~dp0'; $s.IconLocation=(Join-Path '%~dp0' 'stockroom.ico'); $s.WindowStyle=7; $s.Description='Herba Pharmacy Stock Room'; $s.Save()" >nul 2>&1
if not errorlevel 1 (
  echo made> "runtime\shortcut-made.txt"
  echo   A "Stock Room" icon has been added to your desktop.
)

:run
rem Normal start: run Stock Room in the background with no black window.
rem To see its messages for troubleshooting, run:  "Start Stock Room.bat" console
if /i "%~1"=="console" goto console
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "Start-Process -FilePath (Join-Path '%~dp0' 'runtime\bun.exe') -ArgumentList 'stockroom-server.js' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
if errorlevel 1 goto console
exit /b

:console
"runtime\bun.exe" "stockroom-server.js"
if errorlevel 3 if not errorlevel 4 exit /b
echo.
echo   Stock Room has stopped.
pause
exit /b

:fail
echo.
echo   The download didn't work. Check this computer is connected to the internet,
echo   then double-click "Start Stock Room" again.
if exist "runtime\engine.zip" del "runtime\engine.zip"
pause
