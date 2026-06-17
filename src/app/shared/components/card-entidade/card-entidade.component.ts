import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-entidade',
  imports: [NgClass, MatCardModule],
  templateUrl: './card-entidade.component.html',
  styleUrl: './card-entidade.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardEntidadeComponent {
  public readonly classe = input<string | string[]>('');
}
