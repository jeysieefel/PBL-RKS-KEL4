document.getElementById("resetPasswordForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const resetEmail = document.getElementById("resetEmail").value;

    if (!validateEmail(resetEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Simulasi pengiriman email reset password
    fetch("https://your-backend-api.com/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: resetEmail })
    })
        .then(response => {
            if (response.ok) {
                alert("A reset link has been sent to your email.");
            } else {
                alert("Failed to send reset link. Please try again later.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
});

// Fungsi validasi email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
