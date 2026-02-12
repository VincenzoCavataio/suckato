const { JSDOM } = require('jsdom');
const url = require('url');
const { fetchPage } = require('./http');

/**
 * Estrae tutti i link degli episodi dalla pagina principale
 * @param {string} mainUrl - URL della pagina principale
 * @returns {Promise<string[]>} Array di URL degli episodi
 */
async function getEpisodeLinks(mainUrl) {
  try {
    console.log('Fetching main page...');
    const html = await fetchPage(mainUrl);
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const episodes = [];
    document.querySelectorAll('.episode > a').forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : new url.URL(href, mainUrl).href;
        episodes.push(fullUrl);
      }
    });

    console.log(`Trovati ${episodes.length} episodi`);
    return episodes;
  } catch (err) {
    console.error('Errore nel fetch della pagina principale:', err.message);
    throw err;
  }
}

/**
 * Estrae il link di download da una pagina di episodio
 * @param {string} episodeUrl - URL dell'episodio
 * @returns {Promise<string|null>} Link di download o null
 */
async function getDownloadLink(episodeUrl) {
  try {
    const html = await fetchPage(episodeUrl);
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const downloadElement = document.getElementById('alternativeDownloadLink');
    if (downloadElement) {
      const href = downloadElement.getAttribute('href');
      return href || null;
    }
    return null;
  } catch (err) {
    return null;
  }
}

module.exports = { getEpisodeLinks, getDownloadLink };
