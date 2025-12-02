import { Component , computed, inject, OnInit, Signal, WritableSignal} from '@angular/core';
import { RouterLink} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Logo } from '../logo/logo';

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
