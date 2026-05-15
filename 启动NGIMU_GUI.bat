@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\start-local-lab.ps1" -Mode NgimuOnly
if errorlevel 1 (
  echo.
  echo NGIMU GUI startup failed. Press any key to close this window.
  pause >nul
  exit /b 1
)
