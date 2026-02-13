# Guida al Debug

## Come controllare se tutto funziona

### 1. Apri la Console del Browser
Premi: `F12` o `Cmd+Option+I` (Mac)

### 2. Verifica che il SERVER è online

Nella console dovresti vedere:
```
📄 DOM Loaded
🚀 Inizializzazione APP
🔍 Checking API Status: http://localhost:3000
✓ API Status: {success: true, status: "API online", timestamp: "..."}
```

Se vedi errore "Server non raggiungibile", significa che:
- Il server non è avviato (esegui `npm start`)
- La porta è sbagliata
- Controlla le variabili d'ambiente in `frontend/js/config.js`

### 3. Al click su "Estrai Link"

Nella console dovresti vedere:
```
📝 Form submitted
🔍 Scrapando URL: https://www.animeworld.ac/play/...
🌐 API Call: http://localhost:3000/api/scrape
(attesa di risposta...)
✓ API Response: {success: true, data: {...}, stats: {...}}
✓ Estrazione completata, link trovati: 24
```

### Errori comuni e soluzioni

#### ❌ "Failed to fetch"
**Causa**: Il server non è raggiungibile
**Soluzione**:
```bash
# Assicurati che il server sia avviato
npm start

# Verifica la porta
netstat -an | grep 3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

#### ❌ "Server non raggiungibile su localhost:3000"
**Causa**: Il server non è avviato quando la pagina carica
**Soluzione**:
1. Avvia il server: `npm start`
2. Ricarica la pagina del frontend: `Ctrl+R` o `Cmd+R`

#### ❌ "Nessun episodio trovato"
**Causa**: L'URL non contiene episodi
**Soluzione**:
- Verifica che l'URL sia nel formato: `https://www.animeworld.ac/play/...`
- Prova con un anime conosciuto

#### ❌ "CORS error"
**Causa**: Il frontend e il backend non hanno CORS configurato correttamente
**Soluzione**:
1. Verifica che CORS sia abilitato in `server.js`:
   ```javascript
   app.use(cors({ origin: corsOrigin }));
   ```
2. Se ospitato, configura CORS nel `.env`:
   ```env
   CORS_ORIGIN=https://tuodominio.com
   ```

## Console Log Utili

### Loggare l'oggetto CONFIG
```javascript
console.log(CONFIG.getConfig());
```

### Loggare l'oggetto APP
```javascript
console.log(window.APP);
```

### Loggare l'oggetto API
```javascript
console.log(window.API);
```

### Loggare l'oggetto UI
```javascript
console.log(window.UI);
```

## Test Manuale con cURL

Se vuoi testare l'API direttamente:

```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.animeworld.ac/play/kono-subarashii-sekai-ni-shukufuku-wo.9j3hp/A-1Im"}'
```

Dovresti ottenere una risposta JSON con i link.

## Network Tab

Apri la tab "Network" nella console browser:

1. Premi `F12`
2. Vai su "Network"
3. Clicca "Estrai Link"
4. Dovresti vedere una richiesta POST a `http://localhost:3000/api/scrape`

**Se non vedi la richiesta**:
- L'event listener non è collegato
- Controlla che tutti i file .js siano caricati (tab "Sources")
- Assicurati che `config.js`, `api.js`, `ui.js`, `app.js` siano nell'ordine giusto in `index.html`

## Checklist di Debug

- [ ] Server avviato con `npm start`
- [ ] Console del browser aperta (F12)
- [ ] Vedi "✓ API Status: {success: true...}" nella console
- [ ] Inserisci un URL valido
- [ ] Clicca "Estrai Link"
- [ ] Vedi "📝 Form submitted" nella console
- [ ] Vedi "🌐 API Call: ..." nella console
- [ ] Aspetta la risposta "✓ API Response: ..."
- [ ] Vedi i risultati nella pagina

Se uno di questi passaggi non funziona, controlla gli errori nella console.

## Abilitare Debug verbose

Aggiungi in `frontend/js/config.js`:
```javascript
window.DEBUG = true;
```

Poi in `frontend/js/app.js` aggiungi prima di `APP.init()`:
```javascript
if (window.DEBUG) {
  console.log('🐛 Debug Mode Enabled');
}
```

## Performance Monitor

Nella console browser:
```javascript
// Vedi tempo di risposta dell'API
performance.mark('api-start');
// ... API call
performance.mark('api-end');
performance.measure('api-time', 'api-start', 'api-end');
performance.getEntriesByName('api-time');
```
