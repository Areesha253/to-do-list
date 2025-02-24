<?php
include "database.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT * FROM tasks ORDER BY id DESC";
    $result = $conn->query($sql);
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
}

if (isset($_POST['task'])) {
    $task = $_POST['task'];
    $sql = "INSERT INTO tasks (task) VALUES ('$task')";
    $conn->query($sql);
}

if (isset($_POST['Status'])) {
    $id = $_POST['Status'];
    $sql = "SELECT status FROM tasks WHERE id=$id";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    
    $newStatus = ($row['status'] === 'completed') ? 'pending' : 'completed';
    $sql = "UPDATE tasks SET status='$newStatus' WHERE id=$id";
    $conn->query($sql);
    echo json_encode(['newStatus' => $newStatus]);
}

if (isset($_POST['delete'])) {
    $id = $_POST['delete'];
    $sql = "DELETE FROM tasks WHERE id=$id";
    $conn->query($sql);
}
?>
