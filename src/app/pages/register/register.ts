import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterDto } from '../../models/auth.model';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  isloading = signal(false);
  errorMsg = signal("");


  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private service: Auth, private router: Router){
    this.registerForm = this.fb.group({
      nome: ['',Validators.required],
      data_nascimento: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      senha: ['',[Validators.required,Validators.minLength(4)]],
      senha_confirmacao: ['',[Validators.required,Validators.minLength(4)]]
    },
    {
      validator: passwordMatchValidator
    }
    );
  }

  onSubmit(){
    this.isloading.set(true);
    if(this.registerForm.invalid) return;

    // Adicionar validação da confirmação de senha, to pensando em ir corrigindo com o onChange pra ir aparecendo a senha vermelha enquanto forem diferentes

    // coletando dados do form e colocando na interface de registro
    const data: RegisterDto = {
      nome: this.registerForm.value.nome,
      data_nascimento: this.registerForm.value.data_nascimento,
      email: this.registerForm.value.email,
      senha: this.registerForm.value.senha
    }

    // enviando pro service fazer a requisição
    this.service.register(data).subscribe({
      next: () => {
        // registro deu certo
        alert("Cadastro realizado com sucesso! Faça seu login");
        this.isloading.set(false);

        this.router.navigate(["/login"]);
      },
      error: (err: HttpErrorResponse) =>{
        this.isloading.set(false);
        this.handleRegisterError(err);
      }
    });

    
  }

  handleRegisterError(err: HttpErrorResponse){
    if(err.status === 0){
      this.errorMsg.set("Não foi possível conectar ao servidor.");
    } else if( err.status === 401 || err.status === 403){
      this.errorMsg.set("Email ou senha inválidos");
    } else{
      this.errorMsg.set("Erro inesperado. Tente novamente");
    }
  }


  get f() { return this.registerForm.controls;} 
  
}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmacao = control.get('senha_confirmacao');

  // Só valida se ambos os campos existirem e o usuário já tiver tocado neles
  if (!senha || !confirmacao) {
    return null;
  }

  // Se forem iguais, retorna null (sem erro)
  // Se diferentes, retorna o objeto de erro { passwordMismatch: true }
  return senha.value === confirmacao.value ? null : { passwordMismatch: true };
};