<?php
require_once('../connection.php');

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

$todos_query = $conn->prepare("SELECT id, value, checked, important FROM todos WHERE user_id=?");
$todos_query->bind_param('i', $userId);
$todos_query->execute();
$todos_query->store_result();
$todos_query->bind_result($id, $value, $checked, $important);

$todos = [];

while ($todos_query->fetch()) {
  $todo = [
    'id' => $id,
    'value' => $value,
    'checked' => $checked,
    'important' => $important
  ];
  $todos[] = $todo;
}

$response['status'] = true;
$response['message'] = "Todos fetched successfully";
$response['data'] = $todos;

echo json_encode($response);
