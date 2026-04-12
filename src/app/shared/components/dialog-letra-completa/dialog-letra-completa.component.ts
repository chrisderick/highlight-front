import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';

export interface DialogLetraCompletaData {
  idioma: string;
  conteudo: string;
}

@Component({
  selector: 'app-dialog-letra-completa',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule],
  templateUrl: './dialog-letra-completa.component.html',
  styleUrl: './dialog-letra-completa.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogLetraCompletaComponent {
  public readonly dados: DialogLetraCompletaData = inject(MAT_DIALOG_DATA);
}
