import { AvaliacaoResponse } from "./avaliacao.model";
import { Album, Artist, Track } from "./avalicao-card.model";

export interface UsuarioUpdateRequest {
  nome?: string;
  email?: string;
  dataNascimento?: string; // Formato 'YYYY-MM-DD'
  senha?: string;
}

export interface SenhaUpdateRequest{
  senha_antiga: string;
  senha_nova: string;
}

export interface EditEvent {
  avaliacao: AvaliacaoResponse;
  spotifyItem: Artist | Album | Track; 
}