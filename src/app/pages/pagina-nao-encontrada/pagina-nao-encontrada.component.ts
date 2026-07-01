import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-nao-encontrada',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './pagina-nao-encontrada.component.html',
  styleUrl: './pagina-nao-encontrada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginaNaoEncontradaComponent {}
