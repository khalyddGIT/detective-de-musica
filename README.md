# 🎵 Detective de Música

**Detective de Música** es una aplicación web interactiva donde los jugadores reciben pistas progresivas sobre una canción (año de lanzamiento, género, álbum/colaboradores, contexto o letra parcial y muestra de audio de 30 segundos) para adivinar el título exacto con la menor cantidad de pistas posible.

---

## 🛠️ Tech Stack & Arquitectura

* **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons.
* **Backend**: Next.js Server API Routes & Server Actions.
* **Base de Datos & Auth**: Supabase (PostgreSQL con Row Level Security + Supabase Auth Magic Link).
* **APIs Externas**:
  * **Last.fm API**: Información del artista, álbum, géneros y biografía/resumen.
  * **iTunes Search API & Deezer API**: Muestras de audio de 30 segundos.
* **Herramientas de Despliegue**: GitHub CLI (`gh`), Vercel CLI (`vercel`), Supabase CLI (`supabase`).

---

## 📐 Modelo de Datos & Seguridad (RLS)

1. **`canciones`**: Almacena título, artista, álbum, año, array JSONB de 5 pistas (de difícil a fácil) y la URL de preview de audio de 30s.
2. **`usuarios`**: Sincronizado automáticamente con `auth.users` mediante triggers de PostgreSQL.
3. **`partidas`**: Almacena `usuario_id`, `cancion_id`, `pistas_usadas` (1-5), `acerto` (boolean) y `puntaje` (0-100 pts).
4. **Row Level Security (RLS)**:
   * Canciones y Usuarios son de lectura pública.
   * Modificaciones a canciones restringidas únicamente a `service_role`.
   * Los usuarios autenticados solo pueden registrar e insertar partidas asociadas a su propio `usuario_id`.

---

## 🚀 Inicio Rápido Local

1. **Clonar e instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Rellena tus claves de Supabase y Last.fm API Key.

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📄 Guía de Despliegue en Producción
Para desplegar la aplicación a Vercel y aplicar las migraciones en Supabase mediante CLI, consulta la [Guía de Despliegue (DEPLOYMENT.md)](./DEPLOYMENT.md).
