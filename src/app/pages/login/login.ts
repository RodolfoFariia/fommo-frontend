import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

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

  constructor(private fb: FormBuilder, private router: Router, private service: Auth,private toastService: ToastService) {
    // Aqui definimos os campos e as regras (Validators)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    this.errorMsg.set("");
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
          //console.log("Token recebido:", response.token);

          this.toastService.success("Login realizado com sucesso. Bem-vindo!");
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

  handleLoginError(err: HttpErrorResponse) {
    
    if (err.status === 0) {
      this.toastService.error("Não foi possível conectar ao servidor. Verifique sua internet.");
    } 
    else if (err.status === 401 || err.status === 403) {
      // Erro de credencial é culpa do input -> MENSAGEM NO FORM (errorMsg)
      this.errorMsg.set("E-mail ou senha inválidos.");
    } 
    else {
      this.toastService.error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
  }
}

