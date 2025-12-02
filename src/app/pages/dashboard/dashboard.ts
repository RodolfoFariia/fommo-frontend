import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { SearchQuery, SpotifyResponse } from '../../models/dashboard.model';
import { Spotify } from '../../services/spotify';
import { MusicCard } from '../../shared/music-card/music-card';
import { CardItem } from '../../models/music-card.model';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MusicCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  searchForm: FormGroup;

  searching = signal(false);
  results = signal<SpotifyResponse | null>(null);
  hasSearched = signal(false);

  searchTypes = [
    {label: "Álbum", value: "album"},
    {label: "Artista", value: "artist"},
    {label: "Música", value: "track"}
  ];

  constructor(private fb: FormBuilder, private spotifyService: Spotify){
    this.searchForm = this.fb.group({
      query: [''],
      type: ['album'] // valor inicial do select
    })
  }

  search(){
    this.searching.set(true);
    // coletar o valor do select, e do input
    const data: SearchQuery = {
      q: this.searchForm.value.query,
      type: this.searchForm.value.type
    }
    // chamar service do spotify
    
    this.spotifyService.search(data).subscribe({
      next: (resposta) => {
        this.searching.set(false);

        this.results.set(resposta);
        console.log(resposta);
      },
      error: (err) => {
        this.searching.set(false);
        console.error(err);
      }
    }

    );
  }


  // sinal que ao acionado transforma o resultado do spotify em CardItems adequados
  displayItems = computed<CardItem[]>(() => {
    const rawData = this.results();

    if(!rawData) return []; // caso não tenha recebido resultado algum, retorna lista vazia

    if(rawData.albums){
      return rawData.albums.items.map(album =>({
        id: album.id,
        imageUrl: album.images[0].url,
        title: album.name,
        subtitle: "Álbum",
        type: 'ALBUM'
      }));
    }

    else if (rawData.artists){
      return rawData.artists.items.map(artist =>({
        id: artist.id,
        imageUrl: artist.images?.[0]?.url,
        title: artist.name,
        subtitle: "Artista",
        type: 'ARTISTA'
      }));
    }

     else if (rawData.tracks){
      return rawData.tracks.items.map(track =>({
        id: track.id,
        imageUrl: track.album.images?.[0]?.url,
        title: track.name,
        subtitle: 'Música',
        type: 'MUSICA'
      }));
    }

    return [];
  })

}
