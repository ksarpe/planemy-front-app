# Railway Deployment Guide

## 📋 Przygotowanie

Aplikacja jest skonfigurowana do automatycznego deployu na Railway.

### Pliki konfiguracyjne:
- `railway.json` - główna konfiguracja Railway
- `nixpacks.toml` - konfiguracja buildowania (Nixpacks)
- `.railwayignore` - pliki ignorowane podczas deploymentu

## 🚀 Deployment na Railway

### Metoda 1: Przez Railway Dashboard (Zalecane)

1. **Zaloguj się na Railway**: https://railway.app/
2. **Stwórz nowy projekt**:
   - Kliknij "New Project"
   - Wybierz "Deploy from GitHub repo"
   - Wybierz swoje repozytorium
3. **Railway automatycznie wykryje konfigurację** z `railway.json`
4. **Dodaj zmienne środowiskowe** (jeśli potrzebne):
   - `VITE_API_URL` - URL do backendu (automatycznie ustawione w railway.json)
   - `NODE_ENV` - `production` (automatycznie ustawione)
5. **Railway automatycznie zbuduje i wdroży aplikację**

### Metoda 2: Przez Railway CLI

```bash
# Zainstaluj Railway CLI
npm i -g @railway/cli

# Zaloguj się
railway login

# Połącz z projektem (w głównym folderze)
railway link

# Deploy
railway up
```

## 🔧 Konfiguracja Środowisk

### Production
- `VITE_API_URL`: `https://aiplanner-back-production.up.railway.app`
- Automatycznie używa `.env.production`

### Staging (opcjonalne)
- `VITE_API_URL`: `https://aiplanner-back-staging.up.railway.app`
- Możesz stworzyć osobne środowisko na Railway

## 📝 Proces Buildu

Railway wykonuje następujące kroki:

1. **Install**: `npm install` - instaluje wszystkie zależności
2. **Build**: `npm run build:web` - buduje aplikację Vite
3. **Start**: `npm run preview --workspace=web` - serwuje zbudowaną aplikację na porcie Railway

## 🌍 Zmienne Środowiskowe

Railway automatycznie dostarcza:
- `PORT` - port na którym aplikacja powinna słuchać
- `RAILWAY_ENVIRONMENT` - nazwa środowiska
- `RAILWAY_PROJECT_ID` - ID projektu

Możesz dodać własne w Railway Dashboard → Variables:
- `VITE_API_URL` - URL do API (już ustawione w railway.json)
- `VITE_FIREBASE_API_KEY` - jeśli używasz Firebase
- `VITE_FIREBASE_PROJECT_ID` - projekt Firebase

## 🔍 Debugging

### Sprawdź logi:
```bash
railway logs
```

### Sprawdź status buildu:
- Railway Dashboard → Deployments → Zobacz logi

### Typowe problemy:

**Problem**: Build się nie udaje
- Sprawdź czy wszystkie zależności są w `package.json`
- Sprawdź logi buildu w Railway Dashboard

**Problem**: Aplikacja nie startuje
- Sprawdź czy port jest prawidłowo ustawiony (`$PORT`)
- Sprawdź czy `preview` command działa lokalnie

**Problem**: CORS errors
- Upewnij się że backend ma dodany URL Railway do CORS origins
- Sprawdź czy `VITE_API_URL` jest prawidłowy

## 🔄 Auto-Deploy

Railway automatycznie deployuje przy każdym push do głównej gałęzi (main/master).

### Wyłączenie auto-deploy:
Railway Dashboard → Settings → Wyłącz "Auto Deploy"

### Deploy ręczny:
Railway Dashboard → Deployments → "Deploy"

## 📊 Monitorowanie

Railway dostarcza:
- **Metrics**: CPU, RAM, Network usage
- **Logs**: Real-time logs
- **Deployments**: Historia deploymentów

Dostęp przez Railway Dashboard → Project → Metrics/Logs

## 💡 Tips

1. **Custom Domain**: Railway Dashboard → Settings → Domains
2. **Environment Variables**: Dodaj przez Dashboard, nie commituj .env plików
3. **Multiple Environments**: Stwórz osobne projekty dla staging/production
4. **Database**: Dodaj Railway PostgreSQL/MySQL przez Dashboard
5. **Scaling**: Railway automatycznie skaluje, możesz zmienić plan

## 🔗 Przydatne Linki

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app/
- Railway CLI: https://docs.railway.app/develop/cli
- Nixpacks: https://nixpacks.com/docs

## ⚙️ Konfiguracja Zaawansowana

### Custom Build Command:
Edytuj `railway.json` → `build.buildCommand`

### Custom Start Command:
Edytuj `railway.json` → `deploy.startCommand`

### Healthcheck:
Railway automatycznie sprawdza czy aplikacja odpowiada na porcie

### Railway.toml (alternatywa):
Jeśli wolisz `.toml` zamiast `.json`, możesz użyć `railway.toml`:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build:web"

[deploy]
startCommand = "npm run preview --workspace=web -- --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
```
