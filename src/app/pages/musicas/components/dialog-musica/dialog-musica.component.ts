import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DialogPadraoComponent } from '../../../../shared/components/dialog-padrao/dialog-padrao.component';

export interface ResultadoDialogMusica {
  titulo: string;
  anoLancamento: number | null;
}

export interface DialogMusicaData {
  titulo: string;
  textoAcao: string;
  tituloInicial: string;
  anoInicial: number | null;
}

@Component({
  selector: 'app-dialog-musica',
  imports: [
    ReactiveFormsModule,
    DialogPadraoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './dialog-musica.component.html',
  styleUrl: './dialog-musica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogMusicaComponent {
  private readonly dialogRef: MatDialogRef<DialogMusicaComponent, ResultadoDialogMusica> = inject(
    MatDialogRef<DialogMusicaComponent, ResultadoDialogMusica>
  );

  public readonly dados: DialogMusicaData = inject(MAT_DIALOG_DATA);
  public readonly tituloControl = new FormControl<string>(this.dados.tituloInicial, {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(180)]
  });
  public readonly anoControl = new FormControl<string>(this.dados.anoInicial?.toString() ?? '', {
    nonNullable: true,
    validators: [Validators.pattern(/^\d{0,4}$/)]
  });

  public fechar(): void {
    this.dialogRef.close();
  }

  public confirmar(): void {
    if (this.tituloControl.invalid || this.anoControl.invalid) {
      this.tituloControl.markAsTouched();
      this.anoControl.markAsTouched();
      return;
    }

    const anoDigitado = this.anoControl.value.trim();

    this.dialogRef.close({
      titulo: this.tituloControl.value.trim(),
      anoLancamento: anoDigitado.length > 0 ? Number(anoDigitado) : null
    });
  }
}
