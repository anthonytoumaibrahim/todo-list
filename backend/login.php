<?php
require_once('connection.php');

$json = file_get_contents('php://input');
$json = json_decode($json, true);

$usernameOrEmail = $json['username'] ?? "";
$password = $json['password'] ?? "";

function login($conn, $usernameOrEmail, $password)
{
  $response = [
    'status' => false,
    'message' => '',
    'data' => [],
  ];

  // Validation
  if (empty($usernameOrEmail) || empty($password)) {
    $response['message'] = "Username/Email or Password cannot be empty.";
    return json_encode($response);
  }

  // Check if user exists
  $query = $conn->prepare("SELECT * FROM users WHERE username=? OR email=?");
  $query->bind_param('ss', $usernameOrEmail, $usernameOrEmail);
  $query->execute();
  $query->store_result();
  $query->bind_result($id, $username, $email, $hashed_password);
  $query->fetch();
  $num_rows = $query->num_rows();

  if ($num_rows == 0) {
    $response['message'] = "User does not exist.";
    return json_encode($response);
  }

  // Check if password is not correct
  if (!password_verify($password, $hashed_password)) {
    $response['message'] = "Password is incorrect.";
    return json_encode($response);
  }

  // Login successful
  $response['status'] = true;
  $response['message'] = "Login successful.";
  $response['data']['user_id'] = $id;
  return json_encode($response);
}

echo login($conn, $usernameOrEmail, $password);
