@echo off
echo ========================================
echo  SmartContent - Starting Servers
echo ========================================
echo.

REM Kill any existing node/python processes to avoid port conflicts
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo [1/3] Starting Backend Server (Node.js)...
start "SmartContent Backend" cmd /k "cd /d "%~dp0backend" && node server.js"
timeout /t 3 /nobreak >nul

echo [2/3] Starting ML API Server (Python Flask)...
start "SmartContent ML API" cmd /k "cd /d "%~dp0ml-api" && py app.py"
timeout /t 3 /nobreak >nul

echo [3/3] Opening Website...
start "" "%~dp0frontend\index.html"

echo.
echo ========================================
echo  All Servers Started Successfully!
echo ========================================
echo.
echo  Backend API: http://localhost:5000
echo  ML API:      http://localhost:5001
echo.
echo  Two terminal windows will open.
echo  Keep them running while using the website.
echo.
echo  Press any key to exit this window...
pause >nul
