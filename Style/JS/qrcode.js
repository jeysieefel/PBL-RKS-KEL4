console.log("Html5Qrcode:", typeof Html5Qrcode);

// Fungsi untuk menghasilkan QR Code dari data yang terenkripsi
document.getElementById("generateButton").addEventListener("click", function() {
    // Ambil data dari input
    var data = document.getElementById("dataInput").value;
    var key = document.getElementById("keyInput").value;

    // Validasi input
    if (data === "" || key === "" || key.length !== 8) {
        alert("Masukkan data dan kunci enkripsi yang valid.");
        return;
    }

    // Enkripsi data menggunakan AES
    var encryptedData = CryptoJS.AES.encrypt(data, key).toString();

    // Hapus QR Code sebelumnya (jika ada) agar tidak ada duplikasi
    var qrCanvas = document.getElementById('qrCode');
    qrCanvas.getContext('2d').clearRect(0, 0, qrCanvas.width, qrCanvas.height);

    // Generate QR Code dari data terenkripsi
    QRCode.toCanvas(qrCanvas, encryptedData, function(error) {
        if (error) {
            console.error(error);
        } else {
            // Tampilkan tombol download setelah QR Code dibuat
            var downloadButton = document.getElementById("downloadButton");
            downloadButton.style.display = "inline-block";

            // Set URL untuk gambar download
            var downloadLink = document.getElementById("downloadLink");
            downloadLink.href = qrCanvas.toDataURL();  // Mengonversi kanvas menjadi URL gambar
        }
    });
});

document.getElementById('scanButton').addEventListener('click', function () {
    const scannerContainer = document.getElementById("scannerContainer");
    const decryptedTextElement = document.getElementById("decryptedText");

    // Tampilkan container kamera
    scannerContainer.style.display = "block";

    // Inisialisasi Html5Qrcode
    const html5QrCode = new Html5Qrcode("scannerContainer");

    // Mendapatkan daftar kamera
    Html5Qrcode.getCameras()
        .then((devices) => {
            if (devices && devices.length) {
                const cameraId = devices[0].id; // Gunakan kamera pertama

                // Mulai pemindaian QR Code
                html5QrCode
                    .start(
                        cameraId,
                        {
                            fps: 10, // Frame per second
                            qrbox: 250, // Ukuran kotak pemindaian
                        },
                        (decodedText) => {
                            // Saat QR Code berhasil dipindai
                            const key = prompt("Masukkan kunci enkripsi untuk dekripsi:");
                            if (key && key.length === 8) {
                                const decryptedData = decryptQRCode(decodedText, key);
                                decryptedTextElement.textContent =
                                    "Data yang terdekripsi: " + decryptedData;
                            } else {
                                alert("Kunci tidak valid. Harus 32 karakter.");
                            }

                            // Hentikan pemindaian setelah selesai
                            html5QrCode.stop().catch(console.error);
                        },
                        (errorMessage) => {
                            // Error saat memindai
                            console.log("Kesalahan pemindaian:", errorMessage);
                        }
                    )
                    .catch((err) => {
                        // Error saat memulai kamera
                        console.log("Gagal memulai kamera:", err);
                        alert("Tidak dapat memulai kamera. Periksa izin atau koneksi.");
                    });
            } else {
                alert("Kamera tidak ditemukan.");
            }
        })
        .catch((err) => {
            console.error("Error mendapatkan perangkat kamera:", err);
            alert("Tidak dapat mengakses kamera.");
        });
});

// Fungsi untuk mendekripsi data dari QR Code
function decryptQRCode(encryptedData, key) {
    var bytes = CryptoJS.AES.decrypt(encryptedData, key);
    var originalData = bytes.toString(CryptoJS.enc.Utf8);
    return originalData;
}

// Efek interaktif untuk tombol
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.3)';
        button.style.transform = 'translateY(-3px) scale(1.05)';
    });
    button.addEventListener('mouseout', () => {
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        button.style.transform = 'translateY(0) scale(1)';
    });
});

// Animasi gerakan halus untuk QR Code saat muncul
document.getElementById("generateButton").addEventListener("click", function () {
    const qrContainer = document.querySelector(".qr-code-container");
    qrContainer.style.animation = "zoomIn 1s ease-in-out";
});

// Efek tambahan pada hasil dekripsi
const resultContainer = document.querySelector(".result-container");
resultContainer.addEventListener("mouseover", () => {
    resultContainer.style.backgroundColor = "rgba(255, 255, 255, 1)";
    resultContainer.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.3)";
});
resultContainer.addEventListener("mouseout", () => {
    resultContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    resultContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
});

// Efek cahaya pada header saat halaman dimuat
window.addEventListener("load", () => {
    const header = document.querySelector("header");
    header.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.3)";
    header.style.transition = "box-shadow 1s ease-in-out";

    setTimeout(() => {
        header.style.boxShadow = "0 5px 10px rgba(0, 0, 0, 0.2)";
    }, 1000);
});

function goHome() {
    window.location.href = '../PBL4_Semester-1/Home.html';
  }