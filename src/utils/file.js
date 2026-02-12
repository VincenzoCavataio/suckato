const fs = require('fs');
const path = require('path');

/**
 * Crea la cartella /output se non esiste
 */
function ensureOutputDir() {
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

/**
 * Salva i link in un file di testo (uno per riga)
 * @param {string[]} links - Array di link
 * @param {string} filename - Nome del file
 */
function saveAsText(links, filename = 'download_links.txt') {
  const outputDir = ensureOutputDir();
  const filepath = path.join(outputDir, filename);
  const content = links.join('\n');
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`✓ Salvato: ${filepath}`);
}

/**
 * Salva i risultati in un file JSON
 * @param {Object[]} results - Array di risultati con dettagli
 * @param {string} filename - Nome del file
 */
function saveAsJson(results, filename = 'download_links.json') {
  const outputDir = ensureOutputDir();
  const filepath = path.join(outputDir, filename);
  const content = JSON.stringify(results, null, 2);
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`✓ Salvato: ${filepath}`);
}

module.exports = { saveAsText, saveAsJson };
