import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataHoraBr'
})
export class DataHoraBrPipe implements PipeTransform {
  public transform(dataIso: string | null | undefined): string {
    if (!dataIso) {
      return 'Data não disponível';
    }

    const data = new Date(dataIso);

    if (Number.isNaN(data.getTime())) {
      return 'Data inválida';
    }

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  }
}
