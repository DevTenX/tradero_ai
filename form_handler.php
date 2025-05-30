<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Function to send data to external platform
function sendToExternalPlatform($data)
{
    $external_api_url = 'https://api.tenxaffiliates.com/api/create-lead-plain';
    $skKey = "sk_683981ced29484.50592965";
    
    // Prepare the data for the external platform
    $postData = json_encode($data);
    
    // Initialize cURL
    $curl = curl_init();
    
    curl_setopt_array($curl, [
        CURLOPT_URL            => $external_api_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $postData,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Content-Length: '.strlen($postData),
            'Authorization: '.$skKey
        ],
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_FOLLOWLOCATION => false
    ]);
    
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    
    curl_close($curl);
    
    if ($error) {
        return [
            'success' => false,
            'error'   => 'cURL error: '.$error
        ];
    }
    
    if ($httpCode === 200) {
        $responseData = json_decode($response, true);
        return [
            'success'      => true,
            'redirect_url' => $responseData['url'] ?? null,
            'response'     => $responseData
        ];
    } else {
        return [
            'success'  => false,
            'error'    => 'External platform returned HTTP '.$httpCode,
            'response' => $response
        ];
    }
}

// Handle POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the request data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Determine form type and validate
$formType = $data['form_type'] ?? '';

switch ($formType) {
    case 'registration':
        // Validate registration data
        $required = ['name', 'email', 'phone'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            exit;
        }
        
        $country = $_SERVER('CF_IPCOUNTRY', 'GB');
        $ip = $_SERVER('CF-Connecting-IP', $_SERVER['REMOTE_ADDR'] != null ? $_SERVER['REMOTE_ADDR'] : null);
        
        $nameArray = explode(' ', $data['name']);
        $name = $nameArray[0];
        unset($nameArray[0]);
        $surname = count($nameArray) >= 1 ? implode(' ', $nameArray) : $name;
        // Prepare data for external platform
        $externalData = [
            'name'       => $name,
            'surname'    => $surname,
            'email'      => $data['email'],
            'phone'      => $data['phone'],
            'country'    => $country,
            'aff_source' => 'tradero_website',
            'ip'         => $ip,
        ];
        
        $result = sendToExternalPlatform($externalData);
        
        if ($result['success']) {
            echo json_encode([
                'success'      => true,
                'message'      => 'Registration successful',
                'redirect_url' => $result['redirect_url']
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error'   => $result['error']
            ]);
        }
        break;
    
    case 'contact':
        // Validate contact data
        $required = ['name', 'email', 'subject', 'message'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            exit;
        }
        
        // Prepare data for external platform
        $externalData = [
            'name'         => $data['name'],
            'email'        => $data['email'],
            'subject'      => $data['subject'],
            'message'      => $data['message'],
            'inquiry_type' => $data['inquiry_type'] ?? 'general',
            'source'       => 'tradero_contact_form',
            'timestamp'    => date('c'),
            'user_agent'   => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'ip_address'   => $_SERVER['REMOTE_ADDR'] ?? ''
        ];
        
        $result = sendToExternalPlatform($externalData, 'contact');
        
        if ($result['success']) {
            echo json_encode([
                'success'      => true,
                'message'      => 'Message sent successfully',
                'redirect_url' => $result['redirect_url']
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error'   => $result['error']
            ]);
        }
        break;
    
    case 'newsletter':
        // Validate newsletter data
        if (empty($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email is required']);
            exit;
        }
        
        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            exit;
        }
        
        // Prepare data for external platform
        $externalData = [
            'email'      => $data['email'],
            'source'     => 'tradero_newsletter',
            'timestamp'  => date('c'),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? ''
        ];
        
        $result = sendToExternalPlatform($externalData, 'newsletter');
        
        if ($result['success']) {
            echo json_encode([
                'success' => true,
                'message' => 'Successfully subscribed to newsletter'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error'   => $result['error']
            ]);
        }
        break;
    
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid form type']);
        break;
}
?>
