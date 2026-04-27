# El Tesorero

App web para gestionar la tesorería del curso.

## Tech Stack

- **SvelteKit** (Svelte 5) — framework full-stack
- **SQLite** via better-sqlite3 + Drizzle ORM
- **TailwindCSS v4**
- **Node.js** adapter para producción

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones y seed
npm run db:seed

# Levantar servidor de desarrollo
npm run dev
```

Navegar a:
- `http://localhost:5173/login` — Login de miembros
- `http://localhost:5173/admin-login` — Login de administrador
- `http://localhost:5173/garage` — Component playground (solo en dev)

### PIN por defecto

- Miembros: `000000` (se pide cambiar al ingresar)
- Admin: definido en variable `ADMIN_PIN` (default `000000`)

### Seed data

El seed crea 8 miembros de ejemplo, 2 eventos y 2 monederos.

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `ADMIN_PIN` | PIN de 6 dígitos del admin | `000000` |
| `SESSION_SECRET` | Secreto para firmar cookies | `dev-secret-...` |
| `DATABASE_URL` | Path al archivo SQLite | `./data/tesorero.db` |
| `UPLOAD_DIR` | Directorio para comprobantes | `./uploads` |
| `ORIGIN` | URL base (producción) | — |

## Producción con Docker

```bash
# Build y ejecutar
docker compose up --build

# O usar la imagen de GHCR
docker compose up
```

La app estará en `http://localhost:3000`.

### Dockge

Usar el `docker-compose.yml` directamente en Dockge. Configurar las variables de entorno:

```yaml
environment:
  - ADMIN_PIN=tu-pin-seguro
  - SESSION_SECRET=genera-un-string-random
  - ORIGIN=https://tu-dominio.com
```

### Volúmenes

- `./data/` — Base de datos SQLite
- `./uploads/` — Comprobantes de pago subidos

## Estructura del proyecto

```
src/
  lib/
    components/       # Componentes Svelte reutilizables
      ui/             # Primitivos (Button, Input, Card, Badge)
      PinKeypad       # Teclado numérico táctil
      WalletStatement # Cartola bancaria
    server/
      db/             # Schema Drizzle, conexión, seed
      auth.ts         # Autenticación PIN + sesiones
      wallets.ts      # Lógica de movimientos y balances
      files.ts        # Manejo de uploads
    utils/            # Helpers (formato moneda, fechas)
  routes/
    login/            # Login miembros
    admin-login/      # Login admin
    cambiar-pin/      # Cambio de PIN
    (member)/         # Rutas autenticadas miembro
    (admin)/          # Rutas autenticadas admin
    garage/           # Component playground (dev only)
    api/uploads/      # Servir archivos subidos
```
