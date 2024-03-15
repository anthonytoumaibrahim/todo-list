<?php
require_once('../connection.php');

$todoId = $_GET['todoId'] ?? 0;
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

if ($todoId === 0) {
  $response['message'] = "Todo ID is required";
  exit(json_encode($response));
}

$delete_query = $conn->prepare("DELETE FROM todos WHERE id=?");
$delete_query->bind_param("i", $todoId);
$delete_query->execute();

$response['status'] = true;
$response['message'] = 'Todo deleted.';

// Count todos
$count_query = $conn->prepare("SELECT id FROM todos WHERE user_id=?");
$count_query->bind_param("i", $userId);
$count_query->execute();
$count_query->store_result();
$count = $count_query->num_rows();

$response['data']['count'] = $count;


echo json_encode($response);
