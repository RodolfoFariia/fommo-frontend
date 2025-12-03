export interface CardItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  type: 'ALBUM' | 'ARTISTA' | 'MUSICA';
  

  // --- DADOS EXTRAS PARA O MODAL ---
  // Usamos '?' porque cada card só vai ter UM desses preenchido
  albumData?: AlbumDetails;
  trackData?: TrackDetails;
  // artistData?: ArtistDetails; // (Podemos adicionar futuramente se precisarmos de gêneros/popularidade)
}

// Detalhes específicos de Álbuns
export interface AlbumDetails {
  releaseDate: string;      // Ex: "1991-08-12"
  totalTracks: number;      // Ex: 12
  artistNames: string[];    // Ex: ["Metallica"]
}

// Detalhes específicos de Músicas
export interface TrackDetails {
  albumName: string;        // Para mostrar de qual álbum é
  artistNames: string[];    // Para mostrar os artistas
}