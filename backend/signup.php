<?php
require_once('connection.php');

$json = file_get_contents('php://input');
$json = json_decode($json, true);

$username = $json['username'] ?? "";
$email = $json['email'] ?? "";
$password = $json['password'] ?? "";

function createUser($conn, $username, $email, $password)
{
  $response = [
    'status' => false,
    'message' => '',
    'data' => []
  ];

  // Validate username
  if (!preg_match("/^[a-zA-Z0-9]{6,20}$/", $username)) {
    $response['message'] = "Username must be between 6 and 20 characters long, and contain only alphanumeric characters.";
    return json_encode($response);
  }

  // Validate email
  $email_regex = "/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/";
  if (!preg_match($email_regex, $email)) {
    $response['message'] = "Invalid email address";
    return json_encode($response);
  }

  // Validate password
  if (strlen($password) < 8) {
    $response['message'] = "Password must be at least 8 characters long.";
    return json_encode($response);
  }

  $check_user = $conn->prepare("SELECT username, email FROM users WHERE username=? OR email=?");
  $check_user->bind_param("ss", $username, $email);
  $check_user->execute();
  $check_user->store_result();
  $user_exists = $check_user->num_rows() > 0;

  if ($user_exists) {
    $response['message'] = 'Username or email already exists';
    return json_encode($response);
  }

  // Add user to table
  $hashed_password = password_hash($password, PASSWORD_BCRYPT);
  $add_user = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
  $add_user->bind_param('sss', $username, $email, $hashed_password);
  $add_user->execute();

  $id = $conn->insert_id;

  $response['status'] = true;
  $response['message'] = 'Your account has been successfully created! Redirecting you in 3 seconds...';
  $response['data']['user_id'] = $id;
  $response['data']['token'] = generateToken($id);
  return json_encode($response);
}

echo createUser($conn, $username, $email, $password);
