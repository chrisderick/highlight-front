import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogConfirmacaoData {
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
}

@Component({
  selector: 'app-dialog-confirmacao',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './dialog-confirmacao.component.html',
  styleUrl: './dialog-confirmacao.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmacaoComponent {
  public readonly dados: DialogConfirmacaoData = inject(MAT_DIALOG_DATA);
}
