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
