---
sidebar_position: 2
---

# Railway Deployment

Deploy the web application to Railway.

## Prerequisites

- Railway account
- GitHub repository connected

## Deployment Steps

### 1. Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Configure Build

Railway automatically detects Vite:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build:web"
  }
}
```

### 3. Set Environment Variables

In Railway Dashboard → Variables:

```env
VITE_API_URL=https://aiplanner-back-production.up.railway.app
NODE_ENV=production
```

### 4. Deploy

Railway auto-deploys on every push to main branch.

## Custom Domain

1. Railway Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records

## Monitoring

- **Logs**: Railway Dashboard → Deployments → Logs
- **Metrics**: CPU, RAM, Network usage
- **Deployments**: History and rollback

## Build Command

```bash
npm install && npm run build:web
```

## Start Command

```bash
npm run preview --workspace=web -- --host 0.0.0.0 --port $PORT
```

## Troubleshooting

### Build Fails

- Check dependencies in `package.json`
- Review build logs in Railway

### CORS Errors

- Ensure backend allows Railway URL in CORS origins
- Check `VITE_API_URL` is correct

### App Not Starting

- Verify port binding (`$PORT` variable)
- Check start command in Railway settings
