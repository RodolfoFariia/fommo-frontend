export interface AvaliacaoResponse{
    id_avaliacao: string;
    titulo: string;
    texto_avaliacao: string;
    nota: number;
    tipo_item: string;
    id_item_externo: string;
}

export interface AvaliacaoRequest{
    titulo: string;
    textoAvaliacao: string;
    nota: number;
    tipo_item: string;
    id_item_externo: string;
}


export interface AvaliacaoUpdate{
    nota: number;
    titulo: string;
    textoAvaliacao: string;
}