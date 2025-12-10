import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchQuery, SpotifyResponse } from '../../models/dashboard.model';
import { Spotify } from '../../services/spotify';
import { MusicCard } from '../../shared/music-card/music-card';
import { CardItem } from '../../models/music-card.model';
import { AvaliacaoModal } from '../../shared/avaliacao-modal/avaliacao-modal';
import { ToastService } from '../../services/toast.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [ReactiveFormsModule, MusicCard, AvaliacaoModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  newReleases = signal<CardItem[]>([]);
  searchForm: FormGroup;

  searching = signal(false);
  results = signal<SpotifyResponse | null>(null);
  hasSearched = signal(false);

  selectedItem = signal<CardItem | null>(null);

  displayItems = signal<CardItem[]>([]);
  offset = signal(0);
  limit = 20;
  hasMore = signal(false);

  searchTypes = [
    { label: "Álbum", value: "album" },
    { label: "Artista", value: "artist" },
    { label: "Música", value: "track" }
  ];

  constructor(
    private fb: FormBuilder, 
    private spotifyService: Spotify,
    private toastService: ToastService 
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      type: ['album']
    });
  }

  ngOnInit(): void {
    this.loadNewReleases();
  }

  loadNewReleases() {
    this.spotifyService.getNewReleases().subscribe({
      next: (response) => {
        const convertedItems: CardItem[] = response.map(item => {
          const album = item.album;
          const listaDeNomes: string[] = album.artists.map(artist => artist.name);

          return {
            id: album.id,
            imageUrl: album.images && album.images.length > 0 ? album.images[0].url : 'assets/default.png',
            title: album.name,
            subtitle: listaDeNomes.join(', '), 
            type: 'album', 
            albumData: {
              releaseDate: album.release_date,
              totalTracks: album.total_tracks,
              artistNames: listaDeNomes 
            }
          };
        });

        this.newReleases.set(convertedItems);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error("Não foi possível carregar os lançamentos.");
      }
    });
  }

  search() {
    if (!this.searchForm.value.query.trim()) return;

    this.searching.set(true);
    this.hasSearched.set(true);
    
    // RESET TOTAL: Nova busca = começa do zero
    this.offset.set(0);
    this.displayItems.set([]); 
    this.hasMore.set(false);

    this.fetchData();
  }

  loadMore() {
    //  Atual = Atual + 20
    this.offset.update(val => val + this.limit);
    this.fetchData();
  }

  fetchData() {
    const data: SearchQuery = {
      q: this.searchForm.value.query,
      type: this.searchForm.value.type
    };

    // Chama o service passando o offset atual
    this.spotifyService.search(data, this.offset(), this.limit).subscribe({
      next: (resposta) => {
        this.searching.set(false);
        
        
        const newItems = this.mapResponseToCards(resposta);

        // Se vieram menos itens que o limite  acabou a lista
        if (newItems.length < this.limit) {
            this.hasMore.set(false);
        } else {
            this.hasMore.set(true);
        }

        this.displayItems.update(current => [...current, ...newItems]);
      },
      error: (err) => {
        this.searching.set(false);
        console.error(err);
        this.toastService.error("Erro ao buscar mais itens.");
      }
    });
  }


  private mapResponseToCards(rawData: SpotifyResponse): CardItem[] {
    if (!rawData) return [];

    if (rawData.albums) {
      return rawData.albums.items.map(album => ({
        id: album.id,
        imageUrl: album.images?.[0]?.url || 'assets/default.png',
        title: album.name,
        subtitle: 'Álbum',
        type: 'album',
        albumData: {
          releaseDate: album.release_date || 'Desconhecido',
          totalTracks: album.total_tracks || 0,
          artistNames: album.artists?.map(a => a.name) || [] 
        }
      }));
    } 
    
    else if (rawData.artists) {
      return rawData.artists.items.map(artist => ({
        id: artist.id,
        imageUrl: artist.images?.[0]?.url || 'assets/default.png',
        title: artist.name,
        subtitle: 'Artista',
        type: 'artist'
      }));
    }
    else if (rawData.tracks) {
      return rawData.tracks.items.map(track => ({
        id: track.id,
        imageUrl: track.album?.images?.[0]?.url || 'assets/default.png',
        title: track.name,
        subtitle: track.artists?.[0]?.name || 'Artista Desconhecido',
        type: 'track',
        trackData: {
            albumName: track.album?.name || 'Desconhecido',
            
            artistNames: track.artists?.map(a => a.name) || []
        }
      }));
    }

    return [];
  }

  openModal(item: CardItem){
    this.selectedItem.set(item);
  }

  closeModal(){
    this.selectedItem.set(null);
  }
}