# Environment Configuration Guide

## 🎯 Cel

System środowiskowy pozwala na łatwe przełączanie między lokalnym backendem a produkcyjnym Railway bez zmiany kodu.

## 📁 Struktura plików

```
web/
├── .env.development      # Automatycznie używany w `npm run dev`
├── .env.production       # Automatycznie używany w `npm run build`
├── .env.local           # (opcjonalny) Nadpisuje inne - NIE commituj!
└── .env.example         # Szablon dla nowych devów
```

## 🚀 Jak używać

### Automatyczne środowiska (ZALECANE)

#### Development (localhost):

```bash
npm run dev
# Automatycznie używa .env.development -> localhost:8080
```

#### Production (Railway):

```bash
npm run build
# Automatycznie używa .env.production -> Railway URL
```

### Nadpisanie ręczne (opcjonalne)

Jeśli chcesz **lokalnie** testować z Railway:

1. Skopiuj `.env.example` do `.env.local`:

   ```bash
   cp web/.env.example web/.env.local
   ```

2. Edytuj `web/.env.local`:

   ```env
   VITE_API_URL=https://aiplanner-back-production.up.railway.app
   ```

3. Uruchom dev server:
   ```bash
   npm run dev
   # Teraz łączysz się z Railway mimo że jesteś w dev mode!
   ```

**Ważne**: `.env.local` jest w `.gitignore` - nie zostanie zacommitowany!

## 🔧 Konfiguracja w kodzie

### Używanie w API calls:

```typescript
import { buildApiUrl } from "@shared/config/api";

// ✅ DOBRZE - używa environment variable
const response = await fetch(buildApiUrl("auth/login"), {
  method: "POST",
  // ...
});

// ❌ ŹLE - hardcoded URL
const response = await fetch("http://localhost:8080/api/v1/auth/login", {
  method: "POST",
  // ...
});
```

### Dostępne helpers:

```typescript
import { API_BASE_URL, API_URL, buildApiUrl } from "@shared/config/api";

console.log(API_BASE_URL); // "http://localhost:8080" lub "https://railway..."
console.log(API_URL); // "http://localhost:8080/api/v1"

buildApiUrl("auth/login"); // "http://localhost:8080/api/v1/auth/login"
buildApiUrl("/tasks"); // "http://localhost:8080/api/v1/tasks"
```

## 📋 Priority order (Vite)

Vite ładuje pliki w kolejności (później = wyższy priorytet):

1. `.env` - bazowy (nie używamy)
2. `.env.local` - lokalne overrides (gitignored)
3. `.env.[mode]` - development/production
4. `.env.[mode].local` - mode-specific overrides (gitignored)

## 🔐 Git Strategy

### Co JEST w repo:

- ✅ `.env.development` (localhost)
- ✅ `.env.production` (Railway)
- ✅ `.env.example` (dokumentacja)

### Co NIE JEST w repo (gitignored):

- ❌ `.env.local`
- ❌ `.env.*.local`

**Dlaczego tak?**

- `.env.development` i `.env.production` są "bezpieczne" - każdy dev wie że dev = localhost, prod = Railway
- `.env.local` może mieć wrażliwe dane lub osobiste overrides - każdy dev ma swoje

## 🎨 Przykładowe scenariusze

### Scenariusz 1: Normalny development

```bash
npm run dev
# → Używa .env.development → localhost:8080 ✅
```

### Scenariusz 2: Testowanie z Railway lokalnie

```bash
# Raz: stwórz .env.local
echo "VITE_API_URL=https://aiplanner-back-production.up.railway.app" > web/.env.local

npm run dev
# → Używa .env.local → Railway ✅
```

### Scenariusz 3: Build produkcyjny

```bash
npm run build
# → Używa .env.production → Railway ✅
```

### Scenariusz 4: Powrót do localhost

```bash
# Usuń override
rm web/.env.local

npm run dev
# → Używa .env.development → localhost:8080 ✅
```

## 🔄 Migracja istniejących API calls

Zamień wszystkie hardcoded URLs:

**Przed:**

```typescript
fetch("http://localhost:8080/api/v1/tasks");
```

**Po:**

```typescript
import { buildApiUrl } from "@shared/config/api";
fetch(buildApiUrl("tasks"));
```

## 📝 Dodawanie nowych zmiennych

1. Dodaj w `web/.env.development`:

   ```env
   VITE_FEATURE_FLAG_NEW=true
   ```

2. Dodaj w `web/.env.production`:

   ```env
   VITE_FEATURE_FLAG_NEW=false
   ```

3. Użyj w kodzie:
   ```typescript
   const isEnabled = import.meta.env.VITE_FEATURE_FLAG_NEW === "true";
   ```

**Ważne**: Zmienne muszą zaczynać się od `VITE_` żeby były dostępne w kliencie!

## 🐛 Debugging

Sprawdź jakie zmienne są załadowane:

```typescript
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("Mode:", import.meta.env.MODE); // "development" lub "production"
```

## ⚠️ Ważne uwagi

1. **Restart dev server** po zmianie `.env` files!
2. Zmienne z `VITE_` są **publiczne** - nie wrzucaj secretów!
3. `.env.local` **nigdy** nie trafia do repo (gitignored)
4. Production build używa `.env.production` automatycznie
