# Deploy automático THEPIOLO (misma VPS que TSM-WEB)

TSM usa el **puerto 3000**. THEPIOLO usa el **puerto 3001** en la misma VPS.

## Lo que ya tienes (de TSM)

Si TSM ya despliega bien, en la VPS ya están:

- Node.js y npm
- PM2
- Nginx
- Usuario `admin_dany` (o el que uses)
- Clave SSH para GitHub Actions

## Lo que debes hacer en la VPS (una sola vez)

### 1. Clonar el repo

```bash
cd ~
git clone https://github.com/jagfxx/thepiolo_web.git
cd thepiolo_web
mkdir -p logs
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
```

Verifica:

```bash
pm2 status
curl http://localhost:3001
```

### 2. Nginx + dominio

```bash
sudo nano /etc/nginx/sites-available/thepiolo-web
```

Pega el contenido de `nginx-config-thepiolo.txt` (dominio: **thepiolo.icu**).

```bash
sudo ln -s /etc/nginx/sites-available/thepiolo-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

SSL (cuando el DNS apunte a la VPS):

```bash
sudo certbot --nginx -d thepiolo.icu -d www.thepiolo.icu
```

## Secrets en GitHub (repo `thepiolo_web`)

**Settings → Secrets and variables → Actions → New repository secret**

Los secrets son **por repositorio**. Copia los mismos valores que en `TSM-WEB`:

| Secret | Descripción |
|--------|-------------|
| `VPS_HOST` | IP de la VPS |
| `VPS_USER` | `admin_dany` |
| `VPS_KEY` | Clave **privada** SSH (ver abajo) |

Este repositorio **no** incluye notificaciones por correo (a diferencia de TSM-WEB). No necesitas `EMAIL_USERNAME` ni `EMAIL_PASS` aquí.

### ¿Qué es `VPS_KEY`?

Es la **clave privada SSH** que GitHub Actions usa para entrar a tu VPS por SSH. **No** es la contraseña de root ni de `admin_dany`.

Si configuraste TSM igual que en la guía, suele ser el archivo que creaste en la VPS:

```bash
cat ~/.ssh/deploy_key
```

Copia **todo** el bloque, incluyendo:

```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Pégalo en GitHub → **thepiolo_web** → Settings → Secrets → `VPS_KEY`.

La **clave pública** (`deploy_key.pub`) debe estar en `~/.ssh/authorized_keys` del usuario `VPS_USER` en la VPS. Si TSM ya despliega bien, puedes usar **la misma** clave privada en ambos repos (`TSM-WEB` y `thepiolo_web`).

**No** uses la clave privada de tu PC ni la de GitHub; debe ser la del par deploy que autorizaste en la VPS.

## Workflows incluidos

| Archivo | Qué hace |
|---------|----------|
| `.github/workflows/deploy.yml` | Push a `main` → SSH → pull → build → `pm2 restart thepiolo-web` |

## PM2 en la VPS

```bash
pm2 status
# tsm-web      → puerto 3000
# thepiolo-web → puerto 3001

pm2 logs thepiolo-web
pm2 restart thepiolo-web
```

## Checklist rápido

- [ ] Repo clonado en `/home/admin_dany/thepiolo_web`
- [ ] `pm2 start` y `thepiolo-web` online en puerto 3001
- [ ] Nginx `thepiolo-web` con tu dominio
- [ ] DNS apuntando a la VPS
- [ ] Certbot SSL
- [ ] Secrets `VPS_HOST`, `VPS_USER`, `VPS_KEY` en GitHub (repo thepiolo_web)
- [ ] Push a `main` y revisar pestaña **Actions**

## Problemas frecuentes

**Puerto en uso:** TSM debe seguir en 3000; THEPIOLO en 3001.

**Deploy falla en git:** En la VPS, dentro del repo:

```bash
git remote -v
# debe ser github.com/jagfxx/thepiolo_web
```

**Commits bloqueados:** Usa el mismo email de GitHub que en TSM (`133823825+jagfxx@users.noreply.github.com`).

**Pantalla blanca / "Application error" en el navegador:** casi siempre son los assets de Next (`/_next/static/...`) devolviendo **400**. Suele pasar si en Nginx hay un `location /_next/static` **sin** `proxy_set_header Host $host;`. Usa el `nginx-config-thepiolo.txt` actual (un solo `location /`) y recarga:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Luego rebuild limpio en la VPS:

```bash
cd ~/thepiolo_web
git pull origin main
rm -rf .next
npm ci
npm run build
pm2 restart thepiolo-web
```

Comprueba que un chunk responda **200** (cambia el hash si cambió el build):

```bash
curl -I "https://thepiolo.icu/_next/static/chunks/webpack-0c08feeaeab5776b.js"
```

## Cuentas de cobro (PostgreSQL + Admin + API)

### Una vez en la VPS

1. PostgreSQL con BD `thepiolo_billing` (usuario `thepiolo`).
2. Archivo `~/thepiolo_web/.env` (copiar de `.env.example`), `chmod 600 .env`.
3. Tras el primer deploy con Prisma:

```bash
cd ~/thepiolo_web
npm run db:seed
```

4. Entrar a `https://thepiolo.icu/admin` con `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Deploy automático (cada push a `main`)

El workflow ejecuta: `prisma generate` → `prisma migrate deploy` → `npm run build` → `pm2 restart`.

### API (ejemplo)

```bash
curl -X POST https://thepiolo.icu/api/v1/invoices \
  -H "Authorization: Bearer tp_TU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Cliente SA","concept":"Desarrollo web","amount":2500000}'
```

Genera API keys en `/admin/api-keys`.
