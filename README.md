# AnimeWorld Download Links Scraper

Script Node.js modulare per estrarre link di download da AnimeWorld in parallelo, con clipboard e text-to-speech.

## Installazione

```bash
npm install
```

## Utilizzo

```bash
node index.js url=https://www.animeworld.ac/play/kono-subarashii-sekai-ni-shukufuku-wo.9j3hp/A-1Im
```

## Features

✅ **Elaborazione parallela veloce** - 10 connessioni simultanee (configurabile)
✅ **Clipboard automatica** - I link vengono copiati automaticamente (incolla e vai!)
✅ **Text-to-speech** - Riproduce "sucato" al termine (cross-platform)
✅ **Struttura modulare** - Codice pulito e mantenibile
✅ **Output multiplo** - TXT e JSON
✅ **Zero commenti** - Solo JSDoc per ogni funzione

## Struttura del progetto

```
├── index.js              # Entry point principale
├── processor.js          # Logica di elaborazione parallela
├── utils/
│   ├── http.js          # Gestione richieste HTTP
│   ├── parser.js        # Parsing HTML
│   ├── file.js          # Salvataggio file
│   └── system.js        # Clipboard e text-to-speech
├── package.json         # Dipendenze
└── README.md
```

## Moduli

### `index.js`
Entry point che orchestra il flusso completo:
- Parsing dei parametri CLI
- Orchestrazione delle varie funzioni
- Copia nella clipboard
- Text-to-speech finale

### `processor.js`
Gestisce l'elaborazione parallela degli episodi con limite di concorrenza controllato.

### `utils/http.js`
Fornisce la funzione `fetchPage()` per le richieste HTTP con timeout.

### `utils/parser.js`
- `getEpisodeLinks()` - Estrae i link degli episodi dalla pagina principale
- `getDownloadLink()` - Estrae il link di download da ogni episodio

### `utils/file.js`
- `saveAsText()` - Salva i link in file di testo
- `saveAsJson()` - Salva i risultati in formato JSON

### `utils/system.js`
- `copyToClipboard()` - Copia il testo nella clipboard (macOS, Windows, Linux)
- `speak()` - Riproduce un messaggio vocale (macOS, Windows, Linux)

## Output

### download_links.txt
Un link per riga, pronto per essere incollato:
```
https://link-ep1.com
https://link-ep2.com
...
```

### download_links.json
Risultati strutturati con dettagli di ogni episodio:
```json
[
  {
    "episode": 1,
    "episodeUrl": "https://...",
    "downloadLink": "https://..."
  },
  ...
]
```

## Clipboard e Text-to-Speech

### Clipboard
Dopo l'elaborazione, i link vengono **automaticamente copiati nella clipboard**:
- **macOS**: Usa `pbcopy`
- **Windows**: Usa PowerShell
- **Linux**: Usa `xclip`

Basta premere `Ctrl+V` (o `Cmd+V` su Mac) nel tuo software di download!

### Text-to-Speech
Una volta finito tutto, il sistema riproduce "sucato" con il sintetizzatore vocale:
- **macOS**: Usa il comando `say`
- **Windows**: Usa PowerShell Text-to-Speech
- **Linux**: Usa `espeak`

Se `espeak` non è disponibile su Linux, l'audio non sarà riprodotto ma non blocca l'esecuzione.

## Configurazione

### Parallelizzazione
Modifica il valore di `concurrency` in `processor.js`:
```javascript
const { links, results, elapsed } = await processEpisodesParallel(episodeLinks, 15);
```

Valori suggeriti:
- **5**: Cauto (meno carico)
- **10**: Equilibrato (default)
- **20+**: Aggressivo (locale)

## Troubleshooting

### Clipboard non funziona
- **macOS**: Assicurati di avere accesso ai comandi di sistema
- **Windows**: Verifica che PowerShell sia disponibile
- **Linux**: Installa `xclip` con `sudo apt-get install xclip`

### Text-to-speech non funziona
- **macOS**: Il comando `say` dovrebbe essere disponibile di default
- **Windows**: PowerShell Text-to-Speech funziona su Windows 7+
- **Linux**: Installa `espeak` con `sudo apt-get install espeak`

### Il progetto non parte
1. Assicurati di avere Node.js >= 12
2. Esegui `npm install`
3. Verifica che il percorso dell'URL sia corretto

## Cross-Platform

Lo script funziona su:
- ✅ macOS
- ✅ Windows
- ✅ Linux
