import { Injectable } from '@angular/core';
import { SearchQuery, SpotifyResponse } from '../models/dashboard.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Spotify {

  private endpoint = "http://localhost:8080";

  constructor(private http: HttpClient){ }

  search(data: SearchQuery): Observable<SpotifyResponse> {
    // construindo parametros que serão enviados no corpo da requisição
    const params = new HttpParams().set('q', data.q).set('type', data.type);


    return this.http.get<SpotifyResponse>(
      `${this.endpoint}/api/spotify/search`,{params: params});
  }
  
}
