import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  public sucesso(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'toastSucesso'
    });
  }

  public erro(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 4200,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'toastErro'
    });
  }

  public aviso(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3200,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'toastAviso'
    });
  }
}
