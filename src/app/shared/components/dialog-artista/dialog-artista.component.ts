import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogArtistaData {
  titulo: string;
  textoAcao: string;
  nomeInicial: string;
}

@Component({
  selector: 'app-dialog-artista',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './dialog-artista.component.html',
  styleUrl: './dialog-artista.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogArtistaComponent {
  private readonly dialogRef: MatDialogRef<DialogArtistaComponent, string> = inject(
    MatDialogRef<DialogArtistaComponent, string>
  );

  public readonly dados: DialogArtistaData = inject(MAT_DIALOG_DATA);
  public readonly nomeControl = new FormControl<string>(this.dados.nomeInicial, {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(120)]
  });

  public fechar(): void {
    this.dialogRef.close();
  }

  public confirmar(): void {
    if (this.nomeControl.invalid) {
      this.nomeControl.markAsTouched();
      return;
    }

    this.dialogRef.close(this.nomeControl.value.trim());
  }
}
