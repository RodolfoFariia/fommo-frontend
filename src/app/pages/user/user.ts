import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User  implements OnInit{

  userForm: FormGroup;
  passwordForm: FormGroup;

  isEditing = signal(false);
  isLoading = signal(false);
  changingPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private router: Router
  ){
    this.userForm = this.fb.group(
      {
        nome: ['', Validators.required],
        email: ['', [Validators.required,Validators.email]],
        dataNascimento: ['', Validators.required],
      }
    );

    this.passwordForm = this.fb.group(
      {
        senha_antiga: ['', [Validators.required, Validators.minLength(1)]], // adicionar restante dos requisitos de senha
        senha_nova: ['', [Validators.required, Validators.minLength(1)]]
      }
    );

    this.userForm.disable();
  }

  ngOnInit(){
    this.loadUserData();
  }

  loadUserData(){
    this.userService.getMe().subscribe(user => {
      // preenche o formulário com os dados do backend
      console.log(user.data_nascimento);
      this.userForm.patchValue({
        nome: user.nome,
        email: user.email,
        dataNascimento: user.data_nascimento // Formato YYYY-MM-DD funciona direto no input date
      });
    });
  }

  toggleEdit() {
    if (this.isEditing()) {
      this.userForm.disable();
      this.isEditing.set(false);
      this.loadUserData(); // Reseta para o valor original
    } else {
  
      this.userForm.enable();
      this.isEditing.set(true);
    }
  }

  saveChanges() {
    if (this.userForm.invalid) return;

    this.isLoading.set(true);
    this.userService.updateMe(this.userForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isEditing.set(false);
        this.userForm.disable();
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        alert('Erro ao atualizar.');
      }
    });
  }

  deleteAccount() {
    if(confirm("Tem certeza? Essa ação não pode ser desfeita e apagará todas as suas avaliações.")) {
      this.userService.deleteMe().subscribe(() => {
        // Logout forçado
        localStorage.clear();
        this.router.navigate(['/login']);
      });
    }
  }

  setChangePassword(){
    this.changingPassword.set(true);
  }

  closePasswordModal(){
    this.changingPassword.set(false);
    this.passwordForm.reset();
  }

  changePassword(){
    // validação do forms antes de enviar
    if(!this.passwordForm.valid){
      alert("Preencha os campos corretamente!");
      return;
    }


    if(confirm("Tem certeza? A ação de alterar sua senha, não poderá ser desfeita.")){
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          alert("Senha alterada com sucesso!");
          this.changingPassword.set(false);
          this.passwordForm.reset();
        },
        error: (err) => {
          alert("Erro ao alterar a senha.");
        }
      })
    }
  }
}
