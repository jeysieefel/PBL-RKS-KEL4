<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $new_password = $_POST["new_password"];
    $confirm_password = $_POST["confirm_password"];

    if ($new_password !== $confirm_password) {
        echo "Kata sandi tidak cocok.";
        exit;
    }

    // Hash password baru
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // Update password di database
    $sql = "UPDATE users SET PasswordHash = ? WHERE Email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $hashed_password, $email);

    if (mysqli_stmt_execute($stmt)) {
        echo "Kata sandi berhasil diperbarui.";
    } else {
        echo "Terjadi kesalahan. Coba lagi.";
    }

    // Hapus token reset
    $sql = "DELETE FROM password_resets WHERE Email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
?>
