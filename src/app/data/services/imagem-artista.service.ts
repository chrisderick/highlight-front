import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface RespostaAudioDb {
  artists: Array<{
    strArtistThumb: string | null;
  }> | null;
}

@Injectable({
  providedIn: 'root'
})
export class ImagemArtistaService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = 'https://www.theaudiodb.com/api/v1/json/123';

  public buscarUrlImagemArtista(nomeArtista: string): Observable<string | null> {
    const termoBusca = encodeURIComponent(nomeArtista.trim().replace(/\s+/g, ' ')).replace(/%20/g, '+');

    return this.httpClient
      .get<RespostaAudioDb>(`${this.baseUrl}/search.php?s=${termoBusca}`)
      .pipe(
        map((resposta) => {
          const urlThumb = resposta.artists?.[0]?.strArtistThumb;

          if (!urlThumb || urlThumb.trim().length === 0) {
            return null;
          }

          return urlThumb;
        })
      );
  }
}
