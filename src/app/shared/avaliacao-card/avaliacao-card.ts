import { Component, input, OnInit, signal } from '@angular/core';
import { Album, Artist, Track } from '../../models/avalicao-card.model';
import { AvaliacaoResponse } from '../../models/avaliacao.model';
import { Spotify } from '../../services/spotify';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avaliacao-card',
  imports: [CommonModule],
  templateUrl: './avaliacao-card.html',
  styleUrl: './avaliacao-card.css',
})
export class AvaliacaoCard  implements OnInit{
  

  avaliacao = input.required<AvaliacaoResponse>();

  spotifyDetails = signal<Artist | Album | Track | null>(null);
  isLoading = signal(true);


  constructor(private spotifyService: Spotify){

  }

  ngOnInit(){
    this.loadSpotifyDetails();
  }

  loadSpotifyDetails(){
    // Pegar o id do item na avaliacao
    const {
      id_item_externo,
      tipo_item
    } = this.avaliacao();

    console.log("AQUI: "+tipo_item);

    this.spotifyService.getById(tipo_item, id_item_externo).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        
        // Coletando o objeto que veio preenchido
        if(response.album){
          this.spotifyDetails.set(response.album);
        }
        else if (response.artist){
          this.spotifyDetails.set(response.artist);
        }
        else{
          this.spotifyDetails.set(response.track);
        }

        console.log(this.spotifyDetails);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

}
