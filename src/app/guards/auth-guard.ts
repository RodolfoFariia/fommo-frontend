import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  // injetando as depedências do service de login e do router de páginas
  const authService = inject(Auth);
  const router = inject(Router);

  // usuário logado retorna true
  if (authService.isLogged()){
    return true;
  } else{
    // usuário deslogado manda pro login e e retorna false
    router.navigate(['/login']);
    return false;
  }

};
