import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, UsuarioResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private endpointServer = "http://localhost:8080";

  public isLogged = signal<boolean>(!!localStorage.getItem('token'));
  public userName = signal<string>('');

  constructor(private http: HttpClient, private router: Router){
    console.log('Auth Service criado');
    if (this.isLogged()) {
      this.getUserProfile();
    }
  }

  sendLogin(data: LoginRequest): Observable<LoginResponse>{
      return this.http.post<LoginResponse>(`${this.endpointServer}/auth/login`, data).pipe(
        tap((response) =>{
          console.log(response.token);
          localStorage.setItem("token",response.token)
          this.isLogged.set(true);

          this.getUserProfile();
        })
      );
  }

  logout(){
    localStorage.removeItem('token');
    this.isLogged.set(false);
    this.userName.set("");
    this.router.navigate(["/login"]);
  }

  getUserProfile(){
    this.http.get<UsuarioResponse>(`${this.endpointServer}/usuario/me`).subscribe({
      next: (user) => {
        this.userName.set(user.nome);
      }, 
      error: (err) => {
        console.error("Erro ao buscar perfil", err);
        if (err.status === 403) this.logout();
      } 
    })

  }
}


