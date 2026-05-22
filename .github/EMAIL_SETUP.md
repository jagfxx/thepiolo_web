# Configuración de notificaciones por correo — THEPIOLO Web

Igual que en **TSM-WEB**: cada push a `main` envía un correo con el detalle del commit.

## Secrets en GitHub (repo `thepiolo_web`)

Los secrets son **por repositorio**. Copia los **mismos valores** que ya usas en TSM-WEB:

1. [github.com/jagfxx/thepiolo_web](https://github.com/jagfxx/thepiolo_web) → **Settings**
2. **Secrets and variables** → **Actions**
3. **New repository secret**

| Secret | Descripción |
|--------|-------------|
| `EMAIL_USERNAME` | Gmail que envía (ej. `thepiolo.co@gmail.com`) |
| `EMAIL_PASS` | Contraseña de aplicación de Gmail (16 caracteres) |

### Cómo obtener `EMAIL_PASS` (si aún no la tienes)

1. [Cuenta de Google](https://myaccount.google.com/) → **Seguridad**
2. Activa **Verificación en 2 pasos**
3. **Contraseñas de aplicaciones** → Correo → nombre "GitHub Actions THEPIOLO"
4. Copia la contraseña generada → pégala en `EMAIL_PASS`

No uses tu contraseña normal de Gmail.

## Destinatarios

Cada push a `main` notifica a:

- `thepiolo.co@gmail.com`
- `transportservicemedellin@gmail.com`

(Puedes editar la línea `to:` en `.github/workflows/email-notification.yml`.)

## Workflow

Archivo: `.github/workflows/email-notification.yml`

- Valida que existan `EMAIL_USERNAME` y `EMAIL_PASS` antes de enviar
- Si faltan, el job falla con un mensaje que apunta a esta guía

## Probar

1. Guarda ambos secrets en `thepiolo_web`
2. Push a `main` o **Actions** → **Email Notification on Push** → **Re-run**
3. Revisa logs; si falla SMTP, verifica contraseña de aplicación y spam

## Mismos secrets en ambos repos

| Repositorio | Secrets de correo |
|-------------|-------------------|
| TSM-WEB | `EMAIL_USERNAME`, `EMAIL_PASS` |
| thepiolo_web | **Los mismos** (copiar valores) |

Deploy VPS usa otros secrets: `VPS_HOST`, `VPS_USER`, `VPS_KEY`.
