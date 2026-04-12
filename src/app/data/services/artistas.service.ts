import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Artista, CriarArtistaRequest } from '../model/artista.model';
import { RespostaLista } from '../model/resposta-lista.model';
import { ConfiguracaoRuntimeService } from '../../core/services/configuracao-runtime.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistasService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly configuracaoRuntimeService: ConfiguracaoRuntimeService = inject(ConfiguracaoRuntimeService);

  public listar(): Observable<RespostaLista<Artista>> {
    return this.httpClient.get<RespostaLista<Artista>>(this.obterUrl('/artists'));
  }

  public buscarPorId(artistaId: number): Observable<Artista> {
    return this.httpClient.get<Artista>(this.obterUrl(`/artists/${artistaId}`));
  }

  public criar(payload: CriarArtistaRequest): Observable<Artista> {
    return this.httpClient.post<Artista>(this.obterUrl('/artists'), payload);
  }

  public editar(artistaId: number, payload: CriarArtistaRequest): Observable<Artista> {
    return this.httpClient.put<Artista>(this.obterUrl(`/artists/${artistaId}`), payload);
  }

  public deletar(artistaId: number): Observable<unknown> {
    return this.httpClient.delete(this.obterUrl(`/artists/${artistaId}`));
  }

  private obterUrl(caminho: string): string {
    return `${this.configuracaoRuntimeService.obterApiBaseUrl()}${caminho}`;
  }
}
