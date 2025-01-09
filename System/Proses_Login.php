<?php
// Pastikan untuk menyertakan file koneksi database di sini
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari formulir login
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    // Validasi input
    if (empty($email) || empty($password)) {
        echo "<script>alert('Email dan kata sandi harus diisi.'); window.history.back();</script>";
        exit;
    }

    // Periksa apakah email terdaftar di database
    $sql = "SELECT id, FullName, PasswordHash FROM users WHERE Email = ?";
    if ($stmt = mysqli_prepare($conn, $sql)) {
        mysqli_stmt_bind_param($stmt, "s", $param_email);
        $param_email = $email;

        // Eksekusi query
        if (mysqli_stmt_execute($stmt)) {
            mysqli_stmt_store_result($stmt);

            // Jika email ditemukan
            if (mysqli_stmt_num_rows($stmt) > 0) {
                mysqli_stmt_bind_result($stmt, $user_id, $fullname, $hashed_password);

                // Ambil hasil query
                if (mysqli_stmt_fetch($stmt)) {
                    // Verifikasi password
                    if (password_verify($password, $hashed_password)) {
                        // Login berhasil, buat session
                        session_start();
                        $_SESSION['id'] = $user_id;   // Simpan ID pengguna di session
                        $_SESSION['Email'] = $email;        // Simpan email pengguna di session
                        $_SESSION['Fullname'] = $fullname;  // Simpan nama lengkap pengguna di session

                        // Redirect ke halaman dashboard setelah login berhasil
                        header("Location: ../Home.html"); // Ganti dengan halaman setelah login
                        exit();
                    } else {
                        echo "<script>alert('Kata sandi salah.'); window.history.back();</script>";
                        exit;
                    }
                }
            } else {
                echo "<script>alert('Email tidak ditemukan.'); window.history.back();</script>";
                exit;
            }
        } else {
            echo "<script>alert('Terjadi kesalahan. Silakan coba lagi nanti.'); window.history.back();</script>";
            exit;
        }
        mysqli_stmt_close($stmt);
    }
    mysqli_close($conn);
} else {
    echo "Metode permintaan tidak valid.";
}
?>
