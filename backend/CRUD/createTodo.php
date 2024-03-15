<?php
require_once('../connection.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$userId = $data['userId'] ?? 0;
$token = $data['token'] ?? "";
$value = $data['value'] ?? "";
$checked = $data['checked'] ?? false;
$important = $data['important'] ?? false;

$response = [
  'status' => false,
  'message' => '',
  'data' => []
];

// Verify token
if (!validateToken($token, $userId)) {
  $response['message'] = "Wrong token.";
  exit(json_encode($response));
}

if (trim($value) === "") {
  $response['message'] = "Please enter a todo";
  exit(json_encode($response));
}

$create = $conn->prepare("INSERT INTO todos (value, checked, important, user_id) VALUES (?, ?, ?, ?)");
$create->bind_param('siis', $value, $checked, $important, $userId);
$create->execute();

$response['status'] = true;
$response['message'] = "Todo created successfully";
$response['data']['id'] = $conn->insert_id;

echo json_encode($response);
