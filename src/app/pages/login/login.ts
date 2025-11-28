import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

 loginForm: FormGroup;

 loading = signal(false); // signal para alterar o button para estado de carregando
 errorMsg = signal(""); // signal para guardar a mensagem de erro retornada pelo http (caso ocorra)

  constructor(private fb: FormBuilder, private router: Router, private service: Auth) {
    // Aqui definimos os campos e as regras (Validators)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    this.loading.set(true);
    if (this.loginForm.valid) {
      // Coletando dados do formulário e colocando na interface de request para enviar ao back
      const data: LoginRequest = {
        email: this.loginForm.value.email,
        senha: this.loginForm.value.senha
      };

      this.service.sendLogin(data).subscribe({
        next: (response: LoginResponse) => {
          this.loginForm.reset();
          this.loading.set(false);
          console.log("Token recebido:", response.token);

          // token foi salvo pelo tap la no service, redireciona para o dashboard
          this.router.navigate(['/dashboard'])

        },
        error: (err: HttpErrorResponse) =>{
        this.loading.set(false);
        this.handleLoginError(err);
      }
      });

    }
  }

  handleLoginError(err: HttpErrorResponse){
    if(err.status === 0){
      this.errorMsg.set("Não foi possível conectar ao servidor.");
    } else if( err.status === 401 || err.status === 403){
      this.errorMsg.set("Email ou senha inválidos");
    } else{
      this.errorMsg.set("Erro inesperado. Tente novamente");
    }
  }
}

