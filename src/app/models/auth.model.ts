// Definindo o que enviamos ao backend na solicitação de login
export interface LoginRequest{
    email: string;
    senha: string;
}

// definindo o que recebemos do back 
export interface LoginResponse{
    token: string;
}

export interface UsuarioResponse {
  idUsuario: number;
  nome: string;
  email: string;
  data_nascimento: string;
}


// Definindo interfaces que são utilizadas para registro de um perfil
export interface RegisterDto{
  nome: string,
  data_nascimento: string,
  email: string,
  senha: string
}