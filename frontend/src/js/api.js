/**
 * Modulo API
 * Gestisce tutte le comunicazioni con il server backend
 */

const API = {
  /**
   * Effettua una richiesta POST per scrapare i link
   * @param {string} url - URL dell'anime
   * @returns {Promise<Object>} Risposta del server
   */
  async scrape(url) {
    try {
      const { apiUrl, apiTimeout } = CONFIG.getConfig();
      console.log('🌐 API Call:', `${apiUrl}/api/scrape`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), apiTimeout);

      const response = await fetch(`${apiUrl}/api/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✓ API Response:', data);
      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('❌ Timeout:', err.message);
        throw new Error('Timeout: il server ha impiegato troppo tempo a rispondere');
      }
      console.error('❌ API Error:', err);
      throw err;
    }
  },

  /**
   * Verifica lo stato dell'API
   * @returns {Promise<Object>} Status del server
   */
  async checkStatus() {
    try {
      const { apiUrl } = CONFIG.getConfig();
      console.log('🔍 Checking API Status:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/status`);
      const data = await response.json();
      
      console.log('✓ API Status:', data);
      return data;
    } catch (err) {
      console.warn('⚠ API Status Check Failed:', err.message);
      return { success: false, error: err.message };
    }
  }
};

// Esponi API globalmente
window.API = API;
