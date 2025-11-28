import { Component , OnInit, Signal, WritableSignal} from '@angular/core';
import { RouterLink} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header{



  isLogged: Signal<boolean>; 
  userName: WritableSignal<string>;

  constructor(private auth: Auth) {
    this.isLogged = this.auth.isLogged;
    this.userName = this.auth.userName;
  }

  logout(){
    this.auth.logout();
  }
    
}
