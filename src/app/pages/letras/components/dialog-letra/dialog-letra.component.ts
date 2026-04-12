import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogPadraoComponent } from '../../../../shared/components/dialog-padrao/dialog-padrao.component';

export interface DialogLetraData {
  idioma: string;
  conteudo: string;
}

@Component({
  selector: 'app-dialog-letra',
  imports: [DialogPadraoComponent, MatButtonModule],
  templateUrl: './dialog-letra.component.html',
  styleUrl: './dialog-letra.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogLetraComponent {
  private readonly dialogRef: MatDialogRef<DialogLetraComponent, void> = inject(MatDialogRef<DialogLetraComponent, void>);

  public readonly dados: DialogLetraData = inject(MAT_DIALOG_DATA);

  public obterTitulo(): string {
    return `Letra · ${this.dados.idioma}`;
  }

  public fechar(): void {
    this.dialogRef.close();
  }
}
