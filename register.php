<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Register</title>
    <link rel="stylesheet" href="dist/css/vendors.min.css" />
    <link rel="stylesheet" href="dist/css/style.css" />
</head>

<body>
    <div class="login-wrapper">
        <div class="login-container">
            <h2>REGISTER</h2>
            <form method="POST" id="user-registeration-form">
                <input type="text" name="username" id="username" required placeholder="Username" />
                <input type="password" name="password" id="password" required placeholder="Password" />
                <button type="submit">Register</button>
            </form>
            <p>Already registered? <a class="registration-link" href="index.php">Click to login</a></p>
        </div>
    </div>

    <script type="text/javascript" src="dist/js/vendors.min.js"></script>
    <script type="module" src="dist/js/script.min.js"></script>
</body>

</html>