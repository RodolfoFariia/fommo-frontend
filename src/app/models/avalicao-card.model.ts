// Interface generica que vem do back
export interface ItemSpotifyResponse{
    type: string,
    album: Album,
    artist: Artist,
    track: Track
}

//////////////////////////////////////////////////////////

// Interface necessária para um objeto do artista
export interface Artist{
    followers: Followers,
    genres: string[],
    images: Images[],
    name: string,
    popularity: number
}

export interface Followers{
    total: number
}

export interface Images{
    url: string,
    width: number,
    height: number
}

//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////

// Interface necessária para um objeto do album
export interface Album{
    id: string,
    total_tracks: number,
    images: Images[],
    name: string,
    release_date: string,
    artists: ArtistObj[],
    popularity: number
}

export interface ArtistObj{
    name: string,
    uri: string // link pro perfil do artista no spotify
    
}


//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////

// Interface necessária para um objeto de música

export interface Track{
    album: AlbumObj,
    artists: ArtistObj[],
    duration_ms: number,
    name: string,
    popularity: number
}

export interface AlbumObj{
    total_tracks: number,
    images: Images[],
    release_date: string,
    name: string
}
