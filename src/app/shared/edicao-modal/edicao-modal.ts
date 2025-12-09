import { Component, EventEmitter, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditEvent } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { Avaliacao } from '../../services/avaliacao';
import { AvaliacaoUpdate } from '../../models/avaliacao.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-edicao-modal',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edicao-modal.html',
  styleUrl: './edicao-modal.css',
})
export class EdicaoModal implements OnInit {


  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  
  dataEdit = input.required<EditEvent>();

  avaliacaoForm: FormGroup;
  isEditing = signal(false);
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private avaliacaoService: Avaliacao,
    private toastService: ToastService 
  ){
    this.avaliacaoForm = this.fb.group({
      nota: ['', [Validators.required, Validators.max(5), Validators.min(0)]],
      titulo: ['', [Validators.required, Validators.maxLength(20)]],
      textoAvaliacao: ['', [Validators.required, Validators.maxLength(200)]]
    });

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
      
      this.avaliacaoService.deleteAvaliacao(this.dataEdit().avaliacao.id_avaliacao).subscribe({
        next: () => {
          this.toastService.success("Avaliação excluída com sucesso.");
          this.refreshFunction();
          this.fecharModal();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error("Erro ao excluir avaliação. Tente novamente.");
        }
      });
    }
  }

  saveChanges(){
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
          this.isLoading.set(false); 
          
          this.toastService.success("Avaliação atualizada com sucesso!");
          
          this.isEditing.set(false);
          this.avaliacaoForm.reset();
          
          this.refreshFunction(); 
          this.fecharModal();     
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err);
          
          if (err.status === 403) {
             this.toastService.error("Sessão expirada. Faça login novamente.");
          } else {
             this.toastService.error("Erro ao salvar. Tente novamente.");
          }
        }
      });
  }
}