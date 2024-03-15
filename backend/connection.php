<?php
// Fix CORS error
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "tododb";

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
  exit("Connection failed: " . $conn->connect_error);
}

// Generate & validate token
function generateToken($userId) {
  return md5($userId . "abcdef123456");
}
function validateToken($token, $userId) {
  $ver = generateToken($userId);
  if($token === $ver) {
    return true;
  }
  return false;
}

// Get user score
function getUserScore($id)
{
  global $conn;
  $query = $conn->prepare("SELECT points FROM users WHERE id=?");
  $query->bind_param("i", $id);
  $query->execute();
  $query->store_result();
  $query->bind_result($points);
  $query->fetch();

  return $points;
}
