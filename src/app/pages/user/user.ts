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
    // busca informações do usuário
    this.loadUserData();

    // busca avaliações feitas pelo usuário
    this.loadAvaliacoes();

  }

  loadAvaliacoes(){
    this.loadingAvaliacoes.set(true);
    console.log(this.id_user())

    this.avaliacaoService.getByUsuario().subscribe(response => {
      this.loadingAvaliacoes.set(false);

      this.avaliacoesResponse.set(response);
      console.log(this.avaliacoesResponse);
    });
  }

  loadUserData(){
    this.userService.getMe().subscribe(user => {
      // preenche o formulário com os dados do backend
      console.log(user.data_nascimento);

      this.id_user.set(user.idUsuario);

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
          console.error(err);
        }
      })
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

