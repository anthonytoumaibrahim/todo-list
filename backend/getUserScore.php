<?php
require_once('connection.php');


$userId = $_GET['userId'] ?? 0;

$response = [
  'status' => false,
  'message' => '',
  'data' => []
];

if ($userId === 0) {
  $response['message'] = "User ID is required";
  exit(json_encode($response));
}

$response['status'] = true;
$response['message'] = getUserScore($userId);

echo json_encode($response);
