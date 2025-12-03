import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { SearchQuery, SpotifyResponse } from '../../models/dashboard.model';
import { Spotify } from '../../services/spotify';
import { MusicCard } from '../../shared/music-card/music-card';
import { CardItem } from '../../models/music-card.model';
import { AvaliacaoModal } from '../../shared/avaliacao-modal/avaliacao-modal';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, MusicCard, AvaliacaoModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  searchForm: FormGroup;

  searching = signal(false);
  results = signal<SpotifyResponse | null>(null);
  hasSearched = signal(false);


  // signal que controla o modal
  selectedItem = signal<CardItem | null>(null);

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
  // O Mapeamento Inteligente
  displayItems = computed<CardItem[]>(() => {
    const rawData = this.results();
    if (!rawData) return [];

    // 1. Mapeamento de ÁLBUNS
    if (rawData.albums) {
      return rawData.albums.items.map(album => ({
        id: album.id,
        imageUrl: album.images?.[0]?.url || 'assets/images/default.png',
        title: album.name,
        subtitle: 'Álbum',
        type: 'ALBUM',
        externalUrl: `https://open.spotify.com/album/${album.id}`, // Link direto
        
        // Preenchendo os detalhes extras para o Modal
        albumData: {
          releaseDate: album.release_date || 'Desconhecido',
          totalTracks: album.total_tracks || 0,
          // Mapeia a lista de artistas para um array de strings
          artistNames: album.artists?.map(a => a.name) || []
        }
      }));
    } 
    
    // 2. Mapeamento de ARTISTAS
    else if (rawData.artists) {
      return rawData.artists.items.map(artist => ({
        id: artist.id,
        imageUrl: artist.images?.[0]?.url || 'assets/images/default.png',
        title: artist.name,
        subtitle: 'Artista',
        type: 'ARTISTA',
        externalUrl: `https://open.spotify.com/artist/${artist.id}`
        // Artista não tem dados extras por enquanto
      }));
    }
    
    // 3. Mapeamento de MÚSICAS (Tracks)
    else if (rawData.tracks) {
      return rawData.tracks.items.map(track => ({
        id: track.id,
        imageUrl: track.album?.images?.[0]?.url || 'assets/images/default.png',
        title: track.name,
        subtitle: track.artists?.[0]?.name, // Mostra o artista principal
        type: 'MUSICA',

        // Preenchendo os detalhes extras
        trackData: {
          albumName: track.album?.name || 'Desconhecido',
          artistNames: track.artists?.map(a => a.name) || []
        }
      }));
    }

    return [];
  });


  // função para abrir o modal
  openModal(item: CardItem){
    this.selectedItem.set(item);
  }

  // função para fechar o modal
  closeModal(){
    this.selectedItem.set(null);
  }

}
