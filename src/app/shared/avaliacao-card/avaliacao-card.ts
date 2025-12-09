import { Component, input, OnInit, output, signal } from '@angular/core';
import { Album, Artist, Track } from '../../models/avalicao-card.model';
import { AvaliacaoResponse } from '../../models/avaliacao.model';
import { Spotify } from '../../services/spotify';
import { CommonModule } from '@angular/common';
import { EditEvent } from '../../models/usuario.model';
import { ToastService } from '../../services/toast.service'; 

@Component({
  selector: 'app-avaliacao-card',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './avaliacao-card.html',
  styleUrl: './avaliacao-card.css',
})
export class AvaliacaoCard implements OnInit {
  
  avaliacao = input.required<AvaliacaoResponse>();
  editar = output<EditEvent>();

  spotifyDetails = signal<Artist | Album | Track | null>(null);
  isLoading = signal(true);

  constructor(
    private spotifyService: Spotify,
    private toastService: ToastService 
  ){}

  ngOnInit(){
    this.loadSpotifyDetails();
  }

  loadSpotifyDetails(){
    const { id_item_externo, tipo_item } = this.avaliacao();

    this.spotifyService.getById(tipo_item, id_item_externo).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        
        
        if(response.album){
          this.spotifyDetails.set(response.album);
        }
        else if (response.artist){
          this.spotifyDetails.set(response.artist);
        }
        else{
          this.spotifyDetails.set(response.track);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
        // não tem o toast para caso carregue uma lista grande e a API falhe em todos, não dar spam de erros.
      }
    });
  }

  // Método acionado ao clicar no card
  clickCard(){
    const details = this.spotifyDetails();

    if(details){
      this.editar.emit({
        avaliacao: this.avaliacao(),
        spotifyItem: details
      });
    } else {
      this.toastService.error("Não foi possível carregar os detalhes deste item.");
    }
  }
}