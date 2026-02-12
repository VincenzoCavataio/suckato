const { getDownloadLink } = require('./utils/parser.js');

/**
 * Elabora gli episodi in parallelo con limite di concorrenza
 * @param {string[]} episodeLinks - Array di URL degli episodi
 * @param {number} concurrency - Numero di richieste parallele simultanee
 * @returns {Promise<{links: string[], results: Object[]}>} Links e risultati dettagliati
 */
async function processEpisodesParallel(episodeLinks, concurrency = 10) {
  const downloadLinks = [];
  const results = [];
  const total = episodeLinks.length;
  
  console.log('\n=== INIZIO ELABORAZIONE IN PARALLELO ===\n');
  console.log(`Numero di connessioni parallele: ${concurrency}\n`);
  
  const startTime = Date.now();
  let activeRequests = 0;
  let currentIndex = 0;

  await new Promise((resolve) => {
    const processNext = async () => {
      if (currentIndex >= total) {
        if (activeRequests === 0) resolve();
        return;
      }

      activeRequests++;
      const i = currentIndex;
      const episodeUrl = episodeLinks[i];
      currentIndex++;

      try {
        console.log(`[${i + 1}/${total}] Elaborando...`);
        const downloadLink = await getDownloadLink(episodeUrl);
        
        if (downloadLink) {
          console.log(`  ✓ [${i + 1}/${total}] Link trovato`);
          downloadLinks.push(downloadLink);
          results[i] = {
            episode: i + 1,
            episodeUrl,
            downloadLink
          };
        } else {
          console.log(`  ✗ [${i + 1}/${total}] Link non trovato`);
          results[i] = {
            episode: i + 1,
            episodeUrl,
            downloadLink: null
          };
        }
      } catch (err) {
        console.error(`  ✗ [${i + 1}/${total}] Errore: ${err.message}`);
        results[i] = {
          episode: i + 1,
          episodeUrl,
          downloadLink: null,
          error: err.message
        };
      } finally {
        activeRequests--;
        if (activeRequests < concurrency && currentIndex < total) {
          setImmediate(processNext);
        } else if (activeRequests === 0 && currentIndex >= total) {
          resolve();
        }
      }
    };

    for (let i = 0; i < Math.min(concurrency, total); i++) {
      setImmediate(processNext);
    }
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  
  return {
    links: downloadLinks,
    results: results.filter(r => r !== undefined).sort((a, b) => a.episode - b.episode),
    elapsed
  };
}

module.exports = { processEpisodesParallel };
