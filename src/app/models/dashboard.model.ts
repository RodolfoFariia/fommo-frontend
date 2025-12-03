export interface SearchQuery {
    q: string;
    type: string;
}

export interface SpotifyResponse {
    albums: Albums;
    artists: Artists;
    tracks: Tracks;
}

// --- Wrappers das Listas ---
export interface Albums {
    items: Item[]; 
}

export interface Artists {
    items: Item[];
}

export interface Tracks {
    items: Item[];
}

// --- O Item Genérico (Serve para Album, Artista e Musica) ---
export interface Item {
    id: string;
    name: string;
    
    // O Spotify manda "images", não "imagens"
    images: Imagem[]; 
    
    // --- Campos específicos de MÚSICA (Track) ---
    album?: AlbumObj; // Música tem um álbum associado
    
    // --- Campos específicos de ÁLBUM ---
    // Usamos '?' porque Artistas e Músicas não têm esses campos
    release_date?: string;   // Data de lançamento
    total_tracks?: number;   // Total de faixas
    artists?: ArtistObj[];   // Lista de artistas do álbum
}

export interface Imagem {
    url: string;
    height: number;
    width: number;
}

// Objeto simples para o Álbum que vem dentro da Música
export interface AlbumObj {
    images: Imagem[];
    name: string;
}

// Objeto simples para Artista (dentro do Álbum)
export interface ArtistObj {
    name: string;
    id: string;
}