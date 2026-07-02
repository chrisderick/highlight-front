import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly router: Router = inject(Router);
  private readonly rotaAtual = toSignal(
    this.router.events.pipe(
      startWith(null),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  public readonly titulo: string = 'Highlight';
  public readonly imagemCabecalho = computed(() => {
    const rota = this.rotaAtual();

    if (rota.includes('/musicas/') && rota.includes('/letras')) {
      return {
        src: '/assets/letra.png',
        alt: 'Ilustração de uma folha com lápis para a seção de letras'
      };
    }

    if (rota.includes('/musicas')) {
      return {
        src: '/assets/musica.png',
        alt: 'Ilustração de fones de ouvido para a seção de músicas'
      };
    }

    if (rota.includes('/artistas')) {
      return {
        src: '/assets/artista.png',
        alt: 'Ilustração de um cantor para a seção de artistas'
      };
    }

    return null;
  });
}
