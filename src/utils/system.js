const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Copia il testo nella clipboard (cross-platform)
 * @param {string} text - Testo da copiare
 */
function copyToClipboard(text) {
  try {
    const platform = process.platform;
    
    if (platform === 'darwin') {
      execSync('pbcopy', { input: text });
    } else if (platform === 'win32') {
      const tempFile = path.join(process.env.TEMP, 'clipboard_temp.txt');
      fs.writeFileSync(tempFile, text, 'utf-8');
      execSync(`powershell -NoProfile -Command "Get-Content '${tempFile}' | Set-Clipboard"`, { 
        shell: 'powershell.exe',
        stdio: 'pipe'
      });
      fs.unlinkSync(tempFile);
    } else {
      execSync('xclip -selection clipboard', { input: text });
    }
    console.log('✓ Link copiati nella clipboard');
  } catch (err) {
    console.warn('⚠ Impossibile copiare nella clipboard:', err.message);
  }
}

/**
 * Riproduce un messaggio vocale usando il sintetizzatore di sistema
 * @param {string} text - Testo da riprodurre
 */
function speak(text) {
  try {
    const platform = process.platform;
    
    if (platform === 'darwin') {
      execSync(`say "${text}"`, { stdio: 'ignore' });
    } else if (platform === 'win32') {
      const psCommand = `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${text}')`;
      execSync(`powershell -NoProfile -Command "${psCommand}"`, { 
        shell: 'powershell.exe',
        stdio: 'ignore'
      });
    } else {
      execSync(`echo "${text}" | espeak -v it 2>/dev/null || espeak "${text}" 2>/dev/null || true`, { stdio: 'ignore' });
    }
  } catch (err) {
    console.warn('⚠ Impossibile riprodurre audio:', err.message);
  }
}

module.exports = { copyToClipboard, speak };
