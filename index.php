<?php
session_start();

if (!isset($_SESSION['username'])) {
  header("Location: admin.html");
  exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TO-DO LIST</title>
  <link rel="stylesheet" href="dist/css/vendors.min.css" />
  <link rel="stylesheet" href="dist/css/style.css" />
</head>

<body>
  <button class="logout-btn btn-primary btn m-3" id="logout-button">Logout</button>
  <hr class="m-2" />
  <div class="container mt-3">
    <h2 class="text-left main-heading">To-Do List</h2>
    <form id="taskForm" method="post">
      <div class="input-group my-3">
        <input type="text" name="task" id="taskInput" class="form-control" placeholder="Enter a task..." required />
        <button type="submit" class="btn btn-primary">Add Task</button>
      </div>
    </form>
    <ul id="taskList" class="list-group">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </ul>
  </div>

  <script type="text/javascript" src="dist/js/vendors.min.js"></script>
  <script type="module" src="dist/js/script.min.js"></script>
</body>

</html>