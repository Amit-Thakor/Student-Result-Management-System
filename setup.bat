@echo off
echo 🎓 Student Result Management System - Setup Script
echo ==================================================

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully

echo.
echo Creating environment file...
if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
    echo NEXT_PUBLIC_APP_NAME=Student Result Management System >> .env.local
    echo NEXT_PUBLIC_APP_VERSION=1.0.0 >> .env.local
    echo ✅ Environment file created
) else (
    echo ⚠️ Environment file already exists
)

echo.
echo Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ⚠️ Build failed, but you can still run in development mode
) else (
    echo ✅ Project built successfully
)

echo.
echo 🎉 Setup completed!
echo.
echo To start the application:
echo 1. Start the PHP backend:
echo    cd backend ^&^& php -S localhost:8000
echo.
echo 2. Start the Next.js frontend (in another terminal):
echo    npm run dev
echo.
echo 3. Open your browser and go to:
echo    http://localhost:3000
echo.
echo Default login credentials:
echo Admin: admin@school.edu / password
echo Student: john.smith@student.edu / password
echo.
echo For more information, check:
echo - README.md - Project overview and setup
echo - API_DOCUMENTATION.md - Complete API reference
echo - TECH_STACK_ALIGNMENT.md - Technical details
echo.
echo Happy coding! 🚀
pause