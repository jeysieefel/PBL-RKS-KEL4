<?php
require_once 'config.php';
require 'vendor/autoload.php'; // Untuk PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["resetEmail"]);

    if (empty($email)) {
        echo "<script>alert('Harap masukkan email Anda.'); window.history.back();</script>";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Format email tidak valid.'); window.history.back();</script>";
        exit;
    }

    // Periksa apakah email terdaftar
    $sql = "SELECT UserID FROM users WHERE Email = ?";
    if ($stmt = mysqli_prepare($conn, $sql)) {
        mysqli_stmt_bind_param($stmt, "s", $param_email);
        $param_email = $email;

        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_store_result($stmt);

            if (mysqli_stmt_num_rows($stmt) == 1) {
                // Email terdaftar, buat token
                $token = bin2hex(random_bytes(32));
                $expiry = date("Y-m-d H:i:s", strtotime("+1 hour"));

                // Simpan token ke database
                $sql_insert = "INSERT INTO password_resets (Email, Token, Expiry) VALUES (?, ?, ?)
                               ON DUPLICATE KEY UPDATE Token=?, Expiry=?";
                if ($stmt_insert = mysqli_prepare($conn, $sql_insert)) {
                    mysqli_stmt_bind_param($stmt_insert, "sssss", $param_email, $param_token, $param_expiry, $param_token, $param_expiry);
                    $param_token = $token;
                    $param_expiry = $expiry;

                    if (mysqli_stmt_execute($stmt_insert)) {
                        // Kirim email
                        $reset_link = "https://yourwebsite.com/reset_password.php?token=" . $token;
                        $mail = new PHPMailer(true);

                        try {
                            // Konfigurasi server email
                            $mail->isSMTP();
                            $mail->Host = 'smtp.gmail.com'; // Ubah sesuai layanan SMTP Anda
                            $mail->SMTPAuth = true;
                            $mail->Username = 'your-email@gmail.com'; // Email Anda
                            $mail->Password = 'your-email-password'; // Password Email
                            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                            $mail->Port = 587;

                            // Pengaturan email
                            $mail->setFrom('your-email@gmail.com', 'Crypto The Explorer');
                            $mail->addAddress($email);
                            $mail->isHTML(true);
                            $mail->Subject = 'Reset Password Anda';
                            $mail->Body = "Klik tautan berikut untuk mengatur ulang kata sandi Anda: <a href='$reset_link'>$reset_link</a>";

                            $mail->send();
                            echo "<script>alert('Tautan reset password telah dikirim ke email Anda.'); window.location.href = 'Login.php';</script>";
                        } catch (Exception $e) {
                            echo "<script>alert('Gagal mengirim email: {$mail->ErrorInfo}'); window.history.back();</script>";
                        }
                    } else {
                        echo "<script>alert('Terjadi kesalahan saat menyimpan token.'); window.history.back();</script>";
                    }
                    mysqli_stmt_close($stmt_insert);
                }
            } else {
                echo "<script>alert('Email tidak terdaftar.'); window.history.back();</script>";
            }
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
