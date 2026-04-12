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
import { DialogEdicaoLetraComponent } from './components/dialog-edicao-letra/dialog-edicao-letra.component';
import { DialogLetraComponent } from './components/dialog-letra/dialog-letra.component';
import { DataHoraBrPipe } from '../../shared/pipes/data-hora-br.pipe';
import { Artista } from '../../data/model/artista.model';
import { Letra } from '../../data/model/letra.model';
import { Musica } from '../../data/model/musica.model';
import { ArtistasService } from '../../data/services/artistas.service';
import { LetrasService } from '../../data/services/letras.service';
import { MusicasService } from '../../data/services/musicas.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-letras',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DataHoraBrPipe
  ],
  templateUrl: './letras.component.html',
  styleUrl: './letras.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetrasComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly artistasService: ArtistasService = inject(ArtistasService);
  private readonly musicasService: MusicasService = inject(MusicasService);
  private readonly letrasService: LetrasService = inject(LetrasService);
  private readonly notificacaoService: NotificacaoService = inject(NotificacaoService);

  public readonly artistaAtual = signal<Artista | null>(null);
  public readonly musicaAtual = signal<Musica | null>(null);
  public readonly letras = signal<Letra[]>([]);
  public readonly carregando = signal<boolean>(false);

  private readonly artistaId = signal<number | null>(null);
  private readonly musicaId = signal<number | null>(null);

  public constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((parametros) => {
      const artistaId = Number(parametros.get('artistaId'));
      const musicaId = Number(parametros.get('musicaId'));

      if (!Number.isInteger(artistaId) || artistaId <= 0 || !Number.isInteger(musicaId) || musicaId <= 0) {
        void this.router.navigate(['/artistas']);
        return;
      }

      this.artistaId.set(artistaId);
      this.musicaId.set(musicaId);
      void this.carregarContexto(artistaId, musicaId);
    });
  }

  public montarLinkVolta(): unknown[] {
    return ['/artistas', this.artistaId(), 'musicas'];
  }

  public async abrirModalAdicionarLetra(): Promise<void> {
    const musicaId = this.musicaId();

    if (!musicaId) {
      return;
    }

    const resultado = await firstValueFrom(
      this.dialog
        .open(DialogEdicaoLetraComponent, {
          width: '760px',
          maxWidth: '95vw',
          data: {
            titulo: 'Adicionar letra ou tradução',
            textoAcao: 'Adicionar',
            idiomaInicial: '',
            conteudoInicial: ''
          }
        })
        .afterClosed()
    );

    if (!resultado) {
      return;
    }

    try {
      await firstValueFrom(
        this.letrasService.criar(musicaId, {
          language: resultado.idioma,
          content: resultado.conteudo
        })
      );
      this.notificacaoService.sucesso('Letra adicionada com sucesso.');
      await this.carregarContexto(this.artistaId()!, musicaId);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao adicionar letra.'));
    }
  }

  public async abrirModalEditarLetra(letra: Letra): Promise<void> {
    const musicaId = this.musicaId();

    if (!musicaId) {
      return;
    }

    const resultado = await firstValueFrom(
      this.dialog
        .open(DialogEdicaoLetraComponent, {
          width: '760px',
          maxWidth: '95vw',
          data: {
            titulo: 'Editar letra',
            textoAcao: 'Salvar',
            idiomaInicial: letra.language,
            conteudoInicial: letra.content
          }
        })
        .afterClosed()
    );

    if (!resultado) {
      return;
    }

    try {
      await firstValueFrom(
        this.letrasService.editar(letra.id, {
          language: resultado.idioma,
          content: resultado.conteudo
        })
      );
      this.notificacaoService.sucesso('Letra atualizada com sucesso.');
      await this.carregarContexto(this.artistaId()!, musicaId);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao atualizar letra.'));
    }
  }

  public async confirmarExclusaoLetra(letra: Letra): Promise<void> {
    const musicaId = this.musicaId();

    if (!musicaId) {
      return;
    }

    const confirmouExclusao = await firstValueFrom(
      this.dialog
        .open(DialogConfirmacaoComponent, {
          width: '460px',
          data: {
            titulo: 'Deletar letra',
            mensagem: `Deseja realmente deletar a letra em "${letra.language}"?`,
            textoConfirmar: 'Deletar'
          }
        })
        .afterClosed()
    );

    if (!confirmouExclusao) {
      return;
    }

    try {
      await firstValueFrom(this.letrasService.deletar(letra.id));
      this.notificacaoService.sucesso('Letra deletada com sucesso.');
      await this.carregarContexto(this.artistaId()!, musicaId);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao deletar letra.'));
    }
  }

  public abrirModalLetra(letra: Letra): void {
    this.dialog.open(DialogLetraComponent, {
      width: '860px',
      maxWidth: '95vw',
      data: {
        idioma: letra.language,
        conteudo: letra.content
      }
    });
  }

  public obterConteudoResumido(conteudo: string): string {
    if (conteudo.length <= 150) {
      return conteudo;
    }

    return `${conteudo.slice(0, 150)}...`;
  }

  private async carregarContexto(artistaId: number, musicaId: number): Promise<void> {
    this.carregando.set(true);

    try {
      const [musica, respostaLetras] = await Promise.all([
        firstValueFrom(this.musicasService.buscarPorId(musicaId)),
        firstValueFrom(this.letrasService.listarPorMusica(musicaId))
      ]);

      const artista = await firstValueFrom(this.artistasService.buscarPorId(artistaId));

      this.musicaAtual.set(musica);
      this.artistaAtual.set(artista);
      this.letras.set(respostaLetras.items ?? []);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao carregar letras.'));
      this.letras.set([]);
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
}
