<?php
session_start();

if (isset($_SESSION['username'])) {
  header("Location: admin.php");
  exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Login</title>
  <link rel="stylesheet" href="dist/css/vendors.min.css" />
  <link rel="stylesheet" href="dist/css/style.css" />
</head>

<body>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>USER LOGIN</h2>
      <form method="POST" id="user-login-form">
        <input type="text" name="username" id="username" required placeholder="Username" />
        <input type="password" name="password" id="password" required placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p>Not registered? <a class="registration-link" href="register.php">Click to register</a></p>
    </div>
  </div>

  <script type="text/javascript" src="dist/js/vendors.min.js"></script>
  <script type="module" src="dist/js/script.min.js"></script>
</body>

</html>