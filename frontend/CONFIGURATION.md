# Configurazione Applicazione

## Overview

L'applicazione usa variabili d'ambiente per gestire la configurazione. Questo permette di avere setup diversi per development, staging e production.

## Backend (Node.js/Express)

### File di configurazione: `config.js`

Il file `config.js` legge automaticamente le variabili d'ambiente dal file `.env`.

### Variabili d'ambiente disponibili:

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `PORT` | 3000 | Porta del server |
| `NODE_ENV` | development | Environment (development, staging, production) |
| `CORS_ORIGIN` | * | Origine CORS permessa |
| `LOG_LEVEL` | info | Livello di logging |

### Setup Development

1. **Crea il file `.env` dalla template:**
```bash
cp .env.example .env
```

2. **Il file `.env` conterrà:**
```env
API_URL=http://localhost:3000
API_TIMEOUT=30000
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=info
```

3. **Avvia il server:**
```bash
npm install
npm start
```

### Setup Production

1. **Imposta le variabili d'ambiente:**

```bash
# Via .env file
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://tuodominio.com
LOG_LEVEL=warn

# Oppure via shell (Heroku, Docker, ecc)
export NODE_ENV=production
export PORT=8080
export CORS_ORIGIN=https://tuodominio.com
```

2. **Avvia il server:**
```bash
npm start
```

### Uso delle variabili nel backend:

```javascript
const config = require('./config');
const { port, env, corsOrigin } = config.getConfig();

console.log(`Server on port ${port} in ${env} mode`);
```

## Frontend (JavaScript)

### File di configurazione: `frontend/js/config.js`

Il frontend ha una propria configurazione che può essere impostata in 3 modi:

#### 1. Variabile globale JavaScript (Metodo consigliato per hosting)

Aggiungi nel file HTML prima di caricare i script:

```html
<script>
  window.API_CONFIG = {
    apiUrl: 'https://api.tuodominio.com',
    apiTimeout: 30000,
    env: 'production'
  };
</script>
<script src="js/config.js"></script>
```

#### 2. Default locale (Development)

Se `window.API_CONFIG` non è definito, usa i default:

```javascript
apiUrl: 'http://localhost:3000'
apiTimeout: 30000
env: 'development'
```

#### 3. Script di build (Webpack, Vite, ecc)

Se usi un build tool, puoi usare variabili d'ambiente durante il build:

```bash
API_URL=https://api.tuodominio.com npm run build
```

### Uso della configurazione nel frontend:

```javascript
const { apiUrl, apiTimeout } = CONFIG.getConfig();

// Usa in API calls
fetch(`${apiUrl}/api/scrape`, { ... })
```

## Deployment Guide

### Heroku

```bash
# Set config vars
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://myapp.herokuapp.com

# Deploy
git push heroku main
```

### Docker

**Dockerfile:**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGIN=*
```

### AWS/GCP/Azure

Imposta le variabili d'ambiente nel pannello di controllo:
- `NODE_ENV=production`
- `PORT=8080`
- `CORS_ORIGIN=https://tuodominio.com`

## Development vs Production

### Development
```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://tuodominio.com
LOG_LEVEL=warn
```

## CORS Configurazione

### Development (tutto permesso)
```env
CORS_ORIGIN=*
```

### Production (solo dominio specifico)
```env
CORS_ORIGIN=https://tuodominio.com
```

### Production (multipli domini)
```env
CORS_ORIGIN=https://app.tuodominio.com,https://admin.tuodominio.com
```

## Checklist Pre-Deployment

- [ ] `.env` non è nel repository (aggiungi a `.gitignore`)
- [ ] `NODE_ENV=production` è impostato
- [ ] `CORS_ORIGIN` è configurato per il tuo dominio
- [ ] `PORT` è corretto per il tuo hosting
- [ ] `LOG_LEVEL` è impostato a `warn` o `error`
- [ ] Frontend ha `window.API_CONFIG` con l'URL corretto

## Troubleshooting

### "CORS error"
- Verifica che `CORS_ORIGIN` corrisponda al tuo dominio
- Assicurati che il frontend chiami l'URL corretto in `API_CONFIG`

### "Port already in use"
- Cambia `PORT` in `.env`
- O: `lsof -i :3000` e uccidi il processo

### "Cannot find module 'dotenv'"
- Esegui `npm install`

## .gitignore

Non fare il commit del file `.env`:

```bash
# .gitignore
.env
.env.local
node_modules/
output/
```

Usa `.env.example` come template per gli sviluppatori.
