# Setup Guida Rapida

## 1. Installa le dipendenze
```bash
npm install
```

## 2. Avvia il server API
```bash
npm start
```

Il server sarà disponibile su http://localhost:3000

## 3. Apri il frontend
Apri il file `frontend.html` nel browser:
- **macOS**: `open frontend.html`
- **Windows**: Doppio click su `frontend.html`
- **Linux**: `xdg-open frontend.html`

Oppure se vuoi un server per il frontend:
```bash
# In un altro terminale
python3 -m http.server 8000
# Poi vai su http://localhost:8000/frontend.html
```

## 4. Usa l'applicazione
1. Incolla l'URL dell'anime nel campo input
2. Clicca "Estrai Link"
3. Aspetta l'elaborazione
4. Clicca "Copia tutti i link" per copiarli negli appunti

## Troubleshooting

### Errore "Failed to fetch"
- Verifica che il server sia avviato con `npm start`
- Controlla che la porta 3000 sia libera
- Se occupata, usa `PORT=8080 npm start`

### Errore "npm: command not found"
- Installa Node.js da https://nodejs.org/

### Nessun episodio trovato
- Verifica che l'URL sia corretto
- L'URL deve essere nel formato: https://www.animeworld.ac/play/...

### Text-to-speech/Clipboard non funzionano dal CLI
- Sono features solo per il CLI (`node index.js url=...`)
- L'API web non supporta queste funzioni

## File principali

- `server.js` - API REST Express
- `frontend.html` - Interfaccia web
- `index.js` - CLI (command line)
- `processor.js` - Logica di elaborazione
- `utils/` - Moduli helper
