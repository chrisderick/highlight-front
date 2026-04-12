import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-padrao',
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatIconModule],
  templateUrl: './dialog-padrao.component.html',
  styleUrl: './dialog-padrao.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogPadraoComponent {
  public readonly titulo = input.required<string>();
  public readonly mostrarBotaoFechar = input<boolean>(false);
  public readonly alinhamentoAcoes = input<'start' | 'center' | 'end'>('end');
}
