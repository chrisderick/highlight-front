import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { DialogArtistaComponent } from '../../shared/components/dialog-artista/dialog-artista.component';
import { DialogConfirmacaoComponent } from '../../shared/components/dialog-confirmacao/dialog-confirmacao.component';
import { DataHoraBrPipe } from '../../shared/pipes/data-hora-br.pipe';
import { Artista } from '../../data/model/artista.model';
import { ArtistasService } from '../../data/services/artistas.service';
import { NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-artistas',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DataHoraBrPipe
  ],
  templateUrl: './artistas.component.html',
  styleUrl: './artistas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistasComponent {
  private readonly artistasService: ArtistasService = inject(ArtistasService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly notificacaoService: NotificacaoService = inject(NotificacaoService);

  public readonly carregando = signal<boolean>(false);
  public readonly artistas = signal<Artista[]>([]);

  public constructor() {
    void this.carregarArtistas();
  }

  public async abrirModalCriarArtista(): Promise<void> {
    const nomeArtista = await firstValueFrom(
      this.dialog
        .open(DialogArtistaComponent, {
          width: '440px',
          data: {
            titulo: 'Adicionar artista',
            textoAcao: 'Adicionar',
            nomeInicial: ''
          }
        })
        .afterClosed()
    );

    if (!nomeArtista) {
      return;
    }

    try {
      await firstValueFrom(
        this.artistasService.criar({
          name: nomeArtista
        })
      );
      this.notificacaoService.sucesso('Artista adicionado com sucesso.');
      await this.carregarArtistas();
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao adicionar artista.'));
    }
  }

  public async abrirModalEditarArtista(artista: Artista): Promise<void> {
    const novoNome = await firstValueFrom(
      this.dialog
        .open(DialogArtistaComponent, {
          width: '440px',
          data: {
            titulo: 'Editar artista',
            textoAcao: 'Salvar',
            nomeInicial: artista.name
          }
        })
        .afterClosed()
    );

    if (!novoNome) {
      return;
    }

    try {
      await firstValueFrom(
        this.artistasService.editar(artista.id, {
          name: novoNome
        })
      );
      this.notificacaoService.sucesso('Artista atualizado com sucesso.');
      await this.carregarArtistas();
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao atualizar artista.'));
    }
  }

  public async confirmarExclusaoArtista(artista: Artista): Promise<void> {
    const confirmouExclusao = await firstValueFrom(
      this.dialog
        .open(DialogConfirmacaoComponent, {
          width: '460px',
          data: {
            titulo: 'Deletar artista',
            mensagem: `Deseja realmente deletar "${artista.name}"? Isso removerá músicas e letras associadas.`,
            textoConfirmar: 'Deletar'
          }
        })
        .afterClosed()
    );

    if (!confirmouExclusao) {
      return;
    }

    try {
      await firstValueFrom(this.artistasService.deletar(artista.id));
      this.notificacaoService.sucesso('Artista deletado com sucesso.');
      await this.carregarArtistas();
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao deletar artista.'));
    }
  }

  private async carregarArtistas(): Promise<void> {
    this.carregando.set(true);

    try {
      const resposta = await firstValueFrom(this.artistasService.listar());
      this.artistas.set(resposta.items ?? []);
    } catch (erro) {
      this.notificacaoService.erro(this.obterMensagemErro(erro, 'Erro ao carregar artistas.'));
      this.artistas.set([]);
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
