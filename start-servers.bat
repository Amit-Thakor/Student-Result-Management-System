@echo off
echo 🎓 Student Result Management System - Server Startup
echo ================================================
echo.

echo 🔧 Starting PHP Backend Server...
echo Backend will be available at: http://localhost:8000
echo.

REM Kill any existing PHP servers on port 8000
taskkill /f /im php.exe 2>nul
timeout /t 1 /nobreak > nul

start "PHP Backend Server" cmd /k "cd /d "%~dp0backend" && echo Starting PHP server... && php -S localhost:8000 && echo Backend server stopped. Press any key to close. && pause"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Starting Next.js Frontend Server...
echo Frontend will be available at: http://localhost:3000
echo.

start "Next.js Frontend Server" cmd /k "cd /d "%~dp0" && echo Starting Next.js server... && npm run dev && echo Frontend server stopped. Press any key to close. && pause"

echo.
echo ✅ Both servers are starting...
echo.
echo 📖 IMPORTANT: Check the opened terminal windows for server status
echo 🌐 Frontend: http://localhost:3000/login
echo 🔧 Backend API: http://localhost:8000
echo.
echo 📧 Demo Credentials:
echo 🔑 Admin: admin@school.edu / password
echo 🎓 Student: john.smith@student.edu / password
echo.
echo 📝 Instructions:
echo 1. Wait for both terminal windows to show servers are running
echo 2. Go to http://localhost:3000/login
echo 3. Click on demo credential buttons to auto-fill
echo 4. The backend status should show "Backend Online" (green)
echo.
echo Press any key to exit this window...
pause > nul
