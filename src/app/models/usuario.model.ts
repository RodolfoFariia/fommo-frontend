export interface UsuarioUpdateRequest {
  nome?: string;
  email?: string;
  dataNascimento?: string; // Formato 'YYYY-MM-DD'
  senha?: string;
}