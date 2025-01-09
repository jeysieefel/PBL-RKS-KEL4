<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari formulir
    $fullname = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $confirm_password = trim($_POST["confirmPassword"]);

    // Validasi input
    if (empty($fullname) || empty($email) || empty($password) || empty($confirm_password)) {
        echo "<script>alert('Semua kolom harus diisi.'); window.history.back();</script>";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Format email tidak valid.'); window.history.back();</script>";
        exit;
    }

    if ($password !== $confirm_password) {
        echo "<script>alert('Kata sandi dan konfirmasi kata sandi tidak cocok.'); window.history.back();</script>";
        exit;
    }

    // Validasi password
    $errors = [];

    // Panjang minimal 8 karakter
    if (strlen($password) < 8) {
        $errors[] = "Kata sandi harus mengandung Minimal 8 Karakter.";
    }
    
    // Harus mengandung huruf besar
    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = "Kata sandi harus mengandung Huruf Besar.";
    }
    
    // Harus mengandung huruf kecil
    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = "Kata sandi harus mengandung Huruf Kecil.";
    }
    
    // Harus mengandung angka
    if (!preg_match('/\d/', $password)) {
        $errors[] = "Kata sandi harus mengandung Angka.";
    }
    
    // Harus mengandung simbol khusus
    if (!preg_match('/[@$!%*?&]/', $password)) {
        $errors[] = "Kata sandi harus mengandung Simbol Khusus.";
    }
    
    // Jika ada kesalahan, tampilkan dalam bentuk alert
    if (!empty($errors)) {
        $error_message = implode("\\n", $errors); // Gabungkan kesalahan dengan baris baru
        echo "<script>alert('$error_message'); window.history.back();</script>";
        exit;
    }

    // Hash kata sandi
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Periksa apakah email sudah terdaftar
    $sql = "SELECT UserID FROM users WHERE Email = ?";
    if ($stmt = mysqli_prepare($conn, $sql)) {
        mysqli_stmt_bind_param($stmt, "s", $param_email);
        $param_email = $email;

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_store_result($stmt);
            if (mysqli_stmt_num_rows($stmt) > 0) {
                echo "<script>alert('Email sudah terdaftar.'); window.history.back();</script>";
                exit;
            }
        } else {
            echo "<script>alert('Terjadi kesalahan. Silakan coba lagi nanti.'); window.history.back();</script>";
            exit;
        }
        mysqli_stmt_close($stmt);
    }

    // Simpan data pengguna baru
    $sql = "INSERT INTO users (FullName, Email, PasswordHash) VALUES (?, ?, ?)";
    if ($stmt = mysqli_prepare($conn, $sql)) {
        mysqli_stmt_bind_param($stmt, "sss", $param_fullname, $param_email, $param_password);
        $param_fullname = $fullname;
        $param_email = $email;
        $param_password = $hashed_password;

        if (mysqli_stmt_execute($stmt)) {
            header("Location: ../index.html");
            exit;
        } else {
            echo "<script>alert('Terjadi kesalahan. Silakan coba lagi nanti.'); window.history.back();</script>";
        }
        mysqli_stmt_close($stmt);
    }
    mysqli_close($conn);
} else {
    echo "Metode permintaan tidak valid.";
}
?>
