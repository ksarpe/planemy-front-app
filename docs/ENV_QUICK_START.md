# Quick Start - Environment Configuration

## ✅ Co zostało skonfigurowane:

### 1. **Pliki .env utworzone:**

- ✅ `web/.env.development` → `http://localhost:8080`
- ✅ `web/.env.production` → `https://aiplanner-back-production.up.railway.app`
- ✅ `web/.env.example` → Szablon dla zespołu

### 2. **Nowy helper stworzony:**

- ✅ `shared/config/api.ts` → funkcja `buildApiUrl()`

### 3. **Przykładowa migracja:**

- ✅ `shared/api/auth.ts` → Wszystkie endpointy zmigrowane

## 🚀 Jak używać TERAZ:

### Development (localhost):

```bash
npm run dev
# Automatycznie: localhost:8080 ✅
```

### Production build (Railway):

```bash
npm run build
# Automatycznie: Railway URL ✅
```

### Testowanie z Railway lokalnie:

```bash
# W web/ folder:
echo VITE_API_URL=https://aiplanner-back-production.up.railway.app > .env.local

npm run dev
# Teraz używasz Railway! ✅

# Żeby wrócić do localhost:
rm .env.local
```

## 📋 Pliki do zmigrowania:

**Zmigro wane (2/12):**

- ✅ auth.ts
- ✅ announcements.ts (już czysty)

**Do zmigrowania (10/12):**

- ⏳ combined.ts (1 URL)
- ⏳ events.ts (4 URLs)
- ⏳ feedback.ts (7 URLs)
- ⏳ labels.ts (10 URLs)
- ⏳ payments.ts (4 URLs)
- ⏳ permissions.ts (14 URLs)
- ⏳ shopping.ts (9 URLs)
- ⏳ tasks.ts (9 URLs)
- ⏳ user_profile.ts (1 URL)

**Razem: 59 URL-i do zamiany**

## 🔧 Jak zmigr ować plik:

**Przed:**

```typescript
const response = await fetch("http://localhost:8080/api/v1/tasks", {
  method: "GET",
  credentials: "include",
});
```

**Po:**

```typescript
import { buildApiUrl } from "@shared/config/api";

const response = await fetch(buildApiUrl("tasks"), {
  method: "GET",
  credentials: "include",
});
```

## 📖 Pełna dokumentacja:

Zobacz `docs/ENVIRONMENT_CONFIG.md` dla szczegółów.

## ⚡ Szybkie FAQ:

**Q: Jak zmienić środowisko lokalnie?** A: Stwórz `web/.env.local` z `VITE_API_URL=...`

**Q: Czy .env.local powinien być w git?** A: NIE! Jest w .gitignore automatycznie (\*.local)

**Q: Jak wiem które środowisko używam?** A: Dodaj w kodzie: `console.log(import.meta.env.VITE_API_URL)`

**Q: Czy muszę restartować dev server?** A: TAK! Zawsze po zmianie .env files

**Q: Czy mogę mieć inne zmienne?** A: TAK! Dodaj `VITE_NAZWA=wartość` (musi zaczynać się od VITE\_)
