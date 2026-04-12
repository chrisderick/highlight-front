export interface Artista {
  id: number;
  name: string;
  created_at: string;
}

export interface CriarArtistaRequest {
  name: string;
}
