import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Avaliacao } from '../../services/avaliacao';
import { AvaliacaoCard } from '../../shared/avaliacao-card/avaliacao-card';
import { AvaliacaoResponse } from '../../models/avaliacao.model';
import { Album, Artist, Track } from '../../models/avalicao-card.model';
import { EditEvent } from '../../models/usuario.model';
import { EdicaoModal } from '../../shared/edicao-modal/edicao-modal';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule,AvaliacaoCard,EdicaoModal],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User  implements OnInit{

  userForm: FormGroup;
  passwordForm: FormGroup;

  isEditing = signal(false);
  isLoading = signal(false);
  changingPassword = signal(false);

  avaliacoesResponse = signal<AvaliacaoResponse[] | null> (null);
  loadingAvaliacoes = signal(false);
  id_user = signal(1);

  dataEdit = signal<EditEvent | null>(null);

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private avaliacaoService: Avaliacao,
    private router: Router,
    private toastService: ToastService
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
    // busca informações do usuário
    this.loadUserData();

    // busca avaliações feitas pelo usuário
    this.loadAvaliacoes();

  }

  loadAvaliacoes() {
    this.loadingAvaliacoes.set(true);

    this.avaliacaoService.getByUsuario().subscribe({
      next: (response) => {
        this.loadingAvaliacoes.set(false);
        this.avaliacoesResponse.set(response);
      },
      error: (err) => {
        this.loadingAvaliacoes.set(false);
        console.error(err);
        this.toastService.error("Não foi possível carregar suas avaliações.");
      }
    });
  }

  loadUserData() {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.id_user.set(user.idUsuario);
        
        this.userForm.patchValue({
          nome: user.nome,
          email: user.email,
          dataNascimento: user.data_nascimento
        });
      },
      error: (err) => {
        console.error(err);
        // Se falhar ao carregar o usuário, provavelmente o token morreu
        this.toastService.error("Erro ao carregar perfil. Faça login novamente.");
        this.router.navigate(['/login']);
      }
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
        this.toastService.success('Perfil atualizado com sucesso!');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        if (err.status === 409) {
           this.toastService.error('Este email já está em uso.');
        } else {
           this.toastService.error('Erro ao atualizar perfil. Tente novamente.');
        }
      }
    });
  }

  deleteAccount() {
    if(confirm("Tem certeza? Essa ação não pode ser desfeita e apagará todas as suas avaliações.")) {
      this.userService.deleteMe().subscribe({
        next: () => {
          this.toastService.success("Sua conta foi excluída. Sentiremos saudades!");
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          this.toastService.error("Não foi possível excluir a conta. Tente novamente.");
        }
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

  changePassword() {
    if (!this.passwordForm.valid) {
      this.toastService.error("A senha deve ter no mínimo 4 caracteres.");
      return;
    }

    if (confirm("Tem certeza? A ação de alterar sua senha não poderá ser desfeita.")) {
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.toastService.success("Senha alterada com sucesso!");
          this.closePasswordModal();
        },
        error: (err) => {
          console.error(err);
          
          // Tratamento específico para senha antiga errada
          if (err.status === 400 || err.status === 401 || err.status === 403) {
            this.toastService.error("A senha antiga está incorreta.");
          } else {
            this.toastService.error("Erro ao alterar a senha.");
          }
        }
      });
    }
  }

  openModalAvaliacao(data: EditEvent){
    //console.log("Clicou na avaliacao");

    this.dataEdit.set(data);

    console.log(this.dataEdit())


  }


  closeModalAvaliacao() {
    this.dataEdit.set(null);
  }


  refreshFunction(){
    this.loadAvaliacoes();
  }
}

