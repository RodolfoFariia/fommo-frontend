import { Component , computed, inject} from '@angular/core';
import { RouterLink} from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header{
  private auth = inject(Auth);


  isLogged = this.auth.isLogged;

  userName = computed(() => {
    // pega o nome completo do usuário logado
    const nomeCompleto = this.auth.userName();
    if(!nomeCompleto) return '';

    // retorna somente o primeiro nome 
    return nomeCompleto.split(" ")[0];
  });


  constructor() {
  }

  logout(){
    this.auth.logout();
  }
    
}
