# Student Result Management System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PHP (v8.0 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend API
Open a new terminal and run:
```bash
cd backend
php -S localhost:8000
```

### 3. Start the Frontend
In another terminal:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🔐 Login Credentials

### Admin Account
- **Email**: `admin@school.edu`
- **Password**: `password`
- **Role**: Administrator (Full access)

### Student Account
- **Email**: `john.smith@student.edu`
- **Password**: `password`
- **Role**: Student (Limited access)

## 🎨 Theme System

The application supports three theme modes:
- **Light Mode**: Default bright theme
- **Dark Mode**: Dark theme for low-light environments
- **System Mode**: Automatically matches your system preference

Click the theme toggle button (🌙/☀️/💻) in the top-right corner to switch between modes.

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### API Configuration
The API base URL is configured in `lib/api.ts`. By default, it points to `http://localhost:8000`.

## 📁 Project Structure

```
SRS/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── student/           # Student dashboard pages
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── backend/               # PHP backend API
│   ├── api.php           # Main API file
│   └── utils/            # Utility functions
├── components/           # React components
│   ├── ui/              # UI components
│   └── providers/       # Context providers
├── lib/                 # Utility libraries
│   ├── api.ts          # API client
│   ├── auth.ts         # Authentication logic
│   └── utils.ts        # Helper functions
└── types/              # TypeScript type definitions
```

## 🐛 Troubleshooting

### Login Issues
1. **Invalid Credentials Error**:
   - Ensure the backend server is running on port 8000
   - Use the exact credentials provided above
   - Check browser console for API errors

2. **CORS Issues**:
   - The backend includes CORS headers
   - Ensure both frontend and backend are running

### Theme Toggle Not Working
1. **Theme not persisting**:
   - Check if localStorage is enabled in your browser
   - Clear browser cache and try again

2. **Dark mode not applying**:
   - Ensure CSS variables are loaded
   - Check browser developer tools for CSS errors

### Backend API Issues
1. **Port 8000 already in use**:
   ```bash
   # Use a different port
   php -S localhost:8001
   # Update API_BASE in lib/api.ts accordingly
   ```

2. **PHP not found**:
   - Install PHP from https://www.php.net/downloads
   - Ensure PHP is in your system PATH

## 🔄 Development Workflow

### Making Changes
1. **Frontend changes**: Automatically reload with Next.js hot reload
2. **Backend changes**: Restart the PHP server
3. **CSS changes**: Automatically applied with Tailwind CSS

### Adding New Features
1. Create components in `components/`
2. Add API endpoints in `backend/api.php`
3. Update types in `types/`
4. Test with both admin and student accounts

## 📊 Features

### Admin Dashboard
- View all students and their results
- Manage courses and subjects
- Generate reports and analytics
- User management

### Student Dashboard
- View personal results and grades
- Track academic progress
- Download result certificates
- View course information

### Authentication System
- JWT-based authentication
- Role-based access control
- Secure login/logout
- Session management

### Theme System
- Light/Dark/System modes
- Persistent theme selection
- Smooth transitions
- Accessibility support

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `out` folder
3. Set environment variables in deployment platform

### Backend (Any PHP hosting)
1. Upload `backend/` folder to server
2. Ensure PHP 8.0+ is available
3. Configure web server to point to `api.php`

## 📝 Notes

- This is a demo application with mock data
- JWT tokens are generated server-side
- All data is stored in memory (resets on server restart)
- For production, implement proper database integration

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify both servers are running
3. Ensure correct login credentials
4. Check network connectivity

## 🎯 Next Steps

- Implement real database integration
- Add email notifications
- Enhance security measures
- Add more detailed analytics
- Implement file upload functionality
