import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CriarLetraRequest, EditarLetraRequest, Letra } from '../model/letra.model';
import { RespostaLista } from '../model/resposta-lista.model';
import { ConfiguracaoRuntimeService } from '../../core/services/configuracao-runtime.service';

@Injectable({
  providedIn: 'root'
})
export class LetrasService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly configuracaoRuntimeService: ConfiguracaoRuntimeService = inject(ConfiguracaoRuntimeService);

  public listarPorMusica(musicaId: number): Observable<RespostaLista<Letra>> {
    return this.httpClient.get<RespostaLista<Letra>>(this.obterUrl(`/songs/${musicaId}/lyrics`));
  }

  public criar(musicaId: number, payload: CriarLetraRequest): Observable<Letra> {
    return this.httpClient.post<Letra>(this.obterUrl(`/songs/${musicaId}/lyrics`), payload);
  }

  public editar(letraId: number, payload: EditarLetraRequest): Observable<Letra> {
    return this.httpClient.put<Letra>(this.obterUrl(`/lyrics/${letraId}`), payload);
  }

  public deletar(letraId: number): Observable<unknown> {
    return this.httpClient.delete(this.obterUrl(`/lyrics/${letraId}`));
  }

  private obterUrl(caminho: string): string {
    return `${this.configuracaoRuntimeService.obterApiBaseUrl()}${caminho}`;
  }
}
