import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // 1. Pega o token do localStorage
  const token = localStorage.getItem('token');

  // 2. Se o token existir, CLONA a requisição e adiciona o cabeçalho
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Passa a requisição clonada (com o "crachá") para frente
    return next(clonedRequest);
  }

  // 3. Se não tiver token (ex: login), passa a requisição original sem mexer
  return next(req);
};