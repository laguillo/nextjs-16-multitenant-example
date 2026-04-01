# Multi-Tenant App — Next.js 16 Demo

Demo de arquitectura multi-tenant con subdominios, autenticación simulada y datos aislados por tenant. Sin base de datos — todo hardcodeado. El objetivo es entender y validar el patrón multi-tenant en Next.js 16.

## Stack

- **Next.js 16.2.2** con App Router y Turbopack
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- Sin base de datos — datos hardcodeados en `src/lib/tenants.ts`

## Estrategia multi-tenant

Cada tenant se identifica por subdominio:

| Subdominio | Tenant | Plan |
|---|---|---|
| `tenant1.localhost:3000` | Acme Corp | Pro |
| `tenant2.localhost:3000` | Globex Inc | Enterprise |
| `tenant3.localhost:3000` | Initech | Starter |

El archivo `src/proxy.ts` (equivalente al `middleware.ts` de Next.js ≤15, renombrado en v16) intercepta cada request, extrae el subdominio y hace un **rewrite interno transparente** a `/[tenant]/ruta`. El usuario siempre ve `tenant1.localhost:3000/products`, pero Next.js sirve internamente desde `/tenant1/products`.

## Configuración previa

Agregar las siguientes entradas a `/etc/hosts`:

```
127.0.0.1  tenant1.localhost
127.0.0.1  tenant2.localhost
127.0.0.1  tenant3.localhost
```

## Instalación y arranque

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000` para ver la landing con los 3 tenants y sus credenciales de prueba.

## Credenciales de prueba

Contraseña para todos los usuarios: `tenant{N}123` (ej. `tenant1123` para tenant1).

**Acme Corp** (`tenant1.localhost:3000`)
- `alice@acme.com` — Admin
- `bob@acme.com` — Manager
- `carol@acme.com` — Viewer

**Globex Inc** (`tenant2.localhost:3000`)
- `david@globex.com` — Admin
- `emma@globex.com` — Manager
- `frank@globex.com` — Manager
- `grace@globex.com` — Viewer

**Initech** (`tenant3.localhost:3000`)
- `peter@initech.com` — Admin
- `samir@initech.com` — Viewer

## Cómo funciona

```
Request: GET tenant1.localhost:3000/products
         │
         ▼
   src/proxy.ts
   ├── Extrae subdominio "tenant1" desde request.url
   ├── Verifica cookie "tenant-session"
   │   ├── Sin sesión → redirect a /login
   │   └── Con sesión → continúa
   └── Rewrite interno: /products → /tenant1/products
         │
         ▼
   src/app/[tenant]/products/page.tsx
   └── Lee params.tenant = "tenant1"
   └── Filtra datos de tenants.ts para ese tenant
```

### Auth guard

El proxy verifica la cookie `tenant-session` en cada request. La cookie se setea en `POST /api/auth/login` con los datos del usuario y el tenant. No hay JWT firmado — es una demo.

### Aislamiento de datos

Cada página recibe el tenant desde `params` (inyectado por el rewrite del proxy) y llama a `getTenantBySubdomain()` para obtener únicamente los datos de ese tenant.

## Estructura del proyecto

```
src/
├── proxy.ts                        ← Routing multi-tenant + auth guard (Next.js 16)
├── app/
│   ├── layout.tsx                  ← Root layout global
│   ├── page.tsx                    ← Landing page con los 3 tenants
│   ├── [tenant]/
│   │   ├── layout.tsx              ← Layout con TenantNavbar (tema dinámico)
│   │   ├── page.tsx                ← Dashboard del tenant
│   │   ├── login/
│   │   │   ├── layout.tsx          ← Override: sin navbar
│   │   │   └── page.tsx            ← Página de login
│   │   ├── products/page.tsx       ← Catálogo de productos del tenant
│   │   └── users/page.tsx          ← Usuarios del tenant
│   └── api/auth/
│       ├── login/route.ts          ← POST: valida credenciales, setea cookie
│       └── logout/route.ts         ← POST: elimina cookie
├── components/
│   ├── TenantNavbar.tsx            ← Navbar con tema por tenant
│   └── LoginForm.tsx               ← Formulario de login (client component)
└── lib/
    └── tenants.ts                  ← Datos hardcodeados + helpers
```

## Breaking changes de Next.js 16 aplicados

- `middleware.ts` → renombrado a `proxy.ts`, función exportada como `proxy`
- `params` es una **Promise** → siempre `await params`
- `cookies()` retorna una **Promise** → `await cookies()`
- `PageProps` y `LayoutProps` son tipos globales — no se importan de ningún módulo
