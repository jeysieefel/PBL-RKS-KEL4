document.getElementById('encryptBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const shiftValue = parseInt(document.getElementById('shiftValue').value, 10);
    document.getElementById('outputText').value = caesarCipher(inputText, shiftValue);
  });
  
  document.getElementById('decryptBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const shiftValue = parseInt(document.getElementById('shiftValue').value, 10);
    document.getElementById('outputText').value = caesarCipher(inputText, -shiftValue);
  });
  
  document.getElementById('copyBtn').addEventListener('click', () => {
    const outputText = document.getElementById('outputText');
    outputText.select();
    document.execCommand('copy');
    alert('Result copied to clipboard!');
  });
  
  function caesarCipher(text, shift) {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char.charCodeAt(0) < 97 ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
    });
  }

  function goHome() {
    window.location.href = '../PBL4_Semester-1/Home.html';
  }