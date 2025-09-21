<?php
/**
 * Authentication Controller
 * Handles user login and authentication
 */
class AuthController {
    private $db;
    private $jwt;

    public function __construct($db) {
        $this->db = $db;
        $this->jwt = new JWTHandler();
    }

    /**
     * Handle login request
     */
    public function create($action = null) {
        if ($action !== 'login' && $action !== null) {
            Response::error("Invalid action", 400);
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            Response::error("Email and password required", 400);
        }

        $email = trim($data['email']);
        $password = trim($data['password']);

        if (empty($email) || empty($password)) {
            Response::error("Email and password cannot be empty", 400);
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error("Invalid email format", 400);
        }

        $user = $this->authenticateUser($email, $password);

        if (!$user) {
            Response::error("Invalid credentials", 401);
        }

        $token = $this->jwt->generateToken($user);

        Response::success("Login successful", [
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role']
            ],
            'token' => $token
        ]);
    }

    /**
     * Authenticate user credentials
     * @param string $email User email
     * @param string $password User password
     * @return array|false User data if valid, false otherwise
     */
    private function authenticateUser($email, $password) {
        try {
            // Check admin table first
            $query = "SELECT id, username as name, email, password, role FROM admin WHERE email = :email AND is_active = true";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password'])) {
                return $admin;
            }

            // Check student table
            $query = "SELECT id, name, email, password, 'student' as role FROM students WHERE email = :email AND is_active = true";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();
            $student = $stmt->fetch();

            if ($student && password_verify($password, $student['password'])) {
                return $student;
            }

            return false;
        } catch (Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Handle logout (token invalidation would be handled client-side)
     */
    public function logout() {
        Response::success("Logged out successfully");
    }

    /**
     * Verify token and return user info
     */
    public function verify() {
        $auth = new AuthMiddleware();
        $user = $auth->getCurrentUser();
        
        if ($user) {
            Response::success("Token valid", [
                'user' => [
                    'id' => $user['user_id'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        }
    }

    // Default methods for routing compatibility
    public function index($action = null) {
        if ($action === 'verify') {
            $this->verify();
        } else {
            Response::error("Method not allowed", 405);
        }
    }

    public function show($action, $id) {
        Response::error("Method not allowed", 405);
    }

    public function update($action, $id) {
        Response::error("Method not allowed", 405);
    }

    public function delete($action, $id) {
        Response::error("Method not allowed", 405);
    }
}
?>