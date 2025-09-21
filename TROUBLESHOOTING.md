# 🔧 Troubleshooting Guide

## Backend Connection Issues

### Problem: "Cannot connect to backend server" or 404 errors

**Solution Steps:**

1. **Stop any existing PHP servers:**
   ```bash
   # Kill all PHP processes
   taskkill /f /im php.exe
   ```

2. **Start backend manually:**
   ```bash
   cd backend
   php -S localhost:8000
   ```

3. **Test backend connection:**
   - Open browser to: http://localhost:8000
   - Should see JSON response with API info
   - Or run: `test-backend.bat`

4. **Check for port conflicts:**
   ```bash
   netstat -an | findstr :8000
   ```

### Problem: Backend returns 404 for all requests

**Root Cause:** The `index.php` file wasn't properly routing requests.

**Solution:** The `index.php` has been fixed to route all requests through `api.php`.

## Login Issues

### Problem: "Invalid credentials" with demo accounts

**Verify these steps:**

1. **Backend Status:** Check that backend status shows "Backend Online" (green)
2. **Correct Credentials:**
   - Admin: `admin@school.edu` / `password`
   - Student: `john.smith@student.edu` / `password`
3. **Use Auto-fill:** Click the demo credential buttons instead of typing manually

### Problem: Backend status shows "Backend Offline" (red)

**Solutions:**

1. **Restart backend server:**
   ```bash
   cd backend
   php -S localhost:8000
   ```

2. **Check PHP installation:**
   ```bash
   php --version
   ```

3. **Check firewall/antivirus:** Ensure localhost:8000 is not blocked

## Dark Mode Issues

### Problem: Text not visible in dark mode

**Status:** ✅ **FIXED** - Input component now has proper dark mode styling.

**What was fixed:**
- Added dark mode classes for input backgrounds
- Enhanced text color for dark theme
- Improved placeholder and label visibility

## Server Startup Issues

### Problem: Servers won't start with start-servers.bat

**Manual startup method:**

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   php -S localhost:8000
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

### Problem: Port already in use

**For Backend (port 8000):**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**For Frontend (port 3000):**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

## Quick Verification Steps

### ✅ Backend Working Checklist:
1. [ ] `http://localhost:8000` returns JSON response
2. [ ] Backend status in login page shows "Backend Online"
3. [ ] `test-backend.bat` shows successful login responses
4. [ ] No 404 errors in PHP server console

### ✅ Frontend Working Checklist:
1. [ ] `http://localhost:3000` loads the application
2. [ ] `http://localhost:3000/login` shows login page
3. [ ] Theme toggle works (light/dark/system)
4. [ ] Demo credential buttons auto-fill the form
5. [ ] Contact support and forgot password modals work

### ✅ Login Working Checklist:
1. [ ] Backend status shows green "Online"
2. [ ] Demo credentials auto-fill correctly
3. [ ] Login succeeds with demo accounts
4. [ ] Redirects to appropriate dashboard after login

## Common Error Messages

### "Failed to connect to localhost port 8000"
- **Cause:** Backend server not running
- **Solution:** Start backend with `cd backend && php -S localhost:8000`

### "Invalid credentials"
- **Cause:** Backend not responding or wrong credentials
- **Solution:** Verify backend is running and use exact demo credentials

### "Cannot connect to the backend server"
- **Cause:** Frontend can't reach backend
- **Solution:** Ensure both servers are running on correct ports

## Development Tips

### Viewing Server Logs:
- **Backend:** Check the terminal where PHP server is running
- **Frontend:** Check browser developer console (F12)

### Testing API Endpoints:
Use the provided test files:
- `test-backend.bat` - Tests backend API
- `debug_login.html` - Tests login functionality
- `test_direct_login.html` - Direct API testing

### Resetting Everything:
1. Stop all servers (Ctrl+C in terminals)
2. Kill PHP processes: `taskkill /f /im php.exe`
3. Kill Node processes: `taskkill /f /im node.exe`
4. Restart with `start-servers.bat`

## Getting Help

If issues persist:

1. **Check server console output** for error messages
2. **Open browser developer tools** (F12) and check console
3. **Run test scripts** to isolate the problem
4. **Verify PHP and Node.js** are properly installed

---

**Most issues are resolved by ensuring both servers are running correctly!** 🚀
