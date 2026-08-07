export type TipoPista = 'anio' | 'genero' | 'colaboradores' | 'letra' | 'audio';

export interface Pista {
  orden: number;
  tipo: TipoPista;
  titulo: string;
  contenido: string;
}

export interface Cancion {
  id: string;
  titulo: string;
  artista: string;
  album: string | null;
  anio: number | null;
  pistas: Pista[];
  preview_url: string | null;
  creado_en?: string;
}

export interface Usuario {
  id: string;
  email: string | null;
  nombre: string | null;
  avatar_url: string | null;
  creado_en?: string;
}

export interface Partida {
  id: string;
  usuario_id: string;
  cancion_id: string;
  pistas_usadas: number;
  acerto: boolean;
  puntaje: number;
  creado_en?: string;
  canciones?: Cancion;
  usuarios?: Usuario;
}

export interface SongInput {
  artist: string;
  track: string;
}
