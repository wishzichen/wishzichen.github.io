@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\start-local-lab.ps1" -Mode Full
if errorlevel 1 (
  echo.
  echo Local lab startup failed. Press any key to close this window.
  pause >nul
  exit /b 1
)
