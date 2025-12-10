import { Component, EventEmitter, input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardItem } from '../../models/music-card.model';
import { Avaliacao } from '../../services/avaliacao';
import { AvaliacaoRequest } from '../../models/avaliacao.model';
import { ToastService } from '../../services/toast.service'; 

@Component({
  selector: 'app-avaliacao-modal',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './avaliacao-modal.html',
  styleUrl: './avaliacao-modal.css',
})
export class AvaliacaoModal implements OnInit {

  @Output() close = new EventEmitter<void>();

  reviews = signal<any[] | null>(null);
  
  isCreating = signal(false);
  isLoading = signal(false);

  avaliacaoForms: FormGroup;
  item = input.required<CardItem>();

  constructor(
    private fb: FormBuilder, 
    private service: Avaliacao,
    private toastService: ToastService 
  ){
    this.avaliacaoForms = this.fb.group({
      nota: ['', [Validators.required, Validators.max(5), Validators.min(0)]],
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      textoAvaliacao: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }  

  ngOnInit(): void {
    this.carregarAvaliacoes();
  }

  carregarAvaliacoes(){
    this.isLoading.set(true); 
    
    const spotifyId = this.item().id;

    this.service.findByIdSpotify(spotifyId).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.reviews.set(response);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        this.toastService.error("Não foi possível carregar as avaliações.");
      }
    });
  }

  cancelar(){
    if(this.isCreating()){
      this.isCreating.set(false);
      this.avaliacaoForms.reset();
    } else{
      this.close.emit();
    }
  }

  fecharModalTotal(){
    this.close.emit();
  }

  cadastrar(){
    if(this.avaliacaoForms.invalid) return;

    this.isLoading.set(true);

    const data: AvaliacaoRequest = { 
      titulo: this.avaliacaoForms.value.titulo,
      textoAvaliacao: this.avaliacaoForms.value.textoAvaliacao,
      nota: this.avaliacaoForms.value.nota,
      tipo_item: this.item().type,
      id_item_externo: this.item().id
    };

    this.service.cadastrarAvaliacao(data).subscribe({
      next: () => {
        this.isLoading.set(false); 
        
        
        this.toastService.success("Avaliação publicada com sucesso!");
        
        this.avaliacaoForms.reset();
        this.isCreating.set(false); 
        
        
        this.carregarAvaliacoes(); 
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        

        if (err.status === 403) {
           this.toastService.error("Sessão expirada. Faça login novamente.");
        } else {
           this.toastService.error("Erro ao publicar avaliação.");
        }
      }
    });
  }

  formatarNota(){
    const control = this.avaliacaoForms.get('nota');

    if(control?.value !== null && control?.value !== ''){
      let valor = parseFloat(control?.value);

      // definindo limites
      if (valor > 5) valor = 5;
      if (valor < 0) valor = 0;

      const valorFormatado = Math.round(valor * 10) / 10; // arredondando para somente uma casa decimal sempre

      control?.setValue(valorFormatado)
    }
  }
}