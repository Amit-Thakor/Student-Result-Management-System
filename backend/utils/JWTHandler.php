<?php
/**
 * JWT Handler for authentication
 * Handles JWT token generation, validation, and decoding
 */
class JWTHandler {
    private $secret_key = "your_secret_key_here_change_in_production";
    private $algorithm = 'HS256';
    private $expiration_time = 3600; // 1 hour

    /**
     * Generate JWT token
     * @param array $user User data to encode in token
     * @return string JWT token
     */
    public function generateToken($user) {
        $header = json_encode(['typ' => 'JWT', 'alg' => $this->algorithm]);
        $payload = json_encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + $this->expiration_time
        ]);

        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->secret_key, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }

    /**
     * Validate JWT token
     * @param string $token JWT token to validate
     * @return array|false User data if valid, false if invalid
     */
    public function validateToken($token) {
        try {
            $tokenParts = explode('.', $token);
            if (count($tokenParts) !== 3) {
                return false;
            }

            $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
            $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
            $signature = str_replace(['-', '_'], ['+', '/'], $tokenParts[2]);

            $expectedSignature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], $this->secret_key, true);
            $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

            if ($signature !== $expectedSignature) {
                return false;
            }

            $payloadData = json_decode($payload, true);
            
            // Check if token is expired
            if ($payloadData['exp'] < time()) {
                return false;
            }

            return $payloadData;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Get token from Authorization header
     * @return string|null Token if found, null otherwise
     */
    public function getTokenFromHeader() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }
}
?>