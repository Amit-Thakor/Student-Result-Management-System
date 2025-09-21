@echo off
echo 🧪 Testing Backend API Connection
echo ================================
echo.

echo Testing root endpoint...
curl -s http://localhost:8000
echo.
echo.

echo Testing admin login...
curl -s -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@school.edu\",\"password\":\"password\"}"
echo.
echo.

echo Testing student login...
curl -s -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"john.smith@student.edu\",\"password\":\"password\"}"
echo.
echo.

echo ✅ Backend test completed!
echo If you see JSON responses above, the backend is working correctly.
echo.
pause
