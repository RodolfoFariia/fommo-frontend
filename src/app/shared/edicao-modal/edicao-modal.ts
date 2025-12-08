import { Component, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditEvent } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edicao-modal',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edicao-modal.html',
  styleUrl: './edicao-modal.css',
})
export class EdicaoModal implements OnInit {

  dataEdit = input.required<EditEvent>();

  avaliacaoForm: FormGroup;

  isEditing = signal(false);

  constructor(
    private fb: FormBuilder
  ){
    this.avaliacaoForm = this.fb.group(
      {
        nota: ['',[Validators.required,Validators.max(5),Validators.min(1)]],
        titulo: ['', [Validators.required, Validators.maxLength(20)]],
        textoAvaliacao: ['', [Validators.required, Validators.maxLength(200)]]
      }
    );
  }

  ngOnInit(): void {
    this.loadAvaliacaoData();
  }


  loadAvaliacaoData(){
    this.avaliacaoForm.patchValue({
      nota: this.dataEdit().avaliacao.nota,
      titulo: this.dataEdit().avaliacao.titulo,
      textoAvaliacao: this.dataEdit().avaliacao.texto_avaliacao
    });
  }

  fecharModal(){
    
  }

  toggleEdit(){

  }

  deleteAvaliacao(){

  }

  saveChanges(){

  }

}
