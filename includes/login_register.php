<?php

include "database.php";

session_start();

header('Content-Type: application/json; charset=utf-8');

function sanitize_input($key)
{
    return filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $method_name = $_POST['name'];

    $username = sanitize_input("username");
    $password = sanitize_input("password");

    if (empty($username) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "All fields are required!"]);
        exit();
    }

    if ($method_name === 'user_login') {
        $sql = "SELECT * FROM users WHERE username = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            if (password_verify($password, $row['password'])) {
                $_SESSION['username'] = $username;
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Invalid Credentials!"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "User not found!"]);
        }
    } elseif ($method_name === 'user_register') {
        $sql = "SELECT * FROM users WHERE username = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if (mysqli_fetch_assoc($result)) {
            echo json_encode(["status" => "error", "message" => "Username already exists!"]);
            exit();
        }

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $username, $hashed_password);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "success", "message" => "Registration successful!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Something went wrong, try again!"]);
        }
    }
    exit();
}
