import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  readonly label: string;
  readonly link?: string | readonly unknown[];
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, MatProgressSpinnerModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  public readonly itens = input.required<readonly BreadcrumbItem[]>();
  public readonly carregando = input<boolean>(false);
}
