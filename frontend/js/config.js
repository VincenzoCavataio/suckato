/**
 * Configurazione Frontend
 * Legge le variabili d'ambiente dal window o da file config
 */

const CONFIG = {
  // API Base URL - Può essere sovrascritto da variabile globale window.API_CONFIG
  apiUrl: (typeof window !== 'undefined' && window.API_CONFIG?.apiUrl) || 'http://localhost:3000',
  apiTimeout: (typeof window !== 'undefined' && window.API_CONFIG?.apiTimeout) || 120000,

  // Environment
  env: (typeof window !== 'undefined' && window.API_CONFIG?.env) || 'development',

  /**
   * Ritorna la configurazione
   */
  getConfig() {
    return {
      apiUrl: this.apiUrl,
      apiTimeout: this.apiTimeout,
      env: this.env,
      isDevelopment: this.env === 'development',
      isProduction: this.env === 'production'
    };
  },

  /**
   * Stampa la configurazione (per debug)
   */
  printConfig() {
    if (this.env === 'development') {
      console.log('%c📋 Configurazione Frontend', 'color: #667eea; font-weight: bold;');
      console.log(`   API URL: ${this.apiUrl}`);
      console.log(`   API Timeout: ${this.apiTimeout}ms (${(this.apiTimeout / 1000).toFixed(0)}s)`);
      console.log(`   Environment: ${this.env}\n`);
    }
  }
};

// Esponi CONFIG globalmente
window.CONFIG = CONFIG;

// Stampa la configurazione in development
CONFIG.printConfig();
