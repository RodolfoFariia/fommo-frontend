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