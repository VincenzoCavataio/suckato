require('dotenv').config();

/**
 * Configurazione applicazione
 * Legge le variabili d'ambiente e fornisce valori di default
 */

const config = {
  // Server
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  /**
   * Ritorna la configurazione come oggetto
   */
  getConfig() {
    return {
      port: this.port,
      env: this.env,
      corsOrigin: this.corsOrigin,
      logLevel: this.logLevel,
      isDevelopment: this.env === 'development',
      isProduction: this.env === 'production'
    };
  },

  /**
   * Stampa la configurazione (per debug)
   */
  printConfig() {
    console.log('\n📋 Configurazione:');
    console.log(`   Environment: ${this.env}`);
    console.log(`   Port: ${this.port}`);
    console.log(`   CORS Origin: ${this.corsOrigin}`);
    console.log(`   Log Level: ${this.logLevel}\n`);
  }
};

module.exports = config;
