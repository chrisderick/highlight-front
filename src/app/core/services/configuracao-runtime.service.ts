import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoRuntimeService {
  private readonly apiBaseUrl: string = 'http://localhost:5000';

  public obterApiBaseUrl(): string {
    return this.apiBaseUrl.replace(/\/+$/, '');
  }
}
