<?php
require_once('../connection.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$userId = $data['userId'] ?? 0;
$todoId = $data['todoId'] ?? 0;
$checked = $data['checked'] ?? false;
$important = $data['important'] ?? false;

$response = [
  'status' => false,
  'message' => '',
  'data' => []
];

if ($userId === 0 || $todoId === 0) {
  $response['message'] = "User and todo IDs are required";
  exit(json_encode($response));
}

$update_query = $conn->prepare("UPDATE todos SET checked=?, important=? WHERE id=? AND user_id=?");
$update_query->bind_param("iiii", $checked, $important, $todoId, $userId);
$update_query->execute();

// Increment user's score
if ($checked) {
  $score = getUserScore($userId) + 1;
  $query = $conn->prepare("UPDATE users SET points=? WHERE id=?");
  $query->bind_param("ii", $score, $userId);
  $query->execute();
}

$response['status'] = true;
$response['data']['score'] = getUserScore($userId);
echo json_encode($response);
