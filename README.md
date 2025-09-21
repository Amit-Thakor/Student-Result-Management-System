# 🎓 Student Result Management System

A modern, full-stack Student Result Management System built with Next.js and PHP. This comprehensive platform provides academic record management with beautiful UI/UX, role-based authentication, real-time analytics, and enterprise-grade features.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based Access Control**: Admin and Student dashboards
- **JWT Authentication**: Secure token-based authentication
- **Password Reset**: Forgot password functionality with email validation
- **Contact Support**: Built-in support system with form validation

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Complete theme system with system preference detection
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Professional Design**: Clean, modern interface with smooth animations
- **Accessibility**: WCAG compliant with proper ARIA labels

### 📊 Analytics & Management
- **Student Management**: Complete CRUD operations for student records
- **Course Management**: Subject and curriculum management
- **Result Tracking**: Comprehensive grade and performance tracking
- **Real-time Analytics**: Interactive charts and performance metrics

### 🔧 Technical Excellence
- **TypeScript**: Full type safety for better development experience
- **Component Architecture**: Reusable, modular UI components
- **State Management**: Zustand for efficient state handling
- **Form Validation**: React Hook Form with Zod schema validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **SweetAlert2** - Beautiful modals and alerts
- **Heroicons** - SVG icon library

### Backend
- **PHP 8.3+** - Server-side scripting
- **Custom REST API** - RESTful API endpoints
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL** - Primary database (with mock data fallback)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18.0+** and npm 8.0+
- **PHP 8.0+** with CLI support
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd student-result-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 📝 Environment Setup

3. **Create environment file**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```

4. **Configure environment variables** (edit `.env.local`):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=Student Result Management System
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

## 🏃 Running the Application

### Quick Start (Recommended)
Use the provided startup script to run both servers:

```bash
# Windows
.\start-servers.bat

# Linux/Mac
./setup.sh
```

### Manual Setup

1. **Start the PHP Backend** (Terminal 1):
   ```bash
   cd backend
   php -S localhost:8000
   ```

2. **Start the Next.js Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Login page: http://localhost:3000/login

## 📜 Available Scripts

In the project directory, you can run:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

## 🔐 Default Login Credentials

### Admin Access
- **Email**: `admin@school.edu`
- **Password**: `password`
- **Features**: Full system access, student management, analytics, reporting

### Student Access
- **Email**: `john.smith@student.edu`
- **Password**: `password`
- **Features**: Personal dashboard, grade viewing, profile management

## 📊 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/verify` - Token verification

### Student Management
- `GET /students` - Get all students
- `GET /students/{id}` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student

### Course Management
- `GET /courses` - Get all courses
- `POST /courses` - Create new course
- `PUT /courses/{id}` - Update course
- `DELETE /courses/{id}` - Delete course

### Results Management
- `GET /results` - Get all results
- `GET /results/dashboard` - Dashboard statistics
- `POST /results` - Create new result
- `PUT /results/{id}` - Update result

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🤝 Contributing

We welcome contributions to the Student Result Management System! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and ensure code quality: `npm run lint && npm run type-check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add TypeScript types for all new code
- Write clear, descriptive commit messages
- Update documentation as needed
- Ensure all checks pass before submitting

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## 🐛 Issues and Support

If you encounter any issues or need support:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue with detailed information:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, Node.js version, etc.)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms library
- **SweetAlert2** - Beautiful alert dialogs

---

**Built with ❤️ for modern education management**

⭐ If you find this project helpful, please give it a star!
