import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface ResultadoDialogLetra {
  idioma: string;
  conteudo: string;
}

export interface DialogLetraData {
  titulo: string;
  textoAcao: string;
  idiomaInicial: string;
  conteudoInicial: string;
}

@Component({
  selector: 'app-dialog-letra',
  imports: [ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog-letra.component.html',
  styleUrl: './dialog-letra.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogLetraComponent {
  private readonly dialogRef: MatDialogRef<DialogLetraComponent, ResultadoDialogLetra> = inject(
    MatDialogRef<DialogLetraComponent, ResultadoDialogLetra>
  );

  public readonly dados: DialogLetraData = inject(MAT_DIALOG_DATA);
  public readonly idiomaControl = new FormControl<string>(this.dados.idiomaInicial, {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(80)]
  });
  public readonly conteudoControl = new FormControl<string>(this.dados.conteudoInicial, {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(20000)]
  });

  public fechar(): void {
    this.dialogRef.close();
  }

  public confirmar(): void {
    if (this.idiomaControl.invalid || this.conteudoControl.invalid) {
      this.idiomaControl.markAsTouched();
      this.conteudoControl.markAsTouched();
      return;
    }

    this.dialogRef.close({
      idioma: this.idiomaControl.value.trim(),
      conteudo: this.conteudoControl.value.trim()
    });
  }
}
