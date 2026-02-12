const https = require('https');
const http = require('http');
const url = require('url');

/**
 * Esegue una richiesta HTTP e ritorna il contenuto
 * @param {string} pageUrl - URL da scaricare
 * @returns {Promise<string>} Contenuto HTML della pagina
 */
function fetchPage(pageUrl) {
  return new Promise((resolve, reject) => {
    const urlObj = new url.URL(pageUrl);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.on('error', reject);
    req.end();
  });
}

module.exports = { fetchPage };
