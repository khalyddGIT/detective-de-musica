-- Migration: 20260807000000_esquema_inicial.sql
-- Descripción: Esquema inicial para "Detective de Música"
-- Tablas: canciones, usuarios, partidas + Triggers + Políticas RLS

-- 1. TABLA CANCIONES
CREATE TABLE IF NOT EXISTS public.canciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    artista TEXT NOT NULL,
    album TEXT,
    anio INTEGER,
    pistas JSONB NOT NULL,
    preview_url TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentario explicativo de la estructura del JSONB de pistas
COMMENT ON COLUMN public.canciones.pistas IS 'Array de objetos JSON conteniendo las pistas en orden de dificultad decreciente. Ejemplo: [{"orden": 1, "tipo": "anio", "descripcion": "Año de lanzamiento", "valor": "2015"}]';

-- Index para búsquedas aleatorias o filtros por año/artista
CREATE INDEX IF NOT EXISTS idx_canciones_artista ON public.canciones(artista);
CREATE INDEX IF NOT EXISTS idx_canciones_anio ON public.canciones(anio);


-- 2. TABLA USUARIOS (Perfil público sincronizado con auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nombre TEXT,
    avatar_url TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_nombre ON public.usuarios(nombre);


-- 3. TRIGGER PARA SINCRONIZAR AUTH.USERS CON PUBLIC.USUARIOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, nombre, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

-- Trigger ejecutado tras el registro de un nuevo usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. TABLA PARTIDAS
CREATE TABLE IF NOT EXISTS public.partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    cancion_id UUID NOT NULL REFERENCES public.canciones(id) ON DELETE CASCADE,
    pistas_usadas INTEGER NOT NULL DEFAULT 1 CHECK (pistas_usadas >= 1),
    acerto BOOLEAN NOT NULL DEFAULT false,
    puntaje INTEGER NOT NULL DEFAULT 0 CHECK (puntaje >= 0),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultar el historial de un usuario y el Leaderboard global
CREATE INDEX IF NOT EXISTS idx_partidas_usuario_id ON public.partidas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_partidas_puntaje ON public.partidas(puntaje DESC);
CREATE INDEX IF NOT EXISTS idx_partidas_creado_en ON public.partidas(creado_en DESC);


-- 5. CONFIGURACIÓN DE SEGURIDAD (ROW LEVEL SECURITY - RLS)

-- Habilitar RLS en todas las tablas
ALTER TABLE public.canciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidas ENABLE ROW LEVEL SECURITY;

-- 5.1 POLÍTICAS PARA CANCIONES
-- Todos los usuarios (autenticados o anónimos) pueden leer canciones
CREATE POLICY "Permitir lectura publica de canciones"
    ON public.canciones
    FOR SELECT
    TO public
    USING (true);

-- Solo el rol service_role (backend/administrador) puede insertar, modificar o borrar canciones
CREATE POLICY "Solo service_role modifica canciones"
    ON public.canciones
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5.2 POLÍTICAS PARA USUARIOS
-- Lectura pública para poder mostrar nombres y perfiles en el Leaderboard
CREATE POLICY "Permitir lectura publica de usuarios"
    ON public.usuarios
    FOR SELECT
    TO public
    USING (true);

-- Los usuarios autenticados solo pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.usuarios
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 5.3 POLÍTICAS PARA PARTIDAS
-- Lectura pública de partidas (necesario para Leaderboard global e historial)
CREATE POLICY "Permitir lectura publica de partidas"
    ON public.partidas
    FOR SELECT
    TO public
    USING (true);

-- Los usuarios autenticados solo pueden insertar partidas asociadas a su propio usuario_id
CREATE POLICY "Usuarios pueden registrar sus propias partidas"
    ON public.partidas
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = usuario_id);

-- Los usuarios pueden modificar únicamente sus propias partidas si fuera necesario
CREATE POLICY "Usuarios pueden actualizar sus propias partidas"
    ON public.partidas
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = usuario_id)
    WITH CHECK (auth.uid() = usuario_id);


-- 6. DATOS DE PRUEBA / SEMILLA (OPCIONAL DE EJEMPLO)
INSERT INTO public.canciones (titulo, artista, album, anio, preview_url, pistas)
VALUES 
(
    'Blinding Lights',
    'The Weeknd',
    'After Hours',
    2019,
    'https://cdns-preview-e.dzcdn.net/stream/c-e771113e00d2b14502b66236b2b73b22-4.mp3',
    '[
        {"orden": 1, "tipo": "anio", "titulo": "Pista 1: Año de lanzamiento", "contenido": "Lanzada a finales de 2019 como sencillo principal de un álbum aclamado."},
        {"orden": 2, "tipo": "genero", "titulo": "Pista 2: Género y Estilo", "contenido": "Synthwave, Synth-pop, electropop con una fuerte influencia ochentera."},
        {"orden": 3, "tipo": "colaboradores", "titulo": "Pista 3: Álbum y Producción", "contenido": "Producida por Max Martin y Oscar Holter. Pertenece al álbum After Hours."},
        {"orden": 4, "tipo": "letra", "titulo": "Pista 4: Fragmento de letra", "contenido": "I said, ooh, I''m blinded by the lights / No, I can''t sleep until I feel your touch..."},
        {"orden": 5, "tipo": "audio", "titulo": "Pista 5: Preview de Audio", "contenido": "Fragmento de 30 segundos disponible"}
    ]'::jsonb
),
(
    'Bohemian Rhapsody',
    'Queen',
    'A Night at the Opera',
    1975,
    'https://cdns-preview-8.dzcdn.net/stream/c-88ab8872b226e64c23f77ea63098e986-5.mp3',
    '[
        {"orden": 1, "tipo": "anio", "titulo": "Pista 1: Década de lanzamiento", "contenido": "Publicada en la década de 1970 (1975)."},
        {"orden": 2, "tipo": "genero", "titulo": "Pista 2: Género y Estilo", "contenido": "Rock progresivo, Opera rock, Hard rock sin estribillo tradicional."},
        {"orden": 3, "tipo": "colaboradores", "titulo": "Pista 3: Álbum y Artista", "contenido": "Escrita por Freddie Mercury para la mítica banda británica Queen. Álbum: A Night at the Opera."},
        {"orden": 4, "tipo": "letra", "titulo": "Pista 4: Fragmento de letra", "contenido": "Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality..."},
        {"orden": 5, "tipo": "audio", "titulo": "Pista 5: Preview de Audio", "contenido": "Fragmento de 30 segundos disponible"}
    ]'::jsonb
);
