# 🚀 Guía de Despliegue — Detective de Música

Guía paso a paso para desplegar **Detective de Música** utilizando los CLIs de **Supabase**, **GitHub** y **Vercel**.

---

## 1. Configuración del Backend con Supabase CLI

### Requisitos previos:
- Tener una cuenta en [Supabase](https://supabase.com).
- Instalar la CLI de Supabase si aún no la tienes (`npm i -g supabase` o `scoop install supabase`).

### Pasos:
1. **Iniciar sesión en Supabase CLI**:
   ```bash
   supabase login
   ```

2. **Vincular el proyecto local con tu proyecto en la nube**:
   > Copia el `Reference ID` de tu proyecto desde la consola de Supabase (Settings > API).
   ```bash
   supabase link --project-ref <TU_PROJECT_REF>
   ```

3. **Ejecutar las migraciones SQL en la base de datos de producción**:
   ```bash
   supabase db push
   ```
   *Esto aplicará el archivo `supabase/migrations/20260807000000_esquema_inicial.sql` creando las tablas `canciones`, `usuarios`, `partidas`, los triggers y las políticas de seguridad RLS.*

---

## 2. Publicación del Código con GitHub CLI (`gh`)

### Requisitos previos:
- Tener instalado [GitHub CLI](https://cli.github.com/).

### Pasos:
1. **Iniciar sesión en GitHub CLI** (si no lo has hecho):
   ```bash
   gh auth login
   ```

2. **Inicializar repositorio e interactuar con Git**:
   ```bash
   git init
   git add .
   git commit -m "feat: Detective de Musica MVP completo con Next.js 14 y Supabase"
   ```

3. **Crear el repositorio público en tu cuenta de GitHub y subir los cambios**:
   ```bash
   gh repo create detective-de-musica --public --source=. --remote=origin --push
   ```

---

## 3. Despliegue en Vercel con Vercel CLI (`vercel`)

### Requisitos previos:
- Tener instalado Vercel CLI (`npm i -g vercel`).

### Pasos:
1. **Iniciar sesión en Vercel**:
   ```bash
   vercel login
   ```

2. **Vincular el directorio del proyecto con Vercel**:
   ```bash
   vercel link
   ```

3. **Agregar las variables de entorno a Vercel**:
   Ejecuta cada comando e ingresa el valor de la clave correspondiente cuando te lo solicite el CLI:

   ```bash
   # URL pública de Supabase
   vercel env add NEXT_PUBLIC_SUPABASE_URL production

   # Anon Key pública de Supabase
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

   # Service Role Key privada de Supabase (para API routes)
   vercel env add SUPABASE_SERVICE_ROLE_KEY production

   # Key privada de Last.fm API
   vercel env add LASTFM_API_KEY production
   ```

4. **Desplegar a producción**:
   ```bash
   vercel --prod
   ```

---

## 🟢 ¡Listo!
Al finalizar `vercel --prod`, la terminal te devolverá la URL pública de tu aplicación en Vercel (por ejemplo: `https://detective-de-musica.vercel.app`).
