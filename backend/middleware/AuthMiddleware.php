<?php
/**
 * Authentication Middleware
 * Handles JWT token validation for protected routes
 */
class AuthMiddleware {
    private $jwt;

    public function __construct() {
        $this->jwt = new JWTHandler();
    }

    /**
     * Validate authentication token
     * @param string $requiredRole Optional role requirement
     * @return array|false User data if authenticated, false otherwise
     */
    public function authenticate($requiredRole = null) {
        $token = $this->jwt->getTokenFromHeader();
        
        if (!$token) {
            Response::error("Authentication token required", 401);
            return false;
        }

        $userData = $this->jwt->validateToken($token);
        
        if (!$userData) {
            Response::error("Invalid or expired token", 401);
            return false;
        }

        // Check role if required
        if ($requiredRole && $userData['role'] !== $requiredRole) {
            Response::error("Insufficient permissions", 403);
            return false;
        }

        return $userData;
    }

    /**
     * Check if user is admin
     * @return array|false User data if admin, false otherwise
     */
    public function requireAdmin() {
        return $this->authenticate('admin');
    }

    /**
     * Check if user is student
     * @return array|false User data if student, false otherwise
     */
    public function requireStudent() {
        return $this->authenticate('student');
    }

    /**
     * Get current authenticated user
     * @return array|false User data if authenticated, false otherwise
     */
    public function getCurrentUser() {
        return $this->authenticate();
    }
}
?>