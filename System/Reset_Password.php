<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["token"])) {
    $token = $_GET["token"];

    $sql = "SELECT Email FROM password_resets WHERE Token = ? AND Expiry > NOW()";
    if ($stmt = mysqli_prepare($conn, $sql)) {
        mysqli_stmt_bind_param($stmt, "s", $param_token);
        $param_token = $token;

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_store_result($stmt);

            if (mysqli_stmt_num_rows($stmt) == 1) {
                mysqli_stmt_bind_result($stmt, $email);
                mysqli_stmt_fetch($stmt);

                // Tampilkan formulir reset password
                echo '
                <form method="POST" action="Proses_Reset.php">
                    <input type="hidden" name="email" value="' . htmlspecialchars($email) . '">
                    <input type="password" name="new_password" placeholder="Password Baru" required>
                    <input type="password" name="confirm_password" placeholder="Konfirmasi Password Baru" required>
                    <button type="submit">Reset Password</button>
                </form>';
            } else {
                echo "Token tidak valid atau kadaluarsa.";
            }
        }
        mysqli_stmt_close($stmt);
    }
    mysqli_close($conn);
}
?>
