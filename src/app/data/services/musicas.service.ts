import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CriarMusicaRequest, EditarMusicaRequest, Musica } from '../model/musica.model';
import { RespostaLista } from '../model/resposta-lista.model';
import { ConfiguracaoRuntimeService } from '../../core/services/configuracao-runtime.service';

@Injectable({
  providedIn: 'root'
})
export class MusicasService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly configuracaoRuntimeService: ConfiguracaoRuntimeService = inject(ConfiguracaoRuntimeService);

  public listarPorArtista(artistaId: number): Observable<RespostaLista<Musica>> {
    return this.httpClient.get<RespostaLista<Musica>>(this.obterUrl(`/artists/${artistaId}/songs`));
  }

  public buscarPorId(musicaId: number): Observable<Musica> {
    return this.httpClient.get<Musica>(this.obterUrl(`/songs/${musicaId}`));
  }

  public criar(artistaId: number, payload: CriarMusicaRequest): Observable<Musica> {
    return this.httpClient.post<Musica>(this.obterUrl(`/artists/${artistaId}/songs`), payload);
  }

  public editar(musicaId: number, payload: EditarMusicaRequest): Observable<Musica> {
    return this.httpClient.put<Musica>(this.obterUrl(`/songs/${musicaId}`), payload);
  }

  public deletar(musicaId: number): Observable<unknown> {
    return this.httpClient.delete(this.obterUrl(`/songs/${musicaId}`));
  }

  private obterUrl(caminho: string): string {
    return `${this.configuracaoRuntimeService.obterApiBaseUrl()}${caminho}`;
  }
}
