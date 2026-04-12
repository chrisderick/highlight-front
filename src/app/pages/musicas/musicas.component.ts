import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DialogConfirmacaoComponent } from '../../shared/components/dialog-confirmacao/dialog-confirmacao.component';
import { DialogMusicaComponent } from '../../shared/components/dialog-musica/dialog-musica.component';
import { DataHoraBrPipe } from '../../shared/pipes/data-hora-br.pipe';
import { Artista } from '../../data/model/artista.model';
import { CriarMusicaRequest, Musica } from '../../data/model/musica.model';
import { ArtistasService } from '../../data/services/artistas.service';
import { MusicasService } from '../../data/services/musicas.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-musicas',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DataHoraBrPipe
  ],
  templateUrl: './musicas.component.html',
  styleUrl: './musicas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicasComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly artistasService: ArtistasService = inject(ArtistasService);
  private readonly musicasService: MusicasService = inject(MusicasService);
  private readonly notificacaoService: NotificacaoService = inject(NotificacaoService);

  public readonly artistaAtual = signal<Artista | null>(null);
  public readonly musicas = signal<Musica[]>([]);
  public readonly carregando = signal<boolean>(false);

  private readonly artistaId = signal<number | null>(null);

  public constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((parametros) => {
      const artistaId = Number(parametros.get('artistaId'));

      if (!Number.isInteger(artistaId) || artistaId <= 0) {
        void this.router.navigate(['/artistas']);
        return;
      }

      this.artistaId.set(artistaId);
      void this.carregarContexto(artistaId);
    });
  }

  public async abrirModalCriarMusica(): Promise<void> {
    const artistaId = this.artistaId();

    if (!artistaId) {
      return;
    }

    const resultado = await firstValueFrom(
      this.dialog
        .open(DialogMusicaComponent, {
          width: '480px',
          data: {
            titulo: 'Adicionar música',
            textoAcao: 'Adicionar',
            tituloInicial: '',
            anoInicial: null
          }
        })
        .afterClosed()
    );

    if (!resultado) {
      return;
    }

    const payload: CriarMusicaRequest = {
      title: resultado.titulo
    };

    if (resultado.anoLancamento !== null) {
      payload.release_year = resultado.anoLancamento;
    }

    try {
      await firstValueFrom(this.musicasService.criar(artistaId, payload));
      this.notificacaoService.sucesso('Música adicionada com sucesso.');
      await this.carregarContexto(artistaId);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao adicionar música.'));
    }
  }

  public async abrirModalEditarMusica(musica: Musica): Promise<void> {
    const artistaId = this.artistaId();

    if (!artistaId) {
      return;
    }

    const resultado = await firstValueFrom(
      this.dialog
        .open(DialogMusicaComponent, {
          width: '480px',
          data: {
            titulo: 'Editar música',
            textoAcao: 'Salvar',
            tituloInicial: musica.title,
            anoInicial: musica.release_year
          }
        })
        .afterClosed()
    );

    if (!resultado) {
      return;
    }

    try {
      await firstValueFrom(
        this.musicasService.editar(musica.id, {
          title: resultado.titulo,
          release_year: resultado.anoLancamento
        })
      );
      this.notificacaoService.sucesso('Música atualizada com sucesso.');
      await this.carregarContexto(artistaId);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao atualizar música.'));
    }
  }

  public async confirmarExclusaoMusica(musica: Musica): Promise<void> {
    const artistaId = this.artistaId();

    if (!artistaId) {
      return;
    }

    const confirmouExclusao = await firstValueFrom(
      this.dialog
        .open(DialogConfirmacaoComponent, {
          width: '460px',
          data: {
            titulo: 'Deletar música',
            mensagem: `Deseja realmente deletar "${musica.title}"? Isso removerá as letras associadas.`,
            textoConfirmar: 'Deletar'
          }
        })
        .afterClosed()
    );

    if (!confirmouExclusao) {
      return;
    }

    try {
      await firstValueFrom(this.musicasService.deletar(musica.id));
      this.notificacaoService.sucesso('Música deletada com sucesso.');
      await this.carregarContexto(artistaId);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao deletar música.'));
    }
  }

  public montarLinkLetras(musicaId: number): unknown[] {
    return ['/artistas', this.artistaId(), 'musicas', musicaId, 'letras'];
  }

  private async carregarContexto(artistaId: number): Promise<void> {
    this.carregando.set(true);

    try {
      const [artista, respostaMusicas] = await Promise.all([
        firstValueFrom(this.artistasService.buscarPorId(artistaId)),
        firstValueFrom(this.musicasService.listarPorArtista(artistaId))
      ]);

      this.artistaAtual.set(artista);
      this.musicas.set(respostaMusicas.items ?? []);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao carregar músicas.'));
      this.musicas.set([]);
    } finally {
      this.carregando.set(false);
    }
  }

  private obterMensagemErro(erro: unknown, mensagemPadrao: string): string {
    if (erro instanceof HttpErrorResponse && typeof erro.error?.message === 'string') {
      return erro.error.message;
    }

    return mensagemPadrao;
  }

  public trackearPorId(_: number, musica: Musica): number {
    return musica.id;
  }
}
