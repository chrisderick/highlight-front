export interface Musica {
  id: number;
  artist_id: number;
  title: string;
  release_year: number | null;
  created_at: string;
}

export interface CriarMusicaRequest {
  title: string;
  release_year?: number;
}

export interface EditarMusicaRequest {
  title: string;
  release_year: number | null;
}
