// Definindo o que enviamos ao back para requisitar dados do spotify
export interface SearchQuery{
    q: string;
    type: string;
}

export interface SpotifyResponse{
    albums: Albums;
    artists: Artists;
    tracks: Tracks;
}

export interface Artists{
    items: Item[];
}

export interface Tracks{
    items: Item[];
}

export interface Albums{
    items: Item[];
}

export interface Item{
    id: string;
    name: string;
    images: Imagem[];
    album: Album;
}

export interface Imagem{
    url: string;
    height: string;
    width: string;
}

// somente para coletar a capa do album 
export interface Album{
    images: Imagem[];
}