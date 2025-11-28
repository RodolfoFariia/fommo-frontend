import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {

  // injetando as depedências do service de login e do router de páginas
  const authService = inject(Auth);
  const router = inject(Router);

  // usuário logado manda pro dashboard e retorna false
  if (authService.isLogged()){
    router.navigate(['/dashboard']);
    return false;
  } else{
    // usuário deslogado retorna true
    return true;
  }
};
