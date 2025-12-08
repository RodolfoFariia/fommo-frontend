import { Component, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
import { CardItem } from '../../models/music-card.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avaliacao } from '../../services/avaliacao';
import { AvaliacaoRequest } from '../../models/avaliacao.model';

@Component({
  selector: 'app-avaliacao-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './avaliacao-modal.html',
  styleUrl: './avaliacao-modal.css',
})
export class AvaliacaoModal  implements OnInit{

  // construindo um emissor de evendos para saída
  @Output() close = new EventEmitter<void>();


  // signal para armazenar as reviewns que vem do banco
  reviews = signal<any[] | null>(null);

  // signal para a tela da direita -> alternar entre reviews e cadastro de avaliações
  isCreating = signal(false);
  isLoading = signal(false);

  // forms para cadastro de avaliação
  avaliacaoForms: FormGroup;

  item = input.required<CardItem>();

  constructor( private fb: FormBuilder, private service: Avaliacao){


    this.avaliacaoForms = this.fb.group({
      nota: ['',[Validators.required, Validators.max(5),Validators.min(1)]],
      titulo: ['', [Validators.required, Validators.maxLength(20)]],
      textoAvaliacao: ['', [Validators.required, Validators.maxLength(200)]]
    });

  }  

  // Inicialização, para ir no banco buscar as reviews que possuam o msm id do spotify
  ngOnInit(): void {
    this.carregarAvaliacoes();
  }

  carregarAvaliacoes(){
    const spotifyId = this.item().id;
    console.log(spotifyId);

    this.service.findByIdSpotify(spotifyId).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        this.reviews.set(response);
        console.log(this.reviews);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
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
    // verificar se o form é valido
    if(this.avaliacaoForms.invalid){
      return;
    }



    this.isLoading.set(true);

    const data: AvaliacaoRequest = { 
      titulo: this.avaliacaoForms.value.titulo,
      textoAvaliacao: this.avaliacaoForms.value.textoAvaliacao,
      nota:this.avaliacaoForms.value.nota,
      tipo_item: this.item().type,
      id_item_externo: this.item().id
    };

    console.log(data);


    this.service.cadastrarAvaliacao(data).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert("Avaliação Cadastrada com Sucesso!");
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }


  

}
