@echo off
setlocal

cd /d "%~dp0"
set "PORT=8080"
set "PYTHON_CMD="

where python >nul 2>nul
if not errorlevel 1 set "PYTHON_CMD=python"

if not defined PYTHON_CMD (
  where py >nul 2>nul
  if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if not defined PYTHON_CMD (
  echo Python was not found.
  echo Please install Python, then run this file again.
  pause
  exit /b 1
)

echo Starting local preview server for ZhiShouYinLing...
start "ZHSL Preview Server" cmd /k "cd /d ""%~dp0"" && %PYTHON_CMD% -m http.server %PORT%"
timeout /t 2 >nul
start "" "http://127.0.0.1:%PORT%/"

echo Browser launch attempted: http://127.0.0.1:%PORT%/
echo Close the "ZHSL Preview Server" window to stop the server.
endlocal
