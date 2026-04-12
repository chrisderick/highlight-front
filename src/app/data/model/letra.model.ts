export interface Letra {
  id: number;
  song_id: number;
  language: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

export interface CriarLetraRequest {
  language: string;
  content: string;
}

export interface EditarLetraRequest {
  language: string;
  content: string;
}
