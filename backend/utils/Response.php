<?php
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit();
    }

    public static function success($message = "Success", $data = null) {
        $response = [
            'success' => true,
            'message' => $message
        ];
        if ($data !== null) {
            $response['data'] = $data;
        }
        self::json($response);
    }

    public static function error($message = "Error occurred", $status = 400, $errors = null) {
        $response = [
            'success' => false,
            'message' => $message
        ];
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        self::json($response, $status);
    }
}
?>