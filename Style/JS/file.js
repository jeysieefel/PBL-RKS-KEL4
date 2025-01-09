async function encryptFile() {
    const fileInput = document.getElementById('encryptFile');
    const password = document.getElementById('encryptPassword').value;

    if (!fileInput.files.length || !password) {
        alert('Please select a file and enter a password.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result.split(',')[1]; // Extract Base64 content
        const encrypted = CryptoJS.AES.encrypt(fileContent, password).toString();
        const blob = new Blob([encrypted], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name + '.aes';
        link.click();
        document.getElementById('encryptOutput').textContent = 'File encrypted successfully!';
    };

    reader.readAsDataURL(file); // Ensure Base64 encoding for binary files
}

async function decryptFile() {
    const fileInput = document.getElementById('decryptFile');
    const password = document.getElementById('decryptPassword').value;

    if (!fileInput.files.length || !password) {
        alert('Please select a file and enter a password.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const encryptedContent = e.target.result;
            const decrypted = CryptoJS.AES.decrypt(encryptedContent, password).toString(CryptoJS.enc.Utf8);

            if (!decrypted) {
                throw new Error('Decryption failed. Incorrect password or corrupted file.');
            }

            const byteArray = Uint8Array.from(atob(decrypted), c => c.charCodeAt(0));
            const blob = new Blob([byteArray]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = file.name.replace('.aes', '');
            link.click();
            document.getElementById('decryptOutput').textContent = 'File decrypted successfully!';
        } catch (error) {
            document.getElementById('decryptOutput').textContent = error.message;
        }
    };

    reader.readAsText(file); // Read encrypted file as plain text
}

function goHome() {
    window.location.href = '../PBL4_Semester-1/Home.html';
  }