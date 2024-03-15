<?php
require_once('connection.php');


$userId = $_GET['userId'] ?? 0;
$token = $_GET['token'] ?? "";

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

$response['status'] = true;
$response['message'] = getUserScore($userId);

echo json_encode($response);
