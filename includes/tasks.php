<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include "database.php";

function set_headers()
{
    header('Content-Type: application/json; charset=utf-8');
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $method_name = $_GET['name'];
    if ($method_name === 'get_all') {
        $sql = "SELECT * FROM tasks ORDER BY id DESC";
        $result = $conn->query($sql);
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        set_headers();

        echo json_encode($tasks);
        return;
    }

    // if ($method_name === 'get_single') {
    //     $id = $_GET['id'];
    //     $sql = "SELECT * FROM tasks WHERE id=" . $id;
    //     $result = $conn->query($sql);
    //     $tasks = [];
    //     while ($row = $result->fetch_assoc()) {
    //         $tasks[] = $row;
    //     }
    //     set_headers();

    //     echo json_encode($tasks);
    //     return;
    // }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $task = htmlspecialchars($_POST['task']);
    $stmt = $conn->prepare("INSERT INTO tasks (task) VALUES (?)");
    $stmt->bind_param("s", $task);
    $isInserted = $stmt->execute();

    set_headers();
    echo json_encode(array("is_inserted" => $isInserted));

    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] === "PATCH") {
    $input = file_get_contents('php://input');
    $decodedData = json_decode($input, true);

    if (!isset($decodedData['id']) || !is_numeric($decodedData['id'])) {
        echo json_encode(["error" => "Invalid ID"]);
        exit;
    }
    $id = intval($decodedData['id']);
    $stmt = $conn->prepare("SELECT status FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    $newStatus = ($row['status'] === 'completed') ? 'pending' : 'completed';
    $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $newStatus, $id);
    $stmt->execute();
    $stmt->close();

    set_headers();
    echo json_encode(["newStatus" => $newStatus]);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $input = file_get_contents('php://input');
    $decodedData = json_decode($input, true);

    if (!isset($decodedData['id']) || !is_numeric($decodedData['id'])) {
        echo json_encode(["error" => "Invalid ID"]);
        exit;
    }

    $id = intval($decodedData['id']);
    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $deletedRows = $stmt->affected_rows > 0;

    $stmt->close();

    set_headers();
    echo json_encode(["is_deleted" => $deletedRows]);
}
