let currentLevel = 0;
let score = 0;
let timer = 180;

// Tampilkan Tantangan
function loadChallenge() {
  const challenge = challenges[currentLevel];
  document.getElementById("challenge-title").textContent = `Level ${challenge.level}: ${challenge.title}`;
  document.getElementById("challenge-text").textContent = challenge.cipherText;
  document.getElementById("feedback").textContent = ""; // Reset feedback
}

// Validasi Jawaban
document.getElementById("submit-btn").addEventListener("click", () => {
  const userAnswer = document.getElementById("answer").value.trim();
  const correctAnswer = challenges[currentLevel].answer;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score += 10;
    currentLevel++;

    if (currentLevel < challenges.length) {
      showNotification("Benar! Lanjut ke level berikutnya.", "success");
      loadChallenge();
    } else {
      showNotification(`Selamat! Anda menyelesaikan semua tantangan dengan skor: ${score}`, "success");
      launchConfetti();
      saveScore(score);
    }
  } else {
    score -= 5;
    showNotification("Jawaban salah, Skor berkurang -5. Coba lagi!", "error");
  }
});

// Timer
setInterval(() => {
  if (timer > 0) {
    timer--;
    document.getElementById("time-left").textContent = timer;
  } else {
    alert("Waktu habis! Coba lagi.");
    location.reload(); // Refresh halaman
  }
}, 1000);

// Hint
function showHint() {
  alert(challenges[currentLevel].hint);
}

// Leaderboard (Sederhana)
function saveScore(score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const name = prompt("Masukkan nama Anda:");
  const timeUsed = 180 - timer; // Hitung waktu yang digunakan

  leaderboard.push({ name, time: timeUsed, score });
  // Urutkan leaderboard: prioritas waktu tercepat, jika sama maka skor tertinggi
  leaderboard.sort((a, b) => a.time - b.time || b.score - a.score);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const tableBody = document.getElementById("leaderboard-list");
  tableBody.innerHTML = ""; // Reset isi tabel

  leaderboard.forEach((entry) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = entry.name;

    const timeCell = document.createElement("td");
    timeCell.textContent = entry.time;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = entry.score;

    row.appendChild(nameCell);
    row.appendChild(timeCell);
    row.appendChild(scoreCell);
    tableBody.appendChild(row);
  });
}

// Reset Leaderboard
function resetLeaderboard() {
  localStorage.removeItem("leaderboard"); // Hapus data leaderboard
  displayLeaderboard(); // Refresh tampilan leaderboard
  alert("Leaderboard telah direset.");
}

function launchConfetti() {
  const duration = 8 * 1000; // Durasi animasi 8 detik
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = type; // Tambahkan kelas (success/error)
  notification.style.display = "block";

  // Hilangkan notifikasi setelah 3 detik
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function loadChallenge() {
  const challenge = challenges[currentLevel];
  document.getElementById("challenge-title").textContent = `Level ${challenge.level}: ${challenge.title}`;
  document.getElementById("challenge-text").textContent = challenge.cipherText;
  document.getElementById("feedback").textContent = ""; // Reset feedback
  document.getElementById("answer").value = ""; // Reset input jawaban
}


// Muat Tantangan Pertama
loadChallenge();
displayLeaderboard();

function goHome() {
  window.location.href = '../PBL4_Semester-1/Home.html';
}

