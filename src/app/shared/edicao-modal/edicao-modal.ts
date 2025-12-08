import { Component, EventEmitter, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditEvent } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { Avaliacao } from '../../services/avaliacao';
import { AvaliacaoUpdate } from '../../models/avaliacao.model';

@Component({
  selector: 'app-edicao-modal',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edicao-modal.html',
  styleUrl: './edicao-modal.css',
})
export class EdicaoModal implements OnInit {

  // construindo um emissor de evendos para saída
  @Output() close = new EventEmitter<void>();

  // construindo um emissor de eventos para atualizar o pai que precisa atualizar 
  // as avaliações da tela
  @Output() refresh = new EventEmitter<void>();

  dataEdit = input.required<EditEvent>();

  avaliacaoForm: FormGroup;

  isEditing = signal(false);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private avaliacaoService: Avaliacao
  ){
    this.avaliacaoForm = this.fb.group(
      {
        nota: ['',[Validators.required,Validators.max(5),Validators.min(1)]],
        titulo: ['', [Validators.required, Validators.maxLength(20)]],
        textoAvaliacao: ['', [Validators.required, Validators.maxLength(200)]]
      }
    );

    this.avaliacaoForm.disable();
  }

  ngOnInit(): void {
    this.loadAvaliacaoData();
  }

  refreshFunction(){
    this.refresh.emit();
  }


  loadAvaliacaoData(){
    this.avaliacaoForm.patchValue({
      nota: this.dataEdit().avaliacao.nota,
      titulo: this.dataEdit().avaliacao.titulo,
      textoAvaliacao: this.dataEdit().avaliacao.texto_avaliacao
    });
  }

  fecharModal(){
    this.close.emit();
  }

  toggleEdit(){
    if(this.isEditing()){
      this.isEditing.set(false);
      this.avaliacaoForm.disable();
      this.loadAvaliacaoData();
    } else{
      this.isEditing.set(true);
      this.avaliacaoForm.enable();
    }
    
  }

  deleteAvaliacao(){
    if(confirm("Tem certeza? Essa ação não pode ser desfeita e apagará a avaliação!")){
      this.avaliacaoService.deleteAvaliacao(this.dataEdit().avaliacao.id_avaliacao).subscribe(() => {
        this.refreshFunction();
        this.fecharModal();
      });
    }
  }

  saveChanges(){

    // verificar se o modal é valido, lançar um erro dps
    if (this.avaliacaoForm.invalid) return;

    this.isLoading.set(true);

    const data = <AvaliacaoUpdate>{
      nota: this.avaliacaoForm.value.nota,
      titulo: this.avaliacaoForm.value.titulo,
      textoAvaliacao: this.avaliacaoForm.value.textoAvaliacao
    }

    this.avaliacaoService.updateAvaliacao(
      data, this.dataEdit().avaliacao.id_avaliacao).subscribe({
        next: () => {
          alert("Avaliação atualizada com sucesso!");
          this.isEditing.set(false);
          this.avaliacaoForm.reset();

          // recarregando dados da avaliação para garantir que apareça os dados atualizados
          this.fecharModal();
          this.refreshFunction();
        },
        error: (err) => {
          this.isEditing.set(false);
          alert("Erro ao atualizar avaliação");
          console.error(err);
        }
      });

  }

}
