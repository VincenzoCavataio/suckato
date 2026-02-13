/**
 * Modulo App
 * Orestra logica dell'applicazione
 */

const APP = {
  allLinks: [],

  /**
   * Inizializza l'applicazione
   */
  init() {
    console.log('🚀 Inizializzazione APP');
    UI.init();
    this.checkServerStatus();
  },

  /**
   * Verifica lo stato del server
   */
  async checkServerStatus() {
    try {
      const status = await API.checkStatus();
      if (status.success) {
        console.log('✓ Server online');
      } else {
        UI.showStatus('⚠ Server non raggiungibile su localhost:3000', 'error');
      }
    } catch (err) {
      UI.showStatus('⚠ Assicurati che il server sia avviato con "npm start"', 'error');
    }
  },

  /**
   * Gestisce l'invio del form
   */
  async handleSubmit() {
    console.log('📝 Form submitted');
    const url = UI.getUrl();

    if (!this.validateUrl(url)) {
      UI.showStatus('Inserisci un URL valido', 'error');
      return;
    }

    console.log('🔍 Scrapando URL:', url);
    UI.showLoading();
    UI.disableForm();

    try {
      const data = await API.scrape(url);

      if (data.success) {
        this.allLinks = data.data.links;
        UI.displayResults(data);
        UI.showStatus('✓ Estrazione completata!', 'success');
        console.log('✓ Estrazione completata, link trovati:', data.data.links.length);
      } else {
        UI.showStatus('✗ ' + (data.error || 'Errore sconosciuto'), 'error');
        console.error('❌ Errore dal server:', data.error);
      }
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? 'Server non raggiungibile. Assicurati che "npm start" sia in esecuzione'
        : err.message;
      UI.showStatus('Errore: ' + errorMsg, 'error');
      console.error('❌ Errore:', err);
    } finally {
      UI.hideLoading();
      UI.enableForm();
    }
  },

  /**
   * Valida l'URL
   * @param {string} url - URL da validare
   * @returns {boolean} True se valido
   */
  validateUrl(url) {
    if (!url) return false;

    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Gestisce la copia dei link
   */
  async handleCopy() {
    if (this.allLinks.length === 0) {
      UI.showStatus('Nessun link da copiare', 'error');
      return;
    }

    const text = this.allLinks.join('\n');
    await UI.copyToClipboard(text);
  }
};

/**
 * Esponi APP a window per il debug
 */
window.APP = APP;

/**
 * Inizializza l'app quando il DOM è pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM Loaded');
  APP.init();

  // Assicura che il form non faccia submit
  const form = document.getElementById('scraperForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      console.log('🛑 Preventing default form submit');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }, true); // Capture phase per essere sicuri
  }
});
