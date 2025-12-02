export interface CardItem{
    id: string;
    imageUrl: string;
    title: string;
    subtitle?: string;
    type: 'ALBUM' | 'ARTISTA' | 'MUSICA';
}