const express = require('express');
const cors = require('cors');
const config = require('./config');
const { getEpisodeLinks } = require('./utils/parser');
const { processEpisodesParallel } = require('./processor');

const app = express();

const { port, corsOrigin, env } = config.getConfig();

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

/**
 * POST /api/scrape
 * Accetta un URL e restituisce tutti i link di download in JSON
 * Body: { "url": "https://..." }
 * Response: { "success": true, "data": {...}, "stats": {...} }
 */
app.post('/api/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL non fornito. Invia { "url": "https://..." }'
      });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({
        success: false,
        error: 'URL non valido. Deve iniziare con http:// o https://'
      });
    }

    const startTime = Date.now();

    const episodeData = await getEpisodeLinks(url);
    const episodeLinks = episodeData.episodes;
    const animeTitle = episodeData.title;

    if (episodeLinks.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Nessun episodio trovato per questo URL'
      });
    }

    const { links, results, elapsed, title } = await processEpisodesParallel(episodeLinks, animeTitle);

    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

    res.json({
      success: true,
      data: {
        results: results,
        links: links,
        title: title
      },
      stats: {
        totalEpisodi: episodeLinks.length,
        linkTrovati: links.length,
        linkMancanti: episodeLinks.length - links.length,
        tempoElaborazione: elapsed,
        tempoRisposta: responseTime
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * GET /api/status
 * Ritorna lo stato del server
 */
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'API online',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /
 * Endpoint di benvenuto con documentazione
 */
app.get('/', (req, res) => {
  res.json({
    name: 'AnimeWorld Downloader API',
    version: '1.0.0',
    endpoints: {
      'POST /api/scrape': {
        description: 'Estrae i link di download da un URL AnimeWorld',
        body: { url: 'https://www.animeworld.ac/...' },
        example: 'curl -X POST http://localhost:3000/api/scrape -H "Content-Type: application/json" -d \'{"url":"https://www.animeworld.ac/play/..."}\''
      },
      'GET /api/status': 'Verifica lo stato dell\'API'
    }
  });
});

/**
 * Error handler middleware
 */
app.use((err, req, res, next) => {
  console.error('Errore:', err.message);
  res.status(500).json({
    success: false,
    error: 'Errore interno del server'
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trovato',
    availableEndpoints: ['POST /api/scrape', 'GET /api/status', 'GET /']
  });
});

app.listen(port, "0.0.0.0", () => {
  config.printConfig();
  console.log(`🚀 Server avviato su http://localhost:${port}`);
  console.log(`📖 Documentazione: http://localhost:${port}`);
});

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n🛑 Ricevuto SIGINT, chiusura in corso...');
  console.log('✓ Server chiuso correttamente');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Ricevuto SIGTERM, chiusura in corso...');
  console.log('✓ Server chiuso correttamente');
  process.exit(0);
});
