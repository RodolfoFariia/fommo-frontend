import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UsuarioResponse } from "../models/auth.model";
import { SenhaUpdateRequest, UsuarioUpdateRequest } from "../models/usuario.model";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService{
    private readonly api_url = 'http://localhost:8080/usuario';

    constructor(private http: HttpClient){ }

    // busca os dados do usuário no banco de dados acessando o endpoint com get /usuario/me do back
    getMe(): Observable<UsuarioResponse>{
        return this.http.get<UsuarioResponse>(`${this.api_url}/me`);
    }

    // atualiza os dados do usuário 
    updateMe(dados: UsuarioUpdateRequest): Observable<UsuarioResponse>{
        return this.http.put<UsuarioResponse>(`${this.api_url}/me`,dados);
    }

    deleteMe(): Observable<void>{
        return this.http.delete<void>(`${this.api_url}/me`);
    }

    changePassword(dados: SenhaUpdateRequest): Observable<void>{
        return this.http.patch<void>(`${this.api_url}/me/password`,dados);
    }
}