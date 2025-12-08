import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvaliacaoRequest, AvaliacaoResponse, AvaliacaoUpdate } from '../models/avaliacao.model';

@Injectable({
  providedIn: 'root',
})
export class Avaliacao {

  private readonly api_url = "http://localhost:8080/avaliacao";

  

  constructor(private http: HttpClient){ }

  findByIdSpotify(id_item_externo: string): Observable<AvaliacaoResponse[]>{
    return this.http.get<AvaliacaoResponse[]>(`${this.api_url}/item/${id_item_externo}`)
  }

  cadastrarAvaliacao(data: AvaliacaoRequest): Observable<AvaliacaoResponse>{
    return this.http.post<AvaliacaoResponse>(`${this.api_url}`,data);
  }

  getByUsuario(): Observable<AvaliacaoResponse[]>{
    return this.http.get<AvaliacaoResponse[]> (`${this.api_url}/me`);
  }
  
  updateAvaliacao(data: AvaliacaoUpdate, id: string): Observable<AvaliacaoResponse>{
    return this.http.put<AvaliacaoResponse> (`${this.api_url}/${id}`,data);
  }

  deleteAvaliacao(id: string): Observable<void>{
    return this.http.delete<void>(`${this.api_url}/${id}`);
  }
}
