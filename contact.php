<?php
/**
 * Contact Form Handler
 * Portfolio - Nguyễn Vũ Quang Huy
 * 
 * This script handles contact form submissions
 * and sends email notifications.
 */

// Set headers for JSON response
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
define('ADMIN_EMAIL', 'quanghuy@example.com'); // Change this to your email
define('EMAIL_SUBJECT_PREFIX', '[Portfolio Contact]');
define('MAX_MESSAGE_LENGTH', 5000);

/**
 * Main handler class for contact form
 */
class ContactFormHandler
{
    private $name;
    private $email;
    private $phone;
    private $subject;
    private $message;
    private $errors = [];

    /**
     * Process the form submission
     */
    public function process()
    {
        // Only accept POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(false, 'Invalid request method', 405);
            return;
        }

        // Get and sanitize input
        $this->getInput();

        // Validate input
        if (!$this->validate()) {
            $this->sendResponse(false, 'Validation failed', 400, $this->errors);
            return;
        }

        // Send email
        if ($this->sendEmail()) {
            $this->logSubmission();
            $this->sendResponse(true, 'Tin nhắn đã được gửi thành công!');
        } else {
            $this->sendResponse(false, 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.', 500);
        }
    }

    /**
     * Get and sanitize input data
     */
    private function getInput()
    {
        // Check if JSON input
        $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        
        if (strpos($contentType, 'application/json') !== false) {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
        } else {
            $data = $_POST;
        }

        $this->name = $this->sanitize($data['name'] ?? '');
        $this->email = $this->sanitize($data['email'] ?? '');
        $this->phone = $this->sanitize($data['phone'] ?? '');
        $this->subject = $this->sanitize($data['subject'] ?? '');
        $this->message = $this->sanitize($data['message'] ?? '');
    }

    /**
     * Sanitize input string
     */
    private function sanitize($input)
    {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Validate form input
     */
    private function validate()
    {
        // Name validation
        if (empty($this->name)) {
            $this->errors['name'] = 'Vui lòng nhập họ tên';
        } elseif (strlen($this->name) < 2) {
            $this->errors['name'] = 'Họ tên phải có ít nhất 2 ký tự';
        } elseif (strlen($this->name) > 100) {
            $this->errors['name'] = 'Họ tên không được quá 100 ký tự';
        }

        // Email validation
        if (empty($this->email)) {
            $this->errors['email'] = 'Vui lòng nhập email';
        } elseif (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'Email không hợp lệ';
        }

        // Phone validation (optional)
        if (!empty($this->phone) && !preg_match('/^[\d\s\+\-\(\)]{10,20}$/', $this->phone)) {
            $this->errors['phone'] = 'Số điện thoại không hợp lệ';
        }

        // Subject validation
        if (empty($this->subject)) {
            $this->errors['subject'] = 'Vui lòng nhập chủ đề';
        } elseif (strlen($this->subject) < 5) {
            $this->errors['subject'] = 'Chủ đề phải có ít nhất 5 ký tự';
        } elseif (strlen($this->subject) > 200) {
            $this->errors['subject'] = 'Chủ đề không được quá 200 ký tự';
        }

        // Message validation
        if (empty($this->message)) {
            $this->errors['message'] = 'Vui lòng nhập tin nhắn';
        } elseif (strlen($this->message) < 10) {
            $this->errors['message'] = 'Tin nhắn phải có ít nhất 10 ký tự';
        } elseif (strlen($this->message) > MAX_MESSAGE_LENGTH) {
            $this->errors['message'] = 'Tin nhắn không được quá ' . MAX_MESSAGE_LENGTH . ' ký tự';
        }

        // Honeypot check (anti-spam)
        if (!empty($_POST['website'] ?? '')) {
            $this->errors['spam'] = 'Spam detected';
        }

        return empty($this->errors);
    }

    /**
     * Send email notification
     */
    private function sendEmail()
    {
        $to = ADMIN_EMAIL;
        $emailSubject = EMAIL_SUBJECT_PREFIX . ' ' . $this->subject;
        
        // Build email body
        $body = $this->buildEmailBody();
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=utf-8',
            'From: Portfolio Contact <noreply@' . $_SERVER['HTTP_HOST'] . '>',
            'Reply-To: ' . $this->name . ' <' . $this->email . '>',
            'X-Mailer: PHP/' . phpversion()
        ];

        // Send email
        return mail($to, $emailSubject, $body, implode("\r\n", $headers));
    }

    /**
     * Build HTML email body
     */
    private function buildEmailBody()
    {
        $date = date('d/m/Y H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #6366f1; margin-bottom: 5px; display: block; }
        .value { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
        .meta { font-size: 11px; color: #94a3b8; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">📧 Tin nhắn mới từ Portfolio</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">👤 Họ tên:</span>
                <div class="value">{$this->name}</div>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value"><a href="mailto:{$this->email}">{$this->email}</a></div>
            </div>
            <div class="field">
                <span class="label">📱 Số điện thoại:</span>
                <div class="value">{$this->phone}</div>
            </div>
            <div class="field">
                <span class="label">📋 Chủ đề:</span>
                <div class="value">{$this->subject}</div>
            </div>
            <div class="field">
                <span class="label">💬 Tin nhắn:</span>
                <div class="value">{$this->message}</div>
            </div>
            <div class="meta">
                <p><strong>Thời gian:</strong> {$date}</p>
                <p><strong>IP:</strong> {$ip}</p>
                <p><strong>User Agent:</strong> {$userAgent}</p>
            </div>
        </div>
        <div class="footer">
            <p>Email này được gửi tự động từ form liên hệ trên Portfolio</p>
            <p>© 2026 Nguyễn Vũ Quang Huy</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Log submission to file (optional)
     */
    private function logSubmission()
    {
        $logFile = __DIR__ . '/logs/contact_log.txt';
        $logDir = dirname($logFile);
        
        // Create logs directory if not exists
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $logEntry = sprintf(
            "[%s] Name: %s | Email: %s | Subject: %s | IP: %s\n",
            date('Y-m-d H:i:s'),
            $this->name,
            $this->email,
            $this->subject,
            $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
        );

        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }

    /**
     * Send JSON response
     */
    private function sendResponse($success, $message, $statusCode = 200, $errors = [])
    {
        http_response_code($statusCode);
        
        $response = [
            'success' => $success,
            'message' => $message
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Rate limiting (simple implementation)
function checkRateLimit()
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $limitFile = sys_get_temp_dir() . '/contact_rate_' . md5($ip) . '.txt';
    $limit = 5; // Max requests
    $window = 3600; // Per hour (seconds)

    if (file_exists($limitFile)) {
        $data = json_decode(file_get_contents($limitFile), true);
        
        if ($data && time() - $data['first_request'] < $window) {
            if ($data['count'] >= $limit) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            $data['count']++;
        } else {
            $data = ['first_request' => time(), 'count' => 1];
        }
    } else {
        $data = ['first_request' => time(), 'count' => 1];
    }

    file_put_contents($limitFile, json_encode($data));
}

// Run rate limit check
checkRateLimit();

// Process the form
$handler = new ContactFormHandler();
$handler->process();
