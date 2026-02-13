const { getEpisodeLinks } = require('./src/utils/parser.js');
const { processEpisodesParallel } = require('./src/processor.js');
const { saveAsText, saveAsJson } = require('./src/utils/file.js');
const { copyToClipboard, speak } = require('./src/utils/system.js');

/**
 * Funzione principale che orchestra tutto il flusso
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const urlParam = args.find(arg => arg.startsWith('url='));
    
    if (!urlParam) {
      console.error('Errore: Specifica l\'URL con url=');
      console.error('Uso: node index.js url=https://example.com');
      process.exit(1);
    }

    const baseUrl = urlParam.split('=')[1];
    console.log('URL base:', baseUrl);

    const episodeData = await getEpisodeLinks(baseUrl);
    const episodeLinks = episodeData.episodes;
    const animeTitle = episodeData.title;

    if (episodeLinks.length === 0) {
      console.warn('Nessun episodio trovato');
      process.exit(1);
    }

    const { links, results, elapsed, title } = await processEpisodesParallel(episodeLinks, animeTitle);

    saveAsText(links);
    saveAsJson(results);
    
    copyToClipboard(links.join('\n'));

    console.log('\n=== RIASSUNTO ===');
    console.log(`Anime: ${title}`);
    console.log(`Total episodi: ${episodeLinks.length}`);
    console.log(`Download link trovati: ${links.length}`);
    console.log(`Download link mancanti: ${episodeLinks.length - links.length}`);
    console.log(`Tempo totale: ${elapsed}s`);
    
    speak('sucato');
    process.exit(0);
  } catch (err) {
    console.error('Errore:', err.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n🛑 Interruzione richiesta, chiusura...');
  process.exit(0);
});

main();
