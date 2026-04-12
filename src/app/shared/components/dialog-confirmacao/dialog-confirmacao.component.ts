import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DialogPadraoComponent } from '../dialog-padrao/dialog-padrao.component';

export interface DialogConfirmacaoData {
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
}

@Component({
  selector: 'app-dialog-confirmacao',
  imports: [DialogPadraoComponent, MatButtonModule],
  templateUrl: './dialog-confirmacao.component.html',
  styleUrl: './dialog-confirmacao.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogConfirmacaoComponent {
  private readonly dialogRef: MatDialogRef<DialogConfirmacaoComponent, boolean> = inject(
    MatDialogRef<DialogConfirmacaoComponent, boolean>
  );

  public readonly dados: DialogConfirmacaoData = inject(MAT_DIALOG_DATA);

  public cancelar(): void {
    this.dialogRef.close(false);
  }

  public confirmar(): void {
    this.dialogRef.close(true);
  }
}
