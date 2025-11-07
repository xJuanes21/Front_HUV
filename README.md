# MIS HUV – Frontend

Aplicación frontend del Sistema MIS del Banco de Sangre del HUV. Provee autenticación de usuarios, panel de administración, panel de usuarios y módulos para gestión de usuarios y documentos.

## Contenido

- **Descripción general**
- **Tecnologías**
- **Estructura del proyecto**
- **Roles y permisos**
- **Autenticación y autorización**
- **Rutas y flujo de navegación**
- **Componentes clave**
- **Estilos y paleta de colores**
- **Ejecución y scripts**
- **Notas de contribución**

## Descripción general

Este proyecto está construido con Next.js (Pages Router) y Tailwind CSS 4. Está orientado a dos perfiles principales: administradores y usuarios finales. El flujo inicia en una pantalla de login y redirige al dashboard correspondiente según el rol.

## Tecnologías

- **Next.js** 15 (Pages Router) con Turbopack
- **React** 19
- **TypeScript** 5
- **Tailwind CSS** 4 (vía `@tailwindcss/postcss`)
- **lucide-react** (iconografía)

## Estructura del proyecto

```
Front_HUV/
├─ src/
│  ├─ components/
│  │  ├─ CTAWidget.tsx
│  │  ├─ LogoutButton.tsx
│  │  ├─ ProtectedRoute.tsx
│  │  ├─ forms-module/
│  │  ├─ my-documents-user/
│  │  ├─ shared/ (Header, UserMenu, etc.)
│  │  └─ users-module/ (UsersTable, tipos, etc.)
│  ├─ contexts/
│  │  └─ AuthContext.tsx
│  ├─ lib/
│  ├─ pages/
│  │  ├─ index.tsx (Login)
│  │  ├─ dashboard-admin/
│  │  │  ├─ index.tsx (Inicio Admin)
│  │  │  ├─ layout.tsx (Layout Admin)
│  │  │  ├─ users/ (gestión de usuarios)
│  │  │  └─ documents/ (gestión de documentos)
│  │  └─ dashboard-users/
│  │     ├─ layout.tsx (Layout Usuarios)
│  │     └─ hemocomponentes/ (módulo funcional)
│  └─ styles/
│     └─ globals.css
├─ middleware.ts (protección básica por ruta)
├─ next.config.ts
├─ postcss.config.mjs
├─ package.json
└─ tsconfig.json
```

## Roles y permisos

- **admin**. Acceso al panel de administración (`/dashboard-admin`), gestión de usuarios y documentos.
- **user**. Acceso al panel de usuarios (`/dashboard-users`) y a módulos funcionales (p. ej. hemocomponentes).
- **editor**. Referenciado en componentes pero no tiene rutas dedicadas actualmente. Se considera un rol reservado/por activar.

La comprobación de rol ocurre en cliente mediante `ProtectedRoute` y `AuthContext` (`user.rol`). En caso de rol insuficiente, se redirige al dashboard acorde al rol actual del usuario.

## Autenticación y autorización

- **Contexto de autenticación**: `src/contexts/AuthContext.tsx`.
  - Persistencia de token en `localStorage` bajo la clave `auth_token`.
  - Métodos: `login(correo, password)`, `logout()`, `hasRole(role)`.
  - Estado: `user`, `token`, `isAuthenticated`, `isLoading`, `isVerifying`.
- **Protección de rutas (cliente)**: `src/components/ProtectedRoute.tsx`.
  - Prop opcional `requiredRole` para restringir acceso.
  - Redirecciones automáticas según `user.rol`.
- **Middleware (edge)**: `middleware.ts`.
  - Verifica la existencia de cookie `auth_token` para bloquear acceso a `/dashboard-*` sin autenticación.
  - Si hay token y se visita `/`, redirige por defecto a `/dashboard-users`.

Nota: El middleware consulta cookie, mientras el cliente persiste en `localStorage`. Si se desea validar también en middleware, el token debe emitirse como cookie por el backend.

## Rutas y flujo de navegación

- **Login (`/`)**
  - Formularios de acceso con `correo` y `password`.
  - Si ya está autenticado, se redirige automáticamente según rol.
- **Dashboard de Administrador (`/dashboard-admin`)**
  - Vista de inicio con accesos a módulos.
  - Módulo de usuarios: `/dashboard-admin/users` (lista, creación, administración).
  - Módulo de documentos: `/dashboard-admin/documents`.
- **Dashboard de Usuarios (`/dashboard-users`)**
  - Módulos funcionales, p. ej. `hemocomponentes`.

Flujo alto nivel:
1. Usuario accede a `/` y se autentica.
2. `AuthContext` guarda token y usuario; `ProtectedRoute` controla accesos.
3. Se navega al dashboard correspondiente y a sus submódulos.

## Componentes clave

- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
  - Wrapper de seguridad con `requiredRole` y estados de carga/verificación.
- **Header** (`src/components/shared/Header.tsx`)
  - Encabezado con datos del usuario, menú y estado.
  - Mapea `user.rol` a títulos legibles.
- **Dashboard layouts**
  - `dashboard-admin/layout.tsx` y `dashboard-users/layout.tsx` con sidebar y encabezado.
- **CTAWidget**, **UsersTable**, módulos de formularios y documentos.

## Estilos y paleta de colores

- **Tailwind CSS 4**. Configurado vía `@tailwindcss/postcss` y `@import "tailwindcss"` en `globals.css`.
- **Variables de tema (CSS)** en `src/styles/globals.css`:
  - `--background`: `#ffffff` (claro), `#0a0a0a` (modo oscuro).
  - `--foreground`: `#171717` (claro), `#ededed` (oscuro).
  - Tipografías: `--font-geist-sans`, `--font-geist-mono` (vía next/font).
- **Paleta UI observada**:
  - Azul institucional: `blue-800`, `blue-700`, `blue-600` (sidebar, header).
  - Rojo de acción: `red-600`, `red-700` (botones primarios, acentos, avatar).
  - Verde de estado: `green-500` (indicadores activos).
  - Grises utilitarios: `gray-50` a `gray-900`.

## Ejecución y scripts

Requisitos: Node 18+.

```bash
npm install
npm run dev          # desarrollo (Turbopack)
npm run build        # build de producción (Turbopack)
npm start            # servir build de producción
```

Aplicación por defecto en http://localhost:3000

## Buenas prácticas y contribución

- Mantener componentes modulares por dominio en `src/components/*-module`.
- Respetar `ProtectedRoute` para nuevas páginas restringidas.
- Centralizar constantes de roles y títulos si se agregan nuevos perfiles.
- Unificar persistencia de token (cookie vs localStorage) si se requiere validación en middleware.

## Licencia

Proyecto interno del HUV. Uso restringido según lineamientos de la organización.
