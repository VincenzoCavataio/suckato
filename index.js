const { getEpisodeLinks } = require('./src/utils/parser');
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

    const episodeLinks = await getEpisodeLinks(baseUrl);
    
    if (episodeLinks.length === 0) {
      console.warn('Nessun episodio trovato');
      process.exit(1);
    }

    const { links, results, elapsed } = await processEpisodesParallel(episodeLinks);

    saveAsText(links);
    saveAsJson(results);
    
    copyToClipboard(links.join('\n'));

    console.log('\n=== RIASSUNTO ===');
    console.log(`Total episodi: ${episodeLinks.length}`);
    console.log(`Download link trovati: ${links.length}`);
    console.log(`Download link mancanti: ${episodeLinks.length - links.length}`);
    console.log(`Tempo totale: ${elapsed}s`);
    console.log(`\n\nSUCATO!`);
    
    speak('sucato');
  } catch (err) {
    console.error('Errore:', err.message);
    process.exit(1);
  }
}

main();
