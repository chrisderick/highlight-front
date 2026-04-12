import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DialogPadraoComponent } from '../../../../shared/components/dialog-padrao/dialog-padrao.component';

export interface ResultadoDialogEdicaoLetra {
  idioma: string;
  conteudo: string;
}

export interface DialogEdicaoLetraData {
  titulo: string;
  textoAcao: string;
  idiomaInicial: string;
  conteudoInicial: string;
}

@Component({
  selector: 'app-dialog-edicao-letra',
  imports: [ReactiveFormsModule, DialogPadraoComponent, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './dialog-edicao-letra.component.html',
  styleUrl: './dialog-edicao-letra.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogEdicaoLetraComponent {
  private readonly dialogRef: MatDialogRef<DialogEdicaoLetraComponent, ResultadoDialogEdicaoLetra> = inject(
    MatDialogRef<DialogEdicaoLetraComponent, ResultadoDialogEdicaoLetra>
  );

  public readonly dados: DialogEdicaoLetraData = inject(MAT_DIALOG_DATA);
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
