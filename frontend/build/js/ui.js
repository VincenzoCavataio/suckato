/**
 * Modulo UI
 * Gestisce tutte le interazioni con il DOM
 */

const UI = {
  elements: null,

  /**
   * Inizializza i riferimenti agli elementi del DOM
   */
  init() {
    this.elements = {
      form: document.getElementById('scraperForm'),
      urlInput: document.getElementById('urlInput'),
      submitBtn: document.getElementById('submitBtn'),
      loading: document.getElementById('loading'),
      status: document.getElementById('status'),
      results: document.getElementById('results'),
      stats: document.getElementById('stats'),
      linksList: document.getElementById('linksList'),
      copyBtn: document.getElementById('copyBtn')
    };

    this.attachEventListeners();
  },

  /**
   * Collega gli event listener
   */
  attachEventListeners() {
    if (!this.elements.form) {
      console.error('❌ Form element not found!');
      return;
    }

    this.elements.form.addEventListener('submit', (e) => {
      console.log('📝 Submit event fired');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (window.APP && typeof window.APP.handleSubmit === 'function') {
        console.log('✓ Calling APP.handleSubmit()');
        window.APP.handleSubmit();
      } else {
        console.error('❌ APP.handleSubmit not available');
      }
      
      return false;
    }, true); // Capture phase

    // Listener per il bottone di submit
    if (this.elements.submitBtn) {
      this.elements.submitBtn.addEventListener('click', (e) => {
        console.log('🖱 Submit button clicked');
        e.preventDefault();
        e.stopPropagation();
        if (window.APP && typeof window.APP.handleSubmit === 'function') {
          console.log('✓ Calling APP.handleSubmit()');
          window.APP.handleSubmit();
        }
      });
    }

    // Listener per il bottone copy
    if (this.elements.copyBtn) {
      this.elements.copyBtn.addEventListener('click', (e) => {
        console.log('📋 Copy button clicked');
        e.preventDefault();
        e.stopPropagation();
        if (window.APP && typeof window.APP.handleCopy === 'function') {
          console.log('✓ Calling APP.handleCopy()');
          window.APP.handleCopy();
        }
      });
    }
  },

  /**
   * Mostra lo spinner di caricamento
   */
  showLoading() {
    this.elements.loading.style.display = 'block';
    this.elements.results.classList.remove('show');
    this.hideStatus();
  },

  /**
   * Nasconde lo spinner di caricamento
   */
  hideLoading() {
    this.elements.loading.style.display = 'none';
  },

  /**
   * Mostra un messaggio di status
   * @param {string} message - Messaggio da mostrare
   * @param {string} type - Tipo ('success' o 'error')
   */
  showStatus(message, type) {
    this.elements.status.textContent = message;
    this.elements.status.classList.remove('success', 'error');
    this.elements.status.classList.add(type, 'show');
    this.elements.status.style.display = 'block';
  },

  /**
   * Nasconde il messaggio di status
   */
  hideStatus() {
    this.elements.status.style.display = 'none';
    this.elements.status.classList.remove('show');
  },

  /**
   * Disabilita il form
   */
  disableForm() {
    this.elements.submitBtn.disabled = true;
  },

  /**
   * Abilita il form
   */
  enableForm() {
    this.elements.submitBtn.disabled = false;
  },

  /**
   * Mostra i risultati (solo statistiche, non la lista)
   * @param {Object} data - Dati dei risultati
   */
  displayResults(data) {
    const { title } = data.data;
    const { totalEpisodi, linkTrovati, linkMancanti, tempoElaborazione } = data.stats;

    this.elements.stats.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Trovato:</span>
        <span class="stat-value">${title}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Episodi totali:</span>
        <span class="stat-value">${totalEpisodi}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Link trovati:</span>
        <span class="stat-value">${linkTrovati}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Link mancanti:</span>
        <span class="stat-value">${linkMancanti}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Tempo elaborazione:</span>
        <span class="stat-value">${tempoElaborazione}s</span>
      </div>
    `;

    this.elements.results.classList.add('show');
  },

  /**
   * Ritorna il valore dell'input URL
   * @returns {string} URL inserito
   */
  getUrl() {
    return this.elements.urlInput.value.trim();
  },

  /**
   * Resetta il form
   */
  resetForm() {
    this.elements.form.reset();
  },

  /**
   * Mostra il bottone di copia con effetto
   */
  showCopySuccess() {
    const originalText = this.elements.copyBtn.textContent;
    this.elements.copyBtn.textContent = '✓ Copiato!';
    setTimeout(() => {
      this.elements.copyBtn.textContent = originalText;
    }, 2000);
  },

  /**
   * Copia il testo negli appunti
   * @param {string} text - Testo da copiare
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showCopySuccess();
      
      // Text-to-speech "Sucato"
      this.speak('Sucato');
    } catch (err) {
      this.showStatus('Errore nel copia negli appunti', 'error');
    }
  },

  /**
   * Riproduce un messaggio vocale
   * @param {string} text - Testo da riprodurre
   */
  speak(text) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
      console.log('🔊 Speaking:', text);
    } catch (err) {
      console.warn('⚠ Text-to-speech not available:', err.message);
    }
  }
};

// Esponi UI globalmente
window.UI = UI;
